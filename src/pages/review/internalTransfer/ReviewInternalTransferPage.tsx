import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Funnel, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InternalTransferListParams } from '@/api/hooks/review/types';
import { useInternalTransferList } from '@/api/hooks/review/review';
import { ReviewInternalTransferForm } from './ReviewInternalTransferForm';
import { ReviewInternalTransferTable } from './ReviewInternalTransferTable';

export const ReviewInternalTransferPage = () => {
  const [params, setParams] = useState<InternalTransferListParams['params']>({
    fuzzyStartTime: '',
    fuzzyEndTime: '',
    fuzzyOutAccount: '',
    fuzzyInAccount: '',
  });
  const [otherParams, setOtherParams] = useState<Omit<InternalTransferListParams, 'params'>>({
    userId: '',
    status: '',
    verifyUserName: '',
    dealTicket: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();

  const { data: internalTransferList, isLoading: internalTransferListLoading } =
    useInternalTransferList(
      {
        pageSize,
        pageNum: pageNum + 1,
        orderByColumn: 'status desc,subTime desc',
        isAsc: '',
        ...otherParams,
        params: {
          ...params,
        },
      },
      { enabled: true },
    );
  const reset = () => {
    setParams({
      fuzzyStartTime: '',
      fuzzyEndTime: '',
      fuzzyOutAccount: '',
      fuzzyInAccount: '',
    });
    setOtherParams({
      userId: '',
      status: '',
      verifyUserName: '',
      dealTicket: '',
    });
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('internalTransferReview.title')}</h1>
      <div className="my-3.5 flex justify-end gap-2">
        <RrhButton variant="outline">{t('table.export')}</RrhButton>
        <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
          <RefreshCcw className="size-3.5" />
        </RrhButton>
        <RrhDrawer
          headerShow={false}
          asChild
          direction="right"
          footerShow={false}
          Trigger={
            <RrhButton variant="ghost" className="size-8">
              <Funnel />
            </RrhButton>
          }
        >
          <ReviewInternalTransferForm
            setParams={setParams}
            setOtherParams={setOtherParams}
            loading={internalTransferListLoading}
          />
        </RrhDrawer>
      </div>
      <ReviewInternalTransferTable
        data={internalTransferList?.rows || []}
        pageCount={Math.ceil(+(internalTransferList?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={internalTransferListLoading}
      />
    </div>
  );
};
