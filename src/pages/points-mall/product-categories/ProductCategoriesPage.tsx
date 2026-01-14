import { useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import {
  GoodsClassificationItem,
  GoodsClassificationParams,
  useGoodsClassification,
} from '@/api/hooks/pointsMall';
import { ProductCategoriesForm } from './ProductCategoriesForm';
import { Funnel, Search, RefreshCcw } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { useChangeGoodsClassificationStatus } from '@/api/hooks/pointsMall';
import { Alert } from '@/components/common/Alert';
import { Switch } from '@/components/ui/switch';
import { useQueryClient } from '@tanstack/react-query';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { Ellipsis } from 'lucide-react';
import { useCallback, useState as useStateHook } from 'react';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

const StatusCell = ({ row }: { row: { original: GoodsClassificationItem } }) => {
  const [isOpen, setIsOpen] = useStateHook(false);
  const changeStatusMutation = useChangeGoodsClassificationStatus();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const onConfirm = useCallback(async () => {
    const res = await changeStatusMutation.mutateAsync({
      id: String(row.original.id),
      status: row.original.status === 1 ? 0 : 1,
    });
    if (res.code === 0) {
      queryClient.invalidateQueries({ queryKey: ['goodsClassification'] });
    }
  }, [changeStatusMutation, queryClient, row.original.id, row.original.status]);

  return (
    <>
      <Switch
        className="cursor-pointer bg-white data-[state=checked]:bg-slate-700"
        checked={row.original.status === 1}
        onClick={() => setIsOpen(true)}
      />
      <Alert
        trigger={null}
        open={isOpen}
        onOpenChange={setIsOpen}
        cancelText={t('common.Cancel')}
        confirmText={t('common.Confirm')}
        title={t('common.SystemPrompt')}
        content={
          row.original.status === 1
            ? t('productCategories.confirm.stop')
            : t('productCategories.confirm.open')
        }
        onConfirm={onConfirm}
      />
    </>
  );
};

export function ProductCategoriesPage() {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [otherParams, setOtherParams] = useState<
    Omit<GoodsClassificationParams, 'pageSize' | 'pageNum' | 'orderByColumn' | 'isAsc'>
  >({
    searchName: '',
  });

  const { data: data, isLoading: loading } = useGoodsClassification({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
  });

  const reset = () => {
    setOtherParams({
      searchName: '',
    });
    setKeyword('');
    setPageNum(0);
    setPageSize(10);
  };

  const allColumns: CRMColumnDef<GoodsClassificationItem, unknown>[] = [
    {
      id: 'No.',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'classificationName',
      header: t('productCategories.classificationName'),
      accessorFn: row => row.classificationName,
      cell: ({ row }) => row?.original?.classificationName || '-',
    },
    {
      id: 'parentClassificationName',
      header: t('productCategories.parentClassificationName'),
      accessorFn: row => row.parentClassificationName,
      cell: ({ row }) => row?.original?.parentClassificationName || '-',
    },
    {
      id: 'sort',
      header: t('table.sort'),
      accessorFn: row => row.sort,
      cell: ({ row }) => row?.original?.sort || '-',
    },
    {
      id: 'status',
      header: t('table.status'),
      cell: ({ row }) => {
        return <StatusCell row={row} />;
      },
    },
    {
      id: 'updateBy',
      header: t('table.operator'),
      accessorFn: row => row.updateBy,
      cell: ({ row }) => row?.original?.updateBy || '-',
    },
    {
      id: 'updateTime',
      header: t('table.updateTime'),
      accessorFn: row => row.updateTime,
      cell: ({ row }) => row?.original?.updateTime || '-',
    },
    {
      id: 'operate',
      header: t('common.Operation'),
      cell: () => (
        <div>
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[{ label: t('common.View'), value: 'view' }]}
            callToAction={() => {}}
          />
        </div>
      ),
      fixed: 'right',
      size: 50,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('points-mall-product-categories-table', allColumns);

  return (
    <div>
      <PageInfo title={t('productCategories.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              placeholder={t('common.pleaseInput', { field: t('products.goodsName') })}
              className="h-9"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={() => {
                setOtherParams(prev => ({ ...prev, searchName: keyword }));
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
              <ProductCategoriesForm setOtherParams={setOtherParams} loading={loading} />
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
