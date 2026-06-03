import { useTranslation } from 'react-i18next';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { FormSwitch } from '@/components/form/FormSwitch';
import { FormRadio } from '@/components/form/FormRadio';
import { FormStepper } from '@/components/form/FormStepper';
import { Input } from '@/components/ui/input';
import { normalizePercentageInput } from '@/lib/utils';

const rebateFieldNames = [
  'performanceFeeRebateLevel1',
  'performanceFeeRebateLevel2',
  'performanceFeeRebateLevel3',
  'performanceFeeRebateLevel4',
  'performanceFeeRebateLevel5',
  'performanceFeeRebateLevel6',
  'performanceFeeRebateLevel7',
  'performanceFeeRebateLevel8',
] as const;

export function AddEditSignalsStepTwo({
  performanceFeeRebateLevel,
  minRebateLevel,
  maxRebateLevel,
  onRebateLevelChange,
}: {
  performanceFeeRebateLevel: number;
  minRebateLevel: number;
  maxRebateLevel: number;
  onRebateLevelChange: (nextLevel: number) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-6">
      <FormSwitch
        name="performanceFeeRebateEnabled"
        label={t('signals.performanceFeeRebateEnabled')}
        labeTipsDom={
          <div className="text-muted-foreground text-xs leading-4">
            {t('signals.performanceFeeRebateEnabledDesc')}
          </div>
        }
        verticalLabel
      />

      <FormRadio
        name="performanceFeeRebateScheme"
        orientation="horizontal"
        label={t('signals.performanceFeeRebateScheme')}
        options={[
          { label: t('signals.performanceFeeRebateSchemeOptions.1'), value: '1' },
          { label: t('signals.performanceFeeRebateSchemeOptions.2'), value: '2' },
        ]}
        labeTipsDom={
          <div className="text-muted-foreground text-xs leading-4">
            {t('signals.performanceFeeRebateSchemeDesc')}
          </div>
        }
      />

      <FormStepper
        name="performanceFeeRebateLevel"
        label={t('copyTradingSettings.rebateLevel')}
        min={minRebateLevel}
        max={maxRebateLevel}
        labeTipsDom={
          <div className="text-muted-foreground text-xs leading-4">
            {t('copyTradingSettings.rebateLevelDesc')}
          </div>
        }
        onValueChange={onRebateLevelChange}
      />

      {rebateFieldNames.slice(0, performanceFeeRebateLevel).map(fieldName => {
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
                    pattern="^(100(\\.0{1,2})?|[0-9]{1,2}(\\.\\d{0,2})?)$"
                    value={field.value}
                    onChange={e => field.onChange(normalizePercentageInput(e.target.value))}
                    placeholder={t('copyTradingSettings.platformManagementFeeRatioPlaceholder')}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        );
      })}
    </div>
  );
}
