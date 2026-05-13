import { FormField } from '@/components/ui/form';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import { CircleAlert } from 'lucide-react';
import { RrhRadioGroup } from '@/components/common/RrhRadioGroup';
import { useCrmUserConfirmRemoveInfo, useCrmUserRemove } from '@/api/hooks/system/system';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhForm } from '@/components/form/RrhForm';
type resetPasswordFormValues = {
  deleteType: string;
};

export const DeleteAccountDialog = ({
  open,
  setOpen,
  id,
  title,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
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

  const onSubmit = async (values: resetPasswordFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await changeRemoveAccountMutation.mutateAsync({
        id: id,
        deleteType: values.deleteType,
      });
      if (res.code === 0) {
        toast.success(t('common.success'));
        setOpen(false);
      } else {
        toast.error(res.msg);
      }
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const onCancel = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <RrhDialog
      title={title}
      trigger={<button></button>}
      isConfirmDisabled={isSubmitting}
      open={open}
      onOpenChange={setOpen}
      footerShow={false}
      variant="small"
      formLoading={isSubmitting}
    >
      <div>
        <div className="bg-destructive/5 mb-5 flex items-center gap-1 rounded-md p-2">
          <CircleAlert className="text-destructive size-4" />
          <span className="text-destructive text-sm leading-5 font-medium">
            {deleteType === '1'
              ? t('CRMAccountPage.DeleteAccountWalletBalanceZero')
              : t('CRMAccountPage.DeleteAccountWalletAndRealAccountBalanceZero')}
          </span>
        </div>
        <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)}>
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
      </div>
    </RrhDialog>
  );
};
