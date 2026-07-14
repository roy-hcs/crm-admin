import { IpWhiteListItem } from '@/api/hooks/system';
import {
  useChangeIpWhiteStatus,
  useChangeWhiteListStatus,
  useDeleteIpWhiteList,
  useIpWhiteList,
  useIpWhiteListDefaultStatus,
} from '@/api/hooks/system/system';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCard } from '@/components/common/RrhCard';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { RrhStatusAlert } from '@/components/common/RrhStatusAlert';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { Ellipsis, RefreshCcw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddEditWhiteListDialog } from './components/AddEditWhiteListDialog';
import { FaqIpWhiteList } from './components/FaqIpWhiteList';
import { Switch } from '@/components/ui/switch';

export function IpWhiteListPage() {
  const { t } = useTranslation();
  const [isFlag, setIsFlag] = useState(false);
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { mutateAsync: initDefaultStatus } = useIpWhiteListDefaultStatus();
  const { mutateAsync: changeStatus } = useChangeWhiteListStatus();
  const { mutateAsync: changeStatusMutation } = useChangeIpWhiteStatus();
  const {
    data: ipWhiteList,
    isLoading: ipWhiteListLoading,
    refetch,
  } = useIpWhiteList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'desc',
  });

  const initStatus = useCallback(async () => {
    const res = await initDefaultStatus();
    setIsFlag(res?.code === 0 && res?.msg === 'true');
  }, [initDefaultStatus]);

  const setStatus = useCallback(
    async (flag: boolean) => {
      const res = await changeStatus({ ipWhiteStatus: flag });
      if (res?.code === 0) {
        refetch();
        initStatus();
      }
    },
    [changeStatus, refetch, initStatus],
  );

  useEffect(() => {
    (async () => {
      const res = await initDefaultStatus();
      setIsFlag(res?.code === 0 && res?.msg === 'true');
    })();
  }, [initDefaultStatus]);

  const allColumns: CRMColumnDef<IpWhiteListItem, unknown>[] = [
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'ipAddress',
      header: t('table.ipAddress'),
      cell: ({ row }) => row.original.ipAddress || '-',
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
                ? t('CRMAccountPage.ConfirmDisableAccount')
                : t('CRMAccountPage.ConfirmEnableAccount')
            }
            checked={row.original.status === 1}
            confirmFunction={changeStatusMutation}
            onSuccess={refetch}
          />
        );
      },
    },
    {
      id: 'remark',
      header: t('table.remarks'),
      cell: ({ row }) => row.original.remark || '-',
    },
    {
      id: 'updateTime',
      header: t('table.operationTime'),
      cell: ({ row }) => row.original.updateTime || '-',
    },
    {
      id: 'operation',
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      cell: ({ row }) => (
        <div>
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('common.Edit'), value: 'edit' },
              { label: t('common.delete'), value: 'delete' },
            ]}
            callToAction={action => {
              setCurrentItem(row.original);
              if (action === 'edit') {
                setEditDialogOpen(true);
              } else if (action === 'delete') {
                setDeleteDialogOpen(true);
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
    useColumnVisibility('ip-white-list-table', allColumns);

  const [currentItem, setCurrentItem] = useState<IpWhiteListItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { mutateAsync: deleteIpWhiteList } = useDeleteIpWhiteList();

  const reset = () => {
    setPageNum(0);
  };

  return (
    <div className="relative flex flex-col gap-3 md:flex-row md:gap-8">
      <div className="flex-1">
        <RrhCard>
          <div className="mb-3 flex justify-end gap-2">
            <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
              <RefreshCcw className="size-3.5" />
            </RrhButton>
            <div className="flex items-center justify-center gap-2">
              <span>{t('ipWhiteList.ipWhiteListStatus')}</span>
              <Switch
                checked={Boolean(isFlag)}
                onCheckedChange={() => {
                  setStatus(!isFlag);
                }}
              />
            </div>
            <ColumnVisibilityButton
              columnMeta={columnMeta}
              visibleColumns={visibleColumns}
              onToggle={toggleColumn}
              onBatchReorder={batchUpdateColumns}
              columns={columns}
            />
            <AddEditWhiteListDialog onSuccess={refetch} mode="add" />
          </div>
          <DataTable
            columns={tableColumns}
            data={ipWhiteList?.rows || []}
            pageCount={Math.ceil(+(ipWhiteList?.total || 0) / pageSize)}
            pageIndex={pageNum}
            pageSize={pageSize}
            onPageChange={setPageNum}
            onPageSizeChange={setPageSize}
            loading={ipWhiteListLoading}
          />
        </RrhCard>
      </div>

      <div className="relative md:w-93.5">
        <FaqIpWhiteList />
      </div>

      <RrhDeleteAlert<{ ids: string }>
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onSuccess={refetch}
        confirmFunction={deleteIpWhiteList}
        params={{ ids: currentItem?.id || '' }}
        tipsText={t('ipWhiteList.deleteTips')}
      />
      <AddEditWhiteListDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        mode="edit"
        onSuccess={refetch}
        currentItem={currentItem || undefined}
      />
    </div>
  );
}
