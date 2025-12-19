import { useEffect, useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { useAgencyOverviewList, OverviewItem } from '@/api/hooks/report';
import { useServerList, useRebateLevelList } from '@/api/hooks/system/system';
import { Funnel, Search, RefreshCcw } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { OverviewForm } from './OverviewForm';

export function OverviewPage() {
  const { t } = useTranslation();
  const [isAsc, setIsAsc] = useState<'asc' | 'desc'>('asc');
  const [serverId, setServerId] = useState('');
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

  const { data: server, isLoading: serverLoading } = useServerList();
  const { data: rebateLevel } = useRebateLevelList();

  // 初始化 serverId（只在第一次拿到数据且还没选中时设置）
  useEffect(() => {
    // 自动选择第一台服务器
    if (!serverId && server?.code === 0 && server?.rows?.length) {
      // 只在还没选中时设置，避免无限循环
      setServerId(server.rows[0].id);
    }
  }, [server, serverId]);

  const { data: AgencyClientTracking, isLoading: AgencyClientTrackingLoading } =
    useAgencyOverviewList(
      {
        pageSize,
        pageNum: pageNum + 1,
        serverId,
        ...params,
        isAsc,
        serverType: '4',
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
      header: t('ib.overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'userName',
      header: t('ib.overview.userName'),
      accessorFn: row => row.username,
    },
    {
      id: 'email',
      header: t('ib.overview.email'),
      accessorFn: row => row.email,
    },
    {
      id: 'rebateLevel',
      header: t('ib.overview.rebateLevelId'),
      accessorFn: row => row.rebateLevel,
    },
    {
      id: 'userNumber',
      accessorKey: 'userNumber',
      header: t('ib.overview.userNumber'),
      accessorFn: row => row.userNumber,
    },
    {
      id: 'depositUserNumber',
      accessorKey: 'depositUserNumber',
      header: t('ib.overview.depositUserNumber'),
      accessorFn: row => row.depositUserNumber,
    },
    {
      id: 'accountNumber',
      accessorKey: 'accountNumber',
      header: t('ib.overview.accountNumber'),
      accessorFn: row => row.accountNumber,
    },
    {
      id: 'balance',
      accessorKey: 'balance',
      header: t('ib.overview.balance'),
      accessorFn: row => row.balance,
    },
    {
      id: 'depositAmount',
      accessorKey: 'depositAmount',
      header: t('ib.overview.depositAmount'),
      accessorFn: row => row.depositAmount,
    },
    {
      id: 'withdrawAmount',
      accessorKey: 'withdrawAmount',
      header: t('ib.overview.withdrawAmount'),
      accessorFn: row => row.withdrawAmount,
    },
    {
      id: 'netDeposit',
      accessorKey: 'netDeposit',
      header: t('ib.overview.netDeposit'),
      accessorFn: row => row.netDeposit,
    },
    {
      id: 'volume',
      accessorKey: 'volume',
      header: t('ib.overview.volume'),
      accessorFn: row => row.volume,
    },
    {
      id: 'profitAndLoss',
      accessorKey: 'profitAndLoss',
      header: t('ib.overview.profitAndLoss'),
      accessorFn: row => row.profitAndLoss,
    },
    {
      id: 'commission',
      accessorKey: 'commission',
      header: t('ib.overview.commission'),
      accessorFn: row => row.commission,
    },
    {
      id: 'swaps',
      accessorKey: 'swaps',
      header: t('ib.overview.swaps'),
      accessorFn: row => row.swaps,
    },
    {
      id: 'rebateOnTrade',
      accessorKey: 'rebateOnTrade',
      header: t('ib.overview.rebateOnTrade'),
      accessorFn: row => row.rebateOnTrade,
    },
    {
      id: 'rebateOnCommission',
      accessorKey: 'rebateOnCommission',
      header: t('ib.overview.rebateOnCommission'),
      accessorFn: row => row.rebateOnCommission,
    },
    {
      id: 'rebateOnDeposit',
      accessorKey: 'rebateOnDeposit',
      header: t('ib.overview.rebateOnDeposit'),
      accessorFn: row => row.rebateOnDeposit,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('ib-overview-reports-table', allColumns);

  return (
    <div>
      <PageInfo title={t('ib.overview.title')} />
      <div className="mt-3.5 mb-3.5 flex justify-between">
        <div className="w-67 max-w-sm">
          <RrhInputWithIcon
            placeholder={t('CRMAccountPage.NameOrAccountId')}
            className="h-9"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            rightIcon={<Search className="size-4" />}
            onRightIconClick={() => {
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
        loading={AgencyClientTrackingLoading || serverLoading}
      />
    </div>
  );
}
