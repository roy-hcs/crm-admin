import { PerformanceFeeRebateVerifyItem } from '@/api/hooks/copyTrading/type';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhSorter } from '@/components/common/RrhSorter';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useTabActions } from '@/hooks/useTabActions';
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { statusOptions } from './data';

export function PerformanceFeeRebateVerifyTable({
  data,
  loading,
  pageNum,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isAsc,
  orderByColumn,
  setIsAsc,
  setOrderByColumn,
}: {
  data: { rows?: PerformanceFeeRebateVerifyItem[]; total?: number | string } | undefined;
  loading: boolean;
  pageNum: number;
  pageSize: number;
  onPageChange: (pageNum: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  setIsAsc: Dispatch<SetStateAction<'asc' | 'desc' | ''>>;
  isAsc: 'asc' | 'desc' | '';
  orderByColumn: string;
  setOrderByColumn: Dispatch<SetStateAction<string>>;
}) {
  const { t } = useTranslation();

  const { openTab } = useTabActions();

  const goToDetail = useCallback(
    (row: PerformanceFeeRebateVerifyItem) => {
      const type = [0, 1].includes(Number(row.status)) ? 'audit' : 'detail';
      const url = `/copy-trading/performance-fee-rebate/verify-detail?type=${type}&id=${row.id}`;
      openTab({
        key: url,
        title: t('performanceFeeRebatePage.performanceFeeDetail'),
        path: url,
      });
    },
    [openTab, t],
  );

  const columns = useMemo<CRMColumnDef<PerformanceFeeRebateVerifyItem, unknown>[]>(
    () => [
      {
        id: 'orderNo',
        header: t('table.orderNumber'),
        cell: ({ row }) => row.original.orderNo || '-',
      },
      {
        id: 'signalSourceName',
        header: t('signals.name'),
        cell: ({ row }) => {
          return (
            <div>
              <div>{row.original.signalSourceName || '-'}</div>
              <div>{(row.original.traderServer || '') + '-' + (row.original.trader || '')}</div>
            </div>
          );
        },
      },
      {
        id: 'userName',
        header: t('table.subscriptionUsers'),
        cell: ({ row }) => {
          return (
            <div>
              <div>{row.original.userName || '-'}</div>
              <div>{row.original.clientShowId || '-'}</div>
            </div>
          );
        },
      },
      {
        id: 'clientServer',
        header: t('table.tradingAccount'),
        cell: ({ row }) => {
          return (
            <div>
              <div>{row.original.clientServer || '-'}</div>
              <div>{row.original.client || '-'}</div>
            </div>
          );
        },
      },
      {
        id: 'userShowId',
        header: t('rewardRecords.rewardTarget'),
        cell: ({ row }) => {
          return (
            <div>
              <div>{row.original.userName || '-'}</div>
              <div>{row.original.userShowId || '-'}</div>
            </div>
          );
        },
      },
      {
        id: 'netPerformanceFee',
        header: () => {
          return (
            <div className="flex items-center justify-between gap-2">
              <div>{t('table.netPerformanceFee')}</div>
              <RrhSorter
                isAsc={isAsc}
                setIsAsc={setIsAsc}
                setOrderByColumn={setOrderByColumn}
                orderByColumn={orderByColumn}
                column="netPerformanceFee"
              />
            </div>
          );
        },
        cell: ({ row }) => `${row.original.netPerformanceFee || 0} ${row.original.currency || ''}`,
      },
      {
        id: 'baseRebateRatio',
        header: () => {
          return (
            <div className="flex items-center justify-between gap-2">
              <div>{t('table.baseRebateRatio')}</div>
              <RrhSorter
                isAsc={isAsc}
                setIsAsc={setIsAsc}
                setOrderByColumn={setOrderByColumn}
                orderByColumn={orderByColumn}
                column="baseRebateRatio"
              />
            </div>
          );
        },
        cell: ({ row }) => `${row.original.baseRebateRatio || 0}%`,
      },
      {
        id: 'extraRebateRatio',
        header: () => {
          return (
            <div className="flex items-center justify-between gap-2">
              <div>{t('table.extraRebateRatio')}</div>
              <RrhSorter
                isAsc={isAsc}
                setIsAsc={setIsAsc}
                setOrderByColumn={setOrderByColumn}
                orderByColumn={orderByColumn}
                column="extraRebateRatio"
              />
            </div>
          );
        },
        cell: ({ row }) => `${row.original.extraRebateRatio || 0}%`,
      },
      {
        id: 'rebateAmount',
        header: () => {
          return (
            <div className="flex items-center justify-between gap-2">
              <div>{t('performanceFeeRebatePage.rebateAmount')}</div>
              <RrhSorter
                isAsc={isAsc}
                setIsAsc={setIsAsc}
                setOrderByColumn={setOrderByColumn}
                orderByColumn={orderByColumn}
                column="rebateAmount"
              />
            </div>
          );
        },
        cell: ({ row }) => row.original.rebateAmount || 0,
      },
      {
        id: 'createTime',
        header: () => {
          return (
            <div className="flex items-center justify-between gap-2">
              <div>{t('common.createTime')}</div>
              <RrhSorter
                isAsc={isAsc}
                setIsAsc={setIsAsc}
                setOrderByColumn={setOrderByColumn}
                orderByColumn={orderByColumn}
                column="createTime"
              />
            </div>
          );
        },
        cell: ({ row }) => row.original.createTime || '-',
      },
      {
        id: 'status',
        header: () => {
          return (
            <div className="flex items-center justify-between gap-2">
              <div>{t('table.status')}</div>
              <RrhSorter
                isAsc={isAsc}
                setIsAsc={setIsAsc}
                setOrderByColumn={setOrderByColumn}
                orderByColumn={orderByColumn}
                column="status"
              />
            </div>
          );
        },
        cell: ({ row }) => {
          const text = statusOptions.find(i => String(i.value) === String(row.original.payStatus));
          return text?.label ? t(text.label) : '-';
        },
      },
      {
        id: 'verifyUserName',
        header: t('table.verifyUser'),
        cell: ({ row }) => row.original.verifyUserName || '-',
      },
      {
        id: 'verifyTime',
        header: () => {
          return (
            <div className="flex items-center justify-between gap-2">
              <div>{t('table.verifyTime')}</div>
              <RrhSorter
                isAsc={isAsc}
                setIsAsc={setIsAsc}
                setOrderByColumn={setOrderByColumn}
                orderByColumn={orderByColumn}
                column="verifyTime"
              />
            </div>
          );
        },
        cell: ({ row }) => row.original.verifyTime || '-',
      },
      {
        id: 'performanceFeeOrderNo',
        header: t('performanceFeeRebatePage.performanceFeeOrderNo'),
        cell: ({ row }) => row.original.performanceFeeOrderNo || '-',
      },
      {
        id: 'operation',
        header: () => {
          return <div className="flex justify-center">{t('common.Operation')}</div>;
        },
        label: t('common.Operation'),
        cell: ({ row }) => (
          <RrhButton variant="ghost" onClick={() => goToDetail(row.original)}>
            {[0, 1].includes(Number(row?.original?.status)) ? t('table.audit') : t('common.View')}
          </RrhButton>
        ),
        fixed: 'right',
        size: 50,
      },
    ],
    [t, isAsc, setIsAsc, setOrderByColumn, orderByColumn, goToDetail],
  );

  return (
    <DataTable
      columns={columns}
      data={data?.rows || []}
      pageCount={Math.ceil(Number(data?.total || 0) / pageSize)}
      pageIndex={pageNum}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      loading={loading}
    />
  );
}
