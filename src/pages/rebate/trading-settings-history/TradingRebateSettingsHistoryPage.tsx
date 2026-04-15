import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { BasicParams } from '@/api/types';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable, DataTableRef } from '@/components/table';
import { REBATE_MODEL_SETTING, transactionTypeMap } from '@/lib/constant';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { useInitServerId } from '@/hooks/useInitServerId';
import {
  RebateFeeSettingsHistoryItem,
  RebateFeeSettingsHistoryListParams,
  useRebateSettingsHistoryList,
} from '@/api/hooks/rebate';
import dayjs from 'dayjs';
import { TradingRebateSettingsHistoryForm } from './TradingRebateSettingsHisotryForm';
import { CalculateRebateDialog } from './CalculateRebateDialog';
import { useGetSysConfig } from '@/api/hooks/system/system';

export const TradingRebateSettingsHistoryPage = () => {
  const { t } = useTranslation();
  const tableRef = useRef<DataTableRef>(null);
  const { serverId, server, serverLoading } = useInitServerId();
  const { data: model } = useGetSysConfig(REBATE_MODEL_SETTING);

  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [timestamp, setTimestamp] = useState(Date.now());

  const [params, setParams] = useState<RebateFeeSettingsHistoryListParams['params']>({
    accounts: '',
    historyFuzzyName: '',
    historyDealBJStartTime: dayjs().subtract(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm'),
    historyDealBJEndTime: dayjs().endOf('day').format('YYYY-MM-DD HH:mm'),
    historyDealBJStartTimeRingOut: '',
    historyDealBJEndTimeRingOut: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<RebateFeeSettingsHistoryListParams, 'params' | keyof BasicParams>
  >({
    timestamp,
    serverId,
    serverGroupList: '',
    serverGroup: '',
    login: '',
    ticket: '',
    symbol: '',
    type: '',
    accountGroupList: '',
    dealAccountGroupIds: '',
    accounts: '',
    entry: '',
  });

  useEffect(() => {
    if (server && server.rows && server.rows.length > 0) {
      setOtherParams(prev => ({
        ...prev,
        serverId: server?.rows?.[0]?.id || '',
      }));
    }
  }, [server]);
  const { data, isLoading } = useRebateSettingsHistoryList(
    {
      orderByColumn: '',
      isAsc: 'asc',
      pageNum: pageNum + 1,
      pageSize,
      ...otherParams,
      params: {
        ...params,
      },
    },
    1,
    {
      enabled: !!serverId,
    },
  );

  const reset = () => {
    const newTimestamp = Date.now();
    setTimestamp(newTimestamp);
    setParams({
      accounts: '',
      historyFuzzyName: '',
      historyDealBJStartTime: dayjs().subtract(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm'),
      historyDealBJEndTime: dayjs().endOf('day').format('YYYY-MM-DD HH:mm'),
      historyDealBJStartTimeRingOut: '',
      historyDealBJEndTimeRingOut: '',
    });
    setOtherParams({
      timestamp: newTimestamp,
      serverId,
      serverGroupList: '',
      serverGroup: '',
      login: '',
      ticket: '',
      symbol: '',
      type: '',
      accountGroupList: '',
      dealAccountGroupIds: '',
      accounts: '',
      entry: '',
    });
    setKeyword('');
    setPageNum(0);
  };

  const allColumns: CRMColumnDef<RebateFeeSettingsHistoryItem, unknown>[] = [
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
      id: 'ticket',
      header: t('table.orderNumber'),
      accessorFn: row => row.ticket,
    },
    {
      id: 'type',
      header: t('table.transactionType'), // 0: buy, 1: sell
      accessorFn: row =>
        transactionTypeMap[row.type as keyof typeof transactionTypeMap] || row.type,
    },
    {
      id: 'symbol',
      header: t('table.symbol'),
      accessorFn: row => row.symbol,
    },
    {
      id: 'tradeCount',
      header: t('table.volume'),
      cell: ({ row }) => {
        const rowData = row.original;
        if (rowData.server_type === '1') {
          return (rowData.volume / 1000).toFixed(2);
        } else if (rowData.server_type === '5') {
          return rowData.volume.toFixed(2);
        } else {
          return (rowData.volume / 100).toFixed(2);
        }
      },
    },
    {
      id: 'price',
      header: t('table.price'),
      cell: ({ row }) => {
        const rowData = row.original;
        if (!rowData.price) {
          return 0;
        }
        return rowData.price.toFixed(rowData.digits);
      },
    },
    {
      id: 'time',
      header: t('table.tradingTime'),
      accessorFn: row => row.time,
    },
    {
      id: 'entry',
      header: t('table.closePrice'),
      cell: ({ row }) => {
        switch (row.original.entry) {
          case 0:
            return 'in';
          case 1:
            return 'out';
          case 2:
            return 'in/out';
          case 3:
            return 'out/by';
          default:
            return row.original.entry;
        }
      },
    },
    {
      id: 'profitAndLoss',
      header: t('table.profitAndLoss'),
      cell: ({ row }) => {
        const rowData = row.original;
        return rowData.profit !== null ? (
          <div>
            {rowData.profit.toFixed(2)} {rowData.currency}
          </div>
        ) : (
          <div>-</div>
        );
      },
    },
    {
      id: 'commission',
      header: t('table.commission'),
      cell: ({ row }) => {
        const rowData = row.original;
        return rowData.commission !== null ? (
          <div>
            {rowData.commission.toFixed(2)} {rowData.currency}
          </div>
        ) : (
          <div>-</div>
        );
      },
    },
    {
      id: 'swaps',
      header: t('table.swap'),
      cell: ({ row }) => {
        const rowData = row.original;
        return rowData.swaps !== null ? (
          <div>
            {rowData.swaps.toFixed(2)} {rowData.currency}
          </div>
        ) : (
          <div>-</div>
        );
      },
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility<RebateFeeSettingsHistoryItem>(
      'rebate-trading-settings-history-table',
      allColumns,
    );

  return (
    <div>
      <PageInfo
        title={t('FeeRebateSettings.feeRebateSettingsHistory')}
        desc={t('FeeRebateSettings.feeRebateSettingsHistoryDesc')}
      />
      <TableContentWrapper>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <RrhInputWithIcon
            placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
            className="h-9"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            leftIcon={<Search className="size-4 cursor-pointer" />}
            onLeftIconClick={e => {
              setOtherParams(prev => ({ ...prev, ticket: e }));
              setPageNum(0);
            }}
          />
          <div className="flex items-center justify-end gap-2">
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
              <TradingRebateSettingsHistoryForm
                params={params}
                otherParams={otherParams}
                reset={reset}
                loading={isLoading}
                serverLoading={serverLoading}
                serverList={server?.rows || []}
                setParams={setParams}
                setOtherParams={setOtherParams}
                setTimeStamp={setTimestamp}
              />
            </RrhDrawer>
            <ColumnVisibilityButton
              columnMeta={columnMeta}
              visibleColumns={visibleColumns}
              onToggle={toggleColumn}
              onBatchReorder={batchUpdateColumns}
              columns={columns}
            />
            <CalculateRebateDialog
              timestamp={timestamp}
              model={Number(model || 1)}
              total={data?.total || '0'}
            />
          </div>
        </div>

        <DataTable
          ref={tableRef}
          columns={tableColumns}
          data={data?.rows || []}
          pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={isLoading}
        />
      </TableContentWrapper>
    </div>
  );
};
