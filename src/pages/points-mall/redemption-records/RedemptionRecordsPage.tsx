import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RedemptionRecordsTable } from './RedemptionRecordsTable';
import { RedemptionRecordsForm } from './RedemptionRecordsForm';
import { usePointsHistoryList, PointsHistoryListParams } from '@/api/hooks/pointsMall';

export const RedemptionRecordsPage = () => {
  const [params, setParams] = useState<PointsHistoryListParams['params']>({
    fuzzyName: '',
    fuzzyEmail: '',
    fuzzyGoods: '',
    verifyStatus: '',
    exchangeTimeStart: '',
    exchangeTimeEnd: '',
    updateTimeStart: '',
    updateTimeEnd: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<PointsHistoryListParams, 'params' | 'pageSize' | 'pageNum' | 'orderByColumn' | 'isAsc'>
  >({
    payType: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const { data: data, isLoading: loading } = usePointsHistoryList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
    params,
  });

  const reset = () => {
    setParams(pre => ({
      ...pre,
      goodsName: '',
    }));
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('redemptionRecords.title')}</h1>
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('table.nameOrId') })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setParams(prev => ({ ...prev, fuzzyName: e }));
            setPageNum(1);
          }}
        />
        <div className="flex justify-end gap-2">
          <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
            <RefreshCcw className="size-3.5" />
          </RrhButton>
          <RrhDrawer
            headerShow={false}
            asChild
            responsiveDirection={{
              mobile: 'bottom',
              desktop: 'right',
            }}
            footerShow={false}
            Trigger={
              <RrhButton variant="ghost" className="size-8">
                <Funnel />
              </RrhButton>
            }
          >
            <RedemptionRecordsForm
              setParams={setParams}
              setOtherParams={setOtherParams}
              loading={loading}
            />
          </RrhDrawer>
        </div>
      </div>
      <RedemptionRecordsTable
        data={data?.rows || []}
        pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={loading}
      />
    </div>
  );
};
