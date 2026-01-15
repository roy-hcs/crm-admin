import { DepositDetail } from '@/api/hooks/review';
import { RrhCard } from '@/components/common/RrhCard';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { LabelItem } from '@/components/common/LabelItem';
import { InfoItem } from '@/components/common/InfoItem';

export const PersonalInfoCard = ({
  depositInfo,
  roleName,
  lastLoginTime,
}: {
  depositInfo: DepositDetail;
  roleName: string;
  lastLoginTime: string;
}) => {
  const { t } = useTranslation();
  const [folded, setFolded] = useState(true);
  return (
    <RrhCard className="mb-3 md:mb-6">
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          folded ? 'max-h-16' : 'max-h-screen',
        )}
      >
        <div className="py-3">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <a href="#">
                <h2 className="text-primary text-lg font-semibold"> {depositInfo.userName}</h2>
              </a>
              <Badge variant="secondary">{roleName}</Badge>
            </div>
            <RrhButton variant="outline" className="size-6" onClick={() => setFolded(!folded)}>
              <ChevronUp className={cn('size-4 duration-200', folded ? '' : 'rotate-180')} />
            </RrhButton>
          </div>
          <div className="text-muted-foreground line-clamp-1 overflow-ellipsis whitespace-nowrap">
            <span>{depositInfo.userShowId}</span>
            {depositInfo.userLastName && depositInfo.userName && <span> | </span>}
            <span title={depositInfo.userLastName + depositInfo.userName}>
              {depositInfo.userLastName + depositInfo.userName}
            </span>
          </div>
        </div>
        <LabelItem label={t('review.latestLogin')} ContentDom={<InfoItem info={lastLoginTime} />} />
      </div>
    </RrhCard>
  );
};
