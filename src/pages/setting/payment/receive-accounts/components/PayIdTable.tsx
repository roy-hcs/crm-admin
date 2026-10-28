import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { RrhStatusAlert } from '@/components/common/RrhStatusAlert';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { Ellipsis } from 'lucide-react';
import {
  useChangePayIdAccountStatus,
  usePayIdAccountList,
  useRemovePayIdAccount,
} from '@/api/hooks/setting/payment';
import { PayIdAccountItem } from '@/api/hooks/setting/types';
import { PayIdDialog } from './PayIdDialog';

export const PayIdTable = () => {
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const {
    data: payIdList,
    isLoading: payIdListLoading,
    refetch,
  } = usePayIdAccountList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
  });

  const { mutateAsync: changePayIdStatus } = useChangePayIdAccountStatus();
  const { mutateAsync: removePayId } = useRemovePayIdAccount();

  const [item, setItem] = useState<PayIdAccountItem | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);

  const renderCommission = useCallback(
    (row: PayIdAccountItem) => {
      if (row.commissionMod === 1) {
        return t('receiveAccountsPage.commissionByRateValue', {
          rate: row.commissionRate ?? '-',
        });
      }
      if (row.commissionMod === 2) {
        return t('receiveAccountsPage.commissionFixedValue', {
          amount: row.fixCommission ?? '-',
        });
      }
      return '-';
    },
    [t],
  );

  const allColumns = useMemo<CRMColumnDef<PayIdAccountItem, unknown>[]>(
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
        id: 'accountName',
        header: t('receiveAccountsPage.accountName'),
        cell: ({ row }) => row?.original?.accountName || '-',
      },
      {
        id: 'accountEmail',
        header: t('receiveAccountsPage.accountEmail'),
        cell: ({ row }) => row?.original?.accountEmail || '-',
      },
      {
        id: 'accountMobile',
        header: t('receiveAccountsPage.accountMobile'),
        cell: ({ row }) => row?.original?.accountMobile || '-',
      },
      {
        id: 'currency',
        header: t('receiveAccountsPage.currency'),
        cell: ({ row }) => row?.original?.currency || '-',
      },
      {
        id: 'depositLimit',
        header: t('receiveAccountsPage.depositLimit'),
        cell: ({ row }) =>
          `${row?.original?.minDeposit ?? '-'} ~ ${row?.original?.maxDeposit ?? '-'}`,
      },
      {
        id: 'commission',
        header: t('receiveAccountsPage.commission'),
        cell: ({ row }) => renderCommission(row.original),
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
              confirmFunction={changePayIdStatus}
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
    [changePayIdStatus, refetch, renderCommission, t],
  );
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('setting-payment-payid-table', allColumns);

  return (
    <div>
      <div className="mb-3 flex items-center justify-end gap-2">
        <ColumnVisibilityButton
          columnMeta={columnMeta}
          visibleColumns={visibleColumns}
          onToggle={toggleColumn}
          onBatchReorder={batchUpdateColumns}
          columns={columns}
        />
        <PayIdDialog mode="add" trigger />
        <PayIdDialog open={open} setOpen={setOpen} mode="edit" item={item} />
      </div>
      <DataTable
        columns={tableColumns}
        data={payIdList?.rows || []}
        pageCount={Math.ceil(+(payIdList?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={payIdListLoading}
      />

      <RrhDeleteAlert<{
        ids: string;
      }>
        open={deleteAlert}
        setOpen={setDeleteAlert}
        onSuccess={refetch}
        confirmFunction={removePayId}
        params={{ ids: String(item?.id || '') }}
        tipsText={t('receiveAccountsPage.payIdDeleteConfirm')}
      />
    </div>
  );
};
