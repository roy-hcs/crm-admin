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

const formatVolume = (serverType: number | undefined, volume: number, lotSize: number) => {
  if (serverType == 1) {
    //MT5
    return (volume / 10000).toFixed(2);
  } else if (serverType == 2) {
    return (volume / 100).toFixed(2);
  } else if (serverType == 4) {
    return (volume / (lotSize || 1.0)).toFixed(2);
  } else {
    return volume.toFixed(2);
  }
};
const LimitOrderDetails = ({
  data,
  serviceType,
}: {
  data: LimitOrderListItem;
  serviceType: number | undefined;
}) => {
  const { t } = useTranslation();
  const detailsData = [
    { label: t('table.fullName'), value: data.params.accountName },
    { label: t('table.tradingAccount'), value: data.login },
    {
      label: t('table.transactionType'),
      value: transactionTypeMap[data.type as keyof typeof transactionTypeMap] || data.type,
    },
    { label: t('table.symbol'), value: data.symbol },
    {
      label: t('table.volume'),
      value:
        data.volume && data.lotSize ? formatVolume(serviceType, data.volume, data.lotSize) : '-',
    },
    { label: t('table.orderPlacementPrice'), value: (data.price || 0).toFixed(data.digits || 2) },
    { label: t('table.orderPlacementTime'), value: data.time },
    // UI上存在以下字段，但接口返回数据中似乎没有相关数据，暂时隐藏
    // { label: t('table.takeProfitPrice'), value: data.takeProfitPrice },
    // { label: t('table.stopLossPrice'), value: data.stopLossPrice },
    { label: t('table.orderNumber'), value: data.ticket?.toString() || '-' },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {detailsData.map((item, index) => {
        return (
          <div className="flex items-center gap-2" key={`${item.label}-${index}`}>
            <span>{item.label}:</span>
            <span>{item.value}</span>
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
  const [keyword, setKeyword] = useState('');
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
          <div>{formatVolume(selectedServer?.serviceType, rowData.volume, rowData.lotSize)} </div>
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
              title={t('tradingHistoryPage.tradingHistoryDetail')}
            >
              <LimitOrderDetails data={row.original} serviceType={selectedServer?.serviceType} />
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
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
          className="h-9"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
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
    </div>
  );
};
