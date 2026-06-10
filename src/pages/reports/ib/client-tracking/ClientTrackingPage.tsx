import { useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import {
  AgencyClientTrackingItem,
  ClientTrackingParams,
  useAgencyClientTrackingList,
} from '@/api/hooks/report';
import { Funnel, Search, RefreshCcw } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { ClientTrackingForm } from './ClientTrackingForm';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { useAgencyClientTrackingExport } from '@/api/hooks/report/report';
import { Switch } from '@/components/ui/switch';
import { ExportButton } from '@/components/common/ExportButton';

export function ClientTrackingPage() {
  const { t } = useTranslation();
  const [isAsc, setIsAsc] = useState<'asc' | 'desc'>('asc');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [resetKey, setResetKey] = useState(0);
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
    setResetKey(k => k + 1);
    setPageNum(0);
    setPageSize(10);
    setIsAsc('asc');
  };

  const allColumns: CRMColumnDef<AgencyClientTrackingItem, unknown>[] = [
    {
      id: 'No.',
      header: t('customerTracking.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'userName',
      header: t('table.userName'),
      cell: ({ row }) => (
        <div>
          <div>{row.original.userName}</div>
          <div>{row.original.email}</div>
        </div>
      ),
    },
    {
      id: 'levelName',
      header: t('customerTracking.levelName'),
      cell: ({ row }) => (
        <div className="max-w-25 whitespace-pre-wrap">
          <span>{row.original.levelName}</span>
          <span>{row.original.level}</span>
        </div>
      ),
    },
    {
      id: 'statisticMonthStr',
      header: t('customerTracking.statisticMonthStr'),
      accessorFn: row => row.statisticMonthStr,
    },
    {
      id: 'allFirstDeposit',
      accessorKey: 'allFirstDeposit',
      header: t('customerTracking.allFirstDeposit'),
      accessorFn: row => row.allFirstDeposit,
    },
    {
      id: 'newClient',
      accessorKey: 'newClient',
      header: t('customerTracking.newClient'),
      accessorFn: row => row.newClient,
    },
    {
      id: 'kycProved',
      accessorKey: 'kycProved',
      header: t('customerTracking.kycProved'),
      accessorFn: row => row.kycProved,
    },
    {
      id: 'taCreateLive',
      accessorKey: 'taCreateLive',
      header: t('customerTracking.taCreateLive'),
      accessorFn: row => row.taCreateLive,
    },
    {
      id: 'newFirstDeposit',
      accessorKey: 'newFirstDeposit',
      header: t('customerTracking.newFirstDeposit'),
      accessorFn: row => row.newFirstDeposit,
    },
    {
      id: 'depositClient',
      accessorKey: 'depositClient',
      header: t('customerTracking.depositClient'),
      accessorFn: row => row.depositClient,
    },
    {
      id: 'tradeClient',
      accessorKey: 'tradeClient',
      header: t('customerTracking.tradeClient'),
      accessorFn: row => row.tradeClient,
    },
    {
      id: 'depositFirstStr',
      accessorKey: 'depositFirstStr',
      header: t('customerTracking.depositFirstStr'),
      accessorFn: row => row.depositFirstStr,
    },
    {
      id: 'depositTotalStr',
      accessorKey: 'depositTotalStr',
      header: t('customerTracking.depositTotalStr'),
      accessorFn: row => row.depositTotalStr,
    },
    {
      id: 'withdrawTotalStr',
      accessorKey: 'withdrawTotalStr',
      header: t('customerTracking.withdrawTotalStr'),
      accessorFn: row => row.withdrawTotalStr,
    },
    {
      id: 'netTotalStr',
      accessorKey: 'netTotalStr',
      header: t('customerTracking.netTotalStr'),
      accessorFn: row => row.netTotalStr,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('client-tracking-reports-table', allColumns);
  const { mutateAsync: exportFunction, isPending: exportLoading } = useAgencyClientTrackingExport();

  return (
    <div>
      <PageInfo title={t('customerTracking.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              key={resetKey}
              placeholder={t('customerTracking.nameOrAccountId')}
              className="h-9"
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={value => {
                setParams(prev => ({ ...prev, userName: value }));
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
            <ExportButton<ClientTrackingParams>
              title={t('customerTracking.title')}
              exportFunction={exportFunction}
              params={{
                ...params,
                drirectFlag: drirectFlag ? '1' : '0',
              }}
              exportLoading={exportLoading}
            />
            <div className="flex items-center justify-center gap-2">
              <span>{t('customerTracking.directBroker')}</span>
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
