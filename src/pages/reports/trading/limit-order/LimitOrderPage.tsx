import { useLimitOrderList, LimitOrderListParams, LimitOrderListItem } from '@/api/hooks/report';
import { useServerList } from '@/api/hooks/system/system';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LimitOrderForm } from './LimitOrderForm';
import { TableCell } from '@/components/ui/table';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { transactionTypeMap } from '@/lib/constant';
import { RrhDialog } from '@/components/common/RrhDialog';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

const formatVolume = (volume: number | null, serverType: number, lotSize: number | null) => {
  if (volume === null) {
    return '-';
  }
  switch (serverType) {
    case 1:
      return (volume / 10000.0).toFixed(2);
    case 2:
      return (volume / 100.0).toFixed(2);
    case 3:
      return (volume / 100.0).toFixed(2);
    case 4:
      return (volume / (lotSize || 1.0)).toFixed(2);
    case 5:
      return volume.toFixed(2);
    default:
      return volume.toString();
  }
};
const LimitOrderDetails = ({ data }: { data: LimitOrderListItem }) => {
  const { t } = useTranslation();
  const detailsData = [
    { label: t('table.fullName'), value: data.params.accountName },
    { label: t('table.tradingAccount'), value: data.login },
    {
      label: t('table.transactionType'),
      value: data.type !== null ? (data.type % 2 === 0 ? 'buy' : 'sell') : '-',
      visble: data.type !== null,
    },
    { label: t('table.symbol'), value: data.symbol },
    {
      label: t('table.volume'),
      value: data.volume ? formatVolume(data.volume, data.serverType || 0, data.lotSize) : '-',
    },
    {
      label: t('table.orderPlacementPrice'),
      value: data.price !== null ? data.price.toFixed(data.digits || 0) : '-',
    },
    { label: t('table.orderPlacementTime'), value: data.time || '-' },
    {
      label: t('table.takeProfitPrice'),
      value: data.tp !== null ? `${data.tp.toFixed(data.digits || 0)}` : '-',
    },
    {
      label: t('table.stopLossPrice'),
      value: data.sl !== null ? `${data.sl.toFixed(data.digits || 0)}` : '-',
    },
    { label: t('table.orderNumber'), value: data.ticket?.toString() || '-' },
  ];
  return (
    <div className="grid grid-cols-2 gap-x-0 gap-y-6">
      {detailsData.map((item, index) => {
        return (
          <div className="grid gap-2" key={`${item.label}-${index}`}>
            <div className="text-foreground text-sm leading-5 font-medium">{item.label}</div>
            <div className="text-muted-foreground text-sm leading-5">{item.value || '-'}</div>
          </div>
        );
      })}
    </div>
  );
};

