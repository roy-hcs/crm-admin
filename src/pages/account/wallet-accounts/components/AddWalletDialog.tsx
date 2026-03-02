import { Form, FormField } from '@/components/ui/form';
import { FormProvider } from '@/contexts/form';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = useMemo(() => z.object(walletSchema(t)), [t]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      crmUserId: '',
      currency: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [walletList, setWalletList] = useState<{ label: string; value: string }[]>([]);
  const { mutateAsync: addWallet } = useAddWallet();
  const { mutateAsync: getWallet } = useGetCurrencies();

  const crmUserId = form.watch('crmUserId');

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const param = {
        crmUserId: data.crmUserId,
        balance: '0',
        currency: data.currency || '',
      };
      const res = await addWallet(param);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancel = () => {
    form.reset();
    setOpen(false);
  };

  useEffect(() => {
    if (!crmUserId) return;
    let mounted = true;
    const fetch = async (crmUserId?: string) => {
      if (!crmUserId) {
        if (mounted) setWalletList([]);
        return;
      }
      if (mounted) setLoading(true);
      try {
        const walletList = await getWallet({ userId: crmUserId });
        if (!mounted) return;
        if (walletList?.length > 0) {
          const walletOptions = walletList
            .filter(i => i)
            .map((item: string) => ({
              label: item,
              value: item,
            }));
          setWalletList(walletOptions);
        } else {
          setWalletList([]);
        }
      } catch (error) {
        console.error(error);
        if (mounted) setWalletList([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch(crmUserId);
    form.setValue('currency', '');
    return () => {
      mounted = false;
    };
  }, [form, getWallet, crmUserId]);

  return (
    <RrhDialog
      trigger={
        <RrhButton type="button" Icon={<Plus className="size-3.5" />}>
          {t('walletAccountsPage.addWalletAccount')}
        </RrhButton>
      }
      title={t('walletAccountsPage.addWalletAccount')}
      isConfirmDisabled={isSubmitting}
      open={open}
      onOpenChange={setOpen}
      footerShow={false}
      variant="small"
      formLoading={isSubmitting}
    >
      <FormProvider form={form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
            <FormField
              name="crmUserId"
              render={({ field }) => {
                return (
                  <SelectAccount
                    verticalLabel
                    field={field}
                    title={t('walletAccountsPage.account')}
                  />
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
          </form>
        </Form>
      </FormProvider>
    </RrhDialog>
  );
};
