import {
  TradingHistoryItem,
  TradingHistoryParams,
  useTradingHistoryList,
} from '@/api/hooks/report';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { FileOutput, Funnel, RefreshCcw, Search } from 'lucide-react';
import { TradingHistoryForm } from './TradingHistoryForm';
import { useEffect, useState } from 'react';
import { useServerList } from '@/api/hooks/system/system';
import { useTranslation } from 'react-i18next';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { BasicParams } from '@/api/types';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { tradingHistoryTypeMap, transactionTypeMap } from '@/lib/constant';
import { Checkbox } from '@/components/ui/checkbox';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { useTradingHistoryExport } from '@/api/hooks/report/report';
import { toast } from 'sonner';
import { downloadFile } from '@/lib/utils';

const formatVolume = (volume: number | null, serverType: number) => {
  if (volume === null) {
    return '-';
  }
  switch (serverType) {
    case 1:
      return (volume * 0.0001).toFixed(2);
    case 2:
      return (volume * 0.01).toFixed(2);
    case 3:
      return volume.toFixed(2);
    case 4:
      return (volume * 0.00001).toFixed(2);
    default:
      return volume.toString();
  }
};

const TradingHistoryDetails = ({ data }: { data: TradingHistoryItem }) => {
  const { t } = useTranslation();
  const detailsData = [
    { label: t('table.fullName'), value: data.name },
    { label: t('table.tradingAccount'), value: data.login },
    {
      label: t('table.transactionType'),
      value:
        data.type === 0 || data.type === 1
          ? transactionTypeMap[data.type as keyof typeof transactionTypeMap]
          : t(tradingHistoryTypeMap[data.type as keyof typeof tradingHistoryTypeMap]) || data.type,
    },
    { label: t('table.symbol'), value: data.symbol },
    {
      label: t('table.volume'),
      value: formatVolume(data.volume, data.serverType || 0),
    },
    {
      label: t('table.price'),
      value: data.price !== null ? `${data.price.toFixed(data.digits || 0)} ${data.currency}` : '-',
      visible: data.serverType === 1,
    },
    {
      label: t('table.tradingTime'),
      value: data.time || '-',
      visible: data.serverType === 1,
    },
    {
      label: t('table.profitAndLoss'),
      value: data.profit !== null ? `${data.profit.toFixed(2)} ${data.currency}` : '-',
      visible: (data.type || 0) < 2,
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
    { label: t('table.orderNumber'), value: data.ticket?.toString() || '-' },
    { label: t('table.comment'), value: data.comment },
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
export const TradingHistoryPage = () => {
  const [params, setParams] = useState<TradingHistoryParams['params']>({
    selectOther: '',
    historyDealBJStartTime: '',
    historyDealBJEndTime: '',
    historyCloseStartTime: '',
    historyCloseEndTime: '',
    accounts: '',
    historyFuzzyName: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<TradingHistoryParams, 'params' | keyof BasicParams>
  >({
    serverType: '',
    serverId: '',
    serverGroupList: '',
    serverGroup: '',
    type: '',
    symbol: '',
    ticket: '',
    login: '',
    accountGroupList: '',
    accounts: '',
    positionID: '',
    entry: '',
    breedGroup: '',
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
        serverId: serverList.rows[0].id,
        serverType: serverList.rows[0].serviceType.toString(),
      }));
    }
  }, [serverList]);
  const { data, isLoading } = useTradingHistoryList(
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
      enabled: otherParams.serverId !== '' && otherParams.serverType !== '',
    },
  );

  const reset = () => {
    setParams({
      selectOther: '',
      historyDealBJStartTime: '',
      historyDealBJEndTime: '',
      historyCloseStartTime: '',
      historyCloseEndTime: '',
      accounts: '',
    });
    setOtherParams({
      serverType: serverList?.rows[0].serviceType.toString() || '',
      serverId: serverList?.rows[0].id || '',
      serverGroupList: '',
      serverGroup: '',
      type: '',
      symbol: '',
      ticket: '',
      login: '',
      accountGroupList: '',
      accounts: '',
      positionID: '',
      entry: '',
    });
    setKeyword('');
    setPageNum(0);
  };

  const allColumns: CRMColumnDef<TradingHistoryItem, unknown>[] = [
    {
      id: 'select',
      label: t('common.select'),
      header: ({ table }) => (
        <Checkbox
          className="data-[state=checked]:border-slate-700"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="data-[state=checked]:border-slate-700"
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'No.',
      header: t('CRMAccountPage.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'userName',
      header: t('CRMAccountPage.UserName'),
      accessorFn: row => row.name,
    },
    {
      id: 'login',
      header: t('table.tradingAccount'),
      accessorFn: row => row.login,
    },
    {
      id: 'ticket',
      header: t('table.orderNumber'),
      accessorFn: row => row.ticket,
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
        return rowData.traderCount && rowData.lotSize ? (
          <div>{(rowData.traderCount / rowData.lotSize).toFixed(2)}</div>
        ) : (
          <div>-</div>
        );
      },
    },
    {
      id: 'openPrice',
      header: t('table.openPrice'),
      accessorFn: row => row.openPrice,
    },
    {
      id: 'openTime',
      header: t('table.openTime'),
      accessorFn: row => row.openTime,
    },
    {
      id: 'closePrice',
      header: t('table.closePrice'),
      accessorFn: row => row.closePrice,
    },
    {
      id: 'closeTime',
      header: t('table.closeTime'),
      accessorFn: row => row.closeTime,
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
      id: 'commission',
      header: t('table.commission'),
      cell: ({ row }) => {
        const rowData = row.original;
        return rowData.commission !== null ? (
          <div>
            {rowData.commission.toFixed(2)} {rowData.currency}
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
        const onClick = (data: TradingHistoryItem) => {
          console.log('Operate on row:', data);
        };
        return (
          <div>
            <RrhDialog
              trigger={
                <RrhButton variant="ghost" onClick={() => onClick(row.original)}>
                  {t('common.View')}
                </RrhButton>
              }
              cancelText={t('common.close')}
              confirmShow={false}
              title={t('tradingHistoryPage.tradingHistoryDetail')}
              variant="large"
            >
              <TradingHistoryDetails data={row.original} />
            </RrhDialog>
          </div>
        );
      },
      fixed: 'right',
      size: 50,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility<TradingHistoryItem>('trading-history-table', allColumns);

  const [exportOpen, setExportOpen] = useState(false);
  const {
    mutateAsync: exportTradingHistory,
    error: exportError,
    isPending: exportLoading,
  } = useTradingHistoryExport();
  useEffect(() => {
    if (exportError) {
      toast.error(t('common.exportFailed'), { duration: 5000 });
    }
  }, [exportError, t]);

  return (
    <div>
      <PageInfo title={t('tradingHistoryPage.tradingHistory')} />
      <TableContentWrapper>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <RrhInputWithIcon
            placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
            className="h-9"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            leftIcon={<Search className="size-4 cursor-pointer" />}
            onLeftIconClick={e => {
              setOtherParams(prev => ({ ...prev, ticket: e }));
              setPageNum(0);
            }}
          />
          <div className="flex items-center justify-end gap-2">
            <RrhButton variant="outline">{t('table.batchDelete')}</RrhButton>
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
              <TradingHistoryForm
                params={params}
                otherParams={otherParams}
                reset={reset}
                serverListLoading={serverListLoading}
                serverList={serverList?.rows || []}
                setParams={setParams}
                setOtherParams={setOtherParams}
                loading={isLoading}
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
                  {t('table.exportAllDataTip', { field: t('tradingHistoryPage.tradingHistory') })}
                </div>
                <div className="mt-4 flex justify-end gap-4 pb-4 md:pb-0">
                  <RrhButton variant="outline" onClick={() => setExportOpen(false)}>
                    {t('common.Cancel')}
                  </RrhButton>
                  <RrhButton
                    variant="default"
                    onClick={async () => {
                      try {
                        const result = await exportTradingHistory({
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
                    }}
                  >
                    {t('common.Confirm')}
                  </RrhButton>
                </div>
              </div>
            </RrhDialog>
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
          loading={isLoading}
        />
      </TableContentWrapper>
    </div>
  );
};
