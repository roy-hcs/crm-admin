import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import {
  NetBonusRewardRow,
  NetBonusRewardStatisticsListParams,
  useExportNetBonusRewardStatistics,
  useGetNetBonusRewardStatistics,
} from '@/api/hooks/marketing';
import { BasicParams } from '@/api/types';
import { ExportButton } from '@/components/common/ExportButton';
import { NetBonusStatisticsForm } from './NetBonusStatisticsForm';
import { crmAccountTypeOptions } from '@/lib/const';
import { RrhSorter } from '@/components/common/RrhSorter';

export const NetBonusStatisticsPage = () => {
  const [params, setParams] = useState<NetBonusRewardStatisticsListParams['params']>({
    beginTime: '',
    endTime: '',
    agentUserId: '',
    drirectFlag: 'a',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<NetBonusRewardStatisticsListParams, 'params' | keyof BasicParams>
  >({
    userName: '',
    accountType: '',
    bonusMonth: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [orderByColumn, setOrderByColumn] = useState<string>(
    'personalAvgNet desc,statisticsTime desc',
  );
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('');
  const { t } = useTranslation();
  const { data: data, isLoading: loading } = useGetNetBonusRewardStatistics({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn,
    isAsc,
    ...otherParams,
    params: {
      ...params,
      agentUserId: params.agentUserId ? params.agentUserId : undefined,
    },
  });

  const reset = () => {
    setParams(pre => ({
      ...pre,
      beginTime: '',
      endTime: '',
      agentUserId: '',
      drirectFlag: 'a',
    }));
    setOtherParams({
      userName: '',
      accountType: '',
      bonusMonth: '',
    });
    setPageNum(0);
  };

  const allColumns: CRMColumnDef<NetBonusRewardRow, unknown>[] = [
    {
      id: 'userName',
      header: t('common.account.type.user'),
      cell: ({ row }) => (
        <div>
          <div>{row.original?.userName || '-'}</div>
          <div>({row.original?.showId || '-'})</div>
        </div>
      ),
    },
    {
      id: 'accountType',
      header: t('CRMAccountPage.CRMAccountType'),
      cell: ({ row }) => {
        const typeName =
          crmAccountTypeOptions.find(item => item.value === row.original.accountType)?.label || '';
        return <div>{t(typeName)}</div>;
      },
    },
    {
      id: 'month',
      header: t('customerTracking.statisticMonthStr'),
      cell: ({ row }) => <div>{row.original.bonusMonth}</div>,
    },
    {
      id: 'statisticsTimeRange',
      header: t('table.timeRangeOfStatistics'),
      cell: ({ row }) => {
        return <div>{row.original?.statisticsTimeRange || '-'}USD</div>;
      },
    },
    {
      id: 'tierAvgNet',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.tieredAverageNetDeposit')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="tierAvgNet"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div>{row.original?.tierAvgNet ? `${row.original.tierAvgNet.toFixed(2)}USD` : '-'}</div>
        );
      },
    },
    {
      id: 'rewardParam',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.rewardParams')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="rewardParam"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        return <div>{row.original?.rewardParam ? `${row.original.rewardParam}%` : '-'}</div>;
      },
    },
    {
      id: 'fixedParams',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.fixedParams')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="fixedParam"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        return <div>{row.original?.fixedParam ? `${row.original.fixedParam}%` : '-'}</div>;
      },
    },
    {
      id: 'expectedBonus',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.tieredAccrualReward')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="expectedBonus"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div>
            {row.original?.expectedBonus ? `${row.original.expectedBonus.toFixed(2)}USD` : '-'}
          </div>
        );
      },
    },
    {
      id: 'statisticTime',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('common.statisticTime')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="statisticsTime"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        return <div>{row.original?.statisticsTime || '-'}</div>;
      },
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('marketing-reward-records-table', allColumns);
  const { mutateAsync: exportNetBonusRewardStatistics, isPending: exportLoading } =
    useExportNetBonusRewardStatistics();

  return (
    <div>
      <PageInfo title={t('netBonus.netBonusRewardReport')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              placeholder={t('common.pleaseInput', { field: t('common.account.type.user') })}
              className="h-9"
              leftIcon={<Search className="size-4 cursor-pointer" />}
              onLeftIconClick={e => {
                setOtherParams(prev => ({ ...prev, userName: e }));
                setPageNum(0);
              }}
            />
          </div>
          <div className="flex items-center gap-2">
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
              <NetBonusStatisticsForm
                otherParams={otherParams}
                setParams={setParams}
                setOtherParams={setOtherParams}
                loading={loading}
                reset={reset}
                params={params}
              />
            </RrhDrawer>
            <ColumnVisibilityButton
              columnMeta={columnMeta}
              visibleColumns={visibleColumns}
              onToggle={toggleColumn}
              onBatchReorder={batchUpdateColumns}
              columns={columns}
            />
            <ExportButton<NetBonusRewardStatisticsListParams>
              exportFunction={exportNetBonusRewardStatistics}
              params={{
                params: {
                  ...params,
                  agentUserId: params.agentUserId ? params.agentUserId : undefined,
                },
                ...otherParams,
              }}
              exportLoading={exportLoading}
              title={t('netBonus.netBonusRewardReport')}
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
          loading={loading}
        />
      </TableContentWrapper>
    </div>
  );
};
