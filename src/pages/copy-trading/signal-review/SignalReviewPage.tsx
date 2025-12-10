import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SignalReviewTable } from './SignalReviewTable';
import { SignalReviewForm } from './SignalReviewForm';
import { BasicParams } from '@/api/types';
import { useMamSignalSourceVerifyList } from '@/api/hooks/copyTrading';
import {
  MamSignalSourceVerifyListParams,
  signalReviewOrderByColumn,
} from '@/api/hooks/copyTrading/type';

export const SignalReviewPage = () => {
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('');
  const [orderByColumn, setOrderByColumn] = useState<string | signalReviewOrderByColumn>('');
  const [params, setParams] = useState<MamSignalSourceVerifyListParams['params']>({
    beginTime: '',
    endTime: '',
    beginReviewTime: '',
    endReviewTime: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<MamSignalSourceVerifyListParams, 'params' | keyof BasicParams>
  >({
    name: '',
    userName: '',
    serverId: '',
    account: '',
    verifyStatus: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();

  const { data: data, isLoading: loading } = useMamSignalSourceVerifyList({
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
      beginTime: '',
      endTime: '',
      beginReviewTime: '',
      endReviewTime: '',
    }));
    setOtherParams(pre => ({
      ...pre,
      name: '',
      userName: '',
      serverId: '',
      account: '',
      verifyStatus: '',
    }));
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('signalReview.title')}</h1>
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('signals.name') })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setOtherParams(prev => ({ ...prev, name: e }));
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
            <SignalReviewForm
              setParams={setParams}
              setOtherParams={setOtherParams}
              loading={loading}
            />
          </RrhDrawer>
        </div>
      </div>
      <SignalReviewTable
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
