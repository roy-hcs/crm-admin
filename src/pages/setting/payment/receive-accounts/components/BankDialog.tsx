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
import { CrmBankItem } from '@/api/hooks/setting/types';
import { useAddCrmBank, useCurrencyList, useEditCrmBank } from '@/api/hooks/setting/payment';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  applyInputNormalizer,
  normalizePositiveIntegerInput,
} from '@/pages/marketing/shared/formValueUtils';

type FormValues = {
  name: string;
  code?: string;
  currency?: string;
  country?: string;
  swiftCode?: string;
  bsbCode?: string;
  ifscCode?: string;
  abaCode?: string;
  sortCode?: string;
  sort?: string;
  status?: string;
};

export const BankDialog = ({
  open: openProp,
  setOpen: onOpenChange,
  mode,
  item,
  trigger,
}: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  mode: 'add' | 'edit';
  item?: CrmBankItem;
  trigger?: boolean;
}) => {
  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;

  const { mutateAsync: add, isPending } = useAddCrmBank();
  const { mutateAsync: edit, isPending: isEditPending } = useEditCrmBank();

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
        name: z.string().min(1, t('rules.required', { field: t('receiveAccountsPage.bankName') })),
        code: z.string().optional(),
        currency: z.string().optional(),
        country: z.string().optional(),
        swiftCode: z.string().optional(),
        bsbCode: z.string().optional(),
        ifscCode: z.string().optional(),
        abaCode: z.string().optional(),
        sortCode: z.string().optional(),
        sort: z.string().optional(),
        status: z.string().optional(),
      }),
    [t],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      code: '',
      currency: '',
      country: '',
      swiftCode: '',
      bsbCode: '',
      ifscCode: '',
      abaCode: '',
      sortCode: '',
      sort: '',
      status: '1',
    },
  });

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && item) {
      form.reset({
        name: item.name || '',
        code: item.code || '',
        currency: item.currency || '',
        country: item.country || '',
        swiftCode: item.swiftCode || '',
        bsbCode: item.bsbCode || '',
        ifscCode: item.ifscCode || '',
        abaCode: item.abaCode || '',
        sortCode: item.sortCode || '',
        sort: String(item.sort ?? ''),
        status: String(item.status ?? '1'),
      });
      return;
    }

    form.reset({
      name: '',
      code: '',
      currency: '',
      country: '',
      swiftCode: '',
      bsbCode: '',
      ifscCode: '',
      abaCode: '',
      sortCode: '',
      sort: '',
      status: '1',
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
        name: data.name,
        code: toOptional(data.code),
        currency: toOptional(data.currency),
        country: toOptional(data.country),
        swiftCode: toOptional(data.swiftCode),
        bsbCode: toOptional(data.bsbCode),
        ifscCode: toOptional(data.ifscCode),
        abaCode: toOptional(data.abaCode),
        sortCode: toOptional(data.sortCode),
        sort: toOptionalNumber(data.sort),
      };
      const res =
        mode === 'add'
          ? await add(params)
          : await edit({
              ...params,
              id: item?.id || '',
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
          ? t('common.addField', { field: t('receiveAccountsPage.bank') })
          : t('common.modify', { field: t('receiveAccountsPage.bank') })
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
          name="name"
          label={t('receiveAccountsPage.bankName')}
          placeholder={t('common.pleaseInput', { field: t('receiveAccountsPage.bankName') })}
        />
        <FormInput
          name="code"
          label={t('receiveAccountsPage.bankCode')}
          placeholder={t('common.pleaseInput', { field: t('receiveAccountsPage.bankCode') })}
        />
        <FormSelect
          name="currency"
          label={t('receiveAccountsPage.currency')}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={currencyOptions}
        />
        <FormInput
          name="country"
          label={t('receiveAccountsPage.country')}
          placeholder={t('common.pleaseInput', { field: t('receiveAccountsPage.country') })}
        />
        <FormInput
          name="swiftCode"
          label={t('receiveAccountsPage.swiftCode')}
          placeholder={t('common.pleaseInput', { field: t('receiveAccountsPage.swiftCode') })}
        />
        <FormInput
          name="bsbCode"
          label={t('receiveAccountsPage.bsbCode')}
          placeholder={t('common.pleaseInput', { field: t('receiveAccountsPage.bsbCode') })}
        />
        <FormInput
          name="ifscCode"
          label={t('receiveAccountsPage.ifscCode')}
          placeholder={t('common.pleaseInput', { field: t('receiveAccountsPage.ifscCode') })}
        />
        <FormInput
          name="abaCode"
          label={t('receiveAccountsPage.abaCode')}
          placeholder={t('common.pleaseInput', { field: t('receiveAccountsPage.abaCode') })}
        />
        <FormInput
          name="sortCode"
          label={t('receiveAccountsPage.sortCode')}
          placeholder={t('common.pleaseInput', { field: t('receiveAccountsPage.sortCode') })}
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
      </RrhForm>
    </RrhDialog>
  );
};
