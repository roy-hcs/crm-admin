import { useAddWallet } from '@/api/hooks/account';
import { useGetCurrencies } from '@/api/hooks/system/system';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhForm } from '@/components/form/RrhForm';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
type FormValues = {
  crmUserId: string;
  currency: string;
};
export const CrmAddWalletDialog = ({
  userId,
  open,
  setOpen,
  onSuccess,
}: {
  userId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
}) => {
  const { t } = useTranslation();
  const { mutateAsync: addWallet, isPending: isSubmitting } = useAddWallet();

  const { data: rawCurrencies, isLoading: loading } = useGetCurrencies(userId);
  const form = useForm<FormValues>({
    defaultValues: {
      crmUserId: userId,
      currency: '',
    },
  });
  const walletList = (rawCurrencies ?? [])
    .filter(Boolean)
    .map(item => ({ label: item, value: item }));
  const onSubmit = async (data: FormValues) => {
    try {
      const res = await addWallet({
        crmUserId: userId,
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
  console.log('wallet list', walletList);
  return (
    <RrhDialog
      title={t('walletAccountsPage.addWalletAccount')}
      open={open}
      onOpenChange={setOpen}
      footerShow={false}
      variant="small"
      formLoading={isSubmitting}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
        <FormSelect
          name="currency"
          label={t('table.wallet')}
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
