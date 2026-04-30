import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { BasicParams } from '@/api/types';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable, DataTableRef } from '@/components/table';
import { REBATE_MODEL_SETTING } from '@/lib/constant';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { useInitServerId } from '@/hooks/useInitServerId';
import {
  RebateDepositSettingsHistoryItem,
  RebateFeeSettingsHistoryListParams,
  useRebateDepositSettingsHistoryList,
} from '@/api/hooks/rebate';
import dayjs from 'dayjs';
import { DepositRebateSettingsHistoryForm } from './DepositRebateSettingsHisotryForm';
import { CalculateRebateDialog } from './CalculateRebateDialog';
import { useGetSysConfig } from '@/api/hooks/system/system';
import { oprType } from '@/lib/utils';

export const DepositRebateSettingsHistoryPage = () => {
  const { t } = useTranslation();
  const tableRef = useRef<DataTableRef>(null);
  const { serverId, server, serverLoading } = useInitServerId();
  const { data: model } = useGetSysConfig(REBATE_MODEL_SETTING);

  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [resetKey, setResetKey] = useState(0);
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
  const { data, isLoading } = useRebateDepositSettingsHistoryList(
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
    setResetKey(k => k + 1);
    setPageNum(0);
  };

  const allColumns: CRMColumnDef<RebateDepositSettingsHistoryItem, unknown>[] = [
    {
      id: 'No.',
      header: t('CRMAccountPage.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'login',
      header: t('table.tradingAccount'),
      accessorFn: row => row.login,
    },
    {
      id: 'userName',
      header: t('CRMAccountPage.UserName'),
      accessorFn: row => row.name,
    },
    {
      id: 'operationType',
      header: t('table.operationType'),
      cell: ({ row }) => {
        const type = oprType(row.original);
        return type ? t(type) : '-';
      },
    },
    {
      id: 'profit',
      header: t('tradingAccountTransactions.profit'),
      cell: ({ row }) => {
        const rowData = row.original;
        return rowData.profit + ' ' + rowData.currency;
      },
    },
    {
      id: 'time',
      header: t('table.time'),
      accessorFn: row => row.timeStr,
    },
    {
      id: 'ticket',
      header: t('table.orderNumber'),
      accessorFn: row => row.ticket,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility<RebateDepositSettingsHistoryItem>(
      'rebate-deposit-settings-history-table',
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
            key={resetKey}
            placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
            className="h-9"
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
              <DepositRebateSettingsHistoryForm
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
