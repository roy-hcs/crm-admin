import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdsList, AdsListItem } from '@/api/hooks/marketing';
import { PageInfo } from '@/components/common/PageInfo';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { Switch } from '@/components/ui/switch';
import { Ellipsis } from 'lucide-react';
import { RrhSorter } from '@/components/common/RrhSorter';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

export const AdsPage = () => {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('asc');
  const [orderByColumn, setOrderByColumn] = useState('');

  const { data: data, isLoading: loading } = useAdsList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn,
    isAsc,
  });

  const reset = () => {
    setPageNum(0);
    setPageSize(10);
    setIsAsc('asc');
    setOrderByColumn('');
  };

  const allColumns: CRMColumnDef<AdsListItem, unknown>[] = [
    {
      id: 'No.',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'name',
      header: t('marketing.ads.name'),
      accessorFn: row => row.name,
      cell: ({ row }) => {
        return <div>{row?.original?.name || '-'}</div>;
      },
    },
    {
      id: 'position',
      header: t('marketing.ads.position'),
      accessorFn: row => row.position,
      cell: ({ row }) => {
        return <div>{t(`marketing.ads.positionType.${row?.original?.position}`) || '-'}</div>;
      },
    },
    {
      id: 'sort',
      label: t('table.sort'),
      header: () => (
        <div className="flex items-center gap-1">
          {t('table.sort')}
          <RrhSorter
            setIsAsc={setIsAsc}
            isAsc={isAsc}
            orderByColumn={orderByColumn}
            setOrderByColumn={setOrderByColumn}
            column="sort"
          />
        </div>
      ),
      accessorFn: row => row.sort,
      cell: ({ row }) => {
        return <div>{row?.original?.sort || '-'}</div>;
      },
    },
    {
      id: 'status',
      header: t('table.status'),
      accessorFn: row => row.status,
      cell: ({ row }) => {
        return <Switch checked={row?.original?.status === 1} />;
      },
    },
    {
      id: 'clickCount',
      label: t('marketing.ads.clickCount'),
      header: () => (
        <div className="flex items-center gap-1">
          {t('marketing.ads.clickCount')}
          <RrhSorter
            setIsAsc={setIsAsc}
            isAsc={isAsc}
            orderByColumn={orderByColumn}
            setOrderByColumn={setOrderByColumn}
            column="clickCount"
          />
        </div>
      ),
      accessorFn: row => row.clickCount,
      cell: ({ row }) => {
        return <div>{row?.original?.clickCount || '-'}</div>;
      },
    },
    {
      id: 'updateBy',
      header: t('table.operator'),
      accessorFn: row => row.updateBy,
      cell: ({ row }) => {
        return <div>{row?.original?.updateBy || '-'}</div>;
      },
    },
    {
      id: 'updateTime',
      label: t('table.updateTime'),
      header: () => (
        <div className="flex items-center gap-1">
          {t('table.updateTime')}
          <RrhSorter
            setIsAsc={setIsAsc}
            isAsc={isAsc}
            orderByColumn={orderByColumn}
            setOrderByColumn={setOrderByColumn}
            column="updateTime"
          />
        </div>
      ),
      accessorFn: row => row.updateTime,
      cell: ({ row }) => {
        return <div>{row?.original?.updateTime || '-'}</div>;
      },
    },
    {
      id: 'operation',
      label: t('common.Operation'),
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
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
    useColumnVisibility('marketing-ads-table', allColumns);

  return (
    <div>
      <PageInfo title={t('marketing.ads.name')} />
      <TableContentWrapper>
        <div className="mb-3 flex items-center justify-end gap-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
              <RefreshCcw className="size-3.5" />
            </Button>
          </div>
          <ColumnVisibilityButton
            columnMeta={columnMeta}
            visibleColumns={visibleColumns}
            onToggle={toggleColumn}
            onBatchReorder={batchUpdateColumns}
            columns={columns}
          />
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
};
