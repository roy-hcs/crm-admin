import {
  MamSignalFundHistoryItem,
  MamSignalFundHistoryParams,
  MamSignalPositionOrderItem,
  MamSignalPositionOrderParams,
} from '@/api/hooks/copyTrading/type';
import { useMamSignalFundHistory, useMamSignalPositionOrder } from '@/api/hooks/copyTrading';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { formatDate } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ActiveTable,
  SearchFormValues,
  TradeOrdersSwitchTables,
} from './components/TradeOrdersSwitchTables';
import { getTradeTypeLabel } from './components/getTradeTypeLabel';

export function SignalTradeOrders({ accountId, trader }: { accountId: string; trader: string }) {
  const { t } = useTranslation();
  const [activeTable, setActiveTable] = useState<ActiveTable>('position');

  const [positionPageNum, setPositionPageNum] = useState(0);
  const [positionPageSize, setPositionPageSize] = useState(10);
  const [historyPageNum, setHistoryPageNum] = useState(0);
  const [historyPageSize, setHistoryPageSize] = useState(10);

  const [positionParams, setPositionParams] = useState<MamSignalPositionOrderParams>({
    pageSize: 10,
    pageNum: 1,
    orderByColumn: '',
    isAsc: 'asc',
    params: {
      positionDealBJStartTime: '',
      positionDealBJEndTime: '',
    },
  });

  const [historyParams, setHistoryParams] = useState<MamSignalFundHistoryParams>({
    pageSize: 10,
    pageNum: 1,
    orderByColumn: '',
    isAsc: 'asc',
    params: {
      historyDealCloseTimeStart: '',
      historyDealCloseTimeEnd: '',
    },
  });

  const form = useForm<SearchFormValues>({
    defaultValues: {
      positionTime: { from: '', to: '' },
      historyTime: { from: '', to: '' },
    },
  });

  const { data: positionData, isLoading: positionLoading } = useMamSignalPositionOrder(
    accountId,
    {
      ...positionParams,
      pageSize: positionPageSize,
      pageNum: positionPageNum + 1,
    },
    { enabled: activeTable === 'position' },
  );

  const { data: historyData, isLoading: historyLoading } = useMamSignalFundHistory(
    accountId,
    {
      ...historyParams,
      pageSize: historyPageSize,
      pageNum: historyPageNum + 1,
    },
    { enabled: activeTable === 'history' },
  );

  const onSubmit = (values: SearchFormValues) => {
    if (activeTable === 'position') {
      setPositionPageNum(0);
      setPositionParams(prev => ({
        ...prev,
        params: {
          positionDealBJStartTime: formatDate(values.positionTime.from),
          positionDealBJEndTime: formatDate(values.positionTime.to),
        },
      }));
      return;
    }

    setHistoryPageNum(0);
    setHistoryParams(prev => ({
      ...prev,
      params: {
        historyDealCloseTimeStart: formatDate(values.historyTime.from),
        historyDealCloseTimeEnd: formatDate(values.historyTime.to),
      },
    }));
  };

  const onReset = () => {
    if (activeTable === 'position') {
      setPositionPageNum(0);
      setPositionPageSize(10);
      setPositionParams(prev => ({
        ...prev,
        pageSize: 10,
        pageNum: 1,
        orderByColumn: '',
        isAsc: 'asc',
        params: {
          positionDealBJStartTime: '',
          positionDealBJEndTime: '',
        },
      }));

      form.setValue('positionTime', { from: '', to: '' });
      return;
    }

    setHistoryPageNum(0);
    setHistoryPageSize(10);
    setHistoryParams(prev => ({
      ...prev,
      pageSize: 10,
      pageNum: 1,
      orderByColumn: '',
      isAsc: 'asc',
      params: {
        historyDealCloseTimeStart: '',
        historyDealCloseTimeEnd: '',
      },
    }));

    form.setValue('historyTime', { from: '', to: '' });
  };

  const positionColumns = useMemo<CRMColumnDef<MamSignalPositionOrderItem, unknown>[]>(
    () => [
      {
        id: 'ticket',
        header: t('table.orderNumber'),
        accessorFn: row => row.ticket || '-',
      },
      {
        id: 'time',
        header: t('table.time'),
        accessorFn: row => row.time || '-',
      },
      {
        id: 'signalSource',
        header: t('signals.tradeOrders.signalSource'),
        accessorFn: row => row.login || trader || '-',
      },
      {
        id: 'type',
        header: t('table.transactionType'),
        accessorFn: row => getTradeTypeLabel(row.type, t),
      },
      {
        id: 'volume',
        header: t('table.volume'),
        accessorFn: row => row.volume || '-',
      },
      {
        id: 'symbol',
        header: t('table.symbol'),
        accessorFn: row => row.symbol || '-',
      },
      {
        id: 'price',
        header: t('table.price'),
        accessorFn: row => row.price || '-',
      },
      {
        id: 'profit',
        header: t('table.profitAndLoss'),
        accessorFn: row => row.profit || '-',
      },
    ],
    [t, trader],
  );

  const historyColumns = useMemo<CRMColumnDef<MamSignalFundHistoryItem, unknown>[]>(
    () => [
      {
        id: 'ticket',
        header: t('table.orderNumber'),
        accessorFn: row => row.ticket || '-',
      },
      {
        id: 'openTime',
        header: t('table.openTime'),
        accessorFn: row => row.openTime || '-',
      },
      {
        id: 'signalSource',
        header: t('signals.tradeOrders.signalSource'),
        accessorFn: row => row.login || trader || '-',
      },
      {
        id: 'type',
        header: t('table.transactionType'),
        accessorFn: row => getTradeTypeLabel(row.type, t),
      },
      {
        id: 'volume',
        header: t('table.volume'),
        accessorFn: row => row.volume || '-',
      },
      {
        id: 'symbol',
        header: t('table.symbol'),
        accessorFn: row => row.symbol || '-',
      },
      {
        id: 'openClosePrice',
        header: t('signals.tradeOrders.openClosePrice'),
        accessorFn: row => `${row.openPrice ?? '-'} / ${row.closePrice ?? '-'}`,
      },
      {
        id: 'profit',
        header: t('table.profitAndLoss'),
        accessorFn: row => row.profit || '-',
      },
      {
        id: 'commission',
        header: t('table.commission'),
        accessorFn: row => row.commission || '-',
      },
      {
        id: 'swaps',
        header: t('signals.tradeOrders.inventoryFee'),
        accessorFn: row => row.swaps || '-',
      },
    ],
    [t, trader],
  );

  const {
    visibleColumns: positionVisibleColumns,
    toggleColumn: togglePositionColumn,
    batchUpdateColumns: batchUpdatePositionColumns,
    columns: positionAllColumns,
    tableColumns: positionTableColumns,
    columnMeta: positionColumnMeta,
  } = useColumnVisibility('signals-position-orders-table', positionColumns);

  const {
    visibleColumns: historyVisibleColumns,
    toggleColumn: toggleHistoryColumn,
    batchUpdateColumns: batchUpdateHistoryColumns,
    columns: historyAllColumns,
    tableColumns: historyTableColumns,
    columnMeta: historyColumnMeta,
  } = useColumnVisibility('signals-history-orders-table', historyColumns);

  return (
    <TradeOrdersSwitchTables
      activeTable={activeTable}
      onActiveTableChange={setActiveTable}
      form={form}
      onSubmit={onSubmit}
      onReset={onReset}
      positionTimeLabel={t('table.time')}
      historyTimeLabel={t('table.closeTime')}
      positionTitle={t('positionOrderPage.positionOrder')}
      historyTitle={t('tradingHistoryPage.tradingHistory')}
      positionActions={
        <ColumnVisibilityButton
          columnMeta={positionColumnMeta}
          visibleColumns={positionVisibleColumns}
          onToggle={togglePositionColumn}
          onBatchReorder={batchUpdatePositionColumns}
          columns={positionAllColumns}
        />
      }
      historyActions={
        <ColumnVisibilityButton
          columnMeta={historyColumnMeta}
          visibleColumns={historyVisibleColumns}
          onToggle={toggleHistoryColumn}
          onBatchReorder={batchUpdateHistoryColumns}
          columns={historyAllColumns}
        />
      }
      positionTable={
        <div className="min-w-0 overflow-x-auto">
          <div className="min-w-max">
            <DataTable
              columns={positionTableColumns}
              data={positionData?.rows || []}
              pageCount={Math.ceil(+(positionData?.total || 0) / positionPageSize)}
              pageIndex={positionPageNum}
              pageSize={positionPageSize}
              onPageChange={setPositionPageNum}
              onPageSizeChange={setPositionPageSize}
              loading={positionLoading}
            />
          </div>
        </div>
      }
      historyTable={
        <div className="min-w-0 overflow-x-auto">
          <div className="min-w-max">
            <DataTable
              columns={historyTableColumns}
              data={historyData?.rows || []}
              pageCount={Math.ceil(+(historyData?.total || 0) / historyPageSize)}
              pageIndex={historyPageNum}
              pageSize={historyPageSize}
              onPageChange={setHistoryPageNum}
              onPageSizeChange={setHistoryPageSize}
              loading={historyLoading}
            />
          </div>
        </div>
      }
    />
  );
}
