import { RrhButton } from '@/components/common/RrhButton';
import { Ellipsis, RefreshCcw, Rocket } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import {
  useCrmMtServiceList,
  useModifyProcessStatus,
  useModifyStatus,
  useRemoveServerSetting,
} from '@/api/hooks/setting/setting';
import { CrmMtServiceListItem } from '@/api/hooks/setting/types';
import { serverMap } from '@/lib/constant';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { RrhStatusAlert } from '@/components/common/RrhStatusAlert';
import { AddEditServerSettingDialog } from './components/AddEditServerSettingDialog';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { useTabActions } from '@/hooks/useTabActions';

export const ServersSettingPage = () => {
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const {
    data: serversList,
    isLoading: serversListLoading,
    refetch,
  } = useCrmMtServiceList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
  });

  const { mutateAsync: modifyStatus } = useModifyStatus();
  const { mutateAsync: modifyProcessStatus } = useModifyProcessStatus();
  const { mutateAsync: removeServerSetting } = useRemoveServerSetting();

  const [item, setItem] = useState<CrmMtServiceListItem | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);

  const { openTab } = useTabActions();

  const goCreate = useCallback(() => {
    const url = '/settings/trading-platform/quickCreate';
    openTab({
      key: url,
      title: t('serversSettingPage.addServer'),
      path: url,
    });
  }, [openTab, t]);

  const goGroup = useCallback(
    (item: CrmMtServiceListItem) => {
      const accountAll = `${item.accountStart || ''} - ${item.accountEnd || ''}`;
      const url = `/settings/trading-platform/mt-server-group?id=${item.id}&name=${encodeURIComponent(item.serverName)}&serviceType=${item.serviceType}&accountAll=${encodeURIComponent(accountAll)}`;
      openTab({
        key: url,
        title: t('table.groups'),
        path: url,
      });
    },
    [openTab, t],
  );

  const goAccountType = useCallback(
    (item: CrmMtServiceListItem) => {
      const accountAll = `${item.accountStart || ''} - ${item.accountEnd || ''}`;
      const url = `/settings/trading-platform/mt-server-account-type?id=${item.id}&name=${encodeURIComponent(item.serverName)}&serviceType=${item.serviceType}&accountAll=${encodeURIComponent(accountAll)}`;
      openTab({
        key: url,
        title: t('common.accountType'),
        path: url,
      });
    },
    [openTab, t],
  );

  const allColumns = useMemo<CRMColumnDef<CrmMtServiceListItem, unknown>[]>(
    () => [
      {
        id: 'No',
        header: t('table.index'),
        cell: ({ row }) => row?.index + 1,
      },
      {
        id: 'sort',
        header: t('table.sort'),
        cell: ({ row }) => row?.original?.sort || '-',
      },
      {
        id: 'serviceType',
        header: t('table.transactionPlatform'),
        cell: ({ row }) => {
          return (
            <div>
              <span>
                {row?.original?.serviceType && (
                  <span> {serverMap[row?.original?.serviceType]}</span>
                )}
              </span>
              <span>
                {row?.original?.serviceProperty === 1 ? t('common.live') : t('common.demo')}
              </span>
            </div>
          );
        },
      },
      {
        id: 'serverName',
        header: t('table.serverName'),
        cell: ({ row }) => row?.original?.serverName || '-',
      },
      {
        id: 'serviceHost',
        header: t('table.serviceHost'),
        cell: ({ row }) => row?.original?.serviceHost || '-',
      },
      {
        id: 'managerAccount',
        header: t('serversSettingPage.managerAccount'),
        cell: ({ row }) => row?.original?.managerAccount || '-',
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
              processStatus: number;
            }>
              params={{
                id: String(row.original.id),
                status: row.original.status === 1 ? 0 : 1,
                processStatus: row.original.processStatus,
              }}
              tipsText={
                row.original.status === 1
                  ? t('serversSettingPage.statusConfirm.stop')
                  : t('serversSettingPage.statusConfirm.open')
              }
              checked={row.original.status === 1}
              confirmFunction={modifyStatus}
              onSuccess={refetch}
            />
          );
        },
      },
      {
        id: 'processStatus',
        header: t('serversSettingPage.processStatus'),
        accessorFn: row => row.processStatus,
        cell: ({ row }) => {
          return (
            <RrhStatusAlert<{
              id: string;
              processStatus: number;
            }>
              params={{
                id: String(row.original.id),
                processStatus: row.original.processStatus === 1 ? 0 : 1,
              }}
              tipsText={
                row.original.processStatus === 1
                  ? t('serversSettingPage.processStatusConfirm.stop')
                  : t('serversSettingPage.processStatusConfirm.open')
              }
              checked={row.original.processStatus === 1}
              confirmFunction={modifyProcessStatus}
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
              { label: t('table.groups'), value: 'groups' },
              { label: t('common.accountType'), value: 'accountType' },
            ]}
            callToAction={action => {
              setItem(row.original);
              switch (action) {
                case 'edit':
                  setOpen(true);
                  break;
                case 'delete':
                  setDeleteAlert(true);
                  break;
                case 'groups':
                  goGroup(row.original);
                  break;
                case 'accountType':
                  goAccountType(row.original);
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
    [goGroup, modifyProcessStatus, modifyStatus, refetch, t],
  );
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('setting-servers-table', allColumns);

  const reset = () => {
    setPageNum(0);
    setPageSize(10);
  };

  return (
    <div>
      <PageInfo title={t('serversSettingPage.title')} />
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
          <AddEditServerSettingDialog mode="add" />
          <RrhButton onClick={goCreate} type="button" className="flex items-center gap-2">
            <Rocket className="size-4" />
            {t('serversSettingPage.quickCreate')}
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
        <AddEditServerSettingDialog open={open} setOpen={setOpen} mode="edit" item={item} />

        <RrhDeleteAlert<{
          ids: string;
        }>
          open={deleteAlert}
          setOpen={setDeleteAlert}
          onSuccess={refetch}
          confirmFunction={removeServerSetting}
          params={{ ids: item?.id || '' }}
          tipsText={t('serversSettingPage.deleteConfirm')}
        />
      </TableContentWrapper>
    </div>
  );
};
