import { useMemo, useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import {
  RebateBaseTypeParams,
  useDeleteRebateBaseType,
  useRebateBaseTypeList,
} from '@/api/hooks/rebate';
import { ProductGroupForm } from './ProductGroupForm';
import { Funnel, Search, RefreshCcw, Ellipsis } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { useDictType } from '@/api/hooks/system/system';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/hooks/review/types';
import { RebateBaseTypeItem } from '@/api/hooks/rebate';
import { serverMap } from '@/lib/constant';
import { ToolTip } from '@/components/common/ToolTip';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { AddProductGroupButton } from './components/AddProductGroupButton';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { EditProductGroupDialog } from './components/EditProductGroupDialog';

export const ProductGroupPage = () => {
  const { t } = useTranslation();
  const [resetKey, setResetKey] = useState(0);
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [otherParams, setOtherParams] = useState<Omit<RebateBaseTypeParams, keyof BasicParams>>({
    typeGroupName: '',
    serverId: '',
    serverType: '',
  });

  const { data: serverTypes } = useDictType('sys_mt_service_type');
  const [currentItem, setCurrentItem] = useState<RebateBaseTypeItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const {
    data: rebateBasePoint,
    isLoading: rebateBasePointLoading,
    refetch,
  } = useRebateBaseTypeList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
  });

  const reset = () => {
    setOtherParams({
      typeGroupName: '',
      serverId: '',
      serverType: '',
    });
    setResetKey(k => k + 1);
    setPageNum(0);
    setPageSize(10);
  };

  const allColumns = useMemo<CRMColumnDef<RebateBaseTypeItem, unknown>[]>(
    () => [
      {
        id: 'No.',
        header: t('overview.Index'),
        cell: ({ row }) => <div>{row.index + 1}</div>,
      },
      {
        id: 'typeGroupName',
        header: t('table.typeGroup'),
        accessorFn: row => row.typeGroupName || '-',
      },
      {
        id: 'serverType',
        header: t('table.transactionPlatform'),
        cell: ({ row }) => {
          return row.original.serverType ? serverMap[row.original.serverType] : '-';
        },
      },
      {
        id: 'serverName',
        header: t('table.server'),
        accessorFn: row => row.serverName || '-',
      },
      {
        id: 'typeName',
        header: t('table.rebateType'),
        cell: ({ row }) => {
          const exceedLength = row.original.typeName.length > 50;
          const content = exceedLength
            ? row.original.typeName.slice(0, 50) + '...'
            : row.original.typeName;
          return exceedLength ? (
            <ToolTip
              maxWidth="800px"
              content={
                <div className="max-h-[50vh] overflow-y-auto break-all">
                  {row.original.typeName}
                </div>
              }
            >
              <div>{content}</div>
            </ToolTip>
          ) : (
            <div>{content}</div>
          );
        },
      },
      {
        id: 'operation',
        header: () => <div className="text-center">{t('common.Operation')}</div>,
        label: t('common.Operation'),
        fixed: 'right',
        size: 50,
        cell: ({ row }) => (
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('common.Edit'), value: 'edit' },
              { label: t('common.delete'), value: 'delete' },
            ]}
            callToAction={action => {
              setCurrentItem(row.original);
              switch (action) {
                case 'edit':
                  setEditDialogOpen(true);
                  break;
                case 'delete':
                  setDeleteDialogOpen(true);
                  break;
              }
            }}
          />
        ),
      },
    ],
    [t, setCurrentItem, setEditDialogOpen, setDeleteDialogOpen],
  );

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('product-group-reports-table', allColumns);

  const { mutateAsync: deleteRebateBaseType } = useDeleteRebateBaseType();
  const onSuccess = () => {
    reset();
    refetch();
  };
  return (
    <div>
      <PageInfo title={t('ProductGroup.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              key={resetKey}
              placeholder={t('common.pleaseInput', { field: t('table.typeGroup') })}
              className="h-9"
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={value => {
                setOtherParams(prev => ({ ...prev, typeGroupName: value }));
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
              <ProductGroupForm
                params={otherParams}
                reset={reset}
                setParams={setOtherParams}
                serverTypes={serverTypes || []}
              />
            </RrhDrawer>
            <ColumnVisibilityButton
              columnMeta={columnMeta}
              visibleColumns={visibleColumns}
              onToggle={toggleColumn}
              onBatchReorder={batchUpdateColumns}
              columns={columns}
            />
            <AddProductGroupButton serverTypes={serverTypes || []} onSuccess={onSuccess} />
          </div>
        </div>
        <DataTable
          columns={tableColumns}
          data={rebateBasePoint?.rows || []}
          pageCount={Math.ceil(+(rebateBasePoint?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={rebateBasePointLoading}
        />
      </TableContentWrapper>
      <RrhDeleteAlert<{ ids: string }>
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onSuccess={onSuccess}
        confirmFunction={deleteRebateBaseType}
        params={{ ids: currentItem?.id || '' }}
        tipsText={t('ProductGroup.deleteTips')}
      />
      <EditProductGroupDialog
        serverTypes={serverTypes || []}
        onSuccess={onSuccess}
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        productGroupItem={currentItem}
      />
    </div>
  );
};
