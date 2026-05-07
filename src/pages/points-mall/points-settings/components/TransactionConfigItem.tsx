import { BaseOption, RrhSelect } from '@/components/common/RrhSelect';
import { SelectMtTypeGroup } from '@/components/common/SelectMtTypeGroup';
import { RrhInputWithUnit } from '@/components/common/RrhInputWithUnit';
import { FormControl, FormField, FormMessage } from '@/components/ui/form';
import { cappedTimeUnitTwoOptions } from '@/lib/const';
import { serverMap } from '@/lib/constant';
import { Slash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

type ServerOption = BaseOption & {
  serviceProperty: number;
  serviceType: number;
};

export function TransactionConfigItem({
  index,
  rowKey,
  serverOptions,
  currentDealServer,
  namePrefix,
  editable,
}: {
  index: number;
  rowKey: string;
  serverOptions: ServerOption[];
  currentDealServer: string;
  namePrefix: 'transaction' | 'agentCustomerTransaction';
  editable: boolean;
}) {
  const { t } = useTranslation();
  const serverType = useMemo(
    () => serverOptions.find(option => option.value === currentDealServer)?.serviceType ?? 0,
    [currentDealServer, serverOptions],
  );
  return (
    <div
      key={rowKey}
      className="bg-primary-foreground grid grid-cols-1 gap-3 rounded-2xl p-3 md:grid-cols-2"
    >
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <FormField
            name={`${namePrefix}.${index}.dealServer`}
            render={({ field }) => (
              <div className="grid gap-3">
                <div className="text-foreground text-sm leading-5 font-medium">
                  {t('table.server')}
                </div>
                <FormControl>
                  <RrhSelect<ServerOption>
                    options={serverOptions}
                    value={field.value ?? ''}
                    showRowValue={false}
                    placeholder={t('common.pleaseSelect')}
                    disabled={!editable}
                    onValueChange={e => {
                      field.onChange(e);
                    }}
                    className="h-10 w-full"
                    renderItem={option => (
                      <div>
                        <span>
                          {option.serviceProperty === 1 ? t('common.live') : t('common.demo')}
                        </span>
                        {option.serviceType && <span> {serverMap[option.serviceType]} | </span>}
                        <span>{option.label}</span>
                      </div>
                    )}
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
            name={`${namePrefix}.${index}.dealBreed`}
            render={({ field }) => (
              <SelectMtTypeGroup
                defaultValue={field.value ?? ''}
                verticalLabel
                field={field}
                serverId={currentDealServer}
                disabled={!editable}
                emptyDisplayText={t('TradingRebateSettings.allRebateGroupType')}
              />
            )}
          />
        </div>
      </div>
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <FormField
            name={`${namePrefix}.${index}.bonusPoints`}
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
            name={`${namePrefix}.${index}.bonusBasis`}
            render={({ field: basisField }) => (
              <FormControl>
                <RrhInputWithUnit
                  unit={serverType === 3 ? 'Contract' : 'lots'}
                  disabled={!editable}
                  value={basisField.value ?? ''}
                  onChange={e => basisField.onChange(e.target.value)}
                />
              </FormControl>
            )}
          />
        </div>
      </div>
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <FormField
            name={`${namePrefix}.${index}.cappedPoints`}
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
            name={`${namePrefix}.${index}.cappedTimeUnit`}
            render={({ field: basisField }) => (
              <FormControl>
                <RrhSelect
                  options={cappedTimeUnitTwoOptions.map(i => ({
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
  );
}
