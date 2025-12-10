import { RrhCard } from '@/components/common/RrhCard';
import { RrhStep, RrhStepProps } from '@/components/common/RrhStep';
import { useTranslation } from 'react-i18next';

export const ReviewStepsCard = ({ reviewSteps }: { reviewSteps: RrhStepProps['steps'] }) => {
  const { t } = useTranslation();
  return (
    <RrhCard title={t('review.reviewRecord')}>
      <RrhStep steps={reviewSteps} />
    </RrhCard>
  );
};
