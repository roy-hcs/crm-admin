import { RrhCard } from '@/components/common/RrhCard';
import { RrhCheckBoxGroup } from '@/components/common/RrhCheckBoxGroup';
import { RrhInputWithUnit } from '@/components/common/RrhInputWithUnit';
import { RrhSelect } from '@/components/common/RrhSelect';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { RrhButton } from '@/components/common/RrhButton';
import { cappedTimeUnitOptions, cappedTimeUnitThreeOptions, selectedMap } from '@/lib/const';
import { useCrmFormContext } from '@/contexts/form';
import { Slash } from 'lucide-react';
import { FieldPath, useFieldArray, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TransactionConfigItem } from './TransactionConfigItem';
import { SelectOption } from '@/api/types';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import { cn } from '@/lib/utils';
import { createEmptyTransaction, PointsMallSettingsFormValues } from '../types';

function CappedPointsWithUnitFields({
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
        <FormField
          name={cappedPointsName}
          render={({ field: basisField }) => (
            <div className="grid gap-3">
              <div>
                <div className="text-foreground text-sm leading-5 font-medium">
                  {t('pointsMallSettings.cappedPointsPerTime')}
                </div>
                <FormMessage />
              </div>
              <FormControl>
                <RrhInputWithUnit
                  unit={pointsUnit}
                  disabled={!editable}
                  value={basisField.value ?? ''}
                  onChange={e => basisField.onChange(e.target.value)}
                />
              </FormControl>
            </div>
          )}
        />
      </div>
      <div className="flex-1">
        <FormField
          name={cappedTimeUnitName}
          render={({ field: basisField }) => (
            <FormControl>
              <RrhSelect
                options={timeUnitOptions}
                disabled={!editable}
                value={basisField.value ?? ''}
                showRowValue={false}
                onValueChange={e => basisField.onChange(e)}
                className="h-10 w-full"
              />
            </FormControl>
          )}
        />
      </div>
    </div>
  );
}

