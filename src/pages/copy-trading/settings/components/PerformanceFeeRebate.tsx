import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FormSwitch } from '@/components/form/FormSwitch';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { RrhForm } from '@/components/form/RrhForm';
import { useEditPerformanceFeeRebate, useGetBaseSettings } from '@/api/hooks/copyTrading';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useGlobalLoading } from '@/contexts/loading';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { normalizePercentageInput } from '@/lib/utils';
import { FormRadio } from '@/components/form/FormRadio';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import { PageInfo } from '@/components/common/PageInfo';
import { FormStepper } from '@/components/form/FormStepper';

type FormValues = {
  allowedSignalSelfRebateSet: string;
  performanceFeeRebateAutoApprove: string;
  performanceFeeRebateSwitch: string;
  rabateUpperType: string;
  rebateLevel: string;
  rebateLevel1: string;
  rebateLevel2: string;
  rebateLevel3: string;
  rebateLevel4: string;
  rebateLevel5: string;
  rebateLevel6: string;
  rebateLevel7: string;
  rebateLevel8: string;
  rebateTarget: string;
  tab: number;
};

const defaultFormValues: FormValues = {
  allowedSignalSelfRebateSet: '',
  performanceFeeRebateAutoApprove: '',
  performanceFeeRebateSwitch: '',
  rabateUpperType: '',
  rebateLevel: '1',
  rebateLevel1: '',
  rebateLevel2: '',
  rebateLevel3: '',
  rebateLevel4: '',
  rebateLevel5: '',
  rebateLevel6: '',
  rebateLevel7: '',
  rebateLevel8: '',
  rebateTarget: '',
  tab: 4,
};

const baseSettingFieldNames = [
  'allowedSignalSelfRebateSet',
  'performanceFeeRebateAutoApprove',
  'performanceFeeRebateSwitch',
  'rabateUpperType',
  'rebateLevel',
  'rebateLevel1',
  'rebateLevel2',
  'rebateLevel3',
  'rebateLevel4',
  'rebateLevel5',
  'rebateLevel6',
  'rebateLevel7',
  'rebateLevel8',
  'rebateTarget',
] as const;

const baseSettingFieldNameSet = new Set<string>(baseSettingFieldNames);
const maxRebateLevel = 8;
const minRebateLevel = 1;
const rebateLevelFieldNames = [
  'rebateLevel1',
  'rebateLevel2',
  'rebateLevel3',
  'rebateLevel4',
  'rebateLevel5',
  'rebateLevel6',
  'rebateLevel7',
  'rebateLevel8',
] as const;

function clampRebateLevel(value: number) {
  return Math.max(minRebateLevel, Math.min(maxRebateLevel, value));
}

