import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PointsBalanceTable } from './PointsBalanceTable';
import { PointsBalanceForm } from './PointsBalanceForm';
import { usePointsBalance, PointsBalanceParams } from '@/api/hooks/pointsMall';

export const PointsBalancePage = () => {
  const [params, setParams] = useState<PointsBalanceParams['params']>({
    fuzzyName: '',
    email: '',
    timeStart: '',
    timeEnd: '',
  });
  const [isAsc, setIsAsc] = useState<'asc' | 'desc'>('asc');
  const [orderByColumn, setOrderByColumn] = useState<
    'pointsBalance' | 'earnPoints' | 'usedPoints' | ''
  >('');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();

  const { data: data, isLoading: loading } = usePointsBalance({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn,
    isAsc,
    params,
  });

  const reset = () => {
    setParams(pre => ({
      ...pre,
      fuzzyName: '',
      email: '',
      timeStart: '',
      timeEnd: '',
    }));
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('pointspBalance.title')}</h1>
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('table.nameOrId') })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setParams(prev => ({ ...prev, fuzzyName: e }));
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
            direction="right"
            footerShow={false}
            Trigger={
              <RrhButton variant="ghost" className="size-8">
                <Funnel />
              </RrhButton>
            }
          >
            <PointsBalanceForm setParams={setParams} loading={loading} />
          </RrhDrawer>
        </div>
      </div>
      <PointsBalanceTable
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
