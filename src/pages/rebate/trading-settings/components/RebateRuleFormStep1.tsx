import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { FormSwitch } from '@/components/form/FormSwitch';
import { FormTextarea } from '@/components/form/FormTextarea';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import { FormField } from '@/components/ui/form';
import { LabelItem } from '@/components/common/LabelItem';
import { RrhRadioGroup } from '@/components/common/RrhRadioGroup';
import { BaseOption } from '@/components/common/RrhSelect';
import { serverMap } from '@/lib/constant';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useCrmFormContext } from '@/contexts/form';
import { useMemo } from 'react';

interface ServerListItem {
  id: string;
  serverName: string;
  serviceProperty: number;
  serviceType: number;
}

interface LevelListItem {
  levelName: string;
  level: string;
}

interface DealAccountGroup {
  id: string;
  name: string;
}
interface RebateRuleFormStep1BaseProps {
  isEditMode: boolean;
  defaultLang: string;
  serverList: { rows: ServerListItem[] } | undefined;
  dealAccountGroupListRes: DealAccountGroup[];
  levelList: { rows: LevelListItem[] } | undefined;
  model: number;
  onServerChange: (value: string[], option?: string, operator?: 'add' | 'remove') => void;
}
interface RebateRuleFormStep1ForTradingProps extends RebateRuleFormStep1BaseProps {
  type: 'trading';
  currentSettleUnit: string;
  settleUnitOptions: BaseOption[];
  onBeforeValueChange: (newValue: string[]) => { valid: boolean; message?: string };
}
interface RebateRuleFormStep1ForFeeProps extends RebateRuleFormStep1BaseProps {
  type: 'fee';
}
interface RebateRuleFormStep1ForDepositProps extends RebateRuleFormStep1BaseProps {
  type: 'deposit';
}

type RebateRuleFormStep1Props =
  | RebateRuleFormStep1ForTradingProps
  | RebateRuleFormStep1ForFeeProps
  | RebateRuleFormStep1ForDepositProps;

export const RebateRuleFormStep1 = ({
  isEditMode,
  defaultLang,
  serverList,
  dealAccountGroupListRes,
  levelList,
  model,
  onServerChange,
  ...props
}: RebateRuleFormStep1Props) => {
  const { t } = useTranslation();
  const { form } = useCrmFormContext();
  const suitTypeValue = form.watch('suitType');
  const serverAndGroupShow = useMemo(() => {
    if (props.type !== 'deposit') {
      return true;
    } else if (suitTypeValue === '0') {
      return true;
    } else {
      return false;
    }
  }, [props.type, suitTypeValue]);

  return (
    <div className="flex flex-col gap-y-4 pb-4">
      <div>{t('TradingRebateSettings.baseSetting')}</div>
      <FormInput
        verticalLabel
        name="ruleName"
        label={t('table.ruleName') + `${defaultLang ? ` (${defaultLang})` : ''}`}
        placeholder={t('rules.limitLength', { field: 64 })}
      />
      <FormSelect
        name="suitType"
        verticalLabel
        showRowValue={false}
        label={t('DepositRebateSettings.depositAccount')}
        placeholder={t('common.pleaseSelect')}
        options={[
          {
            label: t('table.tradingAccount'),
            value: 0,
          },
          {
            label: t('table.wallet'),
            value: 1,
          },
        ]}
      />
      {serverAndGroupShow && (
        <>
          <FormMultiSelect<
            Record<string, string>,
            BaseOption & {
              serviceType: number;
            }
          >
            verticalLabel
            label={t('table.server') + `(${t('common.supportMultipleSelection')})`}
            placeholder={t('common.pleaseSelect')}
            name="serverName"
            options={
              (serverList?.rows || [])
                .filter((item: ServerListItem) => item.serviceProperty === 1)
                .map((item: ServerListItem) => ({
                  label: item.serverName,
                  value: item.id,
                  serviceType: item.serviceType,
                })) || []
            }
            renderItem={option => {
              return (
                <div>
                  {option.serviceType && <span> {serverMap[option.serviceType]} | </span>}
                  <span>{option.label}</span>
                </div>
              );
            }}
            onValueChange={onServerChange}
            maxSelections={5}
            onMaxSelectionsReached={() => {
              toast.error(t('TradingRebateSettings.serverCanNotExceed5'));
            }}
            onBeforeValueChange={props.type === 'trading' ? props.onBeforeValueChange : undefined}
          />
          <FormMultiSelect
            name="accountGroup"
            label={t('common.optionalField', { field: t('table.accountGroup') })}
            verticalLabel
            placeholder={`${t('table.allAccountGroup')}`}
            options={(dealAccountGroupListRes || []).map(item => ({
              label: item.name,
              value: item.id,
            }))}
          />
        </>
      )}
      <FormSwitch label={t('table.status')} name="hasUsed" verticalLabel />
      {props.type === 'trading' && (
        <>
          <FormField
            name="settleType"
            render={({ field }) => (
              <LabelItem
                label={t('TradingRebateSettings.settleType')}
                className="pt-0"
                ContentDom={
                  <RrhRadioGroup
                    value={field.value ?? '1'}
                    onValueChange={value => {
                      field.onChange(value);
                    }}
                    labelClassName="font-medium"
                    orientation="horizontal"
                    radioItems={[
                      {
                        value: '1',
                        label: t('TradingRebateSettings.amount'),
                      },
                      {
                        value: '2',
                        label: t('TradingRebateSettings.dot'),
                      },
                    ]}
                  />
                }
              />
            )}
          />
          <FormInput
            name="settleValue"
            label={t('TradingRebateSettings.settleUnit')}
            verticalLabel
            type="number"
            placeholder=""
            disabled={props.currentSettleUnit === '1'}
            inputCls="border-r-0 rounded-r-none"
            rightElement={
              <FormSelect
                showRowValue={false}
                name="settleUnit"
                label=""
                options={props.settleUnitOptions}
                selectCls="rounded-l-none"
                defaultValue={'1'}
              />
            }
          />
        </>
      )}
      <div>
        <FormSelect
          name="highestRebateLevel"
          label={
            model === 1
              ? t('TradingRebateSettings.highestRebateLevel')
              : t('TradingRebateSettings.settleLevel')
          }
          verticalLabel
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={
            levelList?.rows.map((item: LevelListItem) => ({
              label: item.levelName,
              value: item.level,
            })) || []
          }
          disabled={isEditMode}
        />
        <div className="text-muted-foreground mt-1 text-xs">
          {t('TradingRebateSettings.canNotModifyAfterAdd')}
        </div>
      </div>
      <FormInput
        name="serialNumber"
        label={t('table.sort')}
        verticalLabel
        type="number"
        placeholder={t('common.sortPlaceholder')}
      />
      <div>
        <FormSelect
          name="commissionSettlementTiming"
          label={t('common.optionalField', {
            field: t('TradingRebateSettings.commissionSettlementTiming'),
          })}
          verticalLabel
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={[
            { value: '0', label: t('common.pleaseSelect') },
            { value: '1', label: t('TradingRebateSettings.manualReview') },
            { value: '2', label: t('TradingRebateSettings.realTimeCommission') },
          ]}
        />
        <div className="text-muted-foreground mt-1 text-xs">
          {t('TradingRebateSettings.commissionDesc')}
        </div>
      </div>
      <FormTextarea
        name="remark"
        label={t('common.optionalField', { field: t('table.remarks') })}
        verticalLabel
        placeholder={t('common.pleaseInput', { field: t('table.description') })}
        maxLength={300}
      />
    </div>
  );
};
