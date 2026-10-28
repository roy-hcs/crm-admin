import { TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IpWarningDetailDialog } from './IpWarningDetailDialog';

export const IpWarningBanner = ({
  withdrawalId,
  ip,
  count,
}: {
  withdrawalId: string;
  ip?: string;
  count?: number;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mb-3 flex flex-col gap-2 rounded-[10px] border border-[#FFD591] bg-[#FFFBE6] px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <TriangleAlert className="size-4 shrink-0 text-[#FA8C16]" />
            <span className="text-sm font-semibold text-[#FA8C16]">
              {t('review.ipWarning.tag')}
            </span>
            <span className="rounded-full border border-[#FFD591] bg-white/60 px-2 py-0.5 text-xs text-[#FA8C16]">
              {t('review.ipWarning.otherUsersChip', { count: count ?? 0 })}
            </span>
          </div>
          <span className="text-muted-foreground text-xs break-all">
            {t('review.ipWarning.descPrefix')} {ip || '-'} {t('review.ipWarning.descSuffix')}
          </span>
        </div>
        <button
          type="button"
          className="text-primary shrink-0 self-start text-sm hover:underline sm:self-auto"
          onClick={() => setOpen(true)}
        >
          {t('review.ipWarning.viewDetail')}
        </button>
      </div>
      <IpWarningDetailDialog open={open} onOpenChange={setOpen} withdrawalId={withdrawalId} />
    </>
  );
};