export function PointConfig({
  editable,
  allRoles,
  allTags,
  serverOptions,
}: {
  editable: boolean;
  allRoles: SelectOption[];
  allTags: SelectOption[];
  serverOptions: Array<{
    label: string;
    value: string;
    serviceProperty: number;
    serviceType: number;
  }>;
}) {
  const { t } = useTranslation();
  const { form } = useCrmFormContext<PointsMallSettingsFormValues>();
  const {
    fields: transactionFields,
    append: appendTransaction,
    remove: removeTransaction,
  } = useFieldArray({
    control: form.control,
    name: 'transaction',
  });
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
    <div className="grid gap-6">
      <RrhCard>
        <div className="grid gap-6">
          <FormField
            name="productExchangeEnable"
            render={({ field }) => (
              <FormControl>
                <div className="flex items-center gap-4">
                  <div className="grid flex-1 gap-1">
                    <div className="text-secondary-foreground text-sm leading-5 font-medium">
                      {t('pointsMallSettings.productExchangeEnable')}
                    </div>
                    <div className="text-muted-foreground text-sm leading-5">
                      {t('pointsMallSettings.productExchangeEnableDesc')}
                    </div>
                  </div>
                  <div>
                    <Switch
                      className="w-9 cursor-pointer bg-white data-[state=checked]:bg-green-500"
                      checked={field?.value === '1'}
                      disabled={!editable}
                      onClick={() => {
                        const newValue = field?.value === '1' ? '0' : '1';
                        field.onChange(newValue);
                      }}
                    />
                  </div>
                </div>
              </FormControl>
            )}
          />
          <FormField
            name="pointsDigits"
            render={({ field }) => (
              <FormControl>
                <div className="flex items-center gap-4 border-t pt-6">
                  <div className="grid flex-1 gap-1">
                    <div className="text-secondary-foreground text-sm leading-5 font-medium">
                      {t('pointsMallSettings.pointsDigits')}
                    </div>
                    <div className="text-muted-foreground text-sm leading-5">
                      {t('pointsMallSettings.pointsDigitsDesc')}
                    </div>
                  </div>
                  <div>
                    <Switch
                      className="w-9 cursor-pointer bg-white data-[state=checked]:bg-green-500"
                      checked={field?.value === '1'}
                      disabled={!editable}
                      onClick={() => {
                        const newValue = field?.value === '1' ? '0' : '1';
                        field.onChange(newValue);
                      }}
                    />
                  </div>
                </div>
              </FormControl>
            )}
          />
        </div>
      </RrhCard>

      <RrhCard>
        <div className="grid gap-6">
          <FormField
            name="selected"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid gap-4">
                    <div className="grid gap-1">
                      <div className="text-secondary-foreground text-lg leading-7 font-semibold">
                        {t('pointsMallSettings.selected')}
                      </div>
                      <div className="text-muted-foreground text-sm leading-5">
                        {t('pointsMallSettings.productExchangeEnableDesc')}
                      </div>
                    </div>
                    <div>
                      <RrhCheckBoxGroup
                        onValueChange={v => {
                          field.onChange(
                            v
                              .split(',')
                              .map(item => item.trim())
                              .filter(Boolean),
                          );
                        }}
                        value={(field.value || []).join(',')}
                        checkItems={selectedMap.map(i => ({
                          label: t(i.label),
                          value: i.value,
                          disabled: !editable,
                        }))}
                        className="grid grid-cols-2 gap-x-0 gap-y-4"
                        checkItemClassName="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 size-3.5"
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 border-t pt-6">
            <div className="grid gap-1">
              <div className="text-secondary-foreground text-lg leading-7 font-semibold">
                {t('pointsMallSettings.depositSuccess')}
              </div>
              <div className="text-muted-foreground text-sm leading-5">
                {t('pointsMallSettings.depositSuccessDesc')}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <FormField
                    name="depositSuccess.bonusPoints"
                    render={({ field: basisField }) => (
                      <div className="grid gap-3">
                        <div>
                          <div className="text-foreground text-sm leading-5 font-medium">
                            {t('pointsMallSettings.rewardCalculation')}
                          </div>
                          <FormMessage />
                        </div>
                        <FormControl>
                          <RrhInputWithUnit
                            unit={t('common.points')}
                            disabled={!editable}
                            value={basisField.value ?? ''}
                            onChange={e => basisField.onChange(e.target.value)}
                          />
                        </FormControl>
                      </div>
                    )}
                  />
                </div>
                <div className="flex h-10 w-3.5 items-center">
                  <Slash className="size-3" />
                </div>
                <div className="flex-1">
                  <FormField
                    name="depositSuccess.bonusBasis"
                    render={({ field: basisField }) => (
                      <FormControl>
                        <RrhInputWithUnit
                          unit="USD"
                          disabled={!editable}
                          value={basisField.value ?? ''}
                          onChange={e => basisField.onChange(e.target.value)}
                        />
                      </FormControl>
                    )}
                  />
                </div>
              </div>
              <CappedPointsWithUnitFields
                cappedPointsName="depositSuccess.cappedPoints"
                cappedTimeUnitName="depositSuccess.cappedTimeUnit"
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
                  {t('pointsMallSettings.transaction')}
                </div>
                <div className="text-muted-foreground text-sm leading-5">
                  {t('pointsMallSettings.transactionDesc')}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <RrhButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendTransaction(createEmptyTransaction('2'))}
                  disabled={!editable}
                >
                  +
                </RrhButton>
                <RrhButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (transactionFields.length > 1) {
                      removeTransaction(transactionFields.length - 1);
                    }
                  }}
                  disabled={!editable || transactionFields.length <= 1}
                >
                  -
                </RrhButton>
              </div>
            </div>
            <div className="grid gap-3">
              {transactionFields.map((item, index) => {
                const currentDealServer = form.watch(`transaction.${index}.dealServer`) || '';
                return (
                  <TransactionConfigItem
                    key={item.id}
                    index={index}
                    rowKey={item.id}
                    serverOptions={serverOptions}
                    currentDealServer={currentDealServer}
                    namePrefix="transaction"
                    editable={editable}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </RrhCard>

      <RrhCard>
        <div className="grid gap-6">
          <div className="grid gap-4">
            <div className="grid gap-1">
              <div className="text-secondary-foreground text-lg leading-7 font-semibold">
                {t('pointsMallSettings.inviteRegister')}
              </div>
              <div className="text-muted-foreground text-sm leading-5">
                {t('pointsMallSettings.inviteRegisterDesc')}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <FormField
                name="inviteRegister.bonusPoints"
                render={({ field: basisField }) => (
                  <div className="grid gap-3">
                    <div>
                      <div className="text-foreground text-sm leading-5 font-medium">
                        {t('pointsMallSettings.rewardCalculation')}
                      </div>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <RrhInputWithUnit
                        unit={`${t('common.points')}/${t('common.piece')}`}
                        disabled={!editable}
                        value={basisField.value ?? ''}
                        onChange={e => basisField.onChange(e.target.value)}
                      />
                    </FormControl>
                  </div>
                )}
              />
              <CappedPointsWithUnitFields
                cappedPointsName="inviteRegister.cappedPoints"
                cappedTimeUnitName="inviteRegister.cappedTimeUnit"
                timeUnitOptions={cappedTimeUnitThreeOptions.map(i => ({
                  label: t(i.label),
                  value: i.value,
                }))}
                editable={editable}
                pointsUnit={t('common.points')}
              />
            </div>
          </div>

          <div className="grid gap-4 border-t pt-6">
            <div className="grid gap-1">
              <div className="text-secondary-foreground text-lg leading-7 font-semibold">
                {t('pointsMallSettings.inviteOpenAccount')}
              </div>
              <div className="text-muted-foreground text-sm leading-5">
                {t('pointsMallSettings.inviteOpenAccountDesc')}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <FormField
                name="inviteOpenAccount.bonusPoints"
                render={({ field: basisField }) => (
                  <div className="grid gap-3">
                    <div>
                      <div className="text-foreground text-sm leading-5 font-medium">
                        {t('pointsMallSettings.rewardCalculation')}
                      </div>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <RrhInputWithUnit
                        unit={`${t('common.points')}/${t('common.piece')}`}
                        disabled={!editable}
                        value={basisField.value ?? ''}
                        onChange={e => basisField.onChange(e.target.value)}
                      />
                    </FormControl>
                  </div>
                )}
              />
              <CappedPointsWithUnitFields
                cappedPointsName="inviteOpenAccount.cappedPoints"
                cappedTimeUnitName="inviteOpenAccount.cappedTimeUnit"
                timeUnitOptions={cappedTimeUnitThreeOptions.map(i => ({
                  label: t(i.label),
                  value: i.value,
                }))}
                editable={editable}
                pointsUnit={t('common.points')}
              />
            </div>
            <div className="bg-secondary rounded-xl p-3">
              <FormField
                name="inviteOpenAccount.multipleRewards"
                render={({ field }) => (
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <div className="grid flex-1 gap-1">
                        <div className="text-secondary-foreground text-sm leading-5 font-medium">
                          {t('pointsMallSettings.multipleRewards')}
                        </div>
                        <div className="text-muted-foreground text-sm leading-5">
                          {t('pointsMallSettings.multipleRewardsDesc')}
                        </div>
                      </div>
                      <div>
                        <Switch
                          className="w-9 cursor-pointer bg-white data-[state=checked]:bg-green-500"
                          checked={field?.value === '1'}
                          disabled={!editable}
                          onClick={() => {
                            const newValue = field?.value === '1' ? '0' : '1';
                            field.onChange(newValue);
                          }}
                        />
                      </div>
                    </div>
                  </FormControl>
                )}
              />
            </div>
          </div>

          <div className="grid gap-4 border-t pt-6">
            <div className="grid gap-1">
              <div className="text-secondary-foreground text-lg leading-7 font-semibold">
                {t('pointsMallSettings.inviteDeposit')}
              </div>
              <div className="text-muted-foreground text-sm leading-5">
                {t('pointsMallSettings.inviteDepositDesc')}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <FormField
                name="inviteDeposit.bonusPoints"
                render={({ field: basisField }) => (
                  <div className="grid gap-3">
                    <div>
                      <div className="text-foreground text-sm leading-5 font-medium">
                        {t('pointsMallSettings.rewardCalculation')}
                      </div>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <RrhInputWithUnit
                        unit={`${t('common.points')}/${t('common.piece')}`}
                        disabled={!editable}
                        value={basisField.value ?? ''}
                        onChange={e => basisField.onChange(e.target.value)}
                      />
                    </FormControl>
                  </div>
                )}
              />
              <CappedPointsWithUnitFields
                cappedPointsName="inviteDeposit.cappedPoints"
                cappedTimeUnitName="inviteDeposit.cappedTimeUnit"
                timeUnitOptions={cappedTimeUnitThreeOptions.map(i => ({
                  label: t(i.label),
                  value: i.value,
                }))}
                editable={editable}
                pointsUnit={t('common.points')}
              />
            </div>
          </div>
        </div>
      </RrhCard>

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
                  <FormField
                    name="agentCustomerDeposit.bonusPoints"
                    render={({ field: basisField }) => (
                      <div className="grid gap-3">
                        <div>
                          <div className="text-foreground text-sm leading-5 font-medium">
                            {t('pointsMallSettings.rewardCalculation')}
                          </div>
                          <FormMessage />
                        </div>
                        <FormControl>
                          <RrhInputWithUnit
                            unit={t('common.points')}
                            disabled={!editable}
                            value={basisField.value ?? ''}
                            onChange={e => basisField.onChange(e.target.value)}
                          />
                        </FormControl>
                      </div>
                    )}
                  />
                </div>
                <div className="flex h-10 w-3.5 items-center">
                  <Slash className="size-3" />
                </div>
                <div className="flex-1">
                  <FormField
                    name="agentCustomerDeposit.bonusBasis"
                    render={({ field: basisField }) => (
                      <FormControl>
                        <RrhInputWithUnit
                          unit="USD"
                          disabled={!editable}
                          value={basisField.value ?? ''}
                          onChange={e => basisField.onChange(e.target.value)}
                        />
                      </FormControl>
                    )}
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
                  <FormField
                    key={`commission-selected-${commissionRewardSelectedId || 'empty'}`}
                    name="commissionRewardSelectedId"
                    render={({ field: basisField }) => (
                      <div className="grid gap-3">
                        <div>
                          <div className="text-foreground text-sm leading-5 font-medium">
                            {t('pointsMallSettings.commissionType')}
                          </div>
                          <FormMessage />
                        </div>
                        <FormControl>
                          <RrhSelect
                            options={commissionRewardList.map(item => ({
                              label: t(`pointsMallSettings.commissionRewardOptions.${item.id}`),
                              value: item.id,
                            }))}
                            disabled={!editable}
                            value={basisField.value ?? ''}
                            showRowValue={false}
                            onValueChange={e => {
                              basisField.onChange(e);
                            }}
                            className="h-10 w-full"
                          />
                        </FormControl>
                      </div>
                    )}
                  />
                </div>
                <div className="flex h-10 w-3.5 items-center">
                  <Slash className="size-3" />
                </div>
                <div className="flex-1">
                  <FormField
                    key={`commission-bonus-${commissionRewardSelectedId || 'empty'}`}
                    name={`${commissionNamePrefix}.bonusPoints`}
                    render={({ field: basisField }) => (
                      <div className="grid gap-3">
                        <div>
                          <div className="text-foreground text-sm leading-5 font-medium">
                            {t('pointsMallSettings.rewardCalculation')}
                          </div>
                          <FormMessage />
                        </div>
                        <FormControl>
                          <RrhInputWithUnit
                            unit={t('common.points')}
                            disabled={!editable}
                            value={basisField.value ?? ''}
                            onChange={e => basisField.onChange(e.target.value)}
                          />
                        </FormControl>
                      </div>
                    )}
                  />
                </div>
              </div>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <FormField
                    key={`commission-capped-points-${commissionRewardSelectedId || 'empty'}`}
                    name={`${commissionNamePrefix}.cappedPoints`}
                    render={({ field: basisField }) => (
                      <div className="grid gap-3">
                        <div>
                          <div className="text-foreground text-sm leading-5 font-medium">
                            {t('pointsMallSettings.cappedPointsPerTime')}
                          </div>
                          <FormMessage />
                        </div>
                        <FormControl>
                          <RrhInputWithUnit
                            unit={t('common.points')}
                            disabled={!editable}
                            value={basisField.value ?? ''}
                            onChange={e => basisField.onChange(e.target.value)}
                          />
                        </FormControl>
                      </div>
                    )}
                  />
                </div>
                <div className="flex-1">
                  <FormField
                    key={`commission-capped-unit-${commissionRewardSelectedId || 'empty'}`}
                    name={`${commissionNamePrefix}.cappedTimeUnit`}
                    render={({ field: basisField }) => (
                      <FormControl>
                        <RrhSelect
                          options={cappedTimeUnitOptions.map(i => ({
                            label: t(i.label),
                            value: i.value,
                          }))}
                          disabled={!editable}
                          value={basisField.value ?? ''}
                          showRowValue={false}
                          onValueChange={e => basisField.onChange(e)}
                          className="h-10 w-full"
                        />
                      </FormControl>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </RrhCard>

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
              <FormField
                name="deductionDays"
                render={({ field: basisField }) => (
                  <div className="grid gap-3">
                    <div className="text-foreground text-sm leading-5 font-medium">
                      {t('pointsMallSettings.deductionDays')}
                    </div>
                    <FormControl>
                      <RrhInputWithUnit
                        unit={t('common.day')}
                        value={basisField.value ?? ''}
                        onChange={e => basisField.onChange(e.target.value)}
                        disabled={!editable}
                      />
                    </FormControl>
                  </div>
                )}
              />
              <FormField
                name="deductionRatio"
                render={({ field: basisField }) => (
                  <div className="grid gap-3">
                    <div className="text-foreground text-sm leading-5 font-medium">
                      {t('pointsMallSettings.deductionRatio')}
                    </div>
                    <FormControl>
                      <RrhInputWithUnit
                        unit="%"
                        value={basisField.value ?? ''}
                        onChange={e => basisField.onChange(e.target.value)}
                        disabled={!editable}
                      />
                    </FormControl>
                  </div>
                )}
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
              <div
                className={cn(!editable && 'pointer-events-none opacity-60')}
                aria-disabled={!editable}
              >
                <FormMultiSelect
                  name="exemptRoleIds"
                  label={t('pointsMallSettings.exemptRoleIds')}
                  verticalLabel
                  placeholder={t('common.pleaseSelect')}
                  showRowValue={false}
                  options={allRoles}
                />
              </div>
              <div
                className={cn(!editable && 'pointer-events-none opacity-60')}
                aria-disabled={!editable}
              >
                <FormMultiSelect
                  name="exemptTagIds"
                  label={t('pointsMallSettings.exemptTagIds')}
                  verticalLabel
                  placeholder={t('common.pleaseSelect')}
                  showRowValue={false}
                  options={allTags}
                />
              </div>
            </div>
          </div>
        </div>
      </RrhCard>
    </div>
  );
}
