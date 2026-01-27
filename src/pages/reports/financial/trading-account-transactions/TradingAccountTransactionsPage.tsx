import { useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { CrmUserDealItem, CrmUserDealListParams, useCrmUserDealList } from '@/api/hooks/report';
import { TradingAccountTransactionsForm } from './TradingAccountTransactionsForm';
import { Funnel, Search, RefreshCcw } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { BasicParams } from '@/api/types';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { useInitServerId } from '@/hooks/useInitServerId';

export function TradingAccountTransactionsPage() {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [params, setParams] = useState<CrmUserDealListParams['params']>({
    ticket: '',
    historyFuzzyName: '',
    login: '',
    comment: '',
    accounts: '',
    operationStart: '',
    operationEnd: '',
    fuzzyCrmAccount: '',
  });
  const [commonParams, setCommonParams] = useState<
    Omit<CrmUserDealListParams, 'params' | keyof BasicParams>
  >({
    opeTypeList: '',
    opeType: '',
    serverGroupList: '',
    serverGroup: '',
    accountGroupList: '',
    accounts: '',
  });

  const { serverId, setServerId, server, serverLoading } = useInitServerId();

  const { data: data, isLoading: dataLoading } = useCrmUserDealList(
    {
      params,
      pageSize,
      ...commonParams,
      serverId,
      pageNum: pageNum + 1,
      isAsc: 'asc',
      orderByColumn: '',
    },
    { enabled: !!serverId },
  );

  const reset = () => {
    setParams({
      ticket: '',
      historyFuzzyName: '',
      login: '',
      comment: '',
      accounts: '',
      operationStart: '',
      operationEnd: '',
      fuzzyCrmAccount: '',
    });
    setCommonParams({
      opeTypeList: '',
      opeType: '',
      serverGroupList: '',
      serverGroup: '',
      accountGroupList: '',
      accounts: '',
    });
    setKeyword('');
    setPageNum(0);
    setPageSize(10);
  };
  const allColumns: CRMColumnDef<CrmUserDealItem, unknown>[] = [
    {
      id: 'No.',
      size: 50,
      header: t('overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'login',
      header: t('financial.tradingAccountTransactions.login'),
      accessorFn: row => row.login,
    },
    {
      id: 'name',
      header: t('financial.tradingAccountTransactions.name'),
      accessorFn: row => row.name,
    },
    {
      id: 'crmLastName',
      header: t('financial.tradingAccountTransactions.crmLastName'),
      cell: ({ row }) => {
        if (row?.original?.crmLastName || row?.original?.crmName || row?.original?.crmShowId) {
          return (
            <div>
              <div>{(row?.original?.crmLastName ?? '') + (row?.original?.crmName ?? '')}</div>
              <div>{row.original.crmShowId ?? '--'}</div>
            </div>
          );
        }
        return '--';
      },
    },
    {
      id: 'type',
      accessorKey: 'type',
      header: t('table.operationType'),
      accessorFn: row => row.type,
    },
    {
      id: 'profit',
      accessorKey: 'profit',
      header: t('financial.tradingAccountTransactions.profit'),
      accessorFn: row => row.profit,
    },
    {
      id: 'time',
      accessorKey: 'time',
      header: t('financial.tradingAccountTransactions.time'),
      accessorFn: row => row.time,
    },
    {
      id: 'ticket',
      accessorKey: 'ticket',
      header: t('financial.tradingAccountTransactions.ticket'),
      accessorFn: row => row.ticket,
    },
    {
      id: 'order_num',
      accessorKey: 'order_num',
      header: t('financial.tradingAccountTransactions.order_num'),
      accessorFn: row => row.order_num,
    },
    {
      id: 'comment',
      accessorKey: 'comment',
      header: t('financial.tradingAccountTransactions.comment'),
      accessorFn: row => row.comment,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('trading-account-transactions-table', allColumns);

  return (
    <div>
      <PageInfo title={t('financial.tradingAccountTransactions.title')} desc={t('common.tips')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              placeholder={t('common.pleaseInput', {
                field: t('financial.tradingAccountTransactions.name'),
              })}
              className="h-9"
              leftIcon={<Search className="size-4" />}
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onLeftIconClick={e => {
                setPageNum(0);
                setParams(prev => ({
                  ...prev,
                  fuzzyCrmAccount: e,
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
                setParams={setParams}
                setCommonParams={setCommonParams}
                setServerId={setServerId}
                serverOptions={server?.rows || []}
                initialServerId={serverId}
                reset={reset}
                params={params}
                commonParams={commonParams}
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
