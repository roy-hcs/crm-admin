import { useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { PointsBalanceItem, PointsBalanceParams, usePointsBalance } from '@/api/hooks/pointsMall';
import { PointsBalanceForm } from './PointsBalanceForm';
import { Funnel, Search, RefreshCcw, Ellipsis } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { RrhSorter } from '@/components/common/RrhSorter';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

export function PointsBalancePage() {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [params, setParams] = useState<PointsBalanceParams['params']>({
    fuzzyName: '',
    email: '',
    timeStart: '',
    timeEnd: '',
  });

  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('asc');
  const [orderByColumn, setOrderByColumn] = useState<string>('');

  const { data: data, isLoading: loading } = usePointsBalance({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn,
    isAsc,
    params,
  });

  const reset = () => {
    setParams({
      fuzzyName: '',
      email: '',
      timeStart: '',
      timeEnd: '',
    });
    setKeyword('');
    setPageNum(0);
    setPageSize(10);
  };

  const allColumns: CRMColumnDef<PointsBalanceItem, unknown>[] = [
    {
      id: 'No.',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'lastName',
      header: t('table.fullName'),
      cell: ({ row }) => {
        if (row.original?.lastName && row.original?.name) {
          return <div>{row.original.lastName + ' ' + row.original.name}</div>;
        } else {
          return '-';
        }
      },
    },
    {
      id: 'showId',
      header: t('pointspBalance.CRMID'),
      accessorFn: row => row.showId,
      cell: ({ row }) => row?.original?.showId || '-',
    },
    {
      id: 'email',
      header: t('table.email'),
      accessorFn: row => row.email,
      cell: ({ row }) => row?.original?.email || '-',
    },
    {
      id: 'pointsBalance',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('PointsHistory.pointsBalance')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="pointsBalance"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      accessorFn: row => row.pointsBalance,
      cell: ({ row }) => row?.original?.pointsBalance || '-',
    },
    {
      id: 'earnPoints',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('pointspBalance.earnPoints')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="earnPoints"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      accessorFn: row => row.earnPoints,
      cell: ({ row }) => row?.original?.earnPoints || '-',
    },
    {
      id: 'usedPoints',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('pointspBalance.usedPoints')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="usedPoints"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      accessorFn: row => row.usedPoints,
      cell: ({ row }) => row?.original?.usedPoints || '-',
    },
    {
      id: 'operate',
      header: t('common.Operation'),
      cell: () => (
        <div>
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('common.View'), value: 'view' },
              { label: t('common.Edit'), value: 'edit' },
            ]}
            callToAction={action => {
              if (action === 'edit') {
                // Handle edit action
              } else if (action === 'view') {
                // Handle view action
              }
            }}
          />
        </div>
      ),
      fixed: 'right',
      size: 50,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('points-mall-points-balance-table', allColumns);

  return (
    <div>
      <PageInfo title={t('pointspBalance.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              placeholder={t('common.pleaseInput', { field: t('table.nameOrId') })}
              className="h-9"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={() => {
                setParams(prev => ({ ...prev, fuzzyName: keyword }));
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
              responsiveDirection={{
                mobile: 'bottom',
                desktop: 'right',
              }}
              footerShow={false}
            >
              <PointsBalanceForm
                setParams={setParams}
                loading={loading}
                params={params}
                reset={reset}
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
          data={data?.rows || []}
          pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={loading}
        />
      </TableContentWrapper>
    </div>
  );
}
