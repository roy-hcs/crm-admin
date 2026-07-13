import { useGetPreferenceSetting, useSavePreferenceSetting } from '@/api/hooks/report/report';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import { FormSwitchGroup } from '@/components/form/FormSwitchGroup';
import { RrhForm } from '@/components/form/RrhForm';

import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

type FormValues = {
  accountType: string;
  triggeringEvent: string;
};

export const PreferencesDialog = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { mutateAsync: getDetail } = useGetPreferenceSetting();

  const { mutateAsync: save, isPending } = useSavePreferenceSetting();

  const form = useForm<FormValues>({
    defaultValues: {
      accountType: '',
      triggeringEvent: '',
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

      const res = await save({
        accountType: values.accountType,
        triggeringEvent: values.triggeringEvent,
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
        form.reset({
          accountType: res.data.accountType || '',
          triggeringEvent: res.data.triggeringEvent || '',
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
        <FormSwitchGroup
          multiple
          name="accountType"
          label={t('transactionAccountSnapshotPage.accountType')}
          labeTipsDom={
            <div className="text-muted-foreground text-xs leading-4">
              {t('transactionAccountSnapshotPage.accountTypeDesc')}
            </div>
          }
          switchItems={[
            {
              value: '1',
              label: t('common.live'),
            },
            {
              value: '2',
              label: t('common.demo'),
            },
          ]}
        />
        <FormMultiSelect
          name="triggeringEvent"
          label={t('transactionAccountSnapshotPage.triggeringEvent')}
          labeTipsDom={
            <div className="text-muted-foreground text-xs leading-4">
              {t('transactionAccountSnapshotPage.triggeringEventDesc')}
            </div>
          }
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={[
            {
              value: '1',
              label: t('transactionAccountSnapshotPage.triggeringEventOptions.1'),
            },
            {
              value: '2',
              label: t('transactionAccountSnapshotPage.triggeringEventOptions.2'),
            },
            {
              value: '3',
              label: t('transactionAccountSnapshotPage.triggeringEventOptions.3'),
            },
            {
              value: '4',
              label: t('transactionAccountSnapshotPage.triggeringEventOptions.4'),
            },
            {
              value: '5',
              label: t('transactionAccountSnapshotPage.triggeringEventOptions.5'),
            },
          ]}
        />
      </RrhForm>
    </RrhDialog>
  );
};
