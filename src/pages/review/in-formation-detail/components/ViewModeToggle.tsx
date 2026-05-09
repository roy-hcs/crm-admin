import { RrhButton } from '@/components/common/RrhButton';
import { CornerDownLeft, LayoutList } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type InformationDetailViewMode = 'review' | 'overview';

export function ViewModeToggle({
  viewMode,
  onToggle,
}: {
  viewMode: InformationDetailViewMode;
  onToggle: () => void;
}) {
  const { t } = useTranslation();

  return (
    <RrhButton
      onClick={onToggle}
      className="text-xs"
      Icon={
        viewMode === 'review' ? (
          <LayoutList className="size-3" />
        ) : (
          <CornerDownLeft className="size-3" />
        )
      }
      variant="outline"
    >
      {viewMode === 'review' ? t('information.kycOverview') : t('common.back')}
    </RrhButton>
  );
}
