import {
  useCalcDepositAmount,
  useCalcReceiveAmount,
  useDepositExchangeRate,
  useDepositTradeAccounts,
  useSaveAgentDeposit,
} from '@/api/hooks/review/deposit';
import { useCurrencyList, useUploadFile } from '@/api/hooks/system/system';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { RrhInputWithUnit } from '@/components/common/RrhInputWithUnit';
import { RrhSelect } from '@/components/common/RrhSelect';
import { RrhTextarea } from '@/components/common/RrhTextarea';
import { RrhForm } from '@/components/form/RrhForm';
import { FormCrmUserSingleSelect } from '@/components/form/FormCrmUserSingleSelect';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { depositMethodsMap } from '@/lib/constant';
import { ImageUp, Plus, Trash2 } from 'lucide-react';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

type AgentDepositForm = {
  method: string;
  userId: string;
  userLabel: string;
  account: string;
  deposit: string;
  depositCurrency: string;
  rate: string;
  currencyPair: string;
  fee: string;
  payAmount: string;
  remark: string;
  googleCode: string;
};

type AccountOption = {
  value: string;
  label: string;
  accountType: '1' | '2';
  serverId: string;
  currency: string;
  digits: number;
};

type VoucherItem = { id: string; file: File; url: string };

const DEPOSIT_METHODS = [1, 2, 6, 7, 13];
const MAX_VOUCHER_COUNT = 9;
const VOUCHER_MAX_SIZE = 10 * 1024 * 1024;
const VOUCHER_EXTENSIONS = ['jpg', 'jpeg', 'png'];

const DEFAULT_VALUES: AgentDepositForm = {
  method: '1',
  userId: '',
  userLabel: '',
  account: '',
  deposit: '',
  depositCurrency: '',
  rate: '',
  currencyPair: '',
  fee: '',
  payAmount: '',
  remark: '',
  googleCode: '',
};

const limitDigits = (value: string, digits: number) => {
  const dotIndex = value.indexOf('.');
  if (dotIndex === -1) return value;
  return `${value.slice(0, dotIndex)}.${value.slice(dotIndex + 1, dotIndex + 1 + digits)}`;
};

