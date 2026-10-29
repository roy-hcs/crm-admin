import { useMemo, useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { useAgencyOverviewList, OverviewItem, OverviewParams } from '@/api/hooks/report';
import { useRebateLevelList } from '@/api/hooks/system/system';
import { Funnel, Search, RefreshCcw } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { useInitServerId } from '@/hooks/useInitServerId';
import { useAgencyOverviewExport } from '@/api/hooks/report/report';
import { Switch } from '@/components/ui/switch';
import { OverviewForm } from './components/OverviewForm';
import { PreferDialog } from './components/PreferDialog';
import { CrmAccountDetailDialog } from './components/CrmAccountDetailDialog';
import { DealAccountDetailDialog } from './components/DealAccountDetailDialog';
import { RrhButton } from '@/components/common/RrhButton';
import { ExportButton } from '@/components/common/ExportButton';
import { formatCurrencyAmount } from '@/lib/utils';
import {
  VALUE_INDICATOR_SHOW_KEYS,
  useValueIndicatorEnabled,
} from '../../components/valueIndicator';
import { ValueIndicatorHeader } from '../../components/ValueIndicatorHelp';

export function OverviewPage() {
  const { t } = useTranslation();
  const [isAsc, setIsAsc] = useState<'asc' | 'desc'>('asc');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [resetKey, setResetKey] = useState(0);
  const [params, setParams] = useState({
    userName: '',
    email: '',
    beginTime: '',
    endTime: '',
    level: '',
  });
  const [drirectFlag, setDrirectFlag] = useState(false);
  const [crmDetail, setCrmDetail] = useState<{
    open: boolean;
    userId: string;
    userName: string;
    depositFlag?: string;
  }>({ open: false, userId: '', userName: '' });
  const [dealAccountDetail, setDealAccountDetail] = useState<{
    open: boolean;
    userId: string;
    userName: string;
  }>({ open: false, userId: '', userName: '' });

  const { serverId, setServerId, server, serverLoading } = useInitServerId();
  const serverType = `${server?.rows?.find(item => item.id === serverId)?.serviceType || ''}`;
  const valueIndicatorEnabled = useValueIndicatorEnabled(VALUE_INDICATOR_SHOW_KEYS.ibDataOverview);
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
      serverType,
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
    setResetKey(k => k + 1);
    setPageNum(0);
    setPageSize(10);
    setIsAsc('asc');
  };
  const allColumns = useMemo<CRMColumnDef<OverviewItem, unknown>[]>(
    () => [
      {
        id: 'No.',
        header: t('overview.Index'),
        cell: ({ row }) => <div>{row.index + 1}</div>,
      },
      {
        id: 'userName',
        header: t('table.userName'),
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
        header: t('overview.userNumber'),
        cell: ({ row }) => {
          const value = row.original.userNumber;
          if (!value || value === '0') return <div>{value ?? '-'}</div>;
          return (
            <RrhButton
              variant="ghost"
              className="h-auto p-0"
              onClick={() =>
                setCrmDetail({
                  open: true,
                  userId: row.original.userId || '',
                  userName: row.original.username || '',
                })
              }
            >
              {value}
            </RrhButton>
          );
        },
      },
      {
        id: 'depositUserNumber',
        header: t('overview.depositUserNumber'),
        cell: ({ row }) => {
          const value = row.original.depositUserNumber;
          if (!value || value === '0') return <div>{value ?? '-'}</div>;
          return (
            <RrhButton
              variant="ghost"
              className="h-auto p-0"
              onClick={() =>
                setCrmDetail({
                  open: true,
                  userId: row.original.userId || '',
                  userName: row.original.username || '',
                  depositFlag: '1',
                })
              }
            >
              {value}
            </RrhButton>
          );
        },
      },
      {
        id: 'accountNumber',
        header: t('overview.accountNumber'),
        cell: ({ row }) => {
          const value = row.original.accountNumber;
          if (!value || value === '0') return <div>{value ?? '-'}</div>;
          return (
            <RrhButton
              variant="ghost"
              className="h-auto p-0"
              onClick={() =>
                setDealAccountDetail({
                  open: true,
                  userId: row.original.userId || '',
                  userName: row.original.username || '',
                })
              }
            >
              {value}
            </RrhButton>
          );
        },
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
      ...(valueIndicatorEnabled
        ? ([
            {
              id: 'valueIndicator',
              label: t('valueIndicator.title'),
              header: () => <ValueIndicatorHeader />,
              cell: ({ row }) =>
                row.original.valueIndicator === null || row.original.valueIndicator === undefined
                  ? '-'
                  : formatCurrencyAmount(row.original.valueIndicator, 'USD'),
            },
          ] as CRMColumnDef<OverviewItem, unknown>[])
        : []),
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
    ],
    [t, valueIndicatorEnabled],
  );

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('ib-overview-reports-table', allColumns);
  const { mutateAsync: exportFunction, isPending: exportLoading } = useAgencyOverviewExport();

  return (
    <div>
      <PageInfo title={t('overview.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              key={resetKey}
              placeholder={t('CRMAccountPage.NameOrAccountId')}
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
            <ExportButton<OverviewParams>
              title={t('overview.title')}
              exportFunction={exportFunction}
              params={{
                serverId,
                ...params,
                serverType,
                directClient: drirectFlag ? '1' : '0',
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
      <CrmAccountDetailDialog
        open={crmDetail.open}
        setOpen={open => setCrmDetail(prev => ({ ...prev, open }))}
        userId={crmDetail.userId}
        userName={crmDetail.userName}
        depositFlag={crmDetail.depositFlag}
        baseParams={{
          serverId,
          serverType,
          beginTime: params.beginTime,
          endTime: params.endTime,
          directClient: drirectFlag ? '1' : '0',
        }}
      />
      <DealAccountDetailDialog
        open={dealAccountDetail.open}
        setOpen={open => setDealAccountDetail(prev => ({ ...prev, open }))}
        userId={dealAccountDetail.userId}
        userName={dealAccountDetail.userName}
        baseParams={{
          serverId,
          serverType,
          beginTime: params.beginTime,
          endTime: params.endTime,
          directClient: drirectFlag ? '1' : '0',
        }}
      />
    </div>
  );
}
