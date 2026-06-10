import { useCrmUserVipGetPreference, useCrmUserVipPreferenceEdit } from '@/api/hooks/account';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import { FormRadio } from '@/components/form/FormRadio';
import { RrhForm } from '@/components/form/RrhForm';

import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

type FormValues = {
  targetAccount: string[];
  evaluationMode: string;
};

export const PreferencesDialog = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { mutateAsync: getDetail } = useCrmUserVipGetPreference();

  const { mutateAsync: vipUpdatePreferenceEdit, isPending } = useCrmUserVipPreferenceEdit();

  const form = useForm<FormValues>({
    defaultValues: {
      targetAccount: [],
      evaluationMode: '2',
    },
  });

  const onClose = () => {
    setOpen(false);
  };

  const onCancel = () => {
    onClose();
  };

  const onConfirm = async () => {
    try {
      const values = form.getValues();

      const res = await vipUpdatePreferenceEdit({
        targetAccount: values.targetAccount.join(','),
        evaluationMode: values.evaluationMode,
      });
      if (res.code === 0) {
        toast.success(t('common.success'));
        onSuccess?.();
        onClose();
        return;
      }

      toast.error(res.msg);
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    }
  };

  useEffect(() => {
    if (!open) return;

    (async () => {
      const res = await getDetail();
      if (res.code === 0 && res.data) {
        const targetAccount = res.data.targetAccount.split(',').map((item: string) => item.trim());
        form.reset({
          targetAccount: targetAccount || [],
          evaluationMode: res.data.evaluationMode || '2',
        });
      }
    })();
  }, [open, getDetail, form]);

  return (
    <RrhDialog
      trigger={
        <RrhButton type="button" Icon={<Settings className="size-3.5" />}>
          {t('customerLoyaltyPlan.preference')}
        </RrhButton>
      }
      title={t('customerLoyaltyPlan.preference')}
      isConfirmDisabled={isPending}
      open={open}
      onOpenChange={setOpen}
      onCancel={onCancel}
      onConfirm={onConfirm}
      variant="large"
      type="submit"
      cancelShow={true}
      formLoading={isPending}
    >
      <RrhForm form={form} className="grid gap-6">
        <FormMultiSelect
          name="targetAccount"
          label={t('customerLoyaltyPlan.targetAccount')}
          placeholder={t('common.pleaseSelect')}
          options={[
            { value: '1', label: t('copyTradingSettings.rebateTargetOptions.1') },
            { value: '2', label: t('copyTradingSettings.rebateTargetOptions.2') },
            { value: '3', label: t('copyTradingSettings.rebateTargetOptions.3') },
            { value: '4', label: t('copyTradingSettings.rebateTargetOptions.4') },
          ]}
          labeTipsDom={
            <div className="text-muted-foreground text-xs leading-4">
              {t('customerLoyaltyPlan.targetAccountDesc')}
            </div>
          }
        />

        <FormRadio
          name="evaluationMode"
          orientation="horizontal"
          label={t('customerLoyaltyPlan.evaluationMode')}
          options={[
            {
              label: t('customerLoyaltyPlan.evaluationModeOptions.1'),
              value: '1',
              disabled: true,
            },
            {
              label: t('customerLoyaltyPlan.evaluationModeOptions.2'),
              value: '2',
            },
          ]}
          description={t('customerLoyaltyPlan.evaluationModeDesc')}
        />
      </RrhForm>
    </RrhDialog>
  );
};