export const AgentDepositDialog = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'one' | 'two'>('one');
  const [rateMeta, setRateMeta] = useState<{ inRate: string; outRate: string } | null>(null);
  const [vouchers, setVouchers] = useState<VoucherItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const vouchersRef = useRef<VoucherItem[]>([]);
  vouchersRef.current = vouchers;

  const form = useForm<AgentDepositForm>({ defaultValues: DEFAULT_VALUES });
  const { data: currencyList } = useCurrencyList();
  const { mutateAsync: upload } = useUploadFile();
  const { mutateAsync: saveAgentDeposit, isPending: saving } = useSaveAgentDeposit();
  const { mutateAsync: fetchExchangeRate } = useDepositExchangeRate();
  const { mutateAsync: calcReceiveAmount } = useCalcReceiveAmount();
  const { mutateAsync: calcDepositAmount } = useCalcDepositAmount();

  const userId = form.watch('userId');
  const method = form.watch('method');
  const accountValue = form.watch('account');
  const depositCurrency = form.watch('depositCurrency');
  const currencyPair = form.watch('currencyPair');

  const { data: tradeAccounts } = useDepositTradeAccounts(open ? userId : '');

  const accountOptions = useMemo<AccountOption[]>(() => {
    const accounts = (tradeAccounts?.accountList || []).map(account => ({
      value: account.account || '',
      label: `${account.serverName || account.server || ''} / ${account.account || ''} / ${account.balance ?? ''} ${account.currency || ''}`,
      accountType: '2' as const,
      serverId: account.server || '',
      currency: account.currency || '',
      digits: account.digits ?? 2,
    }));
    const wallets = (tradeAccounts?.walletList || []).map(wallet => ({
      value: wallet.id,
      label: `${t('table.wallet')} ${wallet.balance ?? ''} ${wallet.currency || ''}`,
      accountType: '1' as const,
      serverId: '',
      currency: wallet.currency || '',
      digits: wallet.digits ?? 2,
    }));
    return [...accounts, ...wallets].filter(option => !!option.value);
  }, [tradeAccounts, t]);

  const selectedAccount = accountOptions.find(option => option.value === accountValue);
  const feeCurrency = selectedAccount?.currency || '';
  const accountDigits = selectedAccount?.digits ?? 2;
  const busy = submitting || saving;

  const methodOptions = useMemo(
    () =>
      DEPOSIT_METHODS.map(item => ({
        value: String(item),
        label: t(`table.${depositMethodsMap[item]}`),
      })),
    [t],
  );

  const depositCurrencyOptions = useMemo(
    () =>
      (currencyList?.rows || []).map(currency => ({
        value: currency.currencyAbbr,
        label: currency.currencyAbbr,
      })),
    [currencyList],
  );

  const clearVouchers = () => {
    vouchersRef.current.forEach(voucher => URL.revokeObjectURL(voucher.url));
    setVouchers([]);
  };

  useEffect(() => {
    return () => {
      vouchersRef.current.forEach(voucher => URL.revokeObjectURL(voucher.url));
    };
  }, []);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      form.reset(DEFAULT_VALUES);
      setStep('one');
      setRateMeta(null);
    }
    clearVouchers();
  };

  const resetAmountFields = () => {
    form.setValue('deposit', '');
    form.setValue('fee', '');
    form.setValue('payAmount', '');
  };

  const handleUserSelect = (option: { value: string; label: string }) => {
    form.setValue('userLabel', option.label);
    form.setValue('account', '');
    resetAmountFields();
  };

  useEffect(() => {
    if (!open) return;
    form.setValue('rate', '');
    form.setValue('currencyPair', '');
    form.setValue('payAmount', '');
    setRateMeta(null);
    if (!feeCurrency || !depositCurrency) return;
    void refreshRate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, feeCurrency, depositCurrency, userId]);

  async function calcReceive() {
    const values = form.getValues();
    if (!values.deposit || !values.rate || !feeCurrency || !values.depositCurrency) return;
    if (!values.currencyPair) return;
    try {
      const res = await calcReceiveAmount({
        deposit: values.deposit,
        fee: values.fee || '0',
        feeCurrency,
        rate: values.rate,
        currencyPair: values.currencyPair,
        targetCurrency: values.depositCurrency,
        source: feeCurrency,
      });
      if (res.code === 0 && res.data !== null && res.data !== undefined) {
        form.setValue('payAmount', String(res.data));
      }
    } catch {
      // 与旧版一致：计算失败时保留用户输入
    }
  }

  async function calcDeposit() {
    const values = form.getValues();
    if (!values.payAmount || !values.rate || !feeCurrency || !values.depositCurrency) return;
    if (!values.currencyPair) return;
    try {
      const res = await calcDepositAmount({
        payAmount: values.payAmount,
        fee: values.fee || '0',
        feeCurrency,
        rate: values.rate,
        currencyPair: values.currencyPair,
        targetCurrency: values.depositCurrency,
        source: feeCurrency,
      });
      if (res.code === 0 && res.data !== null && res.data !== undefined) {
        form.setValue('deposit', String(res.data));
      }
    } catch {
      // 与旧版一致：计算失败时保留用户输入
    }
  }

  async function refreshRate() {
    if (!userId || !feeCurrency || !depositCurrency) return;
    const localCurrencyPair = `${feeCurrency}/${depositCurrency}`;
    if (feeCurrency === depositCurrency) {
      form.setValue('rate', '1');
      form.setValue('currencyPair', localCurrencyPair);
      setRateMeta({ inRate: '1', outRate: '1' });
      await calcReceive();
      return;
    }
    try {
      const res = await fetchExchangeRate({
        method,
        source: feeCurrency,
        dest: depositCurrency,
        userId,
      });
      if (res.code === 0 && res.data) {
        form.setValue('rate', String(res.data.rate ?? ''));
        form.setValue('currencyPair', res.data.currencyPair || localCurrencyPair);
        setRateMeta({
          inRate: String(res.data.inRate ?? '-'),
          outRate: String(res.data.outRate ?? '-'),
        });
        await calcReceive();
      } else {
        toast.error(res.msg || t('agentDeposit.rateError'));
      }
    } catch {
      toast.error(t('agentDeposit.rateError'));
    }
  }

  const handleAddVoucher = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (vouchers.length >= MAX_VOUCHER_COUNT) {
      toast.error(t('agentDeposit.voucherMax', { count: MAX_VOUCHER_COUNT }));
      return;
    }
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!VOUCHER_EXTENSIONS.includes(extension)) {
      toast.error(t('agentDeposit.voucherTypeInvalid'));
      return;
    }
    if (file.size > VOUCHER_MAX_SIZE) {
      toast.error(t('agentDeposit.voucherSizeLimit'));
      return;
    }
    setVouchers(prev => [
      ...prev,
      {
        id: `${file.name}-${file.lastModified}-${prev.length}`,
        file,
        url: URL.createObjectURL(file),
      },
    ]);
  };

  const removeVoucher = (id: string) => {
    setVouchers(prev => {
      const target = prev.find(voucher => voucher.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter(voucher => voucher.id !== id);
    });
  };

  const handleSubmit = async () => {
    if (!selectedAccount) {
      toast.error(t('agentDeposit.selectUserFirst'));
      return;
    }
    if (!vouchers.length) {
      toast.error(t('agentDeposit.voucherRequired'));
      return;
    }
    const values = form.getValues();
    setSubmitting(true);
    try {
      const voucherUrls: string[] = [];
      for (const voucher of vouchers) {
        const uploadRes = await upload(voucher.file);
        if (uploadRes?.code !== 0 || !uploadRes.url) {
          throw new Error(uploadRes?.msg || t('common.AnErrorOccurred'));
        }
        voucherUrls.push(uploadRes.url);
      }
      const res = await saveAgentDeposit({
        userId: values.userId,
        accountType: selectedAccount.accountType,
        ...(selectedAccount.accountType === '2'
          ? { login: selectedAccount.value, serverId: selectedAccount.serverId }
          : { walletId: selectedAccount.value }),
        deposit: values.deposit,
        fee: values.fee,
        rate: values.rate,
        dest: feeCurrency,
        source: values.depositCurrency,
        subRemark: values.remark,
        feeCurrency,
        depositCurrency: values.depositCurrency,
        currencyPair: values.currencyPair,
        targetDeposit: values.payAmount,
        method: values.method,
        voucher: voucherUrls.join(','),
        googleCode: values.googleCode,
      });
      if (res.code === 0) {
        toast.success(t('common.success'));
        onSuccess?.();
        handleOpenChange(false);
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('common.AnErrorOccurred'));
    } finally {
      setSubmitting(false);
    }
  };

  const requiredRule = (label: string) => ({
    required: t('common.pleaseInput', { field: label }),
  });
  const amountRule = (label: string) => ({
    required: t('common.pleaseInput', { field: label }),
    pattern: { value: /^\d+(\.\d+)?$/, message: t('agentDeposit.amountInvalid') },
  });

  const summaryRows = [
    { label: t('agentDeposit.depositClients'), value: form.watch('userLabel') || '-' },
    { label: t('agentDeposit.depositAccount'), value: selectedAccount?.label || '-' },
    {
      label: t('agentDeposit.depositAmount'),
      value: `${form.watch('deposit') || '-'} ${feeCurrency}`,
    },
    {
      label: t('agentDeposit.exchangeRate'),
      value: `${currencyPair || '-'} | ${form.watch('rate') || '-'}`,
    },
    {
      label: t('agentDeposit.commission'),
      value: `${form.watch('fee') || '-'} ${feeCurrency}`,
    },
    {
      label: t('agentDeposit.payAmount'),
      value: `${form.watch('payAmount') || '-'} ${depositCurrency}`,
    },
  ];

  return (
    <RrhDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={t('agentDeposit.title')}
      variant="adaptive"
      className="sm:!w-[560px]"
      contentClassName="gap-4 py-4"
      type="submit"
      formLoading={busy}
      isConfirmDisabled={busy}
      confirmText={step === 'one' ? t('common.next') : t('common.Confirm')}
      onCancel={() => handleOpenChange(false)}
      onConfirm={step === 'one' ? () => form.handleSubmit(() => setStep('two'))() : handleSubmit}
      leftDom={
        step === 'two' ? (
          <RrhButton variant="outline" onClick={() => setStep('one')} disabled={busy}>
            {t('common.previousStep')}
          </RrhButton>
        ) : undefined
      }
      trigger={<RrhButton Icon={<Plus className="size-4" />}>{t('agentDeposit.title')}</RrhButton>}
    >
      <RrhForm form={form} className="flex flex-col gap-4">
        {step === 'one' ? (
          <>
            <p className="bg-muted text-muted-foreground rounded-md p-3 text-sm">
              {t('agentDeposit.tip')}
            </p>
            <FormField
              name="method"
              control={form.control}
              rules={requiredRule(t('table.depositMethods'))}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('table.depositMethods')}</FormLabel>
                  <FormControl>
                    <RrhSelect
                      options={methodOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder={t('common.pleaseSelect')}
                      displayValue={
                        field.value ? t(`table.${depositMethodsMap[Number(field.value)]}`) : ''
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormCrmUserSingleSelect
              name="userId"
              label={t('agentDeposit.depositClients')}
              verticalLabel
              placeholder={t('common.pleaseSelect')}
              searchPlaceholder={t('common.pleaseInput', {
                field: t('agentDeposit.depositClients'),
              })}
              rules={requiredRule(t('agentDeposit.depositClients'))}
              onSelect={handleUserSelect}
            />
            <FormField
              name="account"
              control={form.control}
              rules={requiredRule(t('agentDeposit.depositAccount'))}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('agentDeposit.depositAccount')}</FormLabel>
                  <FormControl>
                    <RrhSelect
                      options={accountOptions.map(option => ({
                        value: option.value,
                        label: option.label,
                      }))}
                      value={field.value}
                      onValueChange={value => {
                        field.onChange(value);
                        resetAmountFields();
                      }}
                      disabled={!userId}
                      placeholder={
                        userId ? t('common.pleaseSelect') : t('agentDeposit.selectUserFirst')
                      }
                      displayValue={selectedAccount?.label}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="deposit"
              control={form.control}
              rules={amountRule(t('agentDeposit.depositAmount'))}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('agentDeposit.depositAmount')}</FormLabel>
                  <FormControl>
                    <RrhInputWithUnit
                      unit={feeCurrency}
                      value={field.value}
                      onChange={event =>
                        field.onChange(limitDigits(event.target.value, accountDigits))
                      }
                      onBlur={() => {
                        field.onBlur();
                        void calcReceive();
                      }}
                      placeholder={t('common.pleaseInput', {
                        field: t('agentDeposit.depositAmount'),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="depositCurrency"
              control={form.control}
              rules={requiredRule(t('table.paymentCurrency'))}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('table.paymentCurrency')}</FormLabel>
                  <FormControl>
                    <RrhSelect
                      options={depositCurrencyOptions}
                      value={field.value}
                      onValueChange={value => {
                        field.onChange(value);
                        form.setValue('payAmount', '');
                      }}
                      placeholder={t('common.pleaseSelect')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="rate"
              control={form.control}
              rules={amountRule(t('agentDeposit.exchangeRate'))}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('agentDeposit.exchangeRate')}</FormLabel>
                  <FormControl>
                    <RrhInputWithUnit
                      unit={currencyPair}
                      value={field.value}
                      onChange={event => field.onChange(event.target.value)}
                      onBlur={() => {
                        field.onBlur();
                        void calcReceive();
                      }}
                      placeholder={t('common.pleaseInput', {
                        field: t('agentDeposit.exchangeRate'),
                      })}
                    />
                  </FormControl>
                  <div className="text-muted-foreground text-xs">
                    <span>
                      {t('agentDeposit.buyingRate')}
                      {rateMeta?.inRate ?? '-'}
                    </span>
                    <span className="ml-6">
                      {t('agentDeposit.sellingRate')}
                      {rateMeta?.outRate ?? '-'}
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="fee"
              control={form.control}
              rules={amountRule(t('agentDeposit.commission'))}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('agentDeposit.commission')}</FormLabel>
                  <FormControl>
                    <RrhInputWithUnit
                      unit={feeCurrency}
                      value={field.value}
                      onChange={event =>
                        field.onChange(limitDigits(event.target.value, accountDigits))
                      }
                      onBlur={() => {
                        field.onBlur();
                        void calcReceive();
                      }}
                      placeholder={t('common.pleaseInput', { field: t('agentDeposit.commission') })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="payAmount"
              control={form.control}
              rules={amountRule(t('agentDeposit.payAmount'))}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('agentDeposit.payAmount')}</FormLabel>
                  <FormControl>
                    <RrhInputWithUnit
                      unit={depositCurrency}
                      value={field.value}
                      onChange={event => field.onChange(event.target.value)}
                      onBlur={() => {
                        field.onBlur();
                        void calcDeposit();
                      }}
                      placeholder={t('common.pleaseInput', { field: t('agentDeposit.payAmount') })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">{t('agentDeposit.payProof')}</span>
              <div className="flex flex-wrap gap-2">
                {vouchers.map(voucher => (
                  <div
                    key={voucher.id}
                    className="group relative size-20 overflow-hidden rounded-md border"
                  >
                    <img src={voucher.url} alt="" className="size-full object-cover" />
                    <button
                      type="button"
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => removeVoucher(voucher.id)}
                    >
                      <Trash2 className="size-4 text-white" />
                    </button>
                  </div>
                ))}
                {vouchers.length < MAX_VOUCHER_COUNT && (
                  <label className="bg-muted hover:bg-muted/80 flex size-20 cursor-pointer items-center justify-center rounded-md border">
                    <ImageUp className="text-muted-foreground size-5" />
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      className="hidden"
                      onChange={handleAddVoucher}
                    />
                  </label>
                )}
              </div>
              <p className="text-muted-foreground text-xs">{t('agentDeposit.payProofTip')}</p>
            </div>
            <FormField
              name="remark"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('agentDeposit.remark')}</FormLabel>
                  <FormControl>
                    <RrhTextarea
                      {...field}
                      maxLength={500}
                      placeholder={t('common.pleaseInput', { field: t('agentDeposit.remark') })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : (
          <>
            <div className="bg-muted text-muted-foreground rounded-md p-3 text-sm">
              <p>{t('agentDeposit.confirmTip')}</p>
              <p>{t('agentDeposit.confirmTip2')}</p>
            </div>
            <div>
              <div className="mb-2 text-sm font-medium">{t('agentDeposit.depositInfo')}</div>
              <div className="rounded-md border p-4">
                {summaryRows.map(row => (
                  <div key={row.label} className="flex gap-4 py-1.5 text-sm">
                    <span className="text-muted-foreground w-28 shrink-0">{row.label}</span>
                    <span className="break-all">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <FormField
              name="googleCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('agentDeposit.googleCode')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('agentDeposit.googleCodePlaceholder')}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </RrhForm>
    </RrhDialog>
  );
};
