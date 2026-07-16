import { useMemo, useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import {
  GoodsClassificationItem,
  GoodsClassificationParams,
  useGoodsClassification,
  useRemoveGoodsClassification,
} from '@/api/hooks/pointsMall';
import { Funnel, Search, RefreshCcw } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { useChangeGoodsClassificationStatus } from '@/api/hooks/pointsMall';

import { RrhDropdown } from '@/components/common/RrhDropdown';
import { Ellipsis } from 'lucide-react';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { RrhStatusAlert } from '@/components/common/RrhStatusAlert';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { ProductCategoriesForm } from './components/ProductCategoriesForm';
import { GoodSortDialog } from './components/GoodSortDialog';
import { useDictType } from '@/api/hooks/system';

export function ProductCategoriesPage() {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [resetKey, setResetKey] = useState(0);
  const [otherParams, setOtherParams] = useState<
    Omit<GoodsClassificationParams, 'pageSize' | 'pageNum' | 'orderByColumn' | 'isAsc'>
  >({
    searchName: '',
  });
  const { mutateAsync: changeStatusMutation } = useChangeGoodsClassificationStatus();
  const { mutateAsync: removeClassificationMutation } = useRemoveGoodsClassification();
  const { data: languageOptions, isLoading: languageLoading } = useDictType('sys_language');
  const {
    data: data,
    isLoading: loading,
    refetch,
  } = useGoodsClassification({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
  });
  const { data: parentList, isLoading: parentListLoading } = useGoodsClassification({
    parentId: 0,
    status: 0,
  });

  const reset = () => {
    setOtherParams({
      searchName: '',
    });
    setResetKey(k => k + 1);
    setPageNum(0);
    setPageSize(10);
  };

  const [deleteAlert, setDeleteAlert] = useState(false);
  const [ids, setIds] = useState('');
  const [editingItem, setEditingItem] = useState<GoodsClassificationItem | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const allColumns = useMemo<CRMColumnDef<GoodsClassificationItem, unknown>[]>(
    () => [
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
          return (
            <RrhStatusAlert<{
              id: string;
              status: number;
            }>
              params={{
                id: String(row.original.id),
                status: row.original.status === 1 ? 0 : 1,
              }}
              tipsText={
                row.original.status === 1
                  ? t('productCategories.confirm.stop')
                  : t('productCategories.confirm.open')
              }
              checked={row.original.status === 1}
              confirmFunction={changeStatusMutation}
              onSuccess={refetch}
            />
          );
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
        cell: ({ row }) => (
          <div>
            <RrhDropdown
              Trigger={<Ellipsis className="size-4" />}
              dropdownList={[
                { label: t('common.Edit'), value: 'edit' },
                { label: t('common.delete'), value: 'delete' },
              ]}
              callToAction={action => {
                switch (action) {
                  case 'edit':
                    setEditingItem(row.original);
                    setEditOpen(true);
                    break;
                  case 'delete':
                    setIds(String(row?.original.id));
                    setDeleteAlert(true);
                    break;
                }
              }}
            />
          </div>
        ),
        fixed: 'right',
        size: 50,
      },
    ],
    [t, changeStatusMutation, refetch, setEditingItem, setEditOpen, setIds, setDeleteAlert],
  );

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('points-mall-product-categories-table', allColumns);

  return (
    <div>
      <PageInfo title={t('productCategories.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              key={resetKey}
              placeholder={t('common.pleaseInput', { field: t('products.goodsName') })}
              className="h-9"
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={value => {
                setOtherParams(prev => ({ ...prev, searchName: value }));
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
            <GoodSortDialog
              mode="add"
              onSuccess={refetch}
              languageOptions={
                languageOptions?.map(i => ({
                  label: i.dictLabel,
                  value: i.dictValue,
                })) || []
              }
              parentOptions={
                parentList?.rows.map(i => ({
                  label: i.classificationName,
                  value: String(i.id),
                })) || []
              }
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
          loading={loading || languageLoading || parentListLoading}
        />
        <RrhDeleteAlert<{
          ids: string;
        }>
          open={deleteAlert}
          setOpen={setDeleteAlert}
          onSuccess={refetch}
          confirmFunction={removeClassificationMutation}
          params={{ ids: ids }}
          tipsText={t('rewardConfigPage.confirmDeleteTips')}
        />
        <GoodSortDialog
          mode="edit"
          open={editOpen}
          onOpenChange={v => {
            if (!v) setEditingItem(null);
            setEditOpen(v);
          }}
          detail={editingItem || undefined}
          onSuccess={refetch}
          languageOptions={
            languageOptions?.map(i => ({
              label: i.dictLabel,
              value: i.dictValue,
            })) || []
          }
          parentOptions={
            parentList?.rows.map(i => ({
              label: i.classificationName,
              value: String(i.id),
            })) || []
          }
        />
      </TableContentWrapper>
    </div>
  );
}
