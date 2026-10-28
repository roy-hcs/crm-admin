import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useForm } from 'react-hook-form';
import { RrhForm } from '@/components/form/RrhForm';
import { toast } from 'sonner';
import { RrhButton } from '@/components/common/RrhButton';
import { Plus, Upload } from 'lucide-react';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { CrmEWalletItem } from '@/api/hooks/setting/types';
import { useAddCrmEWallet, useCurrencyList, useEditCrmEWallet } from '@/api/hooks/setting/payment';
import { useUploadFile } from '@/api/hooks/system/system';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  applyInputNormalizer,
  normalizePositiveIntegerInput,
} from '@/pages/marketing/shared/formValueUtils';

type FormValues = {
  name: string;
  icon?: string;
  currency?: string;
  country?: string;
  sort?: string;
  status?: string;
};

export const EWalletDialog = ({
  open: openProp,
  setOpen: onOpenChange,
  mode,
  item,
  trigger,
}: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  mode: 'add' | 'edit';
  item?: CrmEWalletItem;
  trigger?: boolean;
}) => {
  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;

  const { mutateAsync: add, isPending } = useAddCrmEWallet();
  const { mutateAsync: edit, isPending: isEditPending } = useEditCrmEWallet();
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();

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
        name: z
          .string()
          .min(1, t('rules.required', { field: t('receiveAccountsPage.ewalletName') })),
        icon: z.string().optional(),
        currency: z.string().optional(),
        country: z.string().optional(),
        sort: z.string().optional(),
        status: z.string().optional(),
      }),
    [t],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      icon: '',
      currency: '',
      country: '',
      sort: '',
      status: '1',
    },
  });

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && item) {
      form.reset({
        name: item.name || '',
        icon: item.icon || '',
        currency: item.currency || '',
        country: item.country || '',
        sort: String(item.sort ?? ''),
        status: String(item.status ?? '1'),
      });
      return;
    }

    form.reset({
      name: '',
      icon: '',
      currency: '',
      country: '',
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

  const onUploadIcon = async (file?: File) => {
    if (!file) return;
    try {
      const res = await uploadFile(file);
      if (res.code === 0 && res.url) {
        form.setValue('icon', res.url);
      } else {
        toast.error(res.msg || t('common.AnErrorOccurred'));
      }
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const params = {
        name: data.name,
        icon: toOptional(data.icon),
        currency: toOptional(data.currency),
        country: toOptional(data.country),
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
          ? t('common.addField', { field: t('receiveAccountsPage.ewallet') })
          : t('common.modify', { field: t('receiveAccountsPage.ewallet') })
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
          label={t('receiveAccountsPage.ewalletName')}
          placeholder={t('common.pleaseInput', { field: t('receiveAccountsPage.ewalletName') })}
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
        <div className="md:col-span-2">
          <div className="mb-2 text-sm">{t('common.icon')}</div>
          <div className="flex items-center gap-3">
            {form.watch('icon') && (
              <img
                src={form.watch('icon')}
                alt="icon"
                className="size-10 rounded border object-contain"
              />
            )}
            <label className="text-muted-foreground hover:border-primary flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-3 py-2 text-sm">
              <Upload className="size-4" />
              {isUploading ? t('common.loading') : t('receiveAccountsPage.uploadIcon')}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={event => onUploadIcon(event.target.files?.[0])}
              />
            </label>
          </div>
        </div>
      </RrhForm>
    </RrhDialog>
  );
};
