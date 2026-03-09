import { RrhButton } from '@/components/common/RrhButton';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface RebateRuleFormNavigationProps {
  step: number;
  onPrevious: () => void;
  onNext: () => void;
  nextLoading?: boolean;
}

export const RebateRuleFormNavigation = ({
  step,
  onPrevious,
  onNext,
  nextLoading = false,
}: RebateRuleFormNavigationProps) => {
  const { t } = useTranslation();

  return (
    <div className="border-border flex justify-end gap-4 border-t pt-6">
      <RrhButton type="button" className={cn(step !== 1 ? 'block' : 'hidden')} onClick={onPrevious}>
        {t('common.previousStep')}
      </RrhButton>
      <RrhButton
        type="button"
        className={cn(step !== 3 ? 'block' : 'hidden')}
        loading={nextLoading}
        disabled={nextLoading}
        onClick={onNext}
      >
        {t('common.next')}
      </RrhButton>
      <RrhButton type="submit" className={cn(step === 3 ? 'block' : 'hidden')}>
        {t('common.save')}
      </RrhButton>
    </div>
  );
};
