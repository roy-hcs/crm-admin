import { Form, FormField } from '@/components/ui/form';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useState } from 'react';
import { CircleAlert } from 'lucide-react';
import { RrhRadioGroup } from '@/components/common/RrhRadioGroup';
import { useCrmUserRemove } from '@/api/hooks/system/system';
type resetPasswordFormValues = {
  deleteType: string;
};

export const DeleteAccount = ({
  isResetDialogOpen,
  setIsResetDialogOpen,
  id,
  title,
}: {
  isResetDialogOpen: boolean;
  setIsResetDialogOpen: (open: boolean) => void;
  id: string;
  title: string;
}) => {
  const { t } = useTranslation();
  const changeRemoveAccountMutation = useCrmUserRemove();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<resetPasswordFormValues>({
    defaultValues: {
      deleteType: '1', // 1仅删除CRM账户 2删除CRM账户及其交易账号
    },
  });

  const onSubmit = async (values: resetPasswordFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await changeRemoveAccountMutation.mutateAsync({
        id: id,
        deleteType: values.deleteType,
      });
      if (res.code === 0) {
        toast.success(t('common.success'));
        setIsResetDialogOpen(false);
      } else {
        toast.error(res.msg);
      }
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onConfirm = () => {
    form.handleSubmit(onSubmit)();
  };

  // 关闭后的回调方法清除数据状态
  const closeCallback = () => {
    setIsResetDialogOpen(false);
    form.reset();
  };

  return (
    <RrhDialog
      title={title}
      trigger={<></>}
      open={isResetDialogOpen}
      cancelText={t('common.Cancel')}
      confirmText={isSubmitting ? t('common.loading') : t('common.Confirm')}
      isConfirmDisabled={isSubmitting}
      onConfirm={() => onConfirm()}
      onCancel={() => closeCallback()}
      className="w-full sm:w-112"
    >
      <div className="w-full sm:w-100">
        <div className="bg-destructive/5 mb-5 flex items-center gap-1 rounded-md p-2">
          <CircleAlert className="text-destructive h-4 w-4" />
          <span className="text-destructive text-sm leading-5 font-medium">
            {t('CRMAccountPage.DeleteAccountWalletBalanceZero')}
          </span>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="deleteType"
              render={({ field }) => (
                <RrhRadioGroup
                  value={field.value ?? '1'}
                  onValueChange={field.onChange}
                  labelClassName="font-medium"
                  radioItems={[
                    {
                      value: '1',
                      label: t('CRMAccountPage.DeleteAccountOnlyCRM'),
                    },
                    {
                      value: '2',
                      label: t('CRMAccountPage.DeleteAccountWithTrading'),
                    },
                  ]}
                />
              )}
            />
          </form>
        </Form>
        <div className="text-foreground mt-6 text-sm leading-5">
          {t('CRMAccountPage.DeleteAccountWalletBalance')}: 0 USD
        </div>
      </div>
    </RrhDialog>
  );
};
