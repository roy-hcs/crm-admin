import { useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { DataStatisticsItem, DataStatisticsParams, useDataStatistics } from '@/api/hooks/report';
import { TradingAccountDataStatsForm } from './TradingAccountDataStatsForm';
import { Funnel, Search, RefreshCcw } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/types';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { useInitServerId } from '@/hooks/useInitServerId';

export function TradingAccountDataStatsPage() {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [params, setParams] = useState<DataStatisticsParams['params']>({
    onlyViewRebateAccount: '',
    serverGroupList: '',
    fuzzyAccount: '',
    fuzzyName: '',
    statisticStartTime: '',
    statisticEndTime: '',
    accounts: '',
  });
  const [commonParams, setCommonParams] = useState<
    Omit<DataStatisticsParams, 'params' | keyof BasicParams>
  >({
    accounts: '',
    accountGroupList: '',
    username: '',
    directBroker: '',
  });

  const { serverId, setServerId, server, serverLoading } = useInitServerId();

  const { data: data, isLoading: dataLoading } = useDataStatistics(
    {
      server: serverId,
      params,
      ...commonParams,
      pageSize,
      pageNum: pageNum + 1,
      isAsc: 'asc',
      orderByColumn: '',
    },
    { enabled: !!serverId },
  );

  const reset = () => {
    setParams({
      onlyViewRebateAccount: '',
      serverGroupList: '',
      fuzzyAccount: '',
      fuzzyName: '',
      statisticStartTime: '',
      statisticEndTime: '',
      accounts: '',
    });
    setCommonParams({
      accounts: '',
      accountGroupList: '',
      username: '',
      directBroker: '',
    });
    setKeyword('');
    setPageNum(0);
    setPageSize(10);
    setServerId(server?.rows?.[0]?.id || '');
  };
  const allColumns: CRMColumnDef<DataStatisticsItem, unknown>[] = [
    {
      id: 'No.',
      size: 50,
      header: t('overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'name',
      header: t('tradingAccountTransactions.name'),
      accessorFn: row => row.name,
    },
    {
      id: 'login',

      header: t('tradingAccountTransactions.login'),
      accessorFn: row => row.login,
    },
    {
      id: 'username',

      header: t('tradingAccountDataStats.username'),

      cell: ({ row }) => {
        if (row?.original?.username) {
          return row.original.username;
        }
        return '--';
      },
    },
    {
      id: 'userLevel',

      header: t('tradingAccountDataStats.userLevel'),

      cell: ({ row }) => {
        if (row?.original?.userLevel) {
          return row.original.userLevel;
        }
        return '--';
      },
    },
    {
      id: 'directBrokerName',

      header: t('tradingAccountDataStats.directBrokerName'),

      cell: ({ row }) => {
        if (row?.original?.directBrokerName) {
          return row.original.directBrokerName;
        }
        return '--';
      },
    },
    {
      id: 'positiveBalance',

      header: t('tradingAccountDataStats.positiveBalance'),

      cell: ({ row }) => {
        if (row?.original?.positiveBalanceCount || row?.original?.positiveBalance) {
          return (
            <div>
              <div>{row?.original?.positiveBalanceCount || '0'}</div>
              <div>{row?.original?.positiveBalance || '0'}</div>
              <div>{row?.original?.currency}</div>
            </div>
          );
        }
        return '--';
      },
    },
    {
      id: 'negativeBalance',

      header: t('tradingAccountDataStats.negativeBalance'),

      cell: ({ row }) => {
        if (row?.original?.negativeBalanceCount || row?.original?.negativeBalance) {
          return (
            <div>
              <div>{row?.original?.negativeBalanceCount || '0'}</div>
              <div>{row?.original?.negativeBalance || '0'}</div>
              <div>{row?.original?.currency}</div>
            </div>
          );
        }
        return '--';
      },
    },
    {
      id: 'netDeposit',

      header: t('tradingAccountDataStats.netDeposit'),

      cell: ({ row }) => {
        if (row?.original?.positiveBalance || row?.original?.negativeBalance) {
          return (
            <div>
              <div>{row?.original?.positiveBalance || '0'}</div>
              <div>{row?.original?.negativeBalance || '0'}</div>
              <div>{row?.original?.currency}</div>
            </div>
          );
        }
        return '--';
      },
    },
    {
      id: 'balance',

      header: t('tradingAccountDataStats.balance'),

      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.balance || '0'}</div>
            <div>{row?.original?.currency}</div>
          </div>
        );
      },
    },
    {
      id: 'netWorth',

      header: t('tradingAccountDataStats.netWorth'),

      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.netWorth || '0'}</div>
            <div>{row?.original?.currency}</div>
          </div>
        );
      },
    },
    {
      id: 'credit',

      header: t('tradingAccountDataStats.credit'),

      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.credit || '0'}</div>
            <div>{row?.original?.currency}</div>
          </div>
        );
      },
    },
    {
      id: 'usedAdvance',

      header: t('tradingAccountDataStats.usedAdvance'),

      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.usedAdvance || '0'}</div>
            <div>{row?.original?.currency}</div>
          </div>
        );
      },
    },
    {
      id: 'usableAdvance',

      header: t('tradingAccountDataStats.usableAdvance'),

      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.usableAdvance || '0'}</div>
            <div>{row?.original?.currency}</div>
          </div>
        );
      },
    },
    {
      id: 'advanceScale',

      header: t('tradingAccountDataStats.advanceScale'),

      cell: ({ row }) => {
        if (row?.original?.advanceScale) {
          return `${row?.original?.advanceScale}%`;
        }
        return '--';
      },
    },
    {
      id: 'riskScale',

      header: t('tradingAccountDataStats.riskScale'),

      cell: ({ row }) => {
        if (row?.original?.riskScale) {
          return `${row?.original?.riskScale}%`;
        }
        return '--';
      },
    },
    {
      id: 'profitPosition',

      header: t('tradingAccountDataStats.profitPosition'),

      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.profitPosition || '0'}</div>
            <div>{row?.original?.currency}</div>
          </div>
        );
      },
    },
    {
      id: 'volumePosition',

      header: t('tradingAccountDataStats.volumePosition'),

      accessorFn: row => row.volumePosition || 0,
    },
    {
      id: 'swapsPosition',

      header: t('tradingAccountDataStats.swapsPosition'),

      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.swapsPosition || '0'}</div>
            <div>{row?.original?.currency}</div>
          </div>
        );
      },
    },
    {
      id: 'profitLoss',

      header: t('tradingAccountDataStats.profitLoss'),

      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.profitLoss || '0'}</div>
            <div>{row?.original?.currency}</div>
          </div>
        );
      },
    },
    {
      id: 'volumeLoss',

      header: t('tradingAccountDataStats.volumeLoss'),

      accessorFn: row => row.volumeLoss || 0,
    },
    {
      id: 'commission',

      header: t('tradingAccountDataStats.commission'),

      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.commission || '0'}</div>
            <div>{row?.original?.currency}</div>
          </div>
        );
      },
    },
    {
      id: 'swaps',

      header: t('tradingAccountDataStats.swaps'),

      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.swaps || '0'}</div>
            <div>{row?.original?.currency}</div>
          </div>
        );
      },
    },
    {
      id: 'netProfit',

      header: t('tradingAccountDataStats.netProfit'),

      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.netProfit || '0'}</div>
            <div>{row?.original?.currency}</div>
          </div>
        );
      },
    },
    {
      id: 'netProfitRatio',

      header: t('tradingAccountDataStats.netProfitRatio'),

      cell: ({ row }) => {
        if (row?.original?.netProfitRatio) {
          return `${row?.original?.netProfitRatio}%`;
        }
        return '--';
      },
    },
    {
      id: 'rebateTraderAmount',

      header: t('tradingAccountDataStats.rebateTraderAmount'),

      accessorFn: row => row.rebateTraderAmount || 0,
    },
    {
      id: 'rebateCommissionAmount',

      header: t('tradingAccountDataStats.rebateCommissionAmount'),

      accessorFn: row => row.rebateCommissionAmount || 0,
    },
    {
      id: 'rebateDepositAmount',

      header: t('tradingAccountDataStats.rebateDepositAmount'),

      accessorFn: row => row.rebateDepositAmount || 0,
    },
  ];
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('trading-account-data-stats-table', allColumns);

  return (
    <div>
      <PageInfo title={t('tradingAccountDataStats.title')} />
      <div className="text-sm leading-6 font-normal text-neutral-900">{t('common.tips')}</div>
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              placeholder={t('common.pleaseInput', {
                field: t('tradingAccountTransactions.name'),
              })}
              value={keyword}
              onChange={e => {
                setKeyword(e.target.value);
              }}
              className="h-9"
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={e => {
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
              <TradingAccountDataStatsForm
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
      </TableContentWrapper>
    </div>
  );
}
