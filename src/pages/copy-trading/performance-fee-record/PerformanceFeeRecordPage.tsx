import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PerformanceFeeRecordTable } from './PerformanceFeeRecordTable';
import { PerformanceFeeRecordForm } from './PerformanceFeeRecordForm';
import { BasicParams } from '@/api/types';
import { usePerformanceFeeList } from '@/api/hooks/copyTrading';
import { PerformanceFeeListParams } from '@/api/hooks/copyTrading/type';

export const PerformanceFeeRecordPage = () => {
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('');
  const [orderByColumn, setOrderByColumn] = useState<string>('');
  const [params, setParams] = useState<PerformanceFeeListParams['params']>({
    signalSourceOwner: '',
    follower: '',
    beginTime: '',
    endTime: '',
    beginPayTime: '',
    endPayTime: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<PerformanceFeeListParams, 'params' | keyof BasicParams>
  >({
    signalSourceName: '',
    traderServerId: '',
    trader: '',
    client: '',
    payStatus: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();

  const { data: data, isLoading: loading } = usePerformanceFeeList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: orderByColumn,
    isAsc: isAsc,
    ...otherParams,
    params,
  });

  const reset = () => {
    setParams(pre => ({
      ...pre,
      signalSourceOwner: '',
      follower: '',
      beginTime: '',
      endTime: '',
      beginPayTime: '',
      endPayTime: '',
    }));
    setOtherParams(pre => ({
      ...pre,
      signalSourceName: '',
      traderServerId: '',
      trader: '',
      client: '',
      payStatus: '',
    }));
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('performanceFeeRecord.title')}</h1>
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('signals.name') })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setOtherParams(prev => ({ ...prev, signalSourceName: e }));
            setPageNum(0);
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
            <PerformanceFeeRecordForm
              setParams={setParams}
              setOtherParams={setOtherParams}
              loading={loading}
            />
          </RrhDrawer>
        </div>
      </div>
      <PerformanceFeeRecordTable
        data={data?.rows || []}
        pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        setIsAsc={setIsAsc}
        isAsc={isAsc}
        orderByColumn={orderByColumn}
        setOrderByColumn={setOrderByColumn}
        loading={loading}
      />
    </div>
  );
};
