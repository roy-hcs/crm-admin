import { useCrmInfoVerifyDetailQuery } from '@/api/hooks/review/review';
import { PageInfo } from '@/components/common/PageInfo';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { StatusList, StatusListType } from './components/StatusList';
import { KycInfoPage } from '../account-opening-detail/kyc-info/KycInfoPage';
import { KycReview } from './components/KycReview';
import { Customer } from '../account-opening-detail/components/Customer';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { InformationDetailViewMode, ViewModeToggle } from './components/ViewModeToggle';
import { buildInformationStatusList } from './informationDetailMappers';
import { toast } from 'sonner';

export function InformationDetailPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');
  const sumsubId = searchParams.get('sumsubId');
  const infoType = searchParams.get('infoType');
  const detailId = id || '';
  const detailUserId = userId || '';

  const {
    data: detailData,
    isLoading,
    isFetching,
    refetch,
    isError,
    errorUpdatedAt,
  } = useCrmInfoVerifyDetailQuery(
    {
      id: detailId,
      userId: detailUserId,
      infoType: infoType || undefined,
      status,
      sumsubId,
    },
    {
      enabled: Boolean(detailId),
    },
  );

  const lastHandledErrorAtRef = useRef(0);

  useEffect(() => {
    if (isError && errorUpdatedAt > lastHandledErrorAtRef.current) {
      lastHandledErrorAtRef.current = errorUpdatedAt;
      toast.error(t('common.AnErrorOccurred'));
    }
  }, [errorUpdatedAt, isError, t]);

  const loadDetail = useCallback(() => {
    void refetch();
  }, [refetch]);

  const istatus = detailData?.istatus;
  const pstatus = detailData?.pstatus;
  const fstatus = detailData?.fstatus;
  const bstatus = detailData?.bstatus;
  const [viewMode, setViewMode] = useState<InformationDetailViewMode>('review');
  const statusList: StatusListType = useMemo(
    () =>
      buildInformationStatusList(t, {
        pstatus,
        fstatus,
        istatus,
        bstatus,
      }),
    [bstatus, fstatus, istatus, pstatus, t],
  );

  if (isLoading) {
    return (
      <div className="h-100">
        <RrhCircleLoading />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-6">
        <PageInfo title={t('information.kycReview')} />
        <div className="flex items-center gap-3">
          {isFetching && !isLoading ? (
            <div className="text-muted-foreground text-xs">{t('common.loading')}</div>
          ) : null}
          <ViewModeToggle
            viewMode={viewMode}
            onToggle={() => setViewMode(current => (current === 'review' ? 'overview' : 'review'))}
          />
        </div>
      </div>
      <div className="pt-3 pb-6">
        <StatusList status={statusList} />
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:gap-8">
        <div className="flex flex-1 flex-col items-start">
          {viewMode === 'review' ? (
            <KycReview
              onSuccess={loadDetail}
              id={detailId}
              infoDetails={detailData?.infoDetails || []}
            />
          ) : (
            <KycInfoPage id={detailUserId} />
          )}
        </div>
        <div className="relative md:w-93.5">
          <div className="sticky top-0">
            <Customer id={detailUserId} />
          </div>
        </div>
      </div>
    </div>
  );
}
