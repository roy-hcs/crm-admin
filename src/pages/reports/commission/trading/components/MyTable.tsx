import { TradingItem } from '@/api/hooks/report/types';
import { DataTable, CRMColumnDef } from '@/components/table/DataTable';
import { useTranslation } from 'react-i18next';

export const MyTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: TradingItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const Columns: CRMColumnDef<TradingItem, unknown>[] = [
    {
      fixed: true,
      size: 50,
      id: 'No.',
      header: t('ib.overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'serverName',
      fixed: true,
      size: 180,
      header: t('commission.trading.serverName'),
      accessorFn: row => row.serverName,
    },
    {
      id: 'mtOrder',
      size: 180,
      header: t('commission.trading.mtOrder'),
      accessorFn: row => row.mtOrder,
    },
    {
      id: 'login',
      size: 180,
      header: t('commission.trading.login'),
      accessorFn: row => row.login,
    },
    {
      accessorKey: 'symbol',
      size: 180,
      header: t('commission.trading.symbol'),
      accessorFn: row => row.symbol,
    },
    {
      accessorKey: 'volume',
      size: 180,
      header: t('commission.trading.volume'),
      accessorFn: row => row.volume,
    },
    {
      accessorKey: 'traderTime',
      size: 180,
      header: t('commission.trading.traderTime'),
      accessorFn: row => row.traderTime,
    },
    {
      accessorKey: 'userName',
      size: 180,
      header: t('commission.trading.userName'),
      cell: ({ row }) => (
        <div>
          <div>{row.original.userName}</div>
          <div>{row.original.showId}</div>
        </div>
      ),
    },
    {
      accessorKey: 'rebateTotalAmt',
      size: 180,
      header: t('commission.trading.rebateTotalAmt'),
      cell: ({ row }) => (
        <div>
          <div>{(row.original.rebateTotalAmt || '') + (row.original.currency || '')}</div>
          <div>
            {(row.original.rebateFixedAmt || '') + '+' + (row.original.rebatePointsAmt || '')}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'rebateAccountName',
      size: 180,
      header: t('commission.trading.rebateAccountName'),
      accessorFn: row => row.rebateAccountName,
    },
    {
      accessorKey: 'rebateTime',
      size: 180,
      header: t('commission.trading.rebateTime'),
      accessorFn: row => row.rebateTime,
    },
    {
      accessorKey: 'rebateTraderName',
      size: 180,
      header: t('commission.trading.rebateTraderName'),
      accessorFn: row => row.rebateTraderName,
    },
  ];
  return (
    <DataTable
      columns={Columns}
      data={data}
      pageCount={pageCount}
      pageIndex={pageIndex}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      loading={loading}
      thCls="text-left"
      tdCls="text-left"
    />
  );
};
