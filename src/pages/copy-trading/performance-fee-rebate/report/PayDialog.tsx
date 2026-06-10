import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RrhDialog } from '@/components/common/RrhDialog';
import { toast } from 'sonner';
import { RrhForm } from '@/components/form/RrhForm';
import { useGetReceiveAccounts, usePay } from '@/api/hooks/copyTrading';
import { PayParams } from '@/api/hooks/copyTrading/type';
import { FormSelect } from '@/components/form/FormSelect';

type FormValues = PayParams;

export const PayDialog = ({
  onSuccess,
  open,
  setOpen,
  userId,
}: {
  onSuccess?: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  userId: string;
}) => {
  const { t } = useTranslation();
  const { data: accountRes } = useGetReceiveAccounts(userId);
  const form = useForm<FormValues>({
    defaultValues: {
      id: '',
      payAccount: '',
      payServerId: '',
    },
  });
  const { mutateAsync: payAsync, isPending } = usePay();

  const onSubmit = async (data: FormValues) => {
    try {
      const param = {
        id: userId,
        payAccount: data.payAccount,
        payServerId: data.payServerId,
      };
      const res = await payAsync(param);
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

  const onClose = (open: boolean) => {
    setOpen(open);
    form.reset();
  };

  const onCancel = () => {
    setOpen(false);
    form.reset();
  };

  const onConfirm = async () => {
    form.handleSubmit(onSubmit)();
  };

  return (
    <RrhDialog
      title={t('tradingAccountTransactions.batchOrderAsync')}
      open={open}
      isConfirmDisabled={isPending}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={onConfirm}
      variant="small"
      formLoading={isPending}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
        <div className="bg-destructive/5 flex items-center gap-1 rounded-md p-2">
          <span className="text-destructive text-sm leading-5 font-medium">
            {t('performanceFeeRebatePage.payAccountDesc')}
          </span>
        </div>

        <FormSelect
          name="payAccount"
          label={t('performanceFeeRebatePage.selectPayAccount')}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={[
            ...(accountRes?.data?.accountList || []).map(i => ({
              label: `${i.serverName}- ${i.account} (${i.currency})`,
              value: i.id,
            })),
            ...(accountRes?.data?.walletList || []).map(i => ({
              label: 'wallet',
              value: i.id,
            })),
          ]}
        />
      </RrhForm>
    </RrhDialog>
  );
};