export function PerformanceFeeRebate() {
  const { t } = useTranslation();
  const { withLoading } = useGlobalLoading();
  const { data, isLoading: initLoading } = useGetBaseSettings();
  const { mutateAsync: edit } = useEditPerformanceFeeRebate();
  const mamConfigs = data?.data?.mamConfigs;
  const hasInitializedRef = useRef(false);

  const form = useForm<FormValues>({
    defaultValues: defaultFormValues,
  });
  const rebateLevel = clampRebateLevel(Number(form.watch('rebateLevel') || minRebateLevel));

  useEffect(() => {
    if (!mamConfigs?.length || hasInitializedRef.current) return;

    const initializedValues: FormValues = { ...defaultFormValues };

    mamConfigs.forEach(({ name, value }) => {
      if (baseSettingFieldNameSet.has(name)) {
        initializedValues[name as (typeof baseSettingFieldNames)[number]] = String(value ?? '');
      }
    });

    const normalizedRebateLevel = clampRebateLevel(
      Number(initializedValues.rebateLevel || minRebateLevel),
    );
    initializedValues.rebateLevel = String(normalizedRebateLevel);
    for (let index = normalizedRebateLevel + 1; index <= maxRebateLevel; index += 1) {
      initializedValues[`rebateLevel${index}` as (typeof rebateLevelFieldNames)[number]] = '';
    }

    form.reset(initializedValues);
    hasInitializedRef.current = true;
  }, [mamConfigs, form]);

  const handleRebateLevelChange = (nextLevel: number) => {
    const normalizedNextLevel = clampRebateLevel(nextLevel);
    if (normalizedNextLevel === rebateLevel) return;

    form.setValue('rebateLevel', String(normalizedNextLevel), {
      shouldDirty: true,
      shouldTouch: true,
    });

    if (normalizedNextLevel < rebateLevel) {
      for (let index = normalizedNextLevel + 1; index <= maxRebateLevel; index += 1) {
        form.setValue(`rebateLevel${index}` as (typeof rebateLevelFieldNames)[number], '', {
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    }
  };

  const onSubmit = async (data: FormValues) => {
    const normalizedRebateLevel = clampRebateLevel(Number(data.rebateLevel || minRebateLevel));
    const payload: Record<string, string | number> = {
      ...data,
      rebateLevel: String(normalizedRebateLevel),
    };

    rebateLevelFieldNames.forEach((fieldName, index) => {
      const level = index + 1;
      payload[fieldName] =
        level <= normalizedRebateLevel ? Number((data[fieldName] || '').trim() || '0') : 0;
    });

    await withLoading(async () => {
      try {
        const res = await edit(payload as Parameters<typeof edit>[0]);
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
      <PageInfo
        title={t('copyTradingSettings.performanceFeeRebate')}
        desc={t('copyTradingSettings.performanceFeeRebateDesc')}
      />
      <FormSwitch
        name="performanceFeeRebateSwitch"
        label={t('copyTradingSettings.performanceFeeRebateSwitch')}
      />
      <FormRadio
        name="rabateUpperType"
        orientation="horizontal"
        label={t('copyTradingSettings.rabateUpperType')}
        labeTipsDom={
          <div className="text-muted-foreground text-xs leading-4">
            {t('copyTradingSettings.rabateUpperTypeDesc')}
          </div>
        }
        options={[
          { label: t('copyTradingSettings.rabateUpperTypeOptions.1'), value: '1' },
          { label: t('copyTradingSettings.rabateUpperTypeOptions.2'), value: '2' },
        ]}
      />
      <FormMultiSelect
        verticalLabel
        name="rebateTarget"
        label={t('copyTradingSettings.rebateTarget')}
        placeholder={t('common.pleaseSelect')}
        options={[
          { value: '1', label: t('copyTradingSettings.rebateTargetOptions.1') },
          { value: '2', label: t('copyTradingSettings.rebateTargetOptions.2') },
          { value: '3', label: t('copyTradingSettings.rebateTargetOptions.3') },
          { value: '4', label: t('copyTradingSettings.rebateTargetOptions.4') },
        ]}
        labeTipsDom={
          <div className="text-muted-foreground text-xs leading-4">
            {t('copyTradingSettings.rebateTargetDesc')}
          </div>
        }
      />
      <FormSwitch
        name="allowedSignalSelfRebateSet"
        label={t('copyTradingSettings.allowedSignalSelfRebateSet')}
        labeTipsDom={
          <div className="text-muted-foreground text-xs leading-4">
            {t('copyTradingSettings.allowedSignalSelfRebateSetDesc')}
          </div>
        }
      />
      <FormSwitch
        name="performanceFeeRebateAutoApprove"
        label={t('copyTradingSettings.performanceFeeRebateAutoApprove')}
        labeTipsDom={
          <div className="text-muted-foreground text-xs leading-4">
            {t('copyTradingSettings.performanceFeeRebateAutoApproveDesc')}
          </div>
        }
      />

      <PageInfo
        title={t('copyTradingSettings.unifiedSetting')}
        desc={t('copyTradingSettings.unifiedSettingDesc')}
      />

      <FormStepper<FormValues>
        name="rebateLevel"
        label={t('copyTradingSettings.rebateLevel')}
        min={minRebateLevel}
        max={maxRebateLevel}
        labeTipsDom={
          <div className="text-muted-foreground text-xs leading-4">
            {t('copyTradingSettings.rebateLevelDesc')}
          </div>
        }
        onValueChange={handleRebateLevelChange}
      />

      {Array.from({ length: rebateLevel }, (_, index) => {
        const level = index + 1;
        const fieldName = `rebateLevel${level}` as (typeof rebateLevelFieldNames)[number];

        return (
          <FormField
            key={fieldName}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel className="leading-5">
                    {t('copyTradingSettings.rebateParamsSetting')}
                  </FormLabel>
                  <div className="text-muted-foreground text-xs leading-4">
                    {t('copyTradingSettings.rebateParamsSettingDesc')}
                  </div>
                </div>
                <FormControl>
                  <Input
                    className="h-10 text-sm"
                    inputMode="decimal"
                    pattern="^(100(\.0{1,2})?|[0-9]{1,2}(\.\d{0,2})?)$"
                    value={field.value}
                    onChange={e => field.onChange(normalizePercentageInput(e.target.value))}
                    placeholder={t('copyTradingSettings.platformManagementFeeRatioPlaceholder')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      })}

      <div className="text-right">
        <RrhButton type="submit" variant="default" disabled={!form.formState.isDirty}>
          {t('common.Confirm')}
        </RrhButton>
      </div>
    </RrhForm>
  );
}
