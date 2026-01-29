import { useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { useAgencyOverviewList, OverviewItem } from '@/api/hooks/report';
import { useRebateLevelList } from '@/api/hooks/system/system';
import { Funnel, Search, RefreshCcw, FileOutput } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { useInitServerId } from '@/hooks/useInitServerId';
import { useAgencyOverviewExport } from '@/api/hooks/report/report';
import { toast } from 'sonner';
import { downloadFile } from '@/lib/utils';
import { RrhDialog } from '@/components/common/RrhDialog';
import { RrhButton } from '@/components/common/RrhButton';
import { Switch } from '@/components/ui/switch';
import { OverviewForm } from './components/OverviewForm';
import { PreferDialog } from './components/PreferDialog';

export function OverviewPage() {
  const { t } = useTranslation();
  const [isAsc, setIsAsc] = useState<'asc' | 'desc'>('asc');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [params, setParams] = useState({
    userName: '',
    email: '',
    beginTime: '',
    endTime: '',
    level: '',
  });
  const [drirectFlag, setDrirectFlag] = useState(false);

  const { serverId, setServerId, server, serverLoading } = useInitServerId();
  const { data: rebateLevel } = useRebateLevelList();
  const {
    data: AgencyClientTracking,
    isLoading,
    refetch,
  } = useAgencyOverviewList(
    {
      pageSize,
      pageNum: pageNum + 1,
      serverId,
      ...params,
      isAsc,
      serverType: '4',
      directClient: drirectFlag ? '1' : '0',
    },
    { enabled: !!serverId },
  );

  const reset = () => {
    setParams({
      userName: '',
      email: '',
      beginTime: '',
      endTime: '',
      level: '',
    });
    setKeyword('');
    setPageNum(0);
    setPageSize(10);
    setIsAsc('asc');
  };
  const allColumns: CRMColumnDef<OverviewItem, unknown>[] = [
    {
      id: 'No.',
      header: t('overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'userName',
      header: t('overview.userName'),
      accessorFn: row => row.username,
    },
    {
      id: 'email',
      header: t('overview.email'),
      accessorFn: row => row.email,
    },
    {
      id: 'rebateLevel',
      header: t('overview.rebateLevelId'),
      accessorFn: row => row.rebateLevel,
    },
    {
      id: 'userNumber',
      accessorKey: 'userNumber',
      header: t('overview.userNumber'),
      accessorFn: row => row.userNumber,
    },
    {
      id: 'depositUserNumber',
      accessorKey: 'depositUserNumber',
      header: t('overview.depositUserNumber'),
      accessorFn: row => row.depositUserNumber,
    },
    {
      id: 'accountNumber',
      accessorKey: 'accountNumber',
      header: t('overview.accountNumber'),
      accessorFn: row => row.accountNumber,
    },
    {
      id: 'balance',
      accessorKey: 'balance',
      header: t('overview.balance'),
      accessorFn: row => row.balance,
    },
    {
      id: 'depositAmount',
      accessorKey: 'depositAmount',
      header: t('overview.depositAmount'),
      accessorFn: row => row.depositAmount,
    },
    {
      id: 'withdrawAmount',
      accessorKey: 'withdrawAmount',
      header: t('overview.withdrawAmount'),
      accessorFn: row => row.withdrawAmount,
    },
    {
      id: 'netDeposit',
      accessorKey: 'netDeposit',
      header: t('overview.netDeposit'),
      accessorFn: row => row.netDeposit,
    },
    {
      id: 'volume',
      accessorKey: 'volume',
      header: t('overview.volume'),
      accessorFn: row => row.volume,
    },
    {
      id: 'profitAndLoss',
      accessorKey: 'profitAndLoss',
      header: t('overview.profitAndLoss'),
      accessorFn: row => row.profitAndLoss,
    },
    {
      id: 'commission',
      accessorKey: 'commission',
      header: t('overview.commission'),
      accessorFn: row => row.commission,
    },
    {
      id: 'swaps',
      accessorKey: 'swaps',
      header: t('overview.swaps'),
      accessorFn: row => row.swaps,
    },
    {
      id: 'rebateOnTrade',
      accessorKey: 'rebateOnTrade',
      header: t('overview.rebateOnTrade'),
      accessorFn: row => row.rebateOnTrade,
    },
    {
      id: 'rebateOnCommission',
      accessorKey: 'rebateOnCommission',
      header: t('overview.rebateOnCommission'),
      accessorFn: row => row.rebateOnCommission,
    },
    {
      id: 'rebateOnDeposit',
      accessorKey: 'rebateOnDeposit',
      header: t('overview.rebateOnDeposit'),
      accessorFn: row => row.rebateOnDeposit,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('ib-overview-reports-table', allColumns);

  const [exportOpen, setExportOpen] = useState(false);
  const { mutateAsync: exportFunction, isPending: exportLoading } = useAgencyOverviewExport();

  const handleExport = async () => {
    try {
      const result = await exportFunction({
        serverId,
        ...params,
        serverType: '4',
        directClient: drirectFlag ? '1' : '0',
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
      <PageInfo title={t('overview.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              placeholder={t('CRMAccountPage.NameOrAccountId')}
              className="h-9"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={() => {
                setParams(prev => ({ ...prev, userName: keyword }));
                setPageNum(0);
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
              <OverviewForm
                setParams={setParams}
                serverOptions={server?.rows || []}
                rebateLevelOptions={rebateLevel?.rows || []}
                setServerId={setServerId}
                initialServerId={serverId}
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
                    field: t('overview.title'),
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
            <div className="flex items-center justify-center gap-2">
              <span>{t('customerTracking.directBroker')}</span>
              <Switch
                checked={Boolean(drirectFlag)}
                onCheckedChange={() => {
                  setDrirectFlag(!drirectFlag);
                }}
              />
            </div>
            <PreferDialog onSuccess={refetch} />
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
          loading={isLoading || serverLoading}
        />
      </TableContentWrapper>
    </div>
  );
}
