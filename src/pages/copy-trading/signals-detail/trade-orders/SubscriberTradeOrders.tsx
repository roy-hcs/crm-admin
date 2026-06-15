import {
  MamClientHistoryItem,
  MamClientPositionItem,
  MamClientTradeOrdersParams,
} from '@/api/hooks/copyTrading/type';
import { useMamClientHistoryList, useMamClientPositionList } from '@/api/hooks/copyTrading';
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

export function SubscriberTradeOrders({
  clientAccount,
  clientServerId,
}: {
  clientAccount: string;
  clientServerId: string;
}) {
  const { t } = useTranslation();
  const [activeTable, setActiveTable] = useState<ActiveTable>('position');

  const [positionPageNum, setPositionPageNum] = useState(0);
  const [positionPageSize, setPositionPageSize] = useState(10);
  const [historyPageNum, setHistoryPageNum] = useState(0);
  const [historyPageSize, setHistoryPageSize] = useState(10);

  const [positionParams, setPositionParams] = useState<MamClientTradeOrdersParams>({
    clientServerId,
    pageSize: 10,
    pageNum: 1,
    orderByColumn: '',
    isAsc: 'asc',
    params: {
      positionDealBJStartTime: '',
      positionDealBJEndTime: '',
      historyCloseStartTime: '',
      historyCloseEndTime: '',
    },
  });

  const [historyParams, setHistoryParams] = useState<MamClientTradeOrdersParams>({
    clientServerId,
    pageSize: 10,
    pageNum: 1,
    orderByColumn: '',
    isAsc: 'asc',
    params: {
      positionDealBJStartTime: '',
      positionDealBJEndTime: '',
      historyCloseStartTime: '',
      historyCloseEndTime: '',
    },
  });

  const form = useForm<SearchFormValues>({
    defaultValues: {
      positionTime: { from: '', to: '' },
      historyTime: { from: '', to: '' },
    },
  });

  const { data: positionData, isLoading: positionLoading } = useMamClientPositionList(
    clientAccount,
    clientServerId,
    {
      ...positionParams,
      clientServerId,
      pageSize: positionPageSize,
      pageNum: positionPageNum + 1,
    },
    { enabled: activeTable === 'position' },
  );

  const { data: historyData, isLoading: historyLoading } = useMamClientHistoryList(
    clientAccount,
    clientServerId,
    {
      ...historyParams,
      clientServerId,
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
        clientServerId,
        params: {
          ...prev.params,
          positionDealBJStartTime: formatDate(values.positionTime.from),
          positionDealBJEndTime: formatDate(values.positionTime.to),
        },
      }));
      return;
    }

    setHistoryPageNum(0);
    setHistoryParams(prev => ({
      ...prev,
      clientServerId,
      params: {
        ...prev.params,
        historyCloseStartTime: formatDate(values.historyTime.from),
        historyCloseEndTime: formatDate(values.historyTime.to),
      },
    }));
  };

  const onReset = () => {
    if (activeTable === 'position') {
      setPositionPageNum(0);
      setPositionPageSize(10);
      setPositionParams(prev => ({
        ...prev,
        clientServerId,
        pageSize: 10,
        pageNum: 1,
        orderByColumn: '',
        isAsc: 'asc',
        params: {
          ...prev.params,
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
      clientServerId,
      pageSize: 10,
      pageNum: 1,
      orderByColumn: '',
      isAsc: 'asc',
      params: {
        ...prev.params,
        historyCloseStartTime: '',
        historyCloseEndTime: '',
      },
    }));
    form.setValue('historyTime', { from: '', to: '' });
  };

  const positionColumns = useMemo<CRMColumnDef<MamClientPositionItem, unknown>[]>(
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
        id: 'tradingAccount',
        header: t('table.tradingAccount'),
        accessorFn: row => row.login || '-',
      },
      {
        id: 'signalSource',
        header: t('signals.tradeOrders.signalSource'),
        accessorFn: () => clientAccount || '-',
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
    [clientAccount, t],
  );

  const historyColumns = useMemo<CRMColumnDef<MamClientHistoryItem, unknown>[]>(
    () => [
      {
        id: 'ticket',
        header: t('table.orderNumber'),
        accessorFn: row => row.ticket || '-',
      },
      {
        id: 'tradingTime',
        header: t('table.tradingTime'),
        accessorFn: row => row.time || row.openTime || '-',
      },
      {
        id: 'tradingAccount',
        header: t('table.tradingAccount'),
        accessorFn: row => row.login || '-',
      },
      {
        id: 'signalSource',
        header: t('signals.tradeOrders.signalSource'),
        accessorFn: () => clientAccount || '-',
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
    [clientAccount, t],
  );

  const {
    visibleColumns: positionVisibleColumns,
    toggleColumn: togglePositionColumn,
    batchUpdateColumns: batchUpdatePositionColumns,
    columns: positionAllColumns,
    tableColumns: positionTableColumns,
    columnMeta: positionColumnMeta,
  } = useColumnVisibility('signals-subscriber-position-table', positionColumns);

  const {
    visibleColumns: historyVisibleColumns,
    toggleColumn: toggleHistoryColumn,
    batchUpdateColumns: batchUpdateHistoryColumns,
    columns: historyAllColumns,
    tableColumns: historyTableColumns,
    columnMeta: historyColumnMeta,
  } = useColumnVisibility('signals-subscriber-history-table', historyColumns);

  return (
    <TradeOrdersSwitchTables
      activeTable={activeTable}
      onActiveTableChange={setActiveTable}
      form={form}
      onSubmit={onSubmit}
      onReset={onReset}
      positionTimeLabel={t('table.time')}
      historyTimeLabel={t('table.tradingTime')}
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
