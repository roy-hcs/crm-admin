import { useMemo, useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { MamSymbolItem, MamSymbolListParams } from '@/api/hooks/copyTrading/type';
import { useMamSymbolList, useRemoveMamSymbol } from '@/api/hooks/copyTrading';
import { VarietyManagementForm } from './VarietyManagementForm';
import { Funnel, Search, RefreshCcw, Ellipsis } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/types';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { AddEditVarietyManagementDialog } from './components/AddEditVarietyManagementDialog';
import { useDictType } from '@/api/hooks/system';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';

export const VarietyManagementPage = () => {
  const [dialogState, setDialogState] = useState<{
    type: 'none' | 'edit' | 'view' | 'delete';
    id: string;
  }>({
    type: 'none',
    id: '',
  });
  const { mutateAsync: removeMamSymbol } = useRemoveMamSymbol();
  const [otherParams, setOtherParams] = useState<Omit<MamSymbolListParams, keyof BasicParams>>({
    symbolCategory: '',
    symbol: '',
  });

  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [resetKey, setResetKey] = useState(0);
  const { t } = useTranslation();

  const {
    data: data,
    isLoading: loading,
    refetch,
  } = useMamSymbolList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
  });

  const { data: symbolCategoryDataRes, isLoading: symbolCategoryLoading } =
    useDictType('mam_symbol_category');

  const symbolCategoryOptions = useMemo(
    () =>
      (symbolCategoryDataRes || []).map(i => ({
        label: i.dictLabel,
        value: i.dictValue,
      })),
    [symbolCategoryDataRes],
  );

  const reset = () => {
    setOtherParams(pre => ({
      ...pre,
      symbolCategory: '',
      symbol: '',
    }));
    setResetKey(k => k + 1);
    setPageNum(0);
  };

  const allColumns: CRMColumnDef<MamSymbolItem, unknown>[] = [
    {
      id: 'No.',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'symbolCategory',
      header: t('varietyManagement.symbolCategory'),
      cell: ({ row }) => row?.original?.symbolCategory || '-',
    },
    {
      id: 'symbol',
      header: t('varietyManagement.symbol'),
      cell: ({ row }) => row?.original?.symbol || '-',
    },
    {
      id: 'cname',
      header: t('varietyManagement.cname'),
      cell: ({ row }) => row?.original?.cname || '-',
    },
    {
      id: 'enname',
      header: t('varietyManagement.enname'),
      cell: ({ row }) => row?.original?.enname || '-',
    },
    {
      id: 'name',
      header: t('varietyManagement.name'),
      cell: ({ row }) => row?.original?.name || '-',
    },
    {
      id: 'sort',
      header: t('table.sort'),
      cell: ({ row }) => row?.original?.sort || '-',
    },
    {
      id: 'operation',
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      cell: ({ row }) => (
        <RrhDropdown
          Trigger={<Ellipsis className="size-4" />}
          dropdownList={[
            { label: t('common.Edit'), value: 'edit' },
            { label: t('common.View'), value: 'view' },
            { label: t('common.delete'), value: 'delete' },
          ]}
          callToAction={action => {
            const id = row.original.id || '';
            if (action === 'edit') {
              setDialogState({ type: 'edit', id });
            }
            if (action === 'view') {
              setDialogState({ type: 'view', id });
            }
            if (action === 'delete') {
              setDialogState({ type: 'delete', id });
            }
          }}
        />
      ),
      fixed: 'right',
      size: 50,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('variety-management-table', allColumns);

  return (
    <div>
      <PageInfo title={t('varietyManagement.title')} />
      <div className="mb-3 flex justify-between">
        <div className="w-67 max-w-sm">
          <RrhInputWithIcon
            key={resetKey}
            placeholder={t('common.pleaseInput', { field: t('varietyManagement.symbol') })}
            className="h-9"
            leftIcon={<Search className="size-4" />}
            onLeftIconClick={value => {
              setOtherParams(prev => ({ ...prev, symbol: value }));
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
            <VarietyManagementForm
              setOtherParams={setOtherParams}
              reset={reset}
              loading={loading}
              otherParams={otherParams}
              symbolCategoryOptions={
                (symbolCategoryDataRes || []).map(i => ({
                  label: i.dictLabel,
                  value: i.dictValue,
                })) || []
              }
            />
          </RrhDrawer>
          <ColumnVisibilityButton
            columnMeta={columnMeta}
            visibleColumns={visibleColumns}
            onToggle={toggleColumn}
            onBatchReorder={batchUpdateColumns}
            columns={columns}
          />
          <AddEditVarietyManagementDialog
            mode="add"
            onSuccess={refetch}
            title={t('varietyManagement.add')}
            symbolCategoryOptions={symbolCategoryOptions}
          />
          <AddEditVarietyManagementDialog
            mode="edit"
            open={dialogState.type === 'edit'}
            onOpenChange={open => {
              if (!open) {
                setDialogState(prev => ({ ...prev, type: 'none' }));
              }
            }}
            id={dialogState.id}
            onSuccess={refetch}
            title={t('common.modify', { field: t('varietyManagement.title') })}
            symbolCategoryOptions={symbolCategoryOptions}
          />
          <AddEditVarietyManagementDialog
            mode="view"
            open={dialogState.type === 'view'}
            onOpenChange={open => {
              if (!open) {
                setDialogState(prev => ({ ...prev, type: 'none' }));
              }
            }}
            id={dialogState.id}
            onSuccess={() => {}}
            title={t('common.detail', { field: t('varietyManagement.title') })}
            symbolCategoryOptions={symbolCategoryOptions}
          />
          <RrhDeleteAlert<{
            ids: string;
          }>
            open={dialogState.type === 'delete'}
            setOpen={open => {
              if (!open) {
                setDialogState(prev => ({ ...prev, type: 'none' }));
              }
            }}
            onSuccess={refetch}
            confirmFunction={removeMamSymbol}
            params={{ ids: dialogState.id || '' }}
            tipsText={t('varietyManagement.deleteTips')}
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
        loading={loading || symbolCategoryLoading}
      />
    </div>
  );
};
