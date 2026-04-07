import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import { serverMap } from '@/lib/constant';
import { RebateBaseTypeItem } from '@/api/hooks/rebate';
import { useTranslation } from 'react-i18next';

interface Server {
  id: string;
  serverName: string;
  serviceType?: number;
}

interface RebateRuleFormStep2Props {
  selectedServerOptions: Server[];
  mtAndRebateTypeList: { groups: string[]; types: RebateBaseTypeItem[] }[];
}

export const RebateRuleFormStep2 = ({
  selectedServerOptions,
  mtAndRebateTypeList,
}: RebateRuleFormStep2Props) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-y-4 pb-4">
      <div>{t('TradingRebateSettings.serverSetting')}</div>
      <div className="flex flex-col gap-4">
        {selectedServerOptions.map((server, index) => (
          <div key={server.id} className="flex flex-col gap-4 rounded-xl border px-3 py-6">
            <div>
              {server.serviceType && <span> {serverMap[server.serviceType]} | </span>}
              <span>{server.serverName}</span>
            </div>
            <FormMultiSelect
              name={`traderServers.${index}.mtGroups`}
              label={t('common.optionalField', { field: t('table.groups') })}
              verticalLabel
              placeholder={t('TradingRebateSettings.allMtGroups')}
              options={
                mtAndRebateTypeList[index]?.groups.map(item => ({
                  label: item,
                  value: item,
                })) || []
              }
            />
            <FormMultiSelect
              name={`traderServers.${index}.rebateGroupTypes`}
              label={t('common.optionalField', { field: t('table.typeGroup') })}
              verticalLabel
              placeholder={t('TradingRebateSettings.allRebateGroupType')}
              options={
                mtAndRebateTypeList[index]?.types.map(item => ({
                  label: item.typeGroupName,
                  value: item.id,
                })) || []
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};
