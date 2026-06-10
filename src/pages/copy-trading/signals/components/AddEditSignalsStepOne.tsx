import { useTranslation } from 'react-i18next';
import { FormInput } from '@/components/form/FormInput';
import { FormSwitch } from '@/components/form/FormSwitch';
import { FormCrmUserSelect } from '@/components/form/FormCrmUserSelect';
import { FormField } from '@/components/ui/form';
import { UploadFile } from '@/pages/marketing/ads/components/components/UploadFile';
import { FormInputWithUnit } from '@/components/form/FormInputWithUnit';
import { FormRadio } from '@/components/form/FormRadio';
import { FormSelect } from '@/components/form/FormSelect';
import { FormTextarea } from '@/components/form/FormTextarea';
import { FormSelectCountries } from '@/pages/points-mall/add-edit-good/components/FormSelectCountries';

type SelectOption = {
  label: string;
  value: string | number;
};

export function AddEditSignalsStepOne({
  isAddMode,
  serverOptions,
  displayValue,
  performanceFeeEnableValue,
  chargeValue,
  receiveAccountOptions,
}: {
  isAddMode: boolean;
  serverOptions: SelectOption[];
  displayValue: string;
  performanceFeeEnableValue: string;
  chargeValue: string;
  receiveAccountOptions: SelectOption[];
}) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-6">
      <FormInput
        name="name"
        label={t('signals.name')}
        placeholder={t('common.pleaseInput', {
          field: t('signals.name'),
        })}
      />
      <FormCrmUserSelect
        verticalLabel
        name="userId"
        label={t('signals.signalSourceAuthor')}
        labelName={'userName'}
        disabled={!isAddMode}
        labeTipsDom={
          <div className="text-muted-foreground text-xs leading-4">
            {t('signals.signalSourceAuthorDesc')}
          </div>
        }
      />
      <FormSelect
        name="serverId"
        label={t('table.signalSourceAccount')}
        options={serverOptions}
        displayValue={displayValue}
        showRowValue={!isAddMode}
        disabled={!isAddMode}
      />
      <FormField
        name="icon"
        render={({ field }) => {
          return (
            <UploadFile
              field={field}
              label={t('signals.icon')}
              description={t('signals.iconDesc')}
            />
          );
        }}
      />
      <div className="grid grid-cols-2 items-end gap-6">
        <FormInput
          name="minBalanceForSubscription"
          label={t('signals.minBalanceForSubscription')}
          placeholder={t('common.pleaseInput', {
            field: t('signals.minBalanceForSubscription'),
          })}
        />
        <FormInput
          name="maxBalanceForSubscription"
          label={t('signals.maxBalanceForSubscription')}
          placeholder={t('common.pleaseInput', {
            field: t('signals.maxBalanceForSubscription'),
          })}
        />
      </div>
      <FormInput
        name="upperLimit"
        label={t('signalReview.upperLimit')}
        placeholder={t('common.pleaseInput', {
          field: t('signalReview.upperLimit'),
        })}
      />
      <FormSwitch name="publicShow" label={t('signals.publicShow')} verticalLabel />
      <FormSwitch
        name="subscriptionReview"
        label={t('signalReview.subscriptionReview')}
        verticalLabel
        labeTipsDom={
          <div className="text-muted-foreground text-xs leading-4">
            {t('signalReview.subscriptionReviewDesc')}
          </div>
        }
      />
      <FormSwitch
        name="performanceFeeEnable"
        label={t('signals.performanceFeeEnable')}
        verticalLabel
      />
      {performanceFeeEnableValue === '1' && (
        <FormInputWithUnit
          name="subscribeFee"
          unit="USD"
          label={t('signals.subscribeFee')}
          labeTipsDom={
            <div className="text-muted-foreground text-xs leading-4">
              {t('signals.subscribeFeeDesc')}
            </div>
          }
          verticalLabel
        />
      )}
      <FormSwitch
        name="charge"
        label={t('signals.charge')}
        labeTipsDom={
          <div className="text-muted-foreground text-xs leading-4">{t('signals.chargeDesc')}</div>
        }
        verticalLabel
      />
      {chargeValue === '1' && (
        <FormRadio
          name="performanceFeeCycle"
          orientation="horizontal"
          label={t('CopyTradingSettings.type')}
          options={[
            { label: t('signalReview.performanceFeeCycleOptions.3'), value: '3' },
            { label: t('signalReview.performanceFeeCycleOptions.0'), value: '0' },
            { label: t('signalReview.performanceFeeCycleOptions.1'), value: '1' },
            { label: t('signalReview.performanceFeeCycleOptions.2'), value: '2' },
          ]}
        />
      )}
      {chargeValue === '1' && (
        <FormInputWithUnit
          name="performanceFeeRatio"
          unit="%"
          label={t('signalReview.performanceFeeRatio')}
          placeholder="0-100"
          verticalLabel
        />
      )}
      <FormSelect
        name="receiveAccount"
        label={t('table.paymentAccount')}
        showRowValue={false}
        options={receiveAccountOptions}
      />
      <FormSelectCountries name="countryId" label={t('table.countryOrRegion')} />
      <FormTextarea
        name="description"
        label={t('signals.description')}
        placeholder={t('rules.limitLength', { field: 500 })}
        maxLength={500}
      />
    </div>
  );
}
