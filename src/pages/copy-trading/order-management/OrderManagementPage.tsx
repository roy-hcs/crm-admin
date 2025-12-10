import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OrderManagementTable } from './OrderManagementTable';
import { OrderManagementForm } from './OrderManagementForm';
import { BasicParams } from '@/api/types';
import { useMamFollowList } from '@/api/hooks/copyTrading';
import { MamFollowListParams } from '@/api/hooks/copyTrading/type';
import { TableCell } from '@/components/ui/table';

export const OrderManagementPage = () => {
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('');
  const [orderByColumn, setOrderByColumn] = useState<string>('');
  const [params, setParams] = useState<MamFollowListParams['params']>({
    signalSourceOwner: '',
    beginTime: '',
    endTime: '',
    beginArrivalTime: '',
    endArrivalTime: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<MamFollowListParams, 'params' | keyof BasicParams>
  >({
    signalSourceName: '',
    userName: '',
    traderServerId: '',
    trader: '',
    client: '',
    arrivalStatus: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();

  const { data: data, isLoading: loading } = useMamFollowList({
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
      beginTime: '',
      endTime: '',
      beginArrivalTime: '',
      endArrivalTime: '',
    }));
    setOtherParams(pre => ({
      ...pre,
      signalSourceName: '',
      userName: '',
      traderServerId: '',
      trader: '',
      client: '',
      arrivalStatus: '',
    }));
    setPageNum(0);
  };

  const totalList = useMemo(() => {
    return data?.totalList?.[0];
  }, [data]);
  return (
    <div>
      <h1 className="text-title">{t('orderManagementTable.title')}</h1>
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
            <OrderManagementForm
              setParams={setParams}
              setOtherParams={setOtherParams}
              loading={loading}
            />
          </RrhDrawer>
        </div>
      </div>
      <OrderManagementTable
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
        CustomRow={
          <>
            <TableCell colSpan={4}>{t('table.total')}</TableCell>
            {loading ? (
              <TableCell>{t('common.loading')}</TableCell>
            ) : (
              <>
                <TableCell colSpan={1}>
                  <div>{(Number(totalList?.totalSubscribeFee) || 0).toFixed(2)}</div>
                </TableCell>
                <TableCell colSpan={10}>
                  <div>{(Number(totalList?.totalEstimatedManagementFee) || 0).toFixed(2)}</div>
                </TableCell>
                <TableCell colSpan={1}>
                  <div>{(Number(totalList?.totalActualSubscribeFee) || 0).toFixed(2)}</div>
                </TableCell>
                <TableCell colSpan={1}>
                  <div>{(Number(totalList?.totalManagementFee) || 0).toFixed(2)}</div>
                </TableCell>
              </>
            )}
          </>
        }
      />
    </div>
  );
};
