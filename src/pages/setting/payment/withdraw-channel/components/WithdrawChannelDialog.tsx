import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useForm } from 'react-hook-form';
import { RrhForm } from '@/components/form/RrhForm';
import { toast } from 'sonner';
import { RrhButton } from '@/components/common/RrhButton';
import { Plus } from 'lucide-react';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { FormTextarea } from '@/components/form/FormTextarea';
import { WithdrawChannelItem } from '@/api/hooks/setting/types';
import {
  useAddWithdrawChannel,
  useCurrencyList,
  useEditWithdrawChannel,
} from '@/api/hooks/setting/payment';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  applyInputNormalizer,
  normalizePositiveIntegerInput,
} from '@/pages/marketing/shared/formValueUtils';

type FormValues = {
  channelName: string;
  channelCurrency?: string;
  sort?: string;
  status?: string;
  minWithdraw?: string;
  maxWithdraw?: string;
  exchangeRateFloat?: string;
  amountDigits?: string;
  commissionMod?: string;
  commissionRate?: string;
  minCommission?: string;
  maxCommission?: string;
  fixCommission?: string;
  commissionAmountDigits?: string;
  outMoneyWithdrawCheck?: string;
  timeEnabled?: string;
  frozen?: string;
  remark?: string;
};

export const WithdrawChannelDialog = ({
  open: openProp,
  setOpen: onOpenChange,
  mode,
  item,
  trigger,
}: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  mode: 'add' | 'edit';
  item?: WithdrawChannelItem;
  trigger?: boolean;
}) => {
  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;

  const { mutateAsync: add, isPending } = useAddWithdrawChannel();
  const { mutateAsync: edit, isPending: isEditPending } = useEditWithdrawChannel();

  const { data: currencyRes } = useCurrencyList(
    { pageNum: 1, pageSize: 1000, orderByColumn: '', isAsc: 'asc' },
    { enabled: open },
  );
  const currencyOptions = useMemo(
    () =>
      (currencyRes?.rows || [])
        .filter(row => row.status === 1)
        .map(row => ({ value: row.currencyAbbr, label: row.currencyAbbr })),
    [currencyRes],
  );

  const schema = useMemo(
    () =>
      z.object({
        channelName: z
          .string()
          .min(1, t('rules.required', { field: t('withdrawChannelPage.channelName') })),
        channelCurrency: z.string().optional(),
        sort: z.string().optional(),
        status: z.string().optional(),
        minWithdraw: z.string().optional(),
        maxWithdraw: z.string().optional(),
        exchangeRateFloat: z.string().optional(),
        amountDigits: z.string().optional(),
        commissionMod: z.string().optional(),
        commissionRate: z.string().optional(),
        minCommission: z.string().optional(),
        maxCommission: z.string().optional(),
        fixCommission: z.string().optional(),
        commissionAmountDigits: z.string().optional(),
        outMoneyWithdrawCheck: z.string().optional(),
        timeEnabled: z.string().optional(),
        frozen: z.string().optional(),
        remark: z.string().optional(),
      }),
    [t],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      channelName: '',
      channelCurrency: '',
      sort: '',
      status: '1',
      minWithdraw: '',
      maxWithdraw: '',
      exchangeRateFloat: '',
      amountDigits: '',
      commissionMod: '1',
      commissionRate: '',
      minCommission: '',
      maxCommission: '',
      fixCommission: '',
      commissionAmountDigits: '',
      outMoneyWithdrawCheck: '0',
      timeEnabled: '0',
      frozen: '0',
      remark: '',
    },
  });

  const commissionMod = form.watch('commissionMod');

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && item) {
      form.reset({
        channelName: item.channelName || '',
        channelCurrency: item.channelCurrency || '',
        sort: String(item.sort ?? ''),
        status: String(item.status ?? '1'),
        minWithdraw:
          item.minWithdraw === null || item.minWithdraw === undefined
            ? ''
            : String(item.minWithdraw),
        maxWithdraw:
          item.maxWithdraw === null || item.maxWithdraw === undefined
            ? ''
            : String(item.maxWithdraw),
        exchangeRateFloat:
          item.exchangeRateFloat === null || item.exchangeRateFloat === undefined
            ? ''
            : String(item.exchangeRateFloat),
        amountDigits:
          item.amountDigits === null || item.amountDigits === undefined
            ? ''
            : String(item.amountDigits),
        commissionMod: String(item.commissionMod ?? '1'),
        commissionRate:
          item.commissionRate === null || item.commissionRate === undefined
            ? ''
            : String(item.commissionRate),
        minCommission:
          item.minCommission === null || item.minCommission === undefined
            ? ''
            : String(item.minCommission),
        maxCommission:
          item.maxCommission === null || item.maxCommission === undefined
            ? ''
            : String(item.maxCommission),
        fixCommission:
          item.fixCommission === null || item.fixCommission === undefined
            ? ''
            : String(item.fixCommission),
        commissionAmountDigits:
          item.commissionAmountDigits === null || item.commissionAmountDigits === undefined
            ? ''
            : String(item.commissionAmountDigits),
        outMoneyWithdrawCheck: String(item.outMoneyWithdrawCheck ?? 0),
        timeEnabled: String(item.timeEnabled ?? 0),
        frozen: String(item.frozen ?? 0),
        remark: item.remark || '',
      });
      return;
    }

    form.reset({
      channelName: '',
      channelCurrency: '',
      sort: '',
      status: '1',
      minWithdraw: '',
      maxWithdraw: '',
      exchangeRateFloat: '',
      amountDigits: '',
      commissionMod: '1',
      commissionRate: '',
      minCommission: '',
      maxCommission: '',
      fixCommission: '',
      commissionAmountDigits: '',
      outMoneyWithdrawCheck: '0',
      timeEnabled: '0',
      frozen: '0',
      remark: '',
    });
  }, [open, mode, item, form]);

  const onCancel = () => onClose(false);

  const onClose = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      form.reset();
    }
  };

  const toOptionalNumber = (value: string | undefined) =>
    value === undefined || value === '' ? undefined : Number(value);

  const onSubmit = async (data: FormValues) => {
    try {
      const params = {
        channelName: data.channelName,
        channelCurrency: data.channelCurrency || undefined,
        sort: toOptionalNumber(data.sort),
        minWithdraw: toOptionalNumber(data.minWithdraw),
        maxWithdraw: toOptionalNumber(data.maxWithdraw),
        exchangeRateFloat: toOptionalNumber(data.exchangeRateFloat),
        amountDigits: toOptionalNumber(data.amountDigits),
        commissionMod: data.commissionMod,
        commissionRate: toOptionalNumber(data.commissionRate),
        minCommission: toOptionalNumber(data.minCommission),
        maxCommission: toOptionalNumber(data.maxCommission),
        fixCommission: toOptionalNumber(data.fixCommission),
        commissionAmountDigits: toOptionalNumber(data.commissionAmountDigits),
        outMoneyWithdrawCheck: toOptionalNumber(data.outMoneyWithdrawCheck),
        timeEnabled: toOptionalNumber(data.timeEnabled),
        frozen: toOptionalNumber(data.frozen),
        remark: data.remark || undefined,
      };
      const res =
        mode === 'add'
          ? await add(params)
          : await edit({
              ...params,
              id: item?.id,
              status: Number(data.status || '1'),
              // 编辑时透传旧系统维护的扩展数据，避免后端清空
              fieldList: (item as { fieldList?: unknown[] } | undefined)?.fieldList,
              languageList: (item as { languageList?: unknown[] } | undefined)?.languageList,
              selectedLanguages: (item as { selectedLanguages?: string } | undefined)
                ?.selectedLanguages,
              applicableUserSettings: (item as { applicableUserSettings?: unknown } | undefined)
                ?.applicableUserSettings,
              availableTimeConfig: (item as { availableTimeConfig?: string } | undefined)
                ?.availableTimeConfig,
              specificCurrencyLimits: (item as { specificCurrencyLimits?: string } | undefined)
                ?.specificCurrencyLimits,
              specificCurrencyCommissions: (
                item as { specificCurrencyCommissions?: string } | undefined
              )?.specificCurrencyCommissions,
              verificationRule: item?.verificationRule ?? undefined,
              outMoneyAccountCheck: item?.outMoneyAccountCheck ?? undefined,
            });
      if (res.code === 0) {
        toast.success(t('common.success'));
        onClose(false);
      } else {
        toast.error(res.msg);
      }
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    }
  };

  return (
    <RrhDialog
      title={
        mode === 'add'
          ? t('common.addField', { field: t('withdrawChannelPage.title') })
          : t('common.modify', { field: t('withdrawChannelPage.title') })
      }
      trigger={
        mode === 'add' && trigger ? (
          <RrhButton type="button" Icon={<Plus className="size-3.5" />}>
            {t('common.add')}
          </RrhButton>
        ) : null
      }
      isConfirmDisabled={isPending || isEditPending}
      open={open}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={form.handleSubmit(onSubmit)}
      variant="large"
      type="submit"
      formLoading={isPending || isEditPending}
    >
      <RrhForm
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2"
      >
        <FormInput
          name="channelName"
          label={t('withdrawChannelPage.channelName')}
          placeholder={t('common.pleaseInput', { field: t('withdrawChannelPage.channelName') })}
        />
        <FormSelect
          name="channelCurrency"
          label={t('receiveAccountsPage.currency')}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={currencyOptions}
        />
        <FormInput
          name="sort"
          label={t('table.sort')}
          placeholder={t('common.pleaseInput', { field: t('table.sort') })}
          onInput={event =>
            applyInputNormalizer(event.currentTarget, normalizePositiveIntegerInput)
          }
        />
        {mode === 'edit' && (
          <FormSelect
            name="status"
            label={t('table.status')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={[
              { value: '1', label: t('common.enable') },
              { value: '0', label: t('common.disable') },
            ]}
          />
        )}

        <div className="rounded-md border p-4 md:col-span-2">
          <div className="mb-4 text-sm font-medium">{t('withdrawChannelPage.limitSection')}</div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
            <FormInput
              name="minWithdraw"
              label={t('withdrawChannelPage.minWithdraw')}
              placeholder={t('common.pleaseInput', {
                field: t('withdrawChannelPage.minWithdraw'),
              })}
            />
            <FormInput
              name="maxWithdraw"
              label={t('withdrawChannelPage.maxWithdraw')}
              placeholder={t('common.pleaseInput', {
                field: t('withdrawChannelPage.maxWithdraw'),
              })}
            />
            <FormInput
              name="exchangeRateFloat"
              label={t('withdrawChannelPage.exchangeRateFloat')}
              placeholder={t('common.pleaseInput', {
                field: t('withdrawChannelPage.exchangeRateFloat'),
              })}
            />
            <FormInput
              name="amountDigits"
              label={t('receiveAccountsPage.amountDigits')}
              placeholder={t('common.pleaseInput', {
                field: t('receiveAccountsPage.amountDigits'),
              })}
              onInput={event =>
                applyInputNormalizer(event.currentTarget, normalizePositiveIntegerInput)
              }
            />
          </div>
        </div>

        <div className="rounded-md border p-4 md:col-span-2">
          <div className="mb-4 text-sm font-medium">
            {t('receiveAccountsPage.commissionSection')}
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
            <FormSelect
              name="commissionMod"
              label={t('receiveAccountsPage.commissionMode')}
              placeholder={t('common.pleaseSelect')}
              showRowValue={false}
              options={[
                { value: '1', label: t('receiveAccountsPage.commissionByRate') },
                { value: '2', label: t('receiveAccountsPage.commissionFixed') },
              ]}
            />
            {commissionMod === '1' && (
              <>
                <FormInput
                  name="commissionRate"
                  label={t('receiveAccountsPage.commissionRate')}
                  placeholder={t('common.pleaseInput', {
                    field: t('receiveAccountsPage.commissionRate'),
                  })}
                />
                <FormInput
                  name="minCommission"
                  label={t('receiveAccountsPage.minCommission')}
                  placeholder={t('common.pleaseInput', {
                    field: t('receiveAccountsPage.minCommission'),
                  })}
                />
                <FormInput
                  name="maxCommission"
                  label={t('receiveAccountsPage.maxCommission')}
                  placeholder={t('common.pleaseInput', {
                    field: t('receiveAccountsPage.maxCommission'),
                  })}
                />
              </>
            )}
            {commissionMod === '2' && (
              <FormInput
                name="fixCommission"
                label={t('receiveAccountsPage.fixCommission')}
                placeholder={t('common.pleaseInput', {
                  field: t('receiveAccountsPage.fixCommission'),
                })}
              />
            )}
            <FormInput
              name="commissionAmountDigits"
              label={t('withdrawChannelPage.commissionAmountDigits')}
              placeholder={t('common.pleaseInput', {
                field: t('withdrawChannelPage.commissionAmountDigits'),
              })}
              onInput={event =>
                applyInputNormalizer(event.currentTarget, normalizePositiveIntegerInput)
              }
            />
          </div>
        </div>

        <FormSelect
          name="outMoneyWithdrawCheck"
          label={t('withdrawChannelPage.outMoneyWithdrawCheck')}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={[
            { value: '1', label: t('common.yes') },
            { value: '0', label: t('common.no') },
          ]}
        />
        <FormSelect
          name="timeEnabled"
          label={t('withdrawChannelPage.timeEnabled')}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={[
            { value: '1', label: t('common.yes') },
            { value: '0', label: t('common.no') },
          ]}
        />
        <FormSelect
          name="frozen"
          label={t('withdrawChannelPage.frozen')}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={[
            { value: '1', label: t('common.yes') },
            { value: '0', label: t('common.no') },
          ]}
        />
        <div className="md:col-span-2">
          <FormTextarea
            name="remark"
            label={t('currencySettingPage.remark')}
            placeholder={t('common.pleaseInput', { field: t('currencySettingPage.remark') })}
          />
        </div>
      </RrhForm>
    </RrhDialog>
  );
};
