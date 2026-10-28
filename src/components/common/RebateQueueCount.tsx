import { useTranslation } from 'react-i18next';
import { useRebateQueueCount } from '@/api/hooks/rebate';

export const RebateQueueCount = ({ rebateType }: { rebateType: 1 | 2 | 3 }) => {
  const { t } = useTranslation();
  const { data } = useRebateQueueCount(rebateType);

  return (
    <span className="text-muted-foreground text-sm whitespace-nowrap">
      {t('common.rebateQueueCount')}：{data?.data ?? '-'}
    </span>
  );
};
