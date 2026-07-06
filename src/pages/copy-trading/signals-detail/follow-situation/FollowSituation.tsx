import { useMamFollowListByTrader } from '@/api/hooks/copyTrading';
import { MamFollowItem } from '@/api/hooks/copyTrading/type';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { RrhButton } from '@/components/common/RrhButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { RefreshCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OrderDetailDialog } from '@/pages/copy-trading/order-management/components/OrderDetailDialog';

export function FollowSituation({
  traderServerId,
  trader,
}: {
  traderServerId: string;
  trader: string;
}) {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailId, setDetailId] = useState('');

  const { data, isLoading } = useMamFollowListByTrader(
    {
      pageSize,
      pageNum: pageNum + 1,
      orderByColumn: '',
      isAsc: 'asc',
      yieldDateRange: '30',
    },
    {
      traderServerId,
      trader,
    },
  );

  const columns = useMemo<CRMColumnDef<MamFollowItem, unknown>[]>(
    () => [
      {
        id: 'client',
        header: t('signals.followTable.tradingAccount'),
        accessorFn: row => row.client || '-',
      },
      {
        id: 'userName',
        header: t('signals.followTable.belongUser'),
        accessorFn: row => row.userName || '-',
      },
      {
        id: 'historyProfit',
        header: t('signals.followTable.followProfit'),
        accessorFn: row => row.historyProfit || '-',
      },
      {
        id: 'historyNum',
        header: t('signals.followTable.followOrderCount'),
        accessorFn: row => row.historyNum || '-',
      },
      {
        id: 'direction',
        header: t('signals.followTable.followDirection'),
        accessorFn: row => {
          if (row.direction === 1) return t('signals.directionOptions.1');
          if (row.direction === 2) return t('signals.directionOptions.2');
          return '-';
        },
      },
      {
        id: 'followType',
        header: t('signals.followTable.followType'),
        accessorFn: row => {
          if (!row.followType) return '-';
          if (row.followType === '1') return t('copyTradingSettings.trackingMethodOptions.1');
          if (row.followType === '2') return t('copyTradingSettings.trackingMethodOptions.2');
          if (row.followType === '3') return t('copyTradingSettings.trackingMethodOptions.3');
          return row.followType || '-';
        },
      },
      {
        id: 'status',
        header: t('table.status'),
        accessorFn: row => {
          if (row.status === 0) return t('signals.statusOptions.0');
          if (row.status === 1) return t('signals.statusOptions.1');
          return '-';
        },
      },
      {
        id: 'followDays',
        header: t('signals.followTable.followDuration'),
        accessorFn: row =>
          row.followDays === null || row.followDays === undefined ? '-' : row.followDays,
      },
      {
        id: 'operation',
        header: t('signals.followTable.operation'),
        cell: ({ row }) => (
          <RrhButton
            variant="ghost"
            onClick={() => {
              setDetailId(String(row.original.id || ''));
              setDetailOpen(true);
            }}
          >
            {t('common.View')}
          </RrhButton>
        ),
      },
    ],
    [t],
  );

  const {
    visibleColumns,
    toggleColumn,
    batchUpdateColumns,
    columns: allColumns,
    tableColumns,
    columnMeta,
  } = useColumnVisibility('signals-follow-situation-table', columns);

  const reset = () => {
    setPageNum(0);
    setPageSize(10);
  };

  return (
    <TableContentWrapper className="max-w-full min-w-0 overflow-hidden">
      <div className="mb-3 flex items-center justify-end gap-2">
        <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
          <RefreshCcw className="size-3.5" />
        </RrhButton>
        <ColumnVisibilityButton
          columnMeta={columnMeta}
          visibleColumns={visibleColumns}
          onToggle={toggleColumn}
          onBatchReorder={batchUpdateColumns}
          columns={allColumns}
        />
      </div>
      <div className="min-w-0 overflow-x-auto">
        <div className="min-w-max">
          <DataTable
            columns={tableColumns}
            data={data?.rows || []}
            pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
            pageIndex={pageNum}
            pageSize={pageSize}
            onPageChange={setPageNum}
            onPageSizeChange={setPageSize}
            loading={isLoading}
          />
        </div>
      </div>
      <OrderDetailDialog open={detailOpen} setOpen={setDetailOpen} id={detailId} />
    </TableContentWrapper>
  );
}
