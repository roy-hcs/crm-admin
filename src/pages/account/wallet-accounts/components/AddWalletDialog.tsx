import { FormField } from '@/components/ui/form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { FormSelect } from '@/components/form/FormSelect';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { SelectAccount } from './SelectAccount';
import { useAddWallet } from '@/api/hooks/account';
import { useGetCurrencies } from '@/api/hooks/system/system';
import { toast } from 'sonner';
import { RrhForm } from '@/components/form/RrhForm';

type FormValues = {
  crmUserId: string;
  currency: string;
};

const walletSchema = (t: TFunction<'translation', undefined>) => {
  return {
    crmUserId: z.string().min(1, t('rules.required', { field: t('walletAccountsPage.account') })),
    currency: z.string().min(1, t('rules.required', { field: t('table.wallet') })),
  };
};

export const AddWalletDialog = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const schema = useMemo(() => z.object(walletSchema(t)), [t]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      crmUserId: '',
      currency: '',
    },
  });
  const { mutateAsync: addWallet, isPending } = useAddWallet();

  const crmUserId = form.watch('crmUserId');

  const { data: rawCurrencies, isLoading: loading } = useGetCurrencies(crmUserId);
  const walletList = (rawCurrencies ?? [])
    .filter(Boolean)
    .map(item => ({ label: item, value: item }));

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await addWallet({
        crmUserId: data.crmUserId,
        balance: '0',
        currency: data.currency || '',
      });
      if (res.code === 0) {
        form.reset();
        toast.success(t('common.success'));
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const onCancel = () => {
    form.reset();
    setOpen(false);
  };

  // 当选择的账户变更时，重置货币选择
  useEffect(() => {
    form.setValue('currency', '');
  }, [crmUserId, form]);

  return (
    <RrhDialog
      trigger={
        <RrhButton type="button" Icon={<Plus className="size-3.5" />}>
          {t('walletAccountsPage.addWalletAccount')}
        </RrhButton>
      }
      title={t('walletAccountsPage.addWalletAccount')}
      isConfirmDisabled={isPending}
      open={open}
      onOpenChange={setOpen}
      footerShow={false}
      variant="small"
      formLoading={isPending}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
        <FormField
          name="crmUserId"
          render={({ field }) => {
            return (
              <SelectAccount verticalLabel field={field} title={t('walletAccountsPage.account')} />
            );
          }}
        />

        <FormSelect
          name="currency"
          label={t('table.wallet')}
          verticalLabel
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={walletList}
          loading={loading}
        />

        <div className="col-span-full -mx-6 flex justify-end px-6 py-6 sm:pb-0">
          <div className="flex justify-end gap-4">
            <RrhButton variant="outline" type="button" className="px-4 py-2" onClick={onCancel}>
              {t('common.Cancel')}
            </RrhButton>
            <RrhButton type="submit" className="px-4 py-2">
              {t('common.Confirm')}
            </RrhButton>
          </div>
        </div>
      </RrhForm>
    </RrhDialog>
  );
};
