import { useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import {
  AgencyClientTrackingItem,
  ClientTrackingParams,
  useAgencyClientTrackingList,
} from '@/api/hooks/report';
import { Funnel, Search, RefreshCcw, FileOutput } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { ClientTrackingForm } from './ClientTrackingForm';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { useAgencyClientTrackingExport } from '@/api/hooks/report/report';
import { RrhDialog } from '@/components/common/RrhDialog';
import { RrhButton } from '@/components/common/RrhButton';
import { toast } from 'sonner';
import { downloadFile } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

export function ClientTrackingPage() {
  const { t } = useTranslation();
  const [isAsc, setIsAsc] = useState<'asc' | 'desc'>('asc');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [params, setParams] = useState<
    Pick<ClientTrackingParams, 'userName' | 'email' | 'statisticMonth' | 'level'>
  >({
    userName: '',
    email: '',
    statisticMonth: '',
    level: '',
  });
  const [drirectFlag, setDrirectFlag] = useState(false);

  const { data: AgencyClientTracking, isLoading } = useAgencyClientTrackingList({
    pageSize,
    pageNum: pageNum + 1,
    ...params,
    drirectFlag: drirectFlag ? '1' : '0',
    isAsc,
  });

  const reset = () => {
    setParams({
      userName: '',
      email: '',
      statisticMonth: '',
      level: '',
    });
    setKeyword('');
    setPageNum(0);
    setPageSize(10);
    setIsAsc('asc');
  };

  const allColumns: CRMColumnDef<AgencyClientTrackingItem, unknown>[] = [
    {
      id: 'No.',
      header: t('ib.CustomerTracking.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'userName',
      header: t('ib.CustomerTracking.userName'),
      cell: ({ row }) => (
        <div>
          <div>{row.original.userName}</div>
          <div>{row.original.email}</div>
        </div>
      ),
    },
    {
      id: 'levelName',
      header: t('ib.CustomerTracking.levelName'),
      cell: ({ row }) => (
        <div className="max-w-25 whitespace-pre-wrap">
          <span>{row.original.levelName}</span>
          <span>{row.original.level}</span>
        </div>
      ),
    },
    {
      id: 'statisticMonthStr',
      header: t('ib.CustomerTracking.statisticMonthStr'),
      accessorFn: row => row.statisticMonthStr,
    },
    {
      id: 'allFirstDeposit',
      accessorKey: 'allFirstDeposit',
      header: t('ib.CustomerTracking.allFirstDeposit'),
      accessorFn: row => row.allFirstDeposit,
    },
    {
      id: 'newClient',
      accessorKey: 'newClient',
      header: t('ib.CustomerTracking.newClient'),
      accessorFn: row => row.newClient,
    },
    {
      id: 'kycProved',
      accessorKey: 'kycProved',
      header: t('ib.CustomerTracking.kycProved'),
      accessorFn: row => row.kycProved,
    },
    {
      id: 'taCreateLive',
      accessorKey: 'taCreateLive',
      header: t('ib.CustomerTracking.taCreateLive'),
      accessorFn: row => row.taCreateLive,
    },
    {
      id: 'newFirstDeposit',
      accessorKey: 'newFirstDeposit',
      header: t('ib.CustomerTracking.newFirstDeposit'),
      accessorFn: row => row.newFirstDeposit,
    },
    {
      id: 'depositClient',
      accessorKey: 'depositClient',
      header: t('ib.CustomerTracking.depositClient'),
      accessorFn: row => row.depositClient,
    },
    {
      id: 'tradeClient',
      accessorKey: 'tradeClient',
      header: t('ib.CustomerTracking.tradeClient'),
      accessorFn: row => row.tradeClient,
    },
    {
      id: 'depositFirstStr',
      accessorKey: 'depositFirstStr',
      header: t('ib.CustomerTracking.depositFirstStr'),
      accessorFn: row => row.depositFirstStr,
    },
    {
      id: 'depositTotalStr',
      accessorKey: 'depositTotalStr',
      header: t('ib.CustomerTracking.depositTotalStr'),
      accessorFn: row => row.depositTotalStr,
    },
    {
      id: 'withdrawTotalStr',
      accessorKey: 'withdrawTotalStr',
      header: t('ib.CustomerTracking.withdrawTotalStr'),
      accessorFn: row => row.withdrawTotalStr,
    },
    {
      id: 'netTotalStr',
      accessorKey: 'netTotalStr',
      header: t('ib.CustomerTracking.netTotalStr'),
      accessorFn: row => row.netTotalStr,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('client-tracking-reports-table', allColumns);

  const [exportOpen, setExportOpen] = useState(false);
  const { mutateAsync: exportFunction, isPending: exportLoading } = useAgencyClientTrackingExport();

  const handleExport = async () => {
    try {
      const result = await exportFunction({
        ...params,
        drirectFlag: drirectFlag ? '1' : '0',
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
      <PageInfo title={t('ib.CustomerTracking.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              placeholder={t('ib.CustomerTracking.nameOrAccountId')}
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
              <ClientTrackingForm params={params} reset={reset} setParams={setParams} />
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
                    field: t('ib.CustomerTracking.title'),
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
              <span>{t('ib.CustomerTracking.directBroker')}</span>
              <Switch
                checked={Boolean(drirectFlag)}
                onCheckedChange={() => {
                  setDrirectFlag(!drirectFlag);
                }}
              />
            </div>
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
          loading={isLoading}
        />
      </TableContentWrapper>
    </div>
  );
}
