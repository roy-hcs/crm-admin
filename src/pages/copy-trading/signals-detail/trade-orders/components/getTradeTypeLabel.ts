import { TFunction } from 'i18next';

export function getTradeTypeLabel(type: number | string | null | undefined, t: TFunction): string {
  if (Number(type) === 0) return t('table.buy');
  if (Number(type) === 1) return t('table.sell');
  return '-';
}
