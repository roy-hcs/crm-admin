import { RrhButton } from '@/components/common/RrhButton';
import { Ellipsis, RefreshCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import {
  useCrmMtServerTypeAssociationList,
  useModifyServerTypeAssociationStatus,
  useRemoveServerTypeAssociation,
} from '@/api/hooks/setting/setting';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { useSearchParams } from 'react-router-dom';
import { serverMap } from '@/lib/constant';
import { CrmMtServerTypeAssociationItem } from '@/api/hooks/setting/types';
import { RrhStatusAlert } from '@/components/common/RrhStatusAlert';
import { AddEditAccountTypeDialog } from './AddEditAccountTypeDialog';

export const MtServerAccountTypePage = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const name = searchParams.get('name');
  const serviceType = searchParams.get('serviceType');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const {
    data: serversList,
    isLoading: serversListLoading,
    refetch,
  } = useCrmMtServerTypeAssociationList(
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

  const { mutateAsync: modifyStatus } = useModifyServerTypeAssociationStatus();
  const { mutateAsync: removeServerGroupSetting } = useRemoveServerTypeAssociation();

  const [item, setItem] = useState<CrmMtServerTypeAssociationItem | undefined>(undefined);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [editGroupDialogOpen, setEditGroupDialogOpen] = useState(false);

  const allColumns = useMemo<CRMColumnDef<CrmMtServerTypeAssociationItem, unknown>[]>(
    () => [
      {
        id: 'No',
        header: t('table.index'),
        cell: ({ row }) => row?.index + 1,
      },
      {
        id: 'typeName',
        header: t('common.accountType'),
        cell: ({ row }) => row?.original?.typeName || '-',
      },
      {
        id: 'defaultMtGroup',
        header: t('serversSettingPage.defaultMtGroup'),
        cell: ({ row }) => row?.original.defaultMtGroup || '-',
      },
      {
        id: 'openCreditBalance',
        header: t('table.openCreditBalance'),
        cell: ({ row }) => row?.original.openCreditBalance || '-',
      },
      {
        id: 'status',
        header: t('table.status'),
        accessorFn: row => row.status,
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
              tipsText={row.original.status === 1 ? t('ads.confirm.stop') : t('ads.confirm.open')}
              checked={row.original.status === 1}
              confirmFunction={modifyStatus}
              onSuccess={refetch}
            />
          );
        },
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
    [modifyStatus, refetch, t],
  );
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('mt-server-account-type-table', allColumns);

  const reset = () => {
    setPageNum(0);
    setPageSize(10);
  };

  return (
    <div>
      <PageInfo title={t('common.accountType')} />
      <TableContentWrapper>
        <div className="mb-3 flex items-center justify-end gap-2">
          <AddEditAccountTypeDialog
            mode="add"
            name={`${name} ${serverMap[serviceType || 0]}`}
            serverId={id || ''}
            onSuccess={refetch}
          />
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
        <RrhDeleteAlert<{
          ids: string;
        }>
          open={deleteAlert}
          setOpen={setDeleteAlert}
          onSuccess={refetch}
          confirmFunction={removeServerGroupSetting}
          params={{ ids: item?.id || '' }}
          tipsText={t('serversSettingPage.deleteAccountTypeConfirm')}
        />
        <AddEditAccountTypeDialog
          mode="edit"
          name={`${name} ${serverMap[serviceType || 0]}`}
          serverId={id || ''}
          open={editGroupDialogOpen}
          setOpen={setEditGroupDialogOpen}
          item={item}
          onSuccess={refetch}
        />
      </TableContentWrapper>
    </div>
  );
};
