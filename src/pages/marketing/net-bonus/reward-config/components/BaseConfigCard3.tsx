import { RrhButton } from '@/components/common/RrhButton';
import { RrhCard } from '@/components/common/RrhCard';
import { useCrmFormContext } from '@/contexts/form';
import { useTranslation } from 'react-i18next';
import { FormInputWithUnit } from '@/components/form/FormInputWithUnit';
import { FieldPath, useFieldArray } from 'react-hook-form';
import { GroupItem } from '../NetBonusRewardConfigPage';

type BaseConfigCard3FormValues = {
  agentRewardIntervals: GroupItem[];
  salesRewardIntervals: GroupItem[];
  businessRewardIntervals: GroupItem[];
};

const createEmptyRewardInterval = (type: 'agent' | 'sales' | 'business'): GroupItem => ({
  startAmount: '',
  endAmount: '',
  rewardParam: '',
  type,
});

export function BaseConfigCard3({ editable }: { editable: boolean }) {
  const { t } = useTranslation();
  const { form } = useCrmFormContext<BaseConfigCard3FormValues>();

  const agentFieldArray = useFieldArray({
    control: form.control,
    name: 'agentRewardIntervals',
  });

  const salesFieldArray = useFieldArray({
    control: form.control,
    name: 'salesRewardIntervals',
  });

  const businessFieldArray = useFieldArray({
    control: form.control,
    name: 'businessRewardIntervals',
  });

  const renderSection = (
    title: string,
    fieldName: 'agentRewardIntervals' | 'salesRewardIntervals' | 'businessRewardIntervals',
    itemType: 'agent' | 'sales' | 'business',
    fields: Array<{ id: string }>,
    append: (value: GroupItem) => void,
    remove: (index: number) => void,
  ) => (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="grid gap-1">
          <div className="text-secondary-foreground text-lg leading-7 font-semibold">{title}</div>
        </div>
        <div className="flex items-center gap-2">
          <RrhButton
            type="button"
            variant="outline"
            size="sm"
            disabled={!editable}
            onClick={() => append(createEmptyRewardInterval(itemType))}
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
          const startAmountName =
            `${fieldName}.${index}.startAmount` as FieldPath<BaseConfigCard3FormValues>;
          const endAmountName =
            `${fieldName}.${index}.endAmount` as FieldPath<BaseConfigCard3FormValues>;
          const rewardParamName =
            `${fieldName}.${index}.rewardParam` as FieldPath<BaseConfigCard3FormValues>;
          return (
            <div
              key={item.id}
              className="bg-primary-foreground grid grid-cols-1 gap-3 rounded-2xl p-3 md:grid-cols-2"
            >
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <FormInputWithUnit<BaseConfigCard3FormValues>
                    name={startAmountName}
                    unit="USD"
                    label={t('netBonusRewardConfig.amountRange')}
                    disabled={!editable}
                  />
                </div>
                <div className="pb-2 text-sm">~</div>
                <div className="flex-1">
                  <FormInputWithUnit<BaseConfigCard3FormValues>
                    verticalLabel={false}
                    name={endAmountName}
                    unit="USD"
                    disabled={!editable || index === fields.length - 1}
                    placeholder={
                      index === fields.length - 1 ? t('netBonusRewardConfig.maxBaseAmount') : ''
                    }
                  />
                </div>
              </div>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <FormInputWithUnit<BaseConfigCard3FormValues>
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
    </>
  );

  return (
    <RrhCard>
      <div className="grid gap-4">
        <div className="grid gap-1">
          <div className="text-secondary-foreground text-lg leading-7 font-semibold">
            {t('netBonusRewardConfig.setRewardLevel')}
          </div>
          <div className="text-muted-foreground text-sm leading-5">
            {t('netBonusRewardConfig.setRewardLevelDesc')}
          </div>
        </div>
        {renderSection(
          t('netBonusRewardConfig.agentRewardLevelTable'),
          'agentRewardIntervals',
          'agent',
          agentFieldArray.fields,
          agentFieldArray.append,
          agentFieldArray.remove,
        )}
        {renderSection(
          t('netBonusRewardConfig.salesRewardLevelTable'),
          'salesRewardIntervals',
          'sales',
          salesFieldArray.fields,
          salesFieldArray.append,
          salesFieldArray.remove,
        )}
        {renderSection(
          t('netBonusRewardConfig.businessRewardLevelTable'),
          'businessRewardIntervals',
          'business',
          businessFieldArray.fields,
          businessFieldArray.append,
          businessFieldArray.remove,
        )}
      </div>
    </RrhCard>
  );
}
