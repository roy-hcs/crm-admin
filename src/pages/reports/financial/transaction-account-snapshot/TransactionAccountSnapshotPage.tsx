import { useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { TradingAccountSnapshotItem, TradingAccountSnapshotParams } from '@/api/hooks/report';
import { TransactionAccountSnapshotForm } from './TransactionAccountSnapshotForm';
import { Funnel, Search, RefreshCcw } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/types';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import {
  useTradingAccountSnapshotExport,
  useTradingAccountSnapshotList,
} from '@/api/hooks/report/report';
import { useDictType, useServerList } from '@/api/hooks/system';
import { PreferencesDialog } from './components/PreferencesDialog';
import { ExportButton } from '@/components/common/ExportButton';
import { DailySnapshotDialog } from './components/DailySnapshotDialog';

export function TransactionAccountSnapshotPage() {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [resetKey, setResetKey] = useState(0);
  const [params, setParams] = useState<TradingAccountSnapshotParams['params']>({
    createTimeStart: '',
    createTimeEnd: '',
  });
  const [commonParams, setCommonParams] = useState<
    Omit<TradingAccountSnapshotParams, 'params' | keyof BasicParams>
  >({
    snapshotId: '',
    server: '',
    account: '',
    currency: '',
    triggeringEvent: '',
  });
  const { data: server, isLoading: serverLoading } = useServerList();
  const { data: triggeringEventRes, isLoading: triggeringEventLoading } = useDictType(
    'crm_triggering_event',
    { enabled: true },
  );
  const { data: data, isLoading: loading } = useTradingAccountSnapshotList({
    params,
    pageSize,
    ...commonParams,
    pageNum: pageNum + 1,
    isAsc: 'asc',
    orderByColumn: '',
  });

  const reset = () => {
    setParams({
      createTimeStart: '',
      createTimeEnd: '',
    });
    setCommonParams({
      snapshotId: '',
      server: '',
      account: '',
      currency: '',
      triggeringEvent: '',
    });
    setPageNum(0);
    setResetKey(k => k + 1);
    setPageSize(10);
  };

  const allColumns: CRMColumnDef<TradingAccountSnapshotItem, unknown>[] = [
    {
      fixed: true,
      id: 'No.',
      header: t('overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
      size: 50,
    },
    {
      id: 'snapshotId',
      header: t('transactionAccountSnapshotPage.snapshotId'),
      accessorFn: row => row.id,
    },
    {
      id: 'serverName',
      header: t('transactionAccountSnapshotPage.serverName'),
      accessorFn: row => row.serverName || '--',
    },
    {
      id: 'account',
      header: t('transactionAccountSnapshotPage.account'),
      accessorFn: row => row.account || '--',
    },
    {
      id: 'currency',
      accessorKey: 'currency',
      header: t('transactionAccountSnapshotPage.currency'),
      accessorFn: row => row.currency || '--',
    },
    {
      id: 'triggeringEvent',
      accessorKey: 'triggeringEvent',
      header: t('transactionAccountSnapshotPage.event'),
      accessorFn: row => {
        const dictItem = (triggeringEventRes || []).find(
          i => i.dictValue === String(row.triggeringEvent),
        );
        return dictItem?.dictLabel || '--';
      },
    },
    {
      id: 'createTime',
      accessorKey: 'createTime',
      header: t('transactionAccountSnapshotPage.snapshotTime'),
      accessorFn: row => row.createTime || '--',
    },
    {
      id: 'balance',
      accessorKey: 'balance',
      header: t('transactionAccountSnapshotPage.balance'),
      accessorFn: row => row.balance ?? '--',
    },
    {
      id: 'changeAmount',
      accessorKey: 'changeAmount',
      header: t('transactionAccountSnapshotPage.changeAmount'),
      accessorFn: row => row.changeAmount ?? '--',
    },
    {
      id: 'equity',
      accessorKey: 'equity',
      header: t('transactionAccountSnapshotPage.equity'),
      accessorFn: row => row.equity ?? '--',
    },
    {
      id: 'credit',
      accessorKey: 'credit',
      header: t('transactionAccountSnapshotPage.credit'),
      accessorFn: row => row.credit ?? '--',
    },
    {
      id: 'usedMargin',
      accessorKey: 'usedMargin',
      header: t('transactionAccountSnapshotPage.usedMargin'),
      accessorFn: row => row.usedMargin ?? '--',
    },
    {
      id: 'freeMargin',
      accessorKey: 'freeMargin',
      header: t('transactionAccountSnapshotPage.freeMargin'),
      accessorFn: row => row.freeMargin ?? '--',
    },
    {
      id: 'marginLevel',
      accessorKey: 'marginLevel',
      header: t('transactionAccountSnapshotPage.marginLevel'),
      accessorFn: row => row.marginLevel ?? '--',
    },
    {
      id: 'lever',
      accessorKey: 'lever',
      header: t('transactionAccountSnapshotPage.leverage'),
      accessorFn: row => row.lever ?? '--',
    },
    {
      id: 'positionOrders',
      accessorKey: 'positionOrders',
      header: t('transactionAccountSnapshotPage.openOrders'),
      accessorFn: row => row.positionOrders ?? '--',
    },
    {
      id: 'positionLots',
      accessorKey: 'positionLots',
      header: t('transactionAccountSnapshotPage.openLots'),
      accessorFn: row => row.positionLots ?? '--',
    },
    {
      id: 'floatingPl',
      accessorKey: 'floatingPl',
      header: t('transactionAccountSnapshotPage.floatingProfitLoss'),
      accessorFn: row => row.floatingPl ?? '--',
    },
  ];
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('transaction-account-snapshot-table', allColumns);

  const { mutateAsync: exportSnapshot, isPending: exportLoading } =
    useTradingAccountSnapshotExport();

  return (
    <div>
      <PageInfo title={t('transactionAccountSnapshotPage.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              key={resetKey}
              placeholder={t('transactionAccountSnapshotPage.account')}
              className="h-9"
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={value => {
                setCommonParams(prev => ({ ...prev, account: value }));
                setPageNum(0);
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
              <RefreshCcw className="size-3.5" />
            </Button>
            <RrhDrawer
              asChild
              Trigger={
                <Button variant="ghost" className="size-8 cursor-pointer">
                  <Funnel className="size-4" />
                </Button>
              }
              title="Filter"
              responsiveDirection={{
                mobile: 'bottom',
                desktop: 'right',
              }}
              footerShow={false}
            >
              <TransactionAccountSnapshotForm
                reset={reset}
                params={params}
                commonParams={commonParams}
                setParams={setParams}
                setCommonParams={setCommonParams}
                serverOptions={(server?.rows || []).map(i => ({
                  label: i.serverName,
                  value: i.id,
                }))}
                triggeringEventOptions={(triggeringEventRes || []).map(i => ({
                  label: i.dictLabel,
                  value: i.dictValue,
                }))}
              />
            </RrhDrawer>
            <ColumnVisibilityButton
              columnMeta={columnMeta}
              visibleColumns={visibleColumns}
              onToggle={toggleColumn}
              onBatchReorder={batchUpdateColumns}
              columns={columns}
            />
            <DailySnapshotDialog />
            <PreferencesDialog />
            <ExportButton<TradingAccountSnapshotParams>
              exportFunction={exportSnapshot}
              params={{
                params,
                ...commonParams,
              }}
              exportLoading={exportLoading}
              title={t('transactionAccountSnapshotPage.title')}
            />
          </div>
        </div>
        <DataTable
          columns={tableColumns}
          data={data?.rows || []}
          pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={loading || serverLoading || triggeringEventLoading}
        />
      </TableContentWrapper>
    </div>
  );
}
