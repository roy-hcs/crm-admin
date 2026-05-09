import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FormSwitch } from '@/components/form/FormSwitch';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { RrhForm } from '@/components/form/RrhForm';
import { useEditBaseSettings, useGetBaseSettings } from '@/api/hooks/copyTrading';
import { useGlobalLoading } from '@/contexts/loading';
import { toast } from 'sonner';
import { FormCheckBoxGroup } from '@/components/form/FormCheckBoxGroup';

type FormValues = {
  addSignalPermSwitch: string;
  dealAccountPasswordMethod: string;
  dealAccountPasswordSwitch: string;
  signalAddModelSwitch: string;
  signalAuditSwitch: string;
  signalAuthorShow: string;
  tab: number;
};

const defaultFormValues: FormValues = {
  addSignalPermSwitch: '',
  dealAccountPasswordMethod: '',
  dealAccountPasswordSwitch: '',
  signalAddModelSwitch: '',
  signalAuditSwitch: '',
  signalAuthorShow: '',
  tab: 1,
};

const baseSettingFieldNames = [
  'addSignalPermSwitch',
  'dealAccountPasswordMethod',
  'dealAccountPasswordSwitch',
  'signalAddModelSwitch',
  'signalAuditSwitch',
  'signalAuthorShow',
] as const;

const baseSettingFieldNameSet = new Set<string>(baseSettingFieldNames);

export function BaseSetting() {
  const { t } = useTranslation();
  const { withLoading } = useGlobalLoading();
  const { data, isLoading: initLoading } = useGetBaseSettings();
  const { mutateAsync: edit } = useEditBaseSettings();
  const mamConfigs = data?.data?.mamConfigs;
  const hasInitializedRef = useRef(false);

  const form = useForm<FormValues>({
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (!mamConfigs?.length || hasInitializedRef.current) return;

    const initializedValues: FormValues = { ...defaultFormValues };

    mamConfigs.forEach(({ name, value }) => {
      if (baseSettingFieldNameSet.has(name)) {
        initializedValues[name as (typeof baseSettingFieldNames)[number]] = String(value ?? '');
      }
    });

    form.reset(initializedValues);
    hasInitializedRef.current = true;
  }, [mamConfigs, form]);

  const onSubmit = async (data: FormValues) => {
    await withLoading(async () => {
      try {
        const res = await edit(data);
        if (res.code === 0) {
          toast.success(t('common.success'));
        } else {
          toast.error(res.msg);
        }
      } catch {
        toast.error(t('common.AnErrorOccurred'));
      }
    });
  };

  if (initLoading) {
    return (
      <div className="h-100">
        <RrhCircleLoading />
      </div>
    );
  }
  return (
    <RrhForm form={form} className="grid gap-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <FormSwitch
        verticalLabel
        name="addSignalPermSwitch"
        label={t('copyTradingSettings.addSignalPermSwitch')}
        labeTipsDom={
          <div className="text-muted-foreground text-xs leading-4">
            *{t('copyTradingSettings.addSignalPermSwitchDesc')}
          </div>
        }
      />
      <FormSwitch
        verticalLabel
        name="signalAddModelSwitch"
        label={t('copyTradingSettings.signalAddModelSwitch')}
        labeTipsDom={
          <div className="text-muted-foreground text-xs leading-4">
            *{t('copyTradingSettings.signalAddModelSwitchDesc')}
          </div>
        }
      />
      <FormSwitch
        verticalLabel
        name="signalAuditSwitch"
        label={t('copyTradingSettings.signalAuditSwitch')}
        labeTipsDom={
          <div className="text-muted-foreground text-xs leading-4">
            *{t('copyTradingSettings.signalAuditSwitchDesc')}
          </div>
        }
      />
      <FormSwitch
        verticalLabel
        name="signalAuthorShow"
        label={t('copyTradingSettings.signalAuthorShow')}
        labeTipsDom={
          <div className="text-muted-foreground text-xs leading-4">
            *{t('copyTradingSettings.signalAuthorShowDesc')}
          </div>
        }
      />
      <FormSwitch
        verticalLabel
        name="dealAccountPasswordSwitch"
        label={t('copyTradingSettings.dealAccountPasswordSwitch')}
      />

      <FormCheckBoxGroup
        name="dealAccountPasswordMethod"
        options={[
          { value: '1', label: t('common.tradingPassword') },
          { value: '2', label: t('common.readOnlyPassword') },
        ]}
      />
      <div className="text-right">
        <RrhButton type="submit" variant="default" disabled={!form.formState.isDirty}>
          {t('common.Confirm')}
        </RrhButton>
      </div>
    </RrhForm>
  );
}
