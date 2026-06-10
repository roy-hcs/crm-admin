import { RrhButton } from '@/components/common/RrhButton';
import { RrhCard } from '@/components/common/RrhCard';
import { useCrmFormContext } from '@/contexts/form';
import { cappedTimeUnitOptions } from '@/lib/const';
import { Slash } from 'lucide-react';
import { FieldPath, useFieldArray, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { createEmptyTransaction, PointsMallSettingsFormValues } from '../types';
import { CappedPointsWithUnitFields } from './CappedPointsWithUnitFields';
import { TransactionConfigItem } from './TransactionConfigItem';
import { FormInputWithUnit } from '@/components/form/FormInputWithUnit';
import { FormSelect } from '@/components/form/FormSelect';

type ServerOption = {
  label: string;
  value: string;
  serviceProperty: number;
  serviceType: number;
};

export function PointConfigCard4({
  editable,
  serverOptions,
}: {
  editable: boolean;
  serverOptions: ServerOption[];
}) {
  const { t } = useTranslation();
  const { form } = useCrmFormContext<PointsMallSettingsFormValues>();

  const {
    fields: agentCustomerTransactionFields,
    append: appendAgentCustomerTransaction,
    remove: removeAgentCustomerTransaction,
  } = useFieldArray({
    control: form.control,
    name: 'agentCustomerTransaction',
  });

  const commissionRewardList =
    useWatch({
      control: form.control,
      name: 'commissionReward',
    }) || [];
  const commissionRewardSelectedId = useWatch({
    control: form.control,
    name: 'commissionRewardSelectedId',
  });

  const commissionRewardIndex = Math.max(
    commissionRewardList.findIndex(item => item.id === commissionRewardSelectedId),
    0,
  );
  const commissionNamePrefix = `commissionReward.${commissionRewardIndex}`;

  return (
    <RrhCard>
      <div className="grid gap-6">
        <div className="grid gap-4">
          <div className="grid gap-1">
            <div className="text-secondary-foreground text-lg leading-7 font-semibold">
              {t('pointsMallSettings.agentCustomerDeposit')}
            </div>
            <div className="text-muted-foreground text-sm leading-5">
              {t('pointsMallSettings.agentCustomerDepositDesc')}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <FormInputWithUnit<PointsMallSettingsFormValues>
                  name="agentCustomerDeposit.bonusPoints"
                  unit={t('common.points')}
                  label={t('pointsMallSettings.rewardCalculation')}
                  disabled={!editable}
                />
              </div>
              <div className="flex h-10 w-3.5 items-center">
                <Slash className="size-3" />
              </div>
              <div className="flex-1">
                <FormInputWithUnit<PointsMallSettingsFormValues>
                  verticalLabel={false}
                  name="agentCustomerDeposit.bonusBasis"
                  unit="USD"
                  disabled={!editable}
                />
              </div>
            </div>
            <CappedPointsWithUnitFields
              cappedPointsName="agentCustomerDeposit.cappedPoints"
              cappedTimeUnitName="agentCustomerDeposit.cappedTimeUnit"
              timeUnitOptions={cappedTimeUnitOptions.map(i => ({
                label: t(i.label),
                value: i.value,
              }))}
              editable={editable}
              pointsUnit={t('common.points')}
            />
          </div>
        </div>

        <div className="grid gap-4 border-t pt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="grid gap-1">
              <div className="text-secondary-foreground text-lg leading-7 font-semibold">
                {t('pointsMallSettings.agentCustomerTransaction')}
              </div>
              <div className="text-muted-foreground text-sm leading-5">
                {t('pointsMallSettings.agentCustomerTransactionDesc')}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <RrhButton
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendAgentCustomerTransaction(createEmptyTransaction('7'))}
                disabled={!editable}
              >
                +
              </RrhButton>
              <RrhButton
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  if (agentCustomerTransactionFields.length > 1) {
                    removeAgentCustomerTransaction(agentCustomerTransactionFields.length - 1);
                  }
                }}
                disabled={!editable || agentCustomerTransactionFields.length <= 1}
              >
                -
              </RrhButton>
            </div>
          </div>
          <div className="grid gap-3">
            {agentCustomerTransactionFields.map((item, index) => {
              const currentDealServer =
                form.watch(`agentCustomerTransaction.${index}.dealServer`) || '';
              return (
                <TransactionConfigItem
                  key={item.id}
                  index={index}
                  rowKey={item.id}
                  serverOptions={serverOptions}
                  currentDealServer={currentDealServer}
                  namePrefix="agentCustomerTransaction"
                  editable={editable}
                />
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 border-t pt-6">
          <div className="grid gap-1">
            <div className="text-secondary-foreground text-lg leading-7 font-semibold">
              {t('pointsMallSettings.commissionReward')}
            </div>
            <div className="text-muted-foreground text-sm leading-5">
              {t('pointsMallSettings.commissionRewardDesc')}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <FormSelect<PointsMallSettingsFormValues>
                  key={`commission-selected-${commissionRewardSelectedId || 'empty'}`}
                  name="commissionRewardSelectedId"
                  label={t('pointsMallSettings.commissionType')}
                  options={commissionRewardList.map(item => ({
                    label: t(`pointsMallSettings.commissionRewardOptions.${item.id}`),
                    value: item.id,
                  }))}
                  disabled={!editable}
                  showRowValue={false}
                  selectCls="h-10 w-full"
                />
              </div>
              <div className="flex h-10 w-3.5 items-center">
                <Slash className="size-3" />
              </div>
              <div className="flex-1">
                <FormInputWithUnit<PointsMallSettingsFormValues>
                  key={`commission-bonus-${commissionRewardSelectedId || 'empty'}`}
                  name={
                    `${commissionNamePrefix}.bonusPoints` as FieldPath<PointsMallSettingsFormValues>
                  }
                  unit={t('common.points')}
                  label={t('pointsMallSettings.rewardCalculation')}
                  disabled={!editable}
                />
              </div>
            </div>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <FormInputWithUnit<PointsMallSettingsFormValues>
                  key={`commission-capped-points-${commissionRewardSelectedId || 'empty'}`}
                  name={
                    `${commissionNamePrefix}.cappedPoints` as FieldPath<PointsMallSettingsFormValues>
                  }
                  unit={t('common.points')}
                  label={t('pointsMallSettings.cappedPointsPerTime')}
                  disabled={!editable}
                />
              </div>
              <div className="flex-1">
                <FormSelect<PointsMallSettingsFormValues>
                  verticalLabel={false}
                  key={`commission-capped-unit-${commissionRewardSelectedId || 'empty'}`}
                  name={
                    `${commissionNamePrefix}.cappedTimeUnit` as FieldPath<PointsMallSettingsFormValues>
                  }
                  options={cappedTimeUnitOptions.map(i => ({
                    label: t(i.label),
                    value: i.value,
                  }))}
                  disabled={!editable}
                  showRowValue={false}
                  selectCls="h-10 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </RrhCard>
  );
}
