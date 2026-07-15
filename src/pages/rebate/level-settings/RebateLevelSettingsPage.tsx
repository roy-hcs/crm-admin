import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDeleteRebateLevel, useRebateLevelList } from '@/api/hooks/rebate';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { RebateLevelItem } from '@/api/hooks/rebate';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { Ellipsis, RefreshCcw } from 'lucide-react';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { EditRebateLevelDialog } from './components/EditRebateLevelDialog';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { AddRebateLevelButton } from './components/AddRebateLevelButton';
import { useGetSysConfig } from '@/api/hooks/system/system';
import { REBATE_LEVEL_SETTING, REBATE_MODEL_SETTING } from '@/lib/constant';
import { LevelSkippingSettingButton } from './components/LevelSkippingSettingButton';

export const RebateLevelSettingsPage = () => {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: rebateLevelList,
    isLoading: rebateLevelListLoading,
    refetch,
  } = useRebateLevelList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
  });
  const [currentItem, setCurrentItem] = useState<RebateLevelItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { mutateAsync: deleteRebateLevel } = useDeleteRebateLevel();
  const { data: rebateModelSetting } = useGetSysConfig(REBATE_MODEL_SETTING);
  const { data: rebateLevelSetting } = useGetSysConfig(REBATE_LEVEL_SETTING);
  const allColumns = useMemo<CRMColumnDef<RebateLevelItem, unknown>[]>(
    () => [
      {
        id: 'No.',
        header: t('overview.Index'),
        cell: ({ row }) => <div>{row.index + 1}</div>,
      },
      {
        id: 'level',
        header: t('table.level'),
        accessorFn: row => row.level || '-',
      },
      {
        id: 'levelName',
        header: t('table.levelName'),
        accessorFn: row => row.levelName || '-',
      },
      // TODO:之后的三项都有点击弹窗的交互
      {
        id: 'relatedAccountCount',
        header: t('table.relatedAccountCount'),
        accessorFn: row => row.relatedAccountCount || '-',
      },
      {
        id: 'relatedRebateRuleCount',
        header: t('table.relatedRebateRuleCount'),
        accessorFn: row => row.relatedRebateRuleCount || '-',
      },
      {
        id: 'relatedRebateTemplateCount',
        header: t('table.relatedRebateTemplateCount'),
        accessorFn: row => row.relatedRebateTemplateCount || '-',
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
    useColumnVisibility('rebate-level-settings-table', allColumns);

  const reset = () => {
    setPageNum(0);
  };
  const onSuccess = () => {
    reset();
    refetch();
  };
  return (
    <div>
      <PageInfo title={t('RebateLevelSettings.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div></div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
              <RefreshCcw className="size-3.5" />
            </Button>
            <ColumnVisibilityButton
              columnMeta={columnMeta}
              visibleColumns={visibleColumns}
              onToggle={toggleColumn}
              onBatchReorder={batchUpdateColumns}
              columns={columns}
            />

            <AddRebateLevelButton onSuccess={onSuccess} />
            {rebateModelSetting === 2 && (
              <LevelSkippingSettingButton
                originalSetting={rebateLevelSetting as number}
                onSuccess={onSuccess}
              />
            )}
          </div>
        </div>
        <DataTable
          columns={tableColumns}
          data={rebateLevelList?.rows || []}
          pageCount={Math.ceil(+(rebateLevelList?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={rebateLevelListLoading}
        />
      </TableContentWrapper>
      <RrhDeleteAlert<{ ids: string }>
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onSuccess={onSuccess}
        confirmFunction={deleteRebateLevel}
        params={{ ids: currentItem?.id || '' }}
        tipsText={t('ProductGroup.deleteTips')}
      />
      <EditRebateLevelDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        onSuccess={onSuccess}
        rebateLevelItem={currentItem}
      />
    </div>
  );
};
