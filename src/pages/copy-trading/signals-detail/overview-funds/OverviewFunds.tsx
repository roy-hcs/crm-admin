import { useCrmDealAccountFundFlow, useMamSignalSourceFundOverview } from '@/api/hooks/copyTrading';
import { crmDealAccountFundFlowItem } from '@/api/hooks/copyTrading/type';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { RrhButton } from '@/components/common/RrhButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { Funnel, RefreshCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OverviewFundsForm } from './OverviewFundsForm';
import { RrhDrawer } from '@/components/common/RrhDrawer';

export function OverviewFunds({
  serverId,
  login,
  id,
  accountId,
}: {
  serverId: string;
  login: string;
  id: string;
  accountId: string;
}) {
  const { t } = useTranslation();
  const { data: overviewData } = useMamSignalSourceFundOverview(id);

  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('asc');
  const [orderByColumn, setOrderByColumn] = useState('');
  const [otherParams, setOtherParams] = useState({
    opeTypeList: '',
  });
  const { data: flowData, isLoading: loading } = useCrmDealAccountFundFlow(
    {
      pageSize,
      pageNum: pageNum + 1,
      orderByColumn,
      isAsc,
      yieldDateRange: '30',
      login,
      serverId,
      ...otherParams,
    },
    accountId,
  );

  const sumData = useMemo(() => {
    if (!overviewData) return [];
    return [
      {
        label: 'signals.overviewFundsOptions.1',
        firstValue: (overviewData?.data?.totalDeposit || 0).toFixed(2),
        secondValue: overviewData?.data?.totalDepositCount || 0,
      },
      {
        label: 'signals.overviewFundsOptions.2',
        firstValue: (overviewData?.data?.totalWithdraw || 0).toFixed(2),
        secondValue: overviewData?.data?.totalWithdrawCount || 0,
      },
      {
        label: 'signals.overviewFundsOptions.3',
        firstValue: (overviewData?.data?.totalCreditDeposit || 0).toFixed(2),
        secondValue: overviewData?.data?.totalCreditDepositCount || 0,
      },
      {
        label: 'signals.overviewFundsOptions.4',
        firstValue: (overviewData?.data?.totalCreditWithdraw || 0).toFixed(2),
        secondValue: overviewData?.data?.totalCreditWithdrawCount || 0,
      },
    ];
  }, [overviewData]);

  const allColumns = useMemo<CRMColumnDef<crmDealAccountFundFlowItem, unknown>[]>(
    () => [
      {
        id: 'login',
        header: t('table.tradingAccount'),
        accessorFn: row => row.login || '-',
      },
      {
        id: 'flowType',
        header: t('table.operationType'),
        accessorFn: row => {
          if (row.flowType === 1 || row.flowType === 3) return t('table.Deposit');
          if (row.flowType === 2 || row.flowType === 4) return t('table.Withdrawal');
          if (row.flowType === 5) return t('table.creditAmountDeposit');
          return '-';
        },
      },
      {
        id: 'profit',
        header: t('tradingAccountTransactions.profit'),
        accessorFn: row => row.profit || '-',
      },
      {
        id: 'timeStr',
        header: t('table.time'),
        accessorFn: row => row.timeStr || '-',
      },
      {
        id: 'ticket',
        header: t('table.orderNumber'),
        accessorFn: row => row.ticket || '-',
      },
      {
        id: 'comment',
        header: t('table.comment'),
        accessorFn: row => row.comment || '-',
      },
    ],
    [t],
  );

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('signals-overview-funds-table', allColumns);

  const reset = (resetFilter = false) => {
    setPageNum(0);
    setPageSize(10);
    setIsAsc('asc');
    setOrderByColumn('');
    if (resetFilter) {
      setOtherParams({ opeTypeList: '' });
    }
  };
  return (
    <div className="grid gap-6">
      <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-4 lg:gap-6">
        {sumData.map(it => {
          return (
            <div className="bg-card flex flex-col gap-2 rounded-lg p-4 shadow-xs" key={it.label}>
              <div className="flex items-center justify-between">
                <div className="text-card-foreground text-sm leading-5 font-normal">
                  {t(it.label)}
                </div>
              </div>
              <div className="text-card-foreground truncate text-base leading-4 font-semibold">
                {it.firstValue}
              </div>
              <div className="text-card-foreground truncate text-base leading-4 font-semibold">
                {it.secondValue}
              </div>
            </div>
          );
        })}
      </div>
      <TableContentWrapper>
        <div className="mb-3 flex items-center justify-end gap-2">
          <div className="flex items-center gap-2">
            <RrhButton
              variant="ghost"
              className="size-8 cursor-pointer"
              onClick={() => reset(true)}
            >
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
              <OverviewFundsForm
                setOtherParams={setOtherParams}
                reset={reset}
                otherParams={otherParams}
              />
            </RrhDrawer>
          </div>
          <ColumnVisibilityButton
            columnMeta={columnMeta}
            visibleColumns={visibleColumns}
            onToggle={toggleColumn}
            onBatchReorder={batchUpdateColumns}
            columns={columns}
          />
        </div>
        <DataTable
          columns={tableColumns}
          data={flowData?.rows || []}
          pageCount={Math.ceil(+(flowData?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={loading}
        />
      </TableContentWrapper>
    </div>
  );
}
