import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';
import { toast } from 'sonner';
import { CrmUserItem, useBatchCreateWallet } from '@/api/hooks/account';
import { useCurrencyList } from '@/api/hooks/system/system';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { RrhForm } from '@/components/form/RrhForm';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';

type FormValues = {
  currencies: string[];
};

export const BatchCreateWalletDialog = ({
  open,
  setOpen,
  rows,
  onSuccess,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  rows: CrmUserItem[];
  onSuccess?: () => void;
}) => {
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState('');
  const { data: currencyList } = useCurrencyList();
  const { mutateAsync: batchCreate, isPending } = useBatchCreateWallet();

  const schema = useMemo(
    () =>
      z.object({
        currencies: z
          .array(z.string())
          .min(1, { message: t('CRMAccountPage.pleaseSelectWalletCurrency') }),
      }),
    [t],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currencies: [],
    },
  });

  const currencyOptions = useMemo(() => {
    const term = keyword.trim().toLowerCase();
    return (currencyList?.rows || [])
      .filter(
        item =>
          !term ||
          item.currencyAbbr.toLowerCase().includes(term) ||
          (item.currencyNameChn || '').includes(term),
      )
      .map(item => ({
        label: `${item.currencyAbbr} ${item.currencyNameChn || ''}`.trim(),
        value: item.currencyAbbr,
      }));
  }, [currencyList, keyword]);

  const onCancel = () => {
    form.reset({ currencies: [] });
    setKeyword('');
    setOpen(false);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await batchCreate({
        ids: rows.map(row => row.id).join(','),
        currencies: data.currencies.join(','),
      });
      if (res.code === 0) {
        toast.success(t('common.success'));
        onCancel();
        onSuccess?.();
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.error('Batch create wallet error', error);
      toast.error(t('common.AnErrorOccurred'));
    }
  };

  return (
    <RrhDialog
      title={t('CRMAccountPage.BatchCreateWallet')}
      open={open}
      onOpenChange={setOpen}
      footerShow={false}
      variant="small"
      formLoading={isPending}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
        <div className="text-foreground text-sm leading-5 font-medium">
          {t('CRMAccountPage.selectedAccounts', { count: rows.length })}
        </div>

        <FormMultiSelect<FormValues>
          name="currencies"
          label={t('CRMAccountPage.walletCurrencyMultiple')}
          options={currencyOptions}
          placeholder={t('common.pleaseSelect')}
          searchSupport
          searchValue={keyword}
          searchPlaceholder={t('common.pleaseInput', {
            field: t('CRMAccountPage.walletCurrencyMultiple'),
          })}
          onSearchChange={setKeyword}
        />

        <div className="col-span-full -mx-6 flex justify-end px-6 py-6 sm:pb-0">
          <div className="flex justify-end gap-4">
            <RrhButton variant="outline" type="button" className="px-4 py-2" onClick={onCancel}>
              {t('common.Cancel')}
            </RrhButton>
            <RrhButton type="submit" className="px-4 py-2" disabled={isPending}>
              {t('common.Confirm')}
            </RrhButton>
          </div>
        </div>
      </RrhForm>
    </RrhDialog>
  );
};