export const LimitOrderPage = () => {
  const [params, setParams] = useState<LimitOrderListParams['params']>({
    positionFuzzyType: '',
    positionFuzzyName: '',
    positionFuzzyLogin: '',
    positionFuzzySymbol: '',
    positionFuzzyTicket: '',
    accounts: '',
    positionDealBJStartTime: '',
    positionDealBJEndTime: '',
  });
  const [otherParams, setOtherParams] = useState<Omit<LimitOrderListParams, 'params'>>({
    server: '',
    serverGroupList: '',
    accounts: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const { data: serverList, isLoading: serverListLoading } = useServerList();
  useEffect(() => {
    if (serverList && serverList.rows && serverList.rows.length > 0) {
      setOtherParams(prev => ({
        ...prev,
        server: serverList.rows[0].id,
      }));
    }
  }, [serverList]);
  const selectedServer = useMemo(() => {
    return serverList?.rows?.find(item => otherParams.server === item.id);
  }, [otherParams.server, serverList?.rows]);
  const { data: positionOrderList, isLoading: positionOrderListLoading } = useLimitOrderList(
    {
      pageSize,
      pageNum: pageNum + 1,
      orderByColumn: '',
      isAsc: 'asc',
      ...otherParams,
      params: {
        ...params,
      },
    },
    { enabled: otherParams.server !== '' },
  );
  const reset = () => {
    setParams({
      positionFuzzyType: '',
      positionFuzzyName: '',
      positionFuzzyLogin: '',
      positionFuzzySymbol: '',
      positionFuzzyTicket: '',
      accounts: '',
      positionDealBJStartTime: '',
      positionDealBJEndTime: '',
    });
    setOtherParams({
      server: '',
      serverGroupList: '',
      accounts: '',
    });
    setPageNum(0);
  };
  const allColumns: CRMColumnDef<LimitOrderListItem, unknown>[] = [
    {
      id: 'No.',
      header: t('CRMAccountPage.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'userName',
      header: t('CRMAccountPage.UserName'),
      accessorFn: row => row.params.accountName,
    },
    {
      id: 'login',
      header: t('table.tradingAccount'),
      accessorFn: row => row.login,
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
        return rowData.volume && rowData.lotSize ? (
          <div>
            {formatVolume(rowData.volume, selectedServer?.serviceType || 0, rowData.lotSize)}{' '}
          </div>
        ) : (
          <div>-</div>
        );
      },
    },
    {
      id: 'openPrice',
      header: t('table.orderPlacementPrice'),
      cell: ({ row }) => {
        return <div>{(row.original.price || 0).toFixed(row.original.digits || 2)}</div>;
      },
    },
    {
      id: 'openTime',
      header: t('table.orderPlacementTime'),
      accessorFn: row => row.time,
    },
    {
      id: 'currentPrice',
      header: t('table.currentPrice'),
      cell: ({ row }) => {
        return <div>{(row.original.priceCur || 0).toFixed(row.original.digits || 2)}</div>;
      },
    },
    {
      id: 'ticket',
      header: t('table.orderNumber'),
      accessorFn: row => row.ticket,
    },
    {
      id: 'comment',
      header: t('table.comment'),
      accessorFn: row => row.comment,
    },
    {
      id: 'operate',
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      cell: ({ row }) => {
        return (
          <div>
            <RrhDialog
              trigger={<RrhButton variant="ghost">{t('common.View')}</RrhButton>}
              cancelText={t('common.close')}
              confirmShow={false}
              title={t('limitOrderPage.limitOrderDetail')}
              variant="large"
            >
              <LimitOrderDetails data={row.original} />
            </RrhDialog>
          </div>
        );
      },
    },
  ];
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility<LimitOrderListItem>('limit-orders-table', allColumns);

  return (
    <div>
      <PageInfo title={t('limitOrderPage.limitOrder')} />
      <TableContentWrapper>
        <div className="mb-3 flex items-center justify-between">
          <RrhInputWithIcon
            placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
            className="h-9"
            leftIcon={<Search className="size-4 cursor-pointer" />}
            onLeftIconClick={e => {
              setParams(prev => ({ ...prev, positionFuzzyTicket: e }));
              setPageNum(0);
            }}
          />
          <div className="flex justify-end gap-2">
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
              <LimitOrderForm
                reset={reset}
                params={params}
                otherParams={otherParams}
                serverListLoading={serverListLoading}
                serverList={serverList?.rows || []}
                setParams={setParams}
                setOtherParams={setOtherParams}
                loading={positionOrderListLoading}
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
          data={positionOrderList?.rows || []}
          pageCount={Math.ceil(+(positionOrderList?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={positionOrderListLoading}
          CustomRow={
            <>
              <TableCell colSpan={5}>{t('table.total')}</TableCell>
              <TableCell colSpan={4}>
                {(
                  positionOrderList?.totalList.reduce((pre, cur) => pre + cur.totalVolume, 0) || 0
                ).toFixed(2)}
              </TableCell>
              <TableCell colSpan={1}>
                {positionOrderList?.totalList.map(item => {
                  return (
                    <div key={item.currency}>
                      {item.totalProfit} {item.currency}
                    </div>
                  );
                })}
              </TableCell>
              <TableCell colSpan={1}>
                {positionOrderList?.totalList.map(item => {
                  return (
                    <div key={item.currency}>
                      {item.totalSwaps} {item.currency}
                    </div>
                  );
                })}
              </TableCell>
            </>
          }
        />
      </TableContentWrapper>
    </div>
  );
};
