import {
  RebateSettingsTemplate,
  useEditRebateSettingsTemplate,
  useGetRebateSettingsTemplate,
} from '@/api/hooks/rebate';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { PageInfo } from '@/components/common/PageInfo';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { Ellipsis, RefreshCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddRebateSettingsTemplateButton } from './components/AddRebateSettingsTemplateButton';
import { EditRebateSettingsTemplateDialog } from './components/EditRebateSettingsTemplateDialog';
import { SetDefaultTemplateButton } from './components/SetDefaultTemplateButton';
import { DeleteRebateSettingsTemplateDialog } from './components/DeleteRebateSettingsTemplateDialog';
import { RrhAlert } from '@/components/common/RrhAlert';

export const RebateSettingsTemplates = ({ type }: { type: 1 | 2 | 3 }) => {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cancelDefaultDialogOpen, setCancelDefaultDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<RebateSettingsTemplate>();
  const { mutateAsync: editRebateSettingsTemplate } = useEditRebateSettingsTemplate(type);
  const {
    data: tradingRebateSettingTemplatesRes,
    isLoading: tradingRebateSettingsLoading,
    refetch,
  } = useGetRebateSettingsTemplate(type, {
    pageNum: pageNum + 1,
    pageSize,
    orderByColumn: '',
    isAsc: 'asc',
  });
  const reset = () => {
    setPageNum(0);
    setPageSize(10);
    refetch();
  };
  const allColumns = useMemo<CRMColumnDef<RebateSettingsTemplate, unknown>[]>(
    () => [
      {
        id: 'No.',
        header: t('overview.Index'),
        cell: ({ row }) => <div>{row.index + 1}</div>,
      },
      {
        id: 'templateName',
        header: t('RebateTemplate.templateName'),
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <div className="flex items-center gap-2">
              <div>{rowData.templateName}</div>
              {rowData.templateDefault === 'Y' && (
                <div className="text-primary border-primary rounded-sm border p-1 text-xs">
                  {t('common.default')}
                </div>
              )}
            </div>
          );
        },
      },
      {
        id: 'rebateLevel',
        header: t('table.rebateLevel'),
        accessorFn: row => row.rebateLevel,
      },
      {
        id: 'relatedSpreadLink',
        header: t('RebateTemplate.relatedSpreadLink'),
        accessorFn: row => row.relatedSpreadLink,
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
            dropdownList={
              [
                { label: t('common.Edit'), value: 'edit' },
                { label: t('common.delete'), value: 'delete' },
                ...[
                  row.original.templateDefault === 'Y'
                    ? { label: t('RebateTemplate.cancelDefault'), value: 'cancelDefault' }
                    : undefined,
                ],
              ].filter(Boolean) as { label: string; value: string }[]
            }
            callToAction={action => {
              setCurrentItem(row.original);
              switch (action) {
                case 'edit':
                  setEditDialogOpen(true);
                  break;
                case 'cancelDefault':
                  setCancelDefaultDialogOpen(true);
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
    [t, setCurrentItem, setEditDialogOpen, setCancelDefaultDialogOpen, setDeleteDialogOpen],
  );
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility(`rebate-settings-template-${type}`, allColumns);
  const titleMap = {
    1: t('RebateTemplate.tradingRebateSettingsTemplate'),
    2: t('RebateTemplate.feeRebateSettingsTemplate'),
    3: t('RebateTemplate.depositRebateSettingsTemplate'),
  };
  return (
    <div>
      <PageInfo title={titleMap[type]} />
      <TableContentWrapper>
        <div className="mb-2 flex items-center justify-end gap-2">
          <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
            <RefreshCcw className="size-3.5" />
          </RrhButton>
          <ColumnVisibilityButton
            columnMeta={columnMeta}
            visibleColumns={visibleColumns}
            onToggle={toggleColumn}
            onBatchReorder={batchUpdateColumns}
            columns={columns}
          />
          <AddRebateSettingsTemplateButton type={type} onSuccess={reset} />
          <SetDefaultTemplateButton
            type={type}
            onSuccess={reset}
            templates={tradingRebateSettingTemplatesRes?.rows || []}
          />
        </div>
        <DataTable
          columns={tableColumns}
          data={tradingRebateSettingTemplatesRes?.rows || []}
          pageCount={Math.ceil(+(tradingRebateSettingTemplatesRes?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={tradingRebateSettingsLoading}
        />
      </TableContentWrapper>
      <EditRebateSettingsTemplateDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        onSuccess={reset}
        currentTemplate={currentItem}
        type={type}
      />
      <DeleteRebateSettingsTemplateDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        currentTemplate={currentItem}
        type={type}
        onSuccess={reset}
      />
      <RrhAlert
        open={cancelDefaultDialogOpen}
        onOpenChange={setCancelDefaultDialogOpen}
        title={t('RebateTemplate.cancelDefault')}
        content={t('RebateTemplate.cancelDefaultMsg')}
        cancelText={t('common.Cancel')}
        confirmText={t('common.Confirm')}
        trigger={null}
        onConfirm={async () => {
          try {
            await editRebateSettingsTemplate({
              id: currentItem?.id || '',
              templateDefault: 'N',
            });
            refetch();
          } catch (error) {
            console.error('Failed to cancel default setting', error);
          }
        }}
      />
    </div>
  );
};
