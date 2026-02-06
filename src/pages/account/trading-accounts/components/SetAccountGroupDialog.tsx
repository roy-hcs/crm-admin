import { Form } from '@/components/ui/form';
import { FormProvider } from '@/contexts/form';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useSetAccountGroup } from '@/api/hooks/account';
import { toast } from 'sonner';
import { FormSelect } from '@/components/form/FormSelect';

type FormValues = {
  accountGroup: string;
};

export const SetAccountGroupDialog = ({
  onSuccess,
  ids,
  dealAccountGroup,
  open,
  setOpen,
}: {
  onSuccess?: () => void;
  ids: string[];
  dealAccountGroup: Array<{ label: string; value: string }>;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      accountGroup: '',
    },
  });
  const { mutateAsync: setAccountGroup } = useSetAccountGroup();

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const param = {
        ...data,
        accountGroup: data.accountGroup || '',
        ids: ids.join(','),
      };
      const res = await setAccountGroup(param);
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

  return (
    <RrhDialog
      title={t('tradingAccountTransactions.batchSetAccountGroup')}
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
            <div className="text-foreground text-sm leading-5 font-medium">
              {t('tradingAccountTransactions.selectedAccounts', { count: ids.length })}
            </div>

            <FormSelect
              name="accountGroup"
              label={t('table.accountGroup')}
              verticalLabel
              placeholder={`${t('common.pleaseSelect')}`}
              showRowValue={false}
              options={dealAccountGroup}
            />

            <div className="col-span-full -mx-6 flex justify-end px-6 py-6 sm:pb-0">
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
