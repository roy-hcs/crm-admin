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
import { CryptoCurrencyItem } from '@/api/hooks/setting/types';
import { useAddCryptoCurrency, useEditCryptoCurrency } from '@/api/hooks/setting/payment';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cryptoNetworkMap } from '@/lib/constant';
import {
  applyInputNormalizer,
  normalizePositiveIntegerInput,
} from '@/pages/marketing/shared/formValueUtils';
import { CommissionSection } from './CommissionSection';

type FormValues = {
  currencyName: string;
  network: string;
  address: string;
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

export const CryptoDialog = ({
  open: openProp,
  setOpen: onOpenChange,
  mode,
  item,
  trigger,
}: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  mode: 'add' | 'edit';
  item?: CryptoCurrencyItem;
  trigger?: boolean;
}) => {
  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;

  const { mutateAsync: add, isPending } = useAddCryptoCurrency();
  const { mutateAsync: edit, isPending: isEditPending } = useEditCryptoCurrency();

  const networkOptions = useMemo(
    () =>
      Object.entries(cryptoNetworkMap).map(([value, label]) => ({
        value,
        label,
      })),
    [],
  );

  const schema = useMemo(
    () =>
      z.object({
        currencyName: z
          .string()
          .min(1, t('rules.required', { field: t('receiveAccountsPage.currency') })),
        network: z
          .string()
          .min(1, t('rules.required', { field: t('receiveAccountsPage.network') })),
        address: z
          .string()
          .min(1, t('rules.required', { field: t('receiveAccountsPage.address') })),
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
      currencyName: '',
      network: '',
      address: '',
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
        currencyName: item.currencyName || '',
        network: String(item.network ?? ''),
        address: item.address || '',
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
      currencyName: '',
      network: '',
      address: '',
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

  const toOptionalNumber = (value: string | undefined) =>
    value === undefined || value === '' ? undefined : Number(value);

  const onSubmit = async (data: FormValues) => {
    try {
      const params = {
        currencyName: data.currencyName,
        network: data.network,
        address: data.address,
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
          ? t('common.addField', { field: t('receiveAccountsPage.crypto') })
          : t('common.modify', { field: t('receiveAccountsPage.crypto') })
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
          name="currencyName"
          label={t('receiveAccountsPage.currency')}
          placeholder={t('common.pleaseInput', { field: t('receiveAccountsPage.currency') })}
        />
        <FormSelect
          name="network"
          label={t('receiveAccountsPage.network')}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={networkOptions}
        />
        <div className="md:col-span-2">
          <FormInput
            name="address"
            label={t('receiveAccountsPage.address')}
            placeholder={t('common.pleaseInput', { field: t('receiveAccountsPage.address') })}
          />
        </div>
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
