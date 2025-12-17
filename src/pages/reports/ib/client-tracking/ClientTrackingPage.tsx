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

  const { data: AgencyClientTracking, isLoading: AgencyClientTrackingLoading } =
    useAgencyClientTrackingList({
      pageSize,
      pageNum: pageNum + 1,
      ...params,
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

  return (
    <div>
      <PageInfo
        title={t('ib.CustomerTracking.title')}
        desc="View all of your account's information"
      />
      <div className="mt-3.5 mb-3.5 flex justify-between">
        <div className="w-67 max-w-sm">
          <RrhInputWithIcon
            placeholder={t('ib.CustomerTracking.nameOrAccountId')}
            className="h-9"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            rightIcon={<Search className="size-4" />}
            onRightIconClick={() => {
              // 触发查询逻辑, 这里简单调用一次刷新
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
        loading={AgencyClientTrackingLoading}
        thCls="text-center"
        tdCls="text-center"
      />
    </div>
  );
}
