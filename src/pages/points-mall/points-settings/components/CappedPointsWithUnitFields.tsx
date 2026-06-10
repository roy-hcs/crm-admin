import { useTranslation } from 'react-i18next';
import { PointsMallSettingsFormValues } from '../types';
import { FieldPath } from 'react-hook-form';
import { FormInputWithUnit } from '@/components/form/FormInputWithUnit';
import { FormSelect } from '@/components/form/FormSelect';

export function CappedPointsWithUnitFields({
  cappedPointsName,
  cappedTimeUnitName,
  timeUnitOptions,
  editable,
  pointsUnit,
}: {
  cappedPointsName: FieldPath<PointsMallSettingsFormValues>;
  cappedTimeUnitName: FieldPath<PointsMallSettingsFormValues>;
  timeUnitOptions: Array<{ label: string; value: string }>;
  editable: boolean;
  pointsUnit: string;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex items-end gap-3">
      <div className="flex-1">
        <FormInputWithUnit<PointsMallSettingsFormValues>
          name={cappedPointsName}
          unit={pointsUnit}
          label={t('pointsMallSettings.cappedPointsPerTime')}
          verticalLabel
          disabled={!editable}
        />
      </div>
      <div className="flex-1">
        <FormSelect<PointsMallSettingsFormValues>
          verticalLabel={false}
          name={cappedTimeUnitName}
          options={timeUnitOptions}
          disabled={!editable}
          showRowValue={false}
          selectCls="h-10 w-full"
        />
      </div>
    </div>
  );
}
