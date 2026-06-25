import { PageInfo } from '@/components/common/PageInfo';
import { RrhCard } from '@/components/common/RrhCard';
import { RrhForm } from '@/components/form/RrhForm';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { FormCrmUserSelect } from '@/components/form/FormCrmUserSelect';
import { useAddUserWallet, useDictType, useGetUserWallets } from '@/api/hooks/system/system';
import { FormSelect } from '@/components/form/FormSelect';
import { FormItem, FormLabel } from '@/components/ui/form';
import { useMemo, useState } from 'react';
import { RrhButton } from '@/components/common/RrhButton';
import { FormInput } from '@/components/form/FormInput';
import { FormTextarea } from '@/components/form/FormTextarea';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RrhAlert } from '@/components/common/RrhAlert';
import { toast } from 'sonner';
import { BatchWalletDialog } from '@/pages/account/wallet-accounts/components/BatchWalletDialog';
import { Sheet } from 'lucide-react';
type FormValues = {
  crmUserId: string;
  walletId: string;
  amount: string;
  remark?: string;
  opType: string;
};
export const WalletAdjustmentPage = () => {
  const { t } = useTranslation();
  const schema = z.object({
    crmUserId: z.string().min(1, t('rules.required', { field: t('walletAccountsPage.account') })),
    walletId: z.string().min(1, t('rules.required', { field: t('table.wallet') })),
    amount: z.string().min(1, t('rules.required', { field: t('table.operationAmount') })),
    remark: z
      .string()
      .max(32, t('rules.limitLength', { field: 32 }))
      .optional(),
    opType: z.string().min(1, t('rules.required', { field: t('table.operationType') })),
  });
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      crmUserId: '',
      walletId: '',
      amount: '',
      remark: '',
      opType: '',
    },
  });
  const [activeWay, setActiveWay] = useState('deposit');
  const [open, setOpen] = useState(false);
  const { data: walletList } = useGetUserWallets(form.watch('crmUserId'));
  const { data: adjustInType } = useDictType('crm_adjust_in_type', { enabled: true });
  const { data: adjustOutType } = useDictType('crm_adjust_out_type', { enabled: true });
  const { mutate: operateWallet, isPending } = useAddUserWallet();
  const operationTypes = useMemo(() => {
    if (!adjustInType || !adjustOutType) return [];
    const adjustTypes = activeWay === 'deposit' ? adjustInType : adjustOutType;
    return adjustTypes
      .map(item => ({
        label: item.dictLabel,
        value: item.dictValue,
      }))
      .filter(item => item.value !== '6');
  }, [activeWay, adjustInType, adjustOutType]);
  const walletId = form.watch('walletId');
  const selectedWalletCurrency = useMemo(() => {
    const selectedWallet = walletList?.find(wallet => wallet.id === walletId);
    if (!selectedWallet) return '';
    return selectedWallet.balance + ' ' + selectedWallet.currency;
  }, [walletId, walletList]);
  const onSubmit = () => {
    setOpen(true);
  };
  const onConfirm = () => {
    const values = form.getValues();
    operateWallet(
      {
        crmUserId: values.crmUserId,
        walletId: values.walletId,
        amount: values.amount,
        remark: values.remark || '',
        opType: values.opType,
        operationType: activeWay === 'deposit' ? '1' : '2',
      },
      {
        onSuccess: result => {
          if (result?.code === 0) {
            form.reset();
            setOpen(false);
            toast.success(t('common.modifyFieldSuccess', { field: t('table.balance') }));
          } else {
            toast.error(
              result?.msg || t('common.modifyFieldFailed', { field: t('table.balance') }),
            );
          }
        },
        onError: error => {
          toast.error(
            error?.message || t('common.modifyFieldFailed', { field: t('table.balance') }),
          );
        },
      },
    );
  };
  return (
    <div>
      <PageInfo title={t('walletAdjustment.title')} desc={t('walletAdjustment.desc')} />
      <RrhCard className="mt-4 flex justify-between gap-50">
        <RrhForm
          form={form}
          className="flex flex-1 flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormCrmUserSelect
            verticalLabel
            name="crmUserId"
            label={t('walletAccountsPage.account')}
          />
          <FormSelect
            name="walletId"
            label={t('table.wallet')}
            showRowValue={false}
            options={(walletList || []).map(wallet => ({
              label: wallet.currency,
              value: wallet.id,
            }))}
          />
          <FormItem>
            <FormLabel>{t('CRMAccountPage.DeleteAccountWalletBalance')}</FormLabel>
            <div>{selectedWalletCurrency}</div>
          </FormItem>
          <FormItem>
            <FormLabel>{t('table.inMethod')}</FormLabel>
            <div className="flex gap-4">
              <RrhButton
                type="button"
                variant={activeWay === 'deposit' ? 'default' : 'outline'}
                onClick={() => setActiveWay('deposit')}
              >
                {t('table.Deposit')}
              </RrhButton>
              <RrhButton
                type="button"
                variant={activeWay === 'withdrawal' ? 'default' : 'outline'}
                onClick={() => setActiveWay('withdrawal')}
              >
                {t('table.Withdrawal')}
              </RrhButton>
            </div>
          </FormItem>
          <FormSelect
            name="opType"
            showRowValue={false}
            label={t('table.operationType')}
            options={operationTypes}
          />
          <FormInput
            name="amount"
            label={t('table.operationAmount')}
            placeholder={t('common.pleaseInput', { field: t('table.operationAmount') })}
          />
          <FormTextarea
            name="remark"
            label={`${t('table.remarks')} (${t('common.optional')})`}
            placeholder={t('rules.limitLength', { field: 32 })}
            maxLength={32}
          />
          <div>
            <RrhButton type="submit">{t('common.submit')}</RrhButton>
          </div>
        </RrhForm>
        <div className="flex flex-1 flex-col items-start gap-2 pt-6">
          <BatchWalletDialog
            trigger={
              <RrhButton type="button" Icon={<Sheet className="size-3.5" />}>
                {t('walletAccountsPage.Excel')}
              </RrhButton>
            }
          />
          <div className="text-xs">{t('walletAdjustment.walletBatchAdjustmentDesc')}</div>
          <div className="text-xs text-red-500">
            {t('walletAdjustment.walletBatchAdjustmentTip')}
          </div>
        </div>
      </RrhCard>
      <RrhAlert
        open={open}
        onOpenChange={setOpen}
        trigger={null}
        cancelText={t('common.Cancel')}
        confirmText={t('common.Confirm')}
        title={t('common.SystemPrompt')}
        content={t('common.confirmToProceed')}
        onConfirm={onConfirm}
        confirmLoading={isPending}
      />
    </div>
  );
};
