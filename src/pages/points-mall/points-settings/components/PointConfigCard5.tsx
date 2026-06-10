import { SelectOption } from '@/api/types';
import { RrhCard } from '@/components/common/RrhCard';
import { FormInputWithUnit } from '@/components/form/FormInputWithUnit';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import { useTranslation } from 'react-i18next';
import { PointsMallSettingsFormValues } from '../types';

export function PointConfigCard5({
  editable,
  allRoles,
  allTags,
}: {
  editable: boolean;
  allRoles: SelectOption[];
  allTags: SelectOption[];
}) {
  const { t } = useTranslation();

  return (
    <RrhCard>
      <div className="grid gap-6">
        <div className="grid gap-4">
          <div className="grid gap-1">
            <div className="text-secondary-foreground text-lg leading-7 font-semibold">
              {t('pointsMallSettings.deduction')}
            </div>
            <div className="text-muted-foreground text-sm leading-5">
              {t('pointsMallSettings.deductionDesc')}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormInputWithUnit<PointsMallSettingsFormValues>
              name="deductionDays"
              unit={t('common.day')}
              label={t('pointsMallSettings.deductionDays')}
              verticalLabel
              disabled={!editable}
            />
            <FormInputWithUnit<PointsMallSettingsFormValues>
              name="deductionRatio"
              unit="%"
              label={t('pointsMallSettings.deductionRatio')}
              verticalLabel
              disabled={!editable}
            />
          </div>
        </div>

        <div className="grid gap-4 border-t pt-6">
          <div className="grid gap-1">
            <div className="text-secondary-foreground text-lg leading-7 font-semibold">
              {t('pointsMallSettings.exempt')}
            </div>
            <div className="text-muted-foreground text-sm leading-5">
              {t('pointsMallSettings.exemptDesc')}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <FormMultiSelect
              name="exemptRoleIds"
              label={t('pointsMallSettings.exemptRoleIds')}
              placeholder={t('common.pleaseSelect')}
              showRowValue={false}
              options={allRoles}
              disabled={!editable}
            />
            <FormMultiSelect
              name="exemptTagIds"
              label={t('pointsMallSettings.exemptTagIds')}
              placeholder={t('common.pleaseSelect')}
              showRowValue={false}
              options={allTags}
              disabled={!editable}
            />
          </div>
        </div>
      </div>
    </RrhCard>
  );
}
