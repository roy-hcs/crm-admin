import { AccountStatisticListItem } from '@/api/hooks/report/types';
import { ServerItem } from '@/api/hooks/system/types';
import { DataTable } from '@/components/table/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

const formatVolume = (serverType: number | undefined, volume: number) => {
  if (serverType == 1) {
    //MT5
    return (volume / 10000).toFixed(2);
  } else if (serverType == 2) {
    return (volume / 100).toFixed(2);
  } else {
    return volume.toFixed(2);
  }
};
export const StatisticTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  CustomRow,
  selectedServer,
}: {
  data: AccountStatisticListItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  CustomRow: ReactElement;
  selectedServer: ServerItem | undefined;
}) => {
  const { t } = useTranslation();
  const serviceType = selectedServer?.serviceType;
  const statisticColumns: ColumnDef<AccountStatisticListItem>[] = [
    {
      id: 'No.',
      header: t('CRMAccountPage.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'userName',
      header: t('CRMAccountPage.UserName'),
      accessorFn: row => row.name,
    },
    {
      id: 'login',
      header: t('table.tradingAccount'),
      accessorFn: row => row.login,
    },
    {
      id: 'totalOrders',
      header: t('table.tradingOrdersTotal'),
      accessorFn: row => row.countOrder,
    },
    {
      id: 'closeLots',
      header: t('table.closeLots'),
      cell: ({ row }) => {
        const rowData = row.original;
        return rowData.historyVolume ? (
          <div>{formatVolume(serviceType, rowData.historyVolume)} </div>
        ) : (
          <div>-</div>
        );
      },
    },
    {
      id: 'openLots',
      header: t('table.openLots'),
      cell: ({ row }) => {
        const rowData = row.original;
        return rowData.positionVolume ? (
          <div>{formatVolume(serviceType, rowData.positionVolume)} </div>
        ) : (
          <div>-</div>
        );
      },
    },
    {
      id: 'commission',
      header: t('table.commission'),
      cell: ({ row }) => {
        return <div>{(row.original.countCommission || 0).toFixed(2)}</div>;
      },
    },
    {
      id: 'swap',
      header: t('table.swap'),
      cell: ({ row }) => {
        return <div>{(row.original.countSwaps || 0).toFixed(2)}</div>;
      },
    },
    {
      id: 'closedPosition',
      header: t('table.closedPosition'),
      cell: ({ row }) => {
        return <div>{(row.original.countProfit || 0).toFixed(2)}</div>;
      },
    },
    {
      id: 'currentBalance',
      header: t('table.currentBalance'),
      cell: ({ row }) => {
        return (
          <div>
            {(row.original.balance || 0).toFixed(2)} {row.original.currency}
          </div>
        );
      },
    },
  ];
  return (
    <DataTable
      columns={statisticColumns}
      data={data}
      pageCount={pageCount}
      pageSize={pageSize}
      pageIndex={pageIndex}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      loading={loading}
      CustomRow={CustomRow}
    />
  );
};
