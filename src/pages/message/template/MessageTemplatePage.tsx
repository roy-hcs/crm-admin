import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMsgTemplateList, MsgTemplateItem, useRemoveMsgTemplate } from '@/api/hooks/message';
import { RefreshCcw, Ellipsis } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { AddEditTemplateDialog } from './components/AddEditTemplateDialog';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';

export function MessageTemplatePage() {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const {
    data: msgList,
    isLoading: msgListLoading,
    refetch,
  } = useMsgTemplateList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: '',
  });
  const [editOpen, setEditOpen] = useState(false);
  const [detail, setDetail] = useState<MsgTemplateItem | null>(null);

  const [deleteAlert, setDeleteAlert] = useState(false);
  const { mutateAsync: removeMsgTemplate } = useRemoveMsgTemplate();

  const allColumns: CRMColumnDef<MsgTemplateItem, unknown>[] = [
    {
      id: 'No.',
      header: t('CRMAccountPage.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'title',
      header: t('table.title'),
      accessorFn: row => row.title,
      cell: ({ row }) => {
        return <div className="max-w-100 text-wrap">{row?.original?.title || '-'}</div>;
      },
    },
    {
      id: 'type',
      header: t('table.updateTime'),
      cell: ({ row }) => row?.original?.modifyTime || '-',
    },
    {
      id: 'operate',
      header: t('common.Operation'),
      cell: ({ row }) => {
        return (
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('common.Edit'), value: 'edit' },
              { label: t('common.delete'), value: 'delete' },
            ]}
            callToAction={action => {
              setDetail(row.original);
              switch (action) {
                case 'edit':
                  setEditOpen(true);
                  break;
                case 'delete':
                  setDeleteAlert(true);
                  break;
              }
            }}
          />
        );
      },
      fixed: 'right',
      size: 50,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('message-management-table', allColumns);

  return (
    <div>
      <PageInfo title={t('messageTemplate.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-end">
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="size-8 cursor-pointer" onClick={() => refetch()}>
              <RefreshCcw className="size-3.5" />
            </Button>
            <ColumnVisibilityButton
              columnMeta={columnMeta}
              visibleColumns={visibleColumns}
              onToggle={toggleColumn}
              onBatchReorder={batchUpdateColumns}
              columns={columns}
            />
            <AddEditTemplateDialog mode="add" onSuccess={refetch} />
          </div>
        </div>
        <DataTable
          columns={tableColumns}
          data={msgList?.rows || []}
          pageCount={Math.ceil(+(msgList?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={msgListLoading}
        />
        <AddEditTemplateDialog
          mode="edit"
          open={editOpen}
          onOpenChange={v => {
            if (!v) setDetail(null);
            setEditOpen(v);
          }}
          detail={detail}
          onSuccess={refetch}
        />
        <RrhDeleteAlert<{
          ids: string;
        }>
          open={deleteAlert}
          setOpen={setDeleteAlert}
          onSuccess={refetch}
          confirmFunction={removeMsgTemplate}
          params={{ ids: detail?.id || '' }}
          tipsText={t('messageTemplate.deleteMsg')}
        />
      </TableContentWrapper>
    </div>
  );
}
