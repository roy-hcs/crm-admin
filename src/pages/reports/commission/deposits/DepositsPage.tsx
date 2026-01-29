import { useEffect, useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { TradingItem, TradingParams, useRebateList } from '@/api/hooks/report';
import { Funnel, Search, RefreshCcw, FileOutput } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { useGetCrmRebateTraders } from '@/api/hooks/system/system';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/types';
import { DepositsForm } from './DepositsForm';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { useInitServerId } from '@/hooks/useInitServerId';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useDepositExport } from '@/api/hooks/report/report';
import { toast } from 'sonner';
import { downloadFile } from '@/lib/utils';
import { RrhButton } from '@/components/common/RrhButton';

export function DepositsPage() {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [params, setParams] = useState<TradingParams['params']>({
    startTraderTime: '',
    endTraderTime: '',
    beginVerifyTime: '',
    endVerifyTime: '',
    accounts: '',
  });
  const [commonParams, setCommonParams] = useState<
    Omit<TradingParams, 'params' | keyof BasicParams>
  >({
    trderAccount: '',
    mtOrder: '',
    taderType: '',
    conditionName: '',
    rebateTraderId: '',
    serverGroup: '',
    rebateType: '3',
  });
  const { serverId, setServerId, server, serverLoading } = useInitServerId();
  const { data: RebateTraders, isLoading: RebateTradersLoading } = useGetCrmRebateTraders('1');

  const { data: AgencyClientTracking, isLoading: AgencyClientTrackingLoading } = useRebateList(
    {
      params,
      serverId,
      pageSize,
      ...commonParams,
      pageNum: pageNum + 1,
      serverGroupList: commonParams.serverGroup,
      rebateTraderIdList: commonParams.rebateTraderId,
      isAsc: 'asc',
      orderByColumn: '',
    },
    { enabled: !!serverId },
  );

  const reset = () => {
    setParams({
      startTraderTime: '',
      endTraderTime: '',
      beginVerifyTime: '',
      endVerifyTime: '',
      accounts: '',
    });
    setKeyword('');
    setPageNum(0);
    setPageSize(10);
  };

  const allColumns: CRMColumnDef<TradingItem, unknown>[] = [
    {
      id: 'No.',
      header: t('overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'serverName',
      header: t('trading.serverName'),
      accessorFn: row => row.serverName,
    },
    {
      id: 'mtOrder',
      header: t('trading.mtOrder'),
      accessorFn: row => row.mtOrder,
    },
    {
      id: 'login',
      header: t('trading.login'),
      accessorFn: row => row.login,
    },
    {
      id: 'symbol',
      accessorKey: 'symbol',
      header: t('trading.symbol'),
      accessorFn: row => row.symbol,
    },
    {
      id: 'volume',
      accessorKey: 'volume',
      header: t('trading.volume'),
      accessorFn: row => row.volume,
    },
    {
      id: 'traderTime',
      accessorKey: 'traderTime',
      header: t('trading.traderTime'),
      accessorFn: row => row.traderTime,
    },
    {
      id: 'userName',
      accessorKey: 'userName',
      header: t('trading.userName'),
      cell: ({ row }) => (
        <div>
          <div>{row.original.userName}</div>
          <div>{row.original.showId}</div>
        </div>
      ),
    },
    {
      id: 'rebateTotalAmt',
      accessorKey: 'rebateTotalAmt',
      header: t('trading.rebateTotalAmt'),
      cell: ({ row }) => (
        <div>
          <div>{(row.original.rebateTotalAmt || '') + (row.original.currency || '')}</div>
          <div>
            {(row.original.rebateFixedAmt || '') + '+' + (row.original.rebatePointsAmt || '')}
          </div>
        </div>
      ),
    },
    {
      id: 'rebateAccountName',
      accessorKey: 'rebateAccountName',
      header: t('trading.rebateAccountName'),
      accessorFn: row => row.rebateAccountName,
    },
    {
      id: 'rebateTime',
      accessorKey: 'rebateTime',
      header: t('trading.rebateTime'),
      accessorFn: row => row.rebateTime,
    },
    {
      id: 'rebateTraderName',
      accessorKey: 'rebateTraderName',
      header: t('trading.rebateTraderName'),
      accessorFn: row => row.rebateTraderName,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('commission-deposits-reports-table', allColumns);

  const [exportOpen, setExportOpen] = useState(false);
  const {
    mutateAsync: exportRebate,
    error: exportError,
    isPending: exportLoading,
  } = useDepositExport();
  useEffect(() => {
    if (exportError) {
      toast.error(t('common.exportFailed'), { duration: 5000 });
    }
  }, [exportError, t]);

  const handleExport = async () => {
    try {
      const result = await exportRebate({
        params,
        ...commonParams,
        serverId,
        serverGroupList: commonParams.serverGroup,
        rebateTraderIdList: commonParams.rebateTraderId,
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

  return (
    <div>
      <PageInfo title={t('deposits.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              placeholder={t('common.pleaseInput', { field: t('trading.mtOrder') })}
              className="h-9"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={e => {
                setPageNum(0);
                setCommonParams(prev => ({
                  ...prev,
                  mtOrder: e,
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
              <DepositsForm
                params={params}
                commonParams={commonParams}
                reset={reset}
                setParams={setParams}
                setServerId={setServerId}
                setCommonParams={setCommonParams}
                serverOptions={server?.rows || []}
                RebateTradersOptions={RebateTraders || []}
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
                  {t('table.exportAllDataTip', {
                    field: t('deposits.title'),
                  })}
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
          </div>
        </div>
        <DataTable
          columns={tableColumns}
          data={AgencyClientTracking?.rows || []}
          pageCount={Math.ceil(+(AgencyClientTracking?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={AgencyClientTrackingLoading || serverLoading || RebateTradersLoading}
        />
      </TableContentWrapper>
    </div>
  );
}
