import { RrhButton } from '@/components/common/RrhButton';
import { RrhCard } from '@/components/common/RrhCard';
import { RrhCheckBoxGroup } from '@/components/common/RrhCheckBoxGroup';
import { useCrmFormContext } from '@/contexts/form';
import { cappedTimeUnitOptions, selectedMap } from '@/lib/const';
import { Slash } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { createEmptyTransaction, PointsMallSettingsFormValues } from '../types';
import { CappedPointsWithUnitFields } from './CappedPointsWithUnitFields';
import { TransactionConfigItem } from './TransactionConfigItem';
import { FormInputWithUnit } from '@/components/form/FormInputWithUnit';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

type ServerOption = {
  label: string;
  value: string;
  serviceProperty: number;
  serviceType: number;
};

export function PointConfigCard2({
  editable,
  serverOptions,
}: {
  editable: boolean;
  serverOptions: ServerOption[];
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

  return (
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
                <FormInputWithUnit<PointsMallSettingsFormValues>
                  name="depositSuccess.bonusPoints"
                  unit={t('common.points')}
                  label={t('pointsMallSettings.rewardCalculation')}
                  verticalLabel
                  disabled={!editable}
                />
              </div>
              <div className="flex h-10 w-3.5 items-center">
                <Slash className="size-3" />
              </div>
              <div className="flex-1">
                <FormInputWithUnit<PointsMallSettingsFormValues>
                  name="depositSuccess.bonusBasis"
                  unit="USD"
                  disabled={!editable}
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
  );
}
