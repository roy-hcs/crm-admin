import { Form, FormField } from '@/components/ui/form';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useEffect, useMemo, useState } from 'react';
import { CircleAlert } from 'lucide-react';
import { RrhRadioGroup } from '@/components/common/RrhRadioGroup';
import { useCrmUserConfirmRemoveInfo, useCrmUserRemove } from '@/api/hooks/system/system';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
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
  const { data: data, isLoading: isLoading } = useCrmUserConfirmRemoveInfo(id || '');
  const { t } = useTranslation();
  const changeRemoveAccountMutation = useCrmUserRemove();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteType, setDeleteType] = useState('');
  const form = useForm<resetPasswordFormValues>({
    defaultValues: {
      deleteType: '1', // 1仅删除CRM账户 2删除CRM账户及其交易账号
    },
  });

  useEffect(() => {
    if (!isResetDialogOpen) {
      form.reset();
    }
  }, [form, isResetDialogOpen]);

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

  const handleConfirm = () => {
    form.handleSubmit(onSubmit)();
  };

  const handleCancel = () => {
    setIsResetDialogOpen(false);
  };

  // 计算真实和模拟账号数量
  const count = useMemo(() => {
    if (!data)
      return {
        real: 0,
        demo: 0,
      };
    return {
      real: data.accountList?.filter(item => item.serviceProperty === 1).length || 0,
      demo: data.accountList?.filter(item => item.serviceProperty !== 1).length || 0,
    };
  }, [data]);

  return (
    <RrhDialog
      title={title}
      trigger={<button></button>}
      open={isResetDialogOpen}
      onOpenChange={handleCancel}
      footerShow={false}
      className="w-full sm:w-112"
    >
      <div className="w-full sm:w-100">
        <div className="bg-destructive/5 mb-5 flex items-center gap-1 rounded-md p-2">
          <CircleAlert className="text-destructive h-4 w-4" />
          <span className="text-destructive text-sm leading-5 font-medium">
            {deleteType === '1'
              ? t('CRMAccountPage.DeleteAccountWalletBalanceZero')
              : t('CRMAccountPage.DeleteAccountWalletAndRealAccountBalanceZero')}
          </span>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="deleteType"
              render={({ field }) => (
                <RrhRadioGroup
                  value={field.value ?? '1'}
                  onValueChange={value => {
                    field.onChange(value);
                    setDeleteType(value);
                  }}
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
        {!isLoading && (
          <div className="text-foreground mt-6 text-sm leading-5">
            {t('CRMAccountPage.DeleteAccountWalletBalance')}:
            {data?.walletList?.map(it => (
              <span>{`${it.balance} ${it.currency},`}</span>
            ))}
          </div>
        )}
        {!isLoading && deleteType === '2' && (
          <div className="text-foreground mt-6 text-sm leading-5">
            <div>
              {t('CRMAccountPage.DeleteAccountWalletAndRealAccountBalance', {
                real: count.real,
                demo: count.demo,
              })}
            </div>
            {data?.accountList?.map(it => (
              <span>
                {`${it?.account}-${it.balance} ${it.currency}-${it.serviceProperty === 1 ? t('common.live') : t('common.demo')},`}
              </span>
            ))}
          </div>
        )}
      </div>
      <DialogFooter className="border-muted -mx-6 gap-2 border-t px-6 pt-6 sm:justify-end">
        <DialogClose>
          <div
            className="cursor-pointer rounded-sm border bg-white px-4 py-2 text-[#1E1E1E]"
            onClick={handleCancel}
          >
            {t('common.Cancel')}
          </div>
        </DialogClose>
        <div
          onClick={() => {
            if (isSubmitting) return;
            handleConfirm();
          }}
          className={cn(
            'bg-primary rounded-sm border px-4 py-2 text-white',
            isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          )}
        >
          {t('common.Confirm')}
        </div>
      </DialogFooter>
    </RrhDialog>
  );
};
