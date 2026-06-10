import { RrhButton } from '@/components/common/RrhButton';
import { RrhCard } from '@/components/common/RrhCard';
import { useCrmFormContext } from '@/contexts/form';
import { useTranslation } from 'react-i18next';
import { FormInputWithUnit } from '@/components/form/FormInputWithUnit';
import { FormCrmUserSelect } from '@/components/form/FormCrmUserSelect';
import { FieldPath, useFieldArray } from 'react-hook-form';

type FixedParamFormItem = {
  userId: string;
  userLabel?: string;
  rewardParam: string;
  type: string;
};

type BaseConfigCard4FormValues = {
  fixedParams: FixedParamFormItem[];
};

const createEmptyFixedParam = (): FixedParamFormItem => ({
  userId: '',
  userLabel: '',
  rewardParam: '',
  type: '1',
});

export function BaseConfigCard4({ editable }: { editable: boolean }) {
  const { t } = useTranslation();
  const { form } = useCrmFormContext<BaseConfigCard4FormValues>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'fixedParams',
  });

  return (
    <RrhCard>
      <div className="grid gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="grid gap-1">
            <div className="text-secondary-foreground text-lg leading-7 font-semibold">
              {t('netBonusRewardConfig.setRewardLevelParams')}
            </div>
            <div className="text-muted-foreground text-sm leading-5">
              {t('netBonusRewardConfig.setRewardLevelParamsDesc')}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <RrhButton
              type="button"
              variant="outline"
              size="sm"
              disabled={!editable}
              onClick={() => append(createEmptyFixedParam())}
            >
              +
            </RrhButton>
            <RrhButton
              type="button"
              variant="outline"
              size="sm"
              disabled={!editable || fields.length <= 1}
              onClick={() => {
                if (fields.length > 1) {
                  remove(fields.length - 1);
                }
              }}
            >
              -
            </RrhButton>
          </div>
        </div>
        <div className="grid gap-3">
          {fields.map((item, index) => {
            const userIdName =
              `fixedParams.${index}.userId` as FieldPath<BaseConfigCard4FormValues>;
            const userLabelName =
              `fixedParams.${index}.userLabel` as FieldPath<BaseConfigCard4FormValues>;
            const rewardParamName =
              `fixedParams.${index}.rewardParam` as FieldPath<BaseConfigCard4FormValues>;
            const typeName = `fixedParams.${index}.type` as FieldPath<BaseConfigCard4FormValues>;

            return (
              <div
                key={item.id}
                className="bg-primary-foreground grid grid-cols-1 gap-3 rounded-2xl p-3 md:grid-cols-2"
              >
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <FormCrmUserSelect<BaseConfigCard4FormValues>
                      verticalLabel
                      name={userIdName}
                      label={t('home.CRMUserCount')}
                      disabled={!editable}
                      labelName={userLabelName}
                      onSelect={() => {
                        form.setValue(typeName, '1');
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <FormInputWithUnit<BaseConfigCard4FormValues>
                      name={rewardParamName}
                      unit="%"
                      label={t('table.rewardParams')}
                      disabled={!editable}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </RrhCard>
  );
}
