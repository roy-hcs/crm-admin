import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FormSwitch } from '@/components/form/FormSwitch';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { RrhForm } from '@/components/form/RrhForm';
import { useEditSubscriptionSetting, useGetBaseSettings } from '@/api/hooks/copyTrading';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RrhCheckBoxGroup } from '@/components/common/RrhCheckBoxGroup';
import { useGlobalLoading } from '@/contexts/loading';
import { toast } from 'sonner';
import { FormRadio } from '@/components/form/FormRadio';
import { ToolTip } from '@/components/common/ToolTip';
import { CircleAlert } from 'lucide-react';

type FormValues = {
  directionFollowingSwitch: string;
  multipleNumberSwitch: string;
  selectiveFollowingSwitch: string;
  subscribeToOrder: string;
  trackingMethod: string;
  tab: number;
};

const defaultFormValues: FormValues = {
  directionFollowingSwitch: '',
  multipleNumberSwitch: '',
  selectiveFollowingSwitch: '',
  subscribeToOrder: '',
  trackingMethod: '',
  tab: 3,
};

const baseSettingFieldNames = [
  'directionFollowingSwitch',
  'multipleNumberSwitch',
  'selectiveFollowingSwitch',
  'subscribeToOrder',
  'trackingMethod',
] as const;

const baseSettingFieldNameSet = new Set<string>(baseSettingFieldNames);

export function SubscriptionSetting() {
  const { t } = useTranslation();
  const { withLoading } = useGlobalLoading();
  const { data, isLoading: initLoading } = useGetBaseSettings();
  const { mutateAsync: edit } = useEditSubscriptionSetting();
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
      <FormRadio
        name="subscribeToOrder"
        orientation="horizontal"
        label={t('copyTradingSettings.subscribeToOrder')}
        labeTipsDom={
          <ToolTip
            content={
              <span className="whitespace-pre-line">
                {t('copyTradingSettings.subscribeToOrderTip')}
              </span>
            }
          >
            <CircleAlert className="text-muted-foreground size-4" />
          </ToolTip>
        }
        options={[
          { label: t('copyTradingSettings.subscribeToOrderOptions.1'), value: '1' },
          { label: t('copyTradingSettings.subscribeToOrderOptions.2'), value: '2' },
        ]}
      />
      <FormField
        name="trackingMethod"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel className="leading-5">{t('copyTradingSettings.trackingMethod')}</FormLabel>
              <FormControl>
                <RrhCheckBoxGroup
                  onValueChange={v => {
                    field.onChange(v);
                  }}
                  value={field.value}
                  labelClassName="font-medium"
                  checkItems={[
                    { value: '1', label: t('copyTradingSettings.trackingMethodOptions.1') },
                    { value: '2', label: t('copyTradingSettings.trackingMethodOptions.2') },
                    {
                      value: '3',
                      label: t('copyTradingSettings.trackingMethodOptions.3'),
                    },
                  ]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormSwitch
        verticalLabel
        name="multipleNumberSwitch"
        label={t('copyTradingSettings.multipleNumberSwitch')}
      />
      <FormSwitch
        verticalLabel
        name="directionFollowingSwitch"
        label={t('copyTradingSettings.directionFollowingSwitch')}
      />
      <FormSwitch
        verticalLabel
        name="selectiveFollowingSwitch"
        label={t('copyTradingSettings.selectiveFollowingSwitch')}
      />
      <div className="text-right">
        <RrhButton type="submit" variant="default" disabled={!form.formState.isDirty}>
          {t('common.Confirm')}
        </RrhButton>
      </div>
    </RrhForm>
  );
}
