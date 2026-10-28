import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { RrhStatusAlert } from '@/components/common/RrhStatusAlert';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { Ellipsis, RefreshCcw } from 'lucide-react';
import {
  useChangeWithdrawChannelStatus,
  useRemoveWithdrawChannel,
  useWithdrawChannelList,
} from '@/api/hooks/setting/payment';
import { WithdrawChannelItem } from '@/api/hooks/setting/types';
import { WithdrawChannelDialog } from './components/WithdrawChannelDialog';

export const WithdrawChannelPage = () => {
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const {
    data: channelList,
    isLoading: channelListLoading,
    refetch,
  } = useWithdrawChannelList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
  });

  const { mutateAsync: changeChannelStatus } = useChangeWithdrawChannelStatus();
  const { mutateAsync: removeChannel } = useRemoveWithdrawChannel();

  const [item, setItem] = useState<WithdrawChannelItem | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);

  const renderCommission = useCallback(
    (row: WithdrawChannelItem) => {
      if (row.commissionMod === '1') {
        return t('receiveAccountsPage.commissionByRateValue', {
          rate: row.commissionRate ?? '-',
        });
      }
      if (row.commissionMod === '2') {
        return t('receiveAccountsPage.commissionFixedValue', {
          amount: row.fixCommission ?? '-',
        });
      }
      return '-';
    },
    [t],
  );

  const allColumns = useMemo<CRMColumnDef<WithdrawChannelItem, unknown>[]>(
    () => [
      {
        id: 'No',
        header: t('table.index'),
        cell: ({ row }) => row?.index + 1,
      },
      {
        id: 'sort',
        header: t('table.sort'),
        cell: ({ row }) => row?.original?.sort ?? '-',
      },
      {
        id: 'channelName',
        header: t('withdrawChannelPage.channelName'),
        cell: ({ row }) => row?.original?.channelName || '-',
      },
      {
        id: 'channelCurrency',
        header: t('receiveAccountsPage.currency'),
        cell: ({ row }) => row?.original?.channelCurrency || '-',
      },
      {
        id: 'withdrawLimit',
        header: t('withdrawChannelPage.withdrawLimit'),
        cell: ({ row }) =>
          `${row?.original?.minWithdraw ?? '-'} ~ ${row?.original?.maxWithdraw ?? '-'}`,
      },
      {
        id: 'commission',
        header: t('receiveAccountsPage.commission'),
        cell: ({ row }) => renderCommission(row.original),
      },
      {
        id: 'timeEnabled',
        header: t('withdrawChannelPage.timeEnabled'),
        cell: ({ row }) => (row?.original?.timeEnabled === 1 ? t('common.yes') : t('common.no')),
      },
      {
        id: 'frozen',
        header: t('withdrawChannelPage.frozen'),
        cell: ({ row }) =>
          row?.original?.frozen === 1 ? (
            <span className="text-red-500">{t('common.yes')}</span>
          ) : (
            t('common.no')
          ),
      },
      {
        id: 'status',
        header: t('table.status'),
        accessorFn: row => row.status,
        cell: ({ row }) => {
          return (
            <RrhStatusAlert<{
              id: number;
              status: number;
            }>
              params={{
                id: row.original.id,
                status: row.original.status === 1 ? 0 : 1,
              }}
              tipsText={
                row.original.status === 1
                  ? t('receiveAccountsPage.statusConfirm.disable')
                  : t('receiveAccountsPage.statusConfirm.enable')
              }
              checked={row.original.status === 1}
              confirmFunction={changeChannelStatus}
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
                  setOpen(true);
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
    [changeChannelStatus, refetch, renderCommission, t],
  );
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('setting-payment-withdraw-channel-table', allColumns);

  const reset = () => {
    setPageNum(0);
    setPageSize(10);
  };

  return (
    <div>
      <PageInfo title={t('withdrawChannelPage.title')} />
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
          <WithdrawChannelDialog mode="add" trigger />
          <WithdrawChannelDialog open={open} setOpen={setOpen} mode="edit" item={item} />
        </div>
        <DataTable
          columns={tableColumns}
          data={channelList?.rows || []}
          pageCount={Math.ceil(+(channelList?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={channelListLoading}
        />

        <RrhDeleteAlert<{
          ids: string;
        }>
          open={deleteAlert}
          setOpen={setDeleteAlert}
          onSuccess={refetch}
          confirmFunction={removeChannel}
          params={{ ids: String(item?.id || '') }}
          tipsText={t('withdrawChannelPage.deleteConfirm')}
        />
      </TableContentWrapper>
    </div>
  );
};
