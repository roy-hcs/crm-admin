import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FormSwitch } from '@/components/form/FormSwitch';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { RrhForm } from '@/components/form/RrhForm';
import { useEditFeeConfig, useGetBaseSettings } from '@/api/hooks/copyTrading';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RrhCheckBoxGroup } from '@/components/common/RrhCheckBoxGroup';
import { useGlobalLoading } from '@/contexts/loading';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { normalizePercentageInput } from '@/lib/utils';

type FormValues = {
  chargingMethod: string;
  collectionAccount: string;
  collectionWallet: string;
  managementFeeSwitch: string;
  payMethod: string;
  platformManagementFeeRatio: string;
  refundSwitch: string;
  signalSourceFeeSwitch: string;
  tab: number;
};

const defaultFormValues: FormValues = {
  chargingMethod: '',
  collectionAccount: '',
  collectionWallet: '',
  managementFeeSwitch: '',
  payMethod: '',
  platformManagementFeeRatio: '',
  refundSwitch: '',
  signalSourceFeeSwitch: '',
  tab: 2,
};

const baseSettingFieldNames = [
  'chargingMethod',
  'collectionAccount',
  'collectionWallet',
  'managementFeeSwitch',
  'payMethod',
  'platformManagementFeeRatio',
  'refundSwitch',
  'signalSourceFeeSwitch',
] as const;

const baseSettingFieldNameSet = new Set<string>(baseSettingFieldNames);

export function FeeConfig() {
  const { t } = useTranslation();
  const { withLoading } = useGlobalLoading();
  const { data, isLoading: initLoading } = useGetBaseSettings();
  const { mutateAsync: edit } = useEditFeeConfig();
  const mamConfigs = data?.data?.mamConfigs;
  const hasInitializedRef = useRef(false);

  const form = useForm<FormValues>({
    defaultValues: defaultFormValues,
  });

  const managementFeeSwitchValue = form.watch('managementFeeSwitch');
  const signalSourceFeeSwitchValue = form.watch('signalSourceFeeSwitch');

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
        const res = await edit({
          ...data,
          platformManagementFeeRatio:
            data?.managementFeeSwitch === '1' ? data?.platformManagementFeeRatio || '0' : '0',
        });
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
        name="managementFeeSwitch"
        label={t('copyTradingSettings.managementFeeSwitch')}
        labeTipsDom={
          <div className="text-muted-foreground text-xs leading-4">
            {t('copyTradingSettings.managementFeeSwitchDesc')}
          </div>
        }
      />
      {managementFeeSwitchValue === '1' && (
        <FormField
          name="platformManagementFeeRatio"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel className="leading-5">
                  {t('copyTradingSettings.platformManagementFeeRatio')}
                </FormLabel>
                <div>
                  <div className="text-muted-foreground text-xs leading-4">
                    {t('copyTradingSettings.managementFeeSwitchDesc')}
                  </div>
                </div>
              </div>
              <FormControl>
                <Input
                  className="disabled:text-muted-foreground h-10 pr-15 text-sm"
                  inputMode="decimal"
                  pattern="^(100(\.0{1,2})?|[0-9]{1,2}(\.\d{0,2})?)$"
                  value={field.value}
                  onChange={e => field.onChange(normalizePercentageInput(e.target.value))}
                  placeholder={t('copyTradingSettings.platformManagementFeeRatioPlaceholder')}
                />
              </FormControl>
              <FormMessage className="text-end" />
            </FormItem>
          )}
        />
      )}

      <FormSwitch
        verticalLabel
        name="signalSourceFeeSwitch"
        label={t('copyTradingSettings.signalSourceFeeSwitch')}
        labeTipsDom={
          <div className="text-muted-foreground text-xs leading-4">
            {t('copyTradingSettings.signalSourceFeeSwitchDesc')}
          </div>
        }
      />
      {signalSourceFeeSwitchValue === '1' && (
        <FormField
          name="chargingMethod"
          render={({ field }) => {
            return (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel className="leading-5">
                    {t('copyTradingSettings.chargingMethod')}
                  </FormLabel>
                  <div>
                    <div className="text-muted-foreground text-xs leading-4">
                      {t('copyTradingSettings.chargingMethodDesc')}
                    </div>
                  </div>
                </div>
                <FormControl>
                  <RrhCheckBoxGroup
                    onValueChange={v => {
                      field.onChange(v);
                    }}
                    value={field.value}
                    labelClassName="font-medium"
                    checkItems={[
                      { value: '1', label: t('copyTradingSettings.chargingMethodOptions.1') },
                      { value: '2', label: t('copyTradingSettings.chargingMethodOptions.2') },
                      {
                        value: '3',
                        label: t('copyTradingSettings.chargingMethodOptions.3'),
                        disabled: true,
                      },
                    ]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      )}

      {signalSourceFeeSwitchValue === '1' && (
        <FormField
          name="payMethod"
          render={({ field }) => {
            return (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel className="leading-5">{t('copyTradingSettings.payMethod')}</FormLabel>
                  <div>
                    <div className="text-muted-foreground text-xs leading-4">
                      {t('copyTradingSettings.payMethodDesc')}
                    </div>
                  </div>
                </div>
                <FormControl>
                  <RrhCheckBoxGroup
                    onValueChange={v => {
                      field.onChange(v);
                    }}
                    value={field.value}
                    labelClassName="font-medium"
                    checkItems={[
                      { value: '1', label: t('copyTradingSettings.Wallet') },
                      {
                        value: '2',
                        label: t('table.tradingAccount'),
                        disabled: true,
                      },
                    ]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      )}

      {signalSourceFeeSwitchValue === '1' && (
        <FormField
          name="collectionWallet"
          render={({ field }) => {
            return (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel className="leading-5">{t('copyTradingSettings.collection')}</FormLabel>
                  <div>
                    <div className="text-muted-foreground text-xs leading-4">
                      {t('copyTradingSettings.collectionDesc')}
                    </div>
                  </div>
                </div>
                <FormControl>
                  <RrhCheckBoxGroup
                    onValueChange={v => {
                      field.onChange(v);
                    }}
                    value={field.value}
                    labelClassName="font-medium"
                    checkItems={[{ value: '1', label: t('copyTradingSettings.Wallet') }]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      )}

      {signalSourceFeeSwitchValue === '1' && (
        <FormField
          name="collectionAccount"
          render={({ field }) => {
            return (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel className="leading-5">{t('copyTradingSettings.collection')}</FormLabel>
                  <div>
                    <div className="text-muted-foreground text-xs leading-4">
                      {t('copyTradingSettings.collectionDesc')}
                    </div>
                  </div>
                </div>
                <FormControl>
                  <RrhCheckBoxGroup
                    onValueChange={v => {
                      field.onChange(v);
                    }}
                    value={field.value}
                    labelClassName="font-medium"
                    checkItems={[
                      {
                        value: '1',
                        label: t('table.tradingAccount'),
                      },
                    ]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      )}

      {signalSourceFeeSwitchValue === '1' && (
        <FormSwitch
          verticalLabel
          name="refundSwitch"
          label={t('copyTradingSettings.managementFeeSwitch')}
          labeTipsDom={
            <div className="text-muted-foreground text-xs leading-4">
              {t('copyTradingSettings.refundSwitchDesc')}
            </div>
          }
          description={t('copyTradingSettings.refundSwitchDescDetail')}
        />
      )}

      <div className="text-right">
        <RrhButton type="submit" variant="default" disabled={!form.formState.isDirty}>
          {t('common.Confirm')}
        </RrhButton>
      </div>
    </RrhForm>
  );
}
