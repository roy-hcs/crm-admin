import { useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import {
  TradingAccountFundsStatsItem,
  TradingAccountFundsStatsParams,
  useTradingAccountFundsStats,
} from '@/api/hooks/report';
import { useServerList } from '@/api/hooks/system/system';
import { TradingAccountTransactionsForm } from './TradingAccountTransactionsForm';
import { Funnel, Search, RefreshCcw } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/types';

export function TradingAccountFundsStatsPage() {
  const { t } = useTranslation();
  const [serverId, setServerId] = useState('');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [params, setParams] = useState<TradingAccountFundsStatsParams['params']>({
    serverGroupList: '',
    fuzzyAccount: '',
    fuzzyName: '',
    statisticStartTime: '',
    statisticEndTime: '',
    accounts: '',
  });
  const [commonParams, setCommonParams] = useState<
    Omit<TradingAccountFundsStatsParams, 'params' | keyof BasicParams>
  >({
    serverGroup: '',
    accounts: '',
    accountGroupList: '',
  });

  const { data: server, isLoading: serverLoading } = useServerList();
  if (!serverId && server?.code === 0 && server?.rows?.length) {
    setServerId(server.rows[0].id);
  }

  const { data: data, isLoading: dataLoading } = useTradingAccountFundsStats(
    {
      server: serverId,
      params,
      ...commonParams,
      pageNum: pageNum + 1,
      pageSize,
      isAsc: 'asc',
      orderByColumn: '',
    },
    { enabled: !!serverId },
  );

  const reset = () => {
    setParams({
      serverGroupList: '',
      fuzzyAccount: '',
      fuzzyName: '',
      statisticStartTime: '',
      statisticEndTime: '',
      accounts: '',
    });
    setCommonParams({
      serverGroup: '',
      accounts: '',
      accountGroupList: '',
    });
    setKeyword('');
    setPageNum(0);
    setPageSize(10);
  };

  const allColumns: CRMColumnDef<TradingAccountFundsStatsItem, unknown>[] = [
    {
      id: 'No.',
      header: t('ib.overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'name',
      header: t('financial.tradingAccountTransactions.name'),
      accessorFn: row => row.name,
    },
    {
      id: 'login',
      header: t('financial.tradingAccountTransactions.login'),
      accessorFn: row => row.login,
    },
    {
      id: 'balance',
      header: t('financial.tradingAccountFundsStats.balance') + ' (+)',
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.positiveBalanceCount ?? '0'}</div>
            <div>
              {Number(row?.original?.positiveBalance ?? 0).toFixed(2) + row?.original?.currency}
            </div>
          </div>
        );
      },
    },
    {
      id: 'inputAmountCount',
      header: t('financial.tradingAccountFundsStats.inputAmountCount'),
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.inputAmountCount ?? '0'}</div>
            <div>
              {Number(row?.original?.inputAmount ?? 0).toFixed(2) + row?.original?.currency}
            </div>
          </div>
        );
      },
    },
    {
      id: 'sysInputAmountCount',
      header: t('financial.tradingAccountFundsStats.sysInputAmountCount'),
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.sysInputAmountCount ?? '0'}</div>
            <div>
              {Number(row?.original?.sysInputAmount ?? 0).toFixed(2) + row?.original?.currency}
            </div>
          </div>
        );
      },
    },
    {
      id: 'commissionInputAmountCount',
      header: t('financial.tradingAccountFundsStats.commissionInputAmountCount'),
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.commissionInputAmountCount ?? '0'}</div>
            <div>
              {Number(row?.original?.commissionInputAmount ?? 0).toFixed(2) +
                row?.original?.currency}
            </div>
          </div>
        );
      },
    },
    {
      id: 'insideTransferInputAmountCount',
      header: t('financial.tradingAccountFundsStats.insideTransferInputAmountCount'),
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.insideTransferInputAmountCount ?? '0'}</div>
            <div>
              {Number(row?.original?.insideTransferInputAmount ?? 0).toFixed(2) +
                row?.original?.currency}
            </div>
          </div>
        );
      },
    },
    {
      id: 'negativeBalanceCount',
      header: t('financial.tradingAccountFundsStats.negativeBalanceCount') + ' (-)',
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.negativeBalanceCount ?? '0'}</div>
            <div>
              {Number(row?.original?.negativeBalance ?? 0).toFixed(2) + row?.original?.currency}
            </div>
          </div>
        );
      },
    },
    {
      id: 'outAmountCount',
      header: t('financial.tradingAccountFundsStats.outAmountCount'),
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.outAmountCount ?? '0'}</div>
            <div>{Number(row?.original?.outAmount ?? 0).toFixed(2) + row?.original?.currency}</div>
          </div>
        );
      },
    },
    {
      id: 'sysOutAmountCount',
      header: t('financial.tradingAccountFundsStats.sysOutAmountCount'),
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.sysOutAmountCount ?? '0'}</div>
            <div>
              {Number(row?.original?.sysOutAmount ?? 0).toFixed(2) + row?.original?.currency}
            </div>
          </div>
        );
      },
    },
    {
      id: 'insideTransferOutAmountCount',
      header: t('financial.tradingAccountFundsStats.insideTransferOutAmountCount'),
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.insideTransferOutAmountCount ?? '0'}</div>
            <div>
              {Number(row?.original?.insideTransferOutAmount ?? 0).toFixed(2) +
                row?.original?.currency}
            </div>
          </div>
        );
      },
    },
    {
      id: 'creditInputAmountCount',
      header: t('financial.tradingAccountFundsStats.creditInputAmountCount'),
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.creditInputAmountCount ?? '0'}</div>
            <div>
              {Number(row?.original?.creditInputAmount ?? 0).toFixed(2) + row?.original?.currency}
            </div>
          </div>
        );
      },
    },
    {
      id: 'creditOutAmountCount',
      header: t('financial.tradingAccountFundsStats.creditOutAmountCount'),
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.creditOutAmountCount ?? '0'}</div>
            <div>
              {Number(row?.original?.creditOutAmount ?? 0).toFixed(2) + row?.original?.currency}
            </div>
          </div>
        );
      },
    },
    {
      id: 'profitLoss',
      header: t('financial.tradingAccountFundsStats.profitLoss'),
      accessorFn: row => row.profitLoss || `0${row.currency}`,
    },
    {
      id: 'currentBalance',
      header: t('financial.tradingAccountFundsStats.currentbalance'),
      accessorFn: row => row.balance || `0${row.currency}`,
    },
  ];
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('trading-account-funds-stats-table', allColumns);
  return (
    <div>
      <PageInfo title={t('financial.tradingAccountFundsStats.title')} desc={t('common.tips')} />
      <div className="mt-3.5 mb-3.5 flex justify-between">
        <div className="w-67 max-w-sm">
          <RrhInputWithIcon
            placeholder={t('table.nameOrEmail')}
            className="h-9"
            rightIcon={<Search className="size-4" />}
            value={keyword}
            onChange={e => {
              setKeyword(e.target.value);
            }}
            onRightIconClick={e => {
              // 触发查询逻辑, 这里简单调用一次刷新
              setPageNum(0);
              setParams(prev => ({
                ...prev,
                fuzzyName: e,
              }));
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
            <TradingAccountTransactionsForm
              reset={reset}
              params={params}
              commonParams={commonParams}
              setParams={setParams}
              setCommonParams={setCommonParams}
              setServerId={setServerId}
              serverOptions={server?.rows || []}
              initialServerId={serverId}
            />
          </RrhDrawer>
          <ColumnVisibilityButton
            columnMeta={columnMeta}
            visibleColumns={visibleColumns}
            onToggle={toggleColumn}
            onBatchReorder={batchUpdateColumns}
            columns={columns}
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
        loading={dataLoading || serverLoading}
      />
    </div>
  );
}
