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
import { PayIdAccountItem } from '@/api/hooks/setting/types';
import {
  useAddPayIdAccount,
  useCurrencyList,
  useEditPayIdAccount,
} from '@/api/hooks/setting/payment';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  applyInputNormalizer,
  normalizePositiveIntegerInput,
} from '@/pages/marketing/shared/formValueUtils';
import { CommissionSection } from './CommissionSection';

type FormValues = {
  accountName: string;
  accountEmail?: string;
  accountMobile?: string;
  abnCode?: string;
  currency?: string;
  sort?: string;
  status?: string;
  restrictCurrency?: string;
  minDeposit?: string;
  maxDeposit?: string;
  commissionMod?: string;
  commissionRate?: string;
  minCommission?: string;
  maxCommission?: string;
  fixCommission?: string;
  amountDigits?: string;
};

export const PayIdDialog = ({
  open: openProp,
  setOpen: onOpenChange,
  mode,
  item,
  trigger,
}: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  mode: 'add' | 'edit';
  item?: PayIdAccountItem;
  trigger?: boolean;
}) => {
  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;

  const { mutateAsync: add, isPending } = useAddPayIdAccount();
  const { mutateAsync: edit, isPending: isEditPending } = useEditPayIdAccount();

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
        accountName: z
          .string()
          .min(1, t('rules.required', { field: t('receiveAccountsPage.accountName') })),
        accountEmail: z.string().optional(),
        accountMobile: z.string().optional(),
        abnCode: z.string().optional(),
        currency: z.string().optional(),
        sort: z.string().optional(),
        status: z.string().optional(),
        restrictCurrency: z.string().optional(),
        minDeposit: z.string().optional(),
        maxDeposit: z.string().optional(),
        commissionMod: z.string().optional(),
        commissionRate: z.string().optional(),
        minCommission: z.string().optional(),
        maxCommission: z.string().optional(),
        fixCommission: z.string().optional(),
        amountDigits: z.string().optional(),
      }),
    [t],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      accountName: '',
      accountEmail: '',
      accountMobile: '',
      abnCode: '',
      currency: '',
      sort: '',
      status: '1',
      restrictCurrency: '0',
      minDeposit: '',
      maxDeposit: '',
      commissionMod: '1',
      commissionRate: '',
      minCommission: '',
      maxCommission: '',
      fixCommission: '',
      amountDigits: '',
    },
  });

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && item) {
      form.reset({
        accountName: item.accountName || '',
        accountEmail: item.accountEmail || '',
        accountMobile: item.accountMobile || '',
        abnCode: item.abnCode || '',
        currency: item.currency || '',
        sort: String(item.sort ?? ''),
        status: String(item.status ?? '1'),
        restrictCurrency: String(item.restrictCurrency ?? 0),
        minDeposit:
          item.minDeposit === null || item.minDeposit === undefined ? '' : String(item.minDeposit),
        maxDeposit:
          item.maxDeposit === null || item.maxDeposit === undefined ? '' : String(item.maxDeposit),
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
        amountDigits:
          item.amountDigits === null || item.amountDigits === undefined
            ? ''
            : String(item.amountDigits),
      });
      return;
    }

    form.reset({
      accountName: '',
      accountEmail: '',
      accountMobile: '',
      abnCode: '',
      currency: '',
      sort: '',
      status: '1',
      restrictCurrency: '0',
      minDeposit: '',
      maxDeposit: '',
      commissionMod: '1',
      commissionRate: '',
      minCommission: '',
      maxCommission: '',
      fixCommission: '',
      amountDigits: '',
    });
  }, [open, mode, item, form]);

  const onCancel = () => onClose(false);

  const onClose = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      form.reset();
    }
  };

  const toOptional = (value: string | undefined) => (value === '' ? undefined : value);
  const toOptionalNumber = (value: string | undefined) =>
    value === undefined || value === '' ? undefined : Number(value);

  const onSubmit = async (data: FormValues) => {
    try {
      const params = {
        accountName: data.accountName,
        accountEmail: toOptional(data.accountEmail),
        accountMobile: toOptional(data.accountMobile),
        abnCode: toOptional(data.abnCode),
        currency: toOptional(data.currency),
        sort: toOptionalNumber(data.sort),
        restrictCurrency: toOptionalNumber(data.restrictCurrency),
        minDeposit: toOptionalNumber(data.minDeposit),
        maxDeposit: toOptionalNumber(data.maxDeposit),
        commissionMod: toOptionalNumber(data.commissionMod),
        commissionRate: toOptionalNumber(data.commissionRate),
        minCommission: toOptionalNumber(data.minCommission),
        maxCommission: toOptionalNumber(data.maxCommission),
        fixCommission: toOptionalNumber(data.fixCommission),
        amountDigits: toOptionalNumber(data.amountDigits),
      };
      const res =
        mode === 'add'
          ? await add(params)
          : await edit({
              ...params,
              id: item?.id,
              status: Number(data.status || '1'),
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
          ? t('common.addField', { field: t('receiveAccountsPage.payId') })
          : t('common.modify', { field: t('receiveAccountsPage.payId') })
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
          name="accountName"
          label={t('receiveAccountsPage.accountName')}
          placeholder={t('common.pleaseInput', { field: t('receiveAccountsPage.accountName') })}
        />
        <FormInput
          name="accountEmail"
          label={t('receiveAccountsPage.accountEmail')}
          placeholder={t('common.pleaseInput', { field: t('receiveAccountsPage.accountEmail') })}
        />
        <FormInput
          name="accountMobile"
          label={t('receiveAccountsPage.accountMobile')}
          placeholder={t('common.pleaseInput', { field: t('receiveAccountsPage.accountMobile') })}
        />
        <FormInput
          name="abnCode"
          label={t('receiveAccountsPage.abnCode')}
          placeholder={t('common.pleaseInput', { field: t('receiveAccountsPage.abnCode') })}
        />
        <FormSelect
          name="currency"
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
        <CommissionSection />
      </RrhForm>
    </RrhDialog>
  );
};
