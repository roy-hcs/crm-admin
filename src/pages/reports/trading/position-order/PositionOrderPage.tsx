import { usePositionOrderList, PositionOrderParams, PositionOrderItem } from '@/api/hooks/report';
import { useServerList } from '@/api/hooks/system/system';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { FileOutput, Funnel, RefreshCcw, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import { PositionOrderForm } from './PositionOrderForm';
import { TableCell } from '@/components/ui/table';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { transactionTypeMap } from '@/lib/constant';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { toast } from 'sonner';
import { usePositionOrderExport } from '@/api/hooks/report/report';
import { downloadFile } from '@/lib/utils';
import { PositionOrderForm } from './components/PositionOrderForm';
import { PositionCostDialog } from './components/PositionCostDialog';

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
const PositionOrderDetails = ({ data }: { data: PositionOrderItem }) => {
  const { t } = useTranslation();
  const detailsData = [
    { label: t('table.fullName'), value: data.params.accountName },
    { label: t('table.tradingAccount'), value: data.login },
    {
      label: t('table.transactionType'),
      value: data.type !== null ? (data.type % 2 === 0 ? 'buy' : 'sell') : '-',
    },
    { label: t('table.symbol'), value: data.symbol },
    {
      label: t('table.volume'),
      value: data.volume ? formatVolume(data.volume, data.serverType || 0, data.lotSize) : '-',
    },
    {
      label: t('table.price'),
      value: data.price || '-',
      visible: data.serverType === 1,
    },
    { label: t('table.openPrice'), value: data.price, visible: data.serverType !== 1 },

    {
      label: t('table.tradingTime'),
      value: data.time || '-',
      visible: data.serverType === 1,
    },
    { label: t('table.openTime'), value: data.time, visible: data.serverType !== 1 },

    {
      label: t('table.profitAndLoss'),
      value: data.profit !== null ? `${data.profit.toFixed(2)} ${data.currency}` : '-',
    },

    {
      label: t('table.takeProfitPrice'),
      value: data.tp !== null ? `${data.tp.toFixed(data.digits || 0)}` : '-',
    },
    {
      label: t('table.stopLossPrice'),
      value: data.sl !== null ? `${data.sl.toFixed(data.digits || 0)}` : '-',
    },

    {
      label: t('table.commission'),
      value: data.commission !== null ? `${data.commission.toFixed(2)} ${data.currency}` : '-',
    },
    {
      label: t('table.swap'),
      value: data.swaps !== null ? `${data.swaps.toFixed(2)} ${data.currency}` : '-',
    },
    { label: t('table.comment'), value: data.comment },
    { label: t('table.orderNumber'), value: data.ticket?.toString() || '-' },
  ].filter(item => item.visible !== false);
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

export const PositionOrderPage = () => {
  const [params, setParams] = useState<PositionOrderParams['params']>({
    random: new Date().getTime() + '' + Math.floor(Math.random() * 100 + 1),
    positionFuzzyName: '',
    positionFuzzyLogin: '',
    positionFuzzySymbol: '',
    positionFuzzyTicket: '',
    accounts: '',
    positionDealBJStartTime: '',
    positionDealBJEndTime: '',
  });
  const [otherParams, setOtherParams] = useState<Omit<PositionOrderParams, 'params'>>({
    server: '',
    serverGroupList: '',
    type: '',
    accountGroupList: '',
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
  const { data: positionOrderList, isLoading: positionOrderListLoading } = usePositionOrderList(
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
      random: new Date().getTime() + '' + Math.floor(Math.random() * 100 + 1),
      positionFuzzyName: '',
      positionFuzzyLogin: '',
      positionFuzzySymbol: '',
      positionFuzzyTicket: '',
      accounts: '',
      positionDealBJStartTime: '',
      positionDealBJEndTime: '',
    });
    setOtherParams({
      server: serverList?.rows[0].id || '',
      serverGroupList: '',
      type: '',
      accountGroupList: '',
      accounts: '',
    });
    setKeyword('');
    setPageNum(0);
  };

  const allColumns: CRMColumnDef<PositionOrderItem, unknown>[] = [
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
            {formatVolume(rowData.volume, selectedServer?.serviceType || 0, rowData.lotSize)}
          </div>
        ) : (
          <div>-</div>
        );
      },
    },
    {
      id: 'openPrice',
      header: t('table.openPrice'),
      accessorFn: row => row.price,
    },
    {
      id: 'openTime',
      header: t('table.openTime'),
      accessorFn: row => row.time,
    },
    {
      id: 'currentPrice',
      header: t('table.currentPrice'),
      accessorFn: row => row.priceCur,
    },
    {
      id: 'profit',
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
      label: t('common.Operation'),
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
              title={t('positionOrderPage.positionOrderDetail')}
              variant="large"
            >
              <PositionOrderDetails data={row.original} />
            </RrhDialog>
          </div>
        );
      },
      fixed: 'right',
      size: 50,
    },
  ];

  const [exportOpen, setExportOpen] = useState(false);
  const {
    mutateAsync: exportPositionOrder,
    error: exportError,
    isPending: exportLoading,
  } = usePositionOrderExport();
  useEffect(() => {
    if (exportError) {
      toast.error(t('common.exportFailed'), { duration: 5000 });
    }
  }, [exportError, t]);

  const handleExport = async () => {
    try {
      const result = await exportPositionOrder({
        params,
        ...otherParams,
      });

      if (result?.code !== 0 && result?.msg) {
        toast.error(result.msg, { duration: 5000 });
      } else if (result?.code === 0 && result?.msg) {
        downloadFile(result.msg);
        setExportOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(t('common.exportFailed'), { duration: 5000 });
    }
  };

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility<PositionOrderItem>('position-orders-table', allColumns);

  return (
    <div>
      <PageInfo title={t('positionOrderPage.positionOrder')} />
      <TableContentWrapper>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <RrhInputWithIcon
            placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
            className="h-9"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            leftIcon={<Search className="size-4 cursor-pointer" />}
            onLeftIconClick={e => {
              setParams(prev => ({ ...prev, positionFuzzyTicket: e }));
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
              <PositionOrderForm
                params={params}
                otherParams={otherParams}
                reset={reset}
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
            <RrhDialog
              title={t('common.SystemPrompt')}
              open={exportOpen}
              onOpenChange={setExportOpen}
              formLoading={exportLoading}
              trigger={
                <RrhButton variant="outline">
                  <FileOutput />
                  {t('table.export')}
                </RrhButton>
              }
              variant="small"
              footerShow={false}
            >
              <div>
                <div>
                  {t('table.exportAllDataTip', { field: t('positionOrderPage.positionOrder') })}
                </div>
                <div className="mt-4 flex justify-end gap-4 pb-4 md:pb-0">
                  <RrhButton variant="outline" onClick={() => setExportOpen(false)}>
                    {t('common.Cancel')}
                  </RrhButton>
                  <RrhButton variant="default" onClick={handleExport}>
                    {t('common.Confirm')}
                  </RrhButton>
                </div>
              </div>
            </RrhDialog>
            <PositionCostDialog
              serverId={otherParams.server}
              otherParams={otherParams}
              params={params}
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
