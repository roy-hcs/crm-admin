import { cn } from '@/lib/utils';
import { CircleCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const getRiskMeta = (riskScore: number) => {
  if (riskScore >= 90) {
    return {
      levelText: 'High',
      borderClass: 'border-red-500',
      textClass: 'text-red-500',
    };
  }

  if (riskScore >= 70) {
    return {
      levelText: 'Medium',
      borderClass: 'border-amber-500',
      textClass: 'text-amber-500',
    };
  }

  if (riskScore >= 40) {
    return {
      levelText: 'Low',
      borderClass: 'border-blue-600',
      textClass: 'text-blue-600',
    };
  }

  return {
    levelText: 'Lowest',
    borderClass: 'border-green-600',
    textClass: 'text-green-600',
  };
};
export const RiskBadge = ({ riskScore }: { riskScore: number }) => {
  const riskMeta = getRiskMeta(riskScore);
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2">
      <div className="text-foreground h-5 text-sm leading-5 font-medium">
        {t('accountOpening.lastLogin')}
      </div>
      <div
        className={cn(
          'bg-background flex items-center justify-center gap-1 rounded-2xl border px-2 py-0.5',
          riskMeta.borderClass,
        )}
      >
        <CircleCheck className={cn('size-2.5', riskMeta.textClass)} />
        <div className={cn('text-xs leading-4 font-medium', riskMeta.textClass)}>
          {riskMeta.levelText}
        </div>
      </div>
    </div>
  );
};
