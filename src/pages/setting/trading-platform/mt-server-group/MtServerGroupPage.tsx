import { RrhButton } from '@/components/common/RrhButton';
import { Ellipsis, RefreshCcw, RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import {
  useCrmMtServerGroupList,
  useRemoveServerGroupSetting,
  useSynchronizeServerGroupSetting,
} from '@/api/hooks/setting/setting';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { useSearchParams } from 'react-router-dom';
import { MtServerGroupRes } from '@/api/hooks/agent/types';
import { EditGroupDialog } from './EditGroupDialog';
import { serverMap } from '@/lib/constant';

export const MtServerGroupPage = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const name = searchParams.get('name');
  const serviceType = searchParams.get('serviceType');
  const accountAll = searchParams.get('accountAll');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const {
    data: serversList,
    isLoading: serversListLoading,
    refetch,
  } = useCrmMtServerGroupList(
    {
      pageSize,
      pageNum: pageNum + 1,
      orderByColumn: '',
      isAsc: 'asc',
    },
    id || '',
    {
      enabled: !!id,
    },
  );

  const { mutateAsync: removeServerGroupSetting } = useRemoveServerGroupSetting();
  const { mutateAsync: synchronizeFunction } = useSynchronizeServerGroupSetting();

  const [item, setItem] = useState<MtServerGroupRes | undefined>(undefined);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [synchronize, setSynchronize] = useState(false);
  const [editGroupDialogOpen, setEditGroupDialogOpen] = useState(false);

  const allColumns = useMemo<CRMColumnDef<MtServerGroupRes, unknown>[]>(
    () => [
      {
        id: 'No',
        header: t('table.index'),
        cell: ({ row }) => row?.index + 1,
      },
      {
        id: 'serverId',
        header: t('common.server'),
        cell: () => name || '-',
      },
      {
        id: 'groupName',
        header: t('table.groups'),
        cell: ({ row }) => row?.original.groupName || '-',
      },
      {
        id: 'accountStart',
        header: t('serversSettingPage.accountStart'),
        cell: ({ row }) => row?.original.accountStart || '-',
      },
      {
        id: 'accountEnd',
        header: t('serversSettingPage.accountEnd'),
        cell: ({ row }) => row?.original.accountEnd || '-',
      },
      {
        id: 'operate',
        header: () => t('common.Operation'),
        cell: ({ row }) => (
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('common.Edit'), value: 'edit' },
              { label: t('common.delete'), value: 'delete' },
            ]}
            callToAction={action => {
              setItem(row.original);
              switch (action) {
                case 'edit':
                  setEditGroupDialogOpen(true);
                  break;
                case 'delete':
                  setDeleteAlert(true);
                  break;
                default:
                  break;
              }
            }}
          />
        ),
        fixed: 'right',
      },
    ],
    [name, t],
  );
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('mt-server-group-table', allColumns);

  const reset = () => {
    setPageNum(0);
    setPageSize(10);
  };

  const synchronization = () => {
    setSynchronize(true);
  };

  return (
    <div>
      <PageInfo title={t('table.groups')} desc={t('serversSettingPage.groupDesc')} />
      <TableContentWrapper>
        <div className="mb-3 flex items-center justify-end gap-2">
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
          <RrhButton onClick={synchronization} type="button" className="flex items-center gap-2">
            <RefreshCw className="size-4" />
            {t('serversSettingPage.synchronize')}
          </RrhButton>
        </div>
        <DataTable
          columns={tableColumns}
          data={serversList?.rows || []}
          pageCount={Math.ceil(+(serversList?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={serversListLoading}
        />
        {/* 删除 */}
        <RrhDeleteAlert<{
          ids: string;
        }>
          open={deleteAlert}
          setOpen={setDeleteAlert}
          onSuccess={refetch}
          confirmFunction={removeServerGroupSetting}
          params={{ ids: item?.id || '' }}
          tipsText={t('serversSettingPage.deleteGroupConfirm')}
        />
        {/* 同步 可复用ui 接口和提示词不同 */}
        <RrhDeleteAlert<{
          serverId: string;
        }>
          open={synchronize}
          setOpen={setSynchronize}
          onSuccess={refetch}
          confirmFunction={synchronizeFunction}
          params={{ serverId: id || '' }}
          tipsText={t('serversSettingPage.synchronizeConfirm')}
        />
        <EditGroupDialog
          name={`${name} ${serverMap[serviceType || 0]}`}
          accountAll={accountAll || ''}
          open={editGroupDialogOpen}
          setOpen={setEditGroupDialogOpen}
          item={item}
        />
      </TableContentWrapper>
    </div>
  );
};
