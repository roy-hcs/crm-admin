import { Form } from '@/components/ui/form';
import { FormProvider } from '@/contexts/form';
import { CircleAlert, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { FormSwitch } from '@/components/form/FormSwitch';
import { toast } from 'sonner';
import {
  useGetRewardRecordSetVerifyConfig,
  useRewardRecordSetVerifyConfig,
} from '@/api/hooks/marketing';

type FormValues = {
  depositRewardChecked: string;
  closePositionRewardChecked: string;
  openAccountRewardChecked: string;
};

export const RewardReviewDialog = ({ onSuccess }: { onSuccess: () => void }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      depositRewardChecked: '0',
      closePositionRewardChecked: '0',
      openAccountRewardChecked: '0',
    },
  });
  const { mutateAsync: getConfig } = useGetRewardRecordSetVerifyConfig();
  const { mutateAsync: setConfig } = useRewardRecordSetVerifyConfig();

  useEffect(() => {
    if (open) {
      async function fetchConfig() {
        try {
          const res = await getConfig();
          if (res?.code === 0 && res?.data) {
            form.setValue('depositRewardChecked', res?.data?.depositRewardChecked);
            form.setValue('closePositionRewardChecked', res?.data?.closePositionRewardChecked);
            form.setValue('openAccountRewardChecked', res?.data?.openAccountRewardChecked);
          } else {
            form.reset({
              depositRewardChecked: '0',
              closePositionRewardChecked: '0',
              openAccountRewardChecked: '0',
            });
          }
        } catch {
          form.reset({
            depositRewardChecked: '0',
            closePositionRewardChecked: '0',
            openAccountRewardChecked: '0',
          });
        }
      }
      fetchConfig();
    }
  }, [form, getConfig, open]);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const param = {
        depositRewardChecked: data.depositRewardChecked || '0',
        closePositionRewardChecked: data.closePositionRewardChecked || '0',
        openAccountRewardChecked: data.openAccountRewardChecked || '0',
      };
      const res = await setConfig(param);
      if (res.code === 0) {
        toast.success(t('common.success'));
        onCancel();
        onSuccess();
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

  const onClose = (open: boolean) => {
    setOpen(open);
    form.reset();
  };

  const onConfirm = () => {
    form.handleSubmit(onSubmit)();
  };

  return (
    <RrhDialog
      trigger={
        <RrhButton type="button" Icon={<Settings className="size-3.5" />}>
          {t('rewardRecords.rewardAutoReviewConfig')}
        </RrhButton>
      }
      title={t('rewardRecords.rewardAutoReviewConfig')}
      isConfirmDisabled={isSubmitting}
      open={open}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={onConfirm}
      variant="small"
      type="submit"
      formLoading={isSubmitting}
    >
      <FormProvider form={form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
            <div className="bg-primary/5 flex items-center gap-1 rounded-md p-2">
              <CircleAlert className="text-primary size-4" />
              <span className="text-primary text-sm leading-5 font-medium">
                {t('rewardRecords.tips')}
              </span>
            </div>
            <FormSwitch
              verticalLabel
              name="openAccountRewardChecked"
              label={t('rewardRecords.accountOpeningReward')}
            />
            <FormSwitch
              verticalLabel
              name="depositRewardChecked"
              label={t('rewardRecords.depositRewardCredit')}
            />
            <FormSwitch
              verticalLabel
              name="closePositionRewardChecked"
              label={t('rewardRecords.orderClosingReward')}
            />
          </form>
        </Form>
      </FormProvider>
    </RrhDialog>
  );
};
