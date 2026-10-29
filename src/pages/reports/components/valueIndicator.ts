import { useGetSysConfig } from '@/api/hooks/system/system';

export const VALUE_INDICATOR_SHOW_KEYS = {
  dealAccountStatistic: 'crm.deal.account.log.meritIndex.setting.dealAccountStatistic',
  ibDataOverview: 'crm.deal.account.log.meritIndex.setting.ibDataOverview',
  ibPerformanceOverview: 'crm.deal.account.log.meritIndex.setting.ibPerformanceOverview',
} as const;

export const VALUE_INDICATOR_FORMULA_KEY = 'crm.deal.account.log.meritIndex.setting.formula';

export type ValueIndicatorFormula = '1' | '2';

const DEFAULT_FORMULA: ValueIndicatorFormula = '1';

export function useValueIndicatorEnabled(key: string) {
  const { data } = useGetSysConfig(key);
  return String(data ?? '') !== '0';
}

export function useValueIndicatorFormula(): ValueIndicatorFormula {
  const { data } = useGetSysConfig(VALUE_INDICATOR_FORMULA_KEY);
  return String(data ?? '') === '2' ? '2' : DEFAULT_FORMULA;
}
