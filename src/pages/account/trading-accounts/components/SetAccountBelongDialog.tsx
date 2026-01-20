import { Form, FormField } from '@/components/ui/form';
import { FormProvider } from '@/contexts/form';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { SelectUser } from './SelectUser';
import { useSetAccountBelong } from '@/api/hooks/account';
import { toast } from 'sonner';

type FormValues = {
  newUserId: string;
};

export const SetAccountBelongDialog = ({
  onSuccess,
  ids,
}: {
  onSuccess?: () => void;
  ids: string[];
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      newUserId: '',
    },
  });
  const { mutateAsync: setAccountBelongs } = useSetAccountBelong();

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const param = {
        ...data,
        newUserId: data.newUserId || '',
        ids: ids.join(','),
      };
      const res = await setAccountBelongs(param);
      if (res.code === 0) {
        form.reset();
        toast.success(t('common.success'));
        setOpen(false);
        onSuccess?.();
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

  return (
    <RrhDialog
      trigger={
        <RrhButton
          onClick={e => {
            if (ids && ids?.length > 0) {
              setOpen(true);
            } else {
              toast.error(t('financial.tradingAccountTransactions.atLeastOneAccount'));
              e.preventDefault();
            }
          }}
          type="button"
          Icon={<Plus className="size-3.5" />}
        >
          {t('financial.tradingAccountTransactions.batchSetAccountBelong')}
        </RrhButton>
      }
      title={t('financial.tradingAccountTransactions.batchSetAccountBelong')}
      isConfirmDisabled={isSubmitting}
      open={open}
      onOpenChange={setOpen}
      footerShow={false}
      variant="small"
      formLoading={isSubmitting}
    >
      <FormProvider form={form}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-1"
          >
            <div className="text-foreground text-sm leading-5 font-medium">
              {t('financial.tradingAccountTransactions.selectedAccounts', { count: ids.length })}
            </div>
            <FormField
              name="newUserId"
              render={({ field }) => {
                return (
                  <SelectUser verticalLabel field={field} title={t('ticketList.belongUser')} />
                );
              }}
            />

            <div className="col-span-full -mx-6 flex justify-end px-6 pt-6 pb-6 sm:pb-0">
              <div className="flex justify-end gap-4">
                <RrhButton variant="outline" type="button" className="px-4 py-2" onClick={onCancel}>
                  {t('common.Cancel')}
                </RrhButton>
                <RrhButton type="submit" className="px-4 py-2" disabled={isSubmitting}>
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
