import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { List } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormField } from '@/components/ui/form';
import { RrhRadioGroup } from '@/components/common/RrhRadioGroup';
import { useForm } from 'react-hook-form';
import { useEditLevelSkippingSetting } from '@/api/hooks/rebate';
import { toast } from 'sonner';
import { RrhForm } from '@/components/form/RrhForm';
export const LevelSkippingSettingButton = ({
  originalSetting,
  onSuccess,
}: {
  originalSetting?: number;
  onSuccess: () => void;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      setting: originalSetting?.toString() ?? '0', // 0不允许平级或越级 1允许平级 2允许平级越级
    },
  });
  useEffect(() => {
    if (originalSetting) {
      form.reset({
        setting: originalSetting.toString(),
      });
    }
  }, [form, originalSetting]);
  const { mutateAsync: editLevelSkippingSetting, isPending } = useEditLevelSkippingSetting();
  const onSubmit = async (values: { setting: string }) => {
    try {
      const res = await editLevelSkippingSetting({
        setting: values.setting,
      });
      if (res.code === 0) {
        toast.success(t('common.success'));
        onSuccess();
      } else {
        toast.error(res.msg || t('common.AnErrorOccurred'));
      }
    } catch (error) {
      console.error('error', error);
    } finally {
      setOpen(false);
    }
  };
  return (
    <RrhDialog
      open={open}
      onOpenChange={setOpen}
      title={t('RebateLevelSettings.levelSkippingSettings')}
      trigger={
        <RrhButton variant="outline">
          <List />
          {t('RebateLevelSettings.levelSkippingSettings')}
        </RrhButton>
      }
      footerShow={false}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="setting"
          render={({ field }) => (
            <RrhRadioGroup
              value={field.value ?? '0'}
              onValueChange={value => {
                field.onChange(value);
              }}
              labelClassName="font-medium"
              radioItems={[
                {
                  value: '0',
                  label: t('RebateLevelSettings.settingOne'),
                  desc: t('RebateLevelSettings.settingOneDesc'),
                },
                {
                  value: '1',
                  label: t('RebateLevelSettings.settingTwo'),
                  desc: t('RebateLevelSettings.settingTwoDesc'),
                },
                {
                  value: '2',
                  label: t('RebateLevelSettings.settingThree'),
                  desc: t('RebateLevelSettings.settingThreeDesc'),
                },
              ]}
            />
          )}
        />
        <div className="border-border -mx-6 mt-4 flex justify-end gap-4 border-t px-6 pt-3 pb-3 md:pt-6 md:pb-0">
          <RrhButton type="button" variant="outline" onClick={() => setOpen(false)}>
            {t('common.Cancel')}
          </RrhButton>
          <RrhDialog
            title={t('common.SystemPrompt')}
            trigger={
              <RrhButton loading={isPending} disabled={isPending} type="button">
                {t('common.Confirm')}
              </RrhButton>
            }
            onConfirm={form.handleSubmit(onSubmit)}
          >
            {(originalSetting || 0) > parseInt(form.watch('setting')) ? (
              <div>
                <div>{t('common.confirmToProceed')}</div>
                <div className="mt-1 text-sm text-orange-400">
                  {t('RebateLevelSettings.confirmWarning')}
                </div>
              </div>
            ) : (
              <div>{t('common.confirmToProceed')}</div>
            )}
          </RrhDialog>
        </div>
      </RrhForm>
    </RrhDialog>
  );
};
