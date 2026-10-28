import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { RrhStatusAlert } from '@/components/common/RrhStatusAlert';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { RrhButton } from '@/components/common/RrhButton';
import { Ellipsis } from 'lucide-react';
import {
  useChangeRemittanceAccountStatus,
  useRemittanceAccountList,
  useRemoveRemittanceAccount,
} from '@/api/hooks/setting/payment';
import { RemittanceAccountItem } from '@/api/hooks/setting/types';
import { RemittanceDialog } from './RemittanceDialog';

export const RemittanceTable = () => {
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [accountType, setAccountType] = useState<number>(1);
  const { t } = useTranslation();
  const {
    data: remittanceList,
    isLoading: remittanceListLoading,
    refetch,
  } = useRemittanceAccountList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    accountType,
  });

  const { mutateAsync: changeRemittanceStatus } = useChangeRemittanceAccountStatus();
  const { mutateAsync: removeRemittance } = useRemoveRemittanceAccount();

  const [item, setItem] = useState<RemittanceAccountItem | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);

  const renderCommission = useCallback(
    (row: RemittanceAccountItem) => {
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

  const allColumns = useMemo<CRMColumnDef<RemittanceAccountItem, unknown>[]>(
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
        id: 'account',
        header: t('receiveAccountsPage.account'),
        cell: ({ row }) => row?.original?.account || '-',
      },
      {
        id: 'accountName',
        header: t('receiveAccountsPage.accountName'),
        cell: ({ row }) => row?.original?.accountName || '-',
      },
      {
        id: 'bankName',
        header: t('receiveAccountsPage.bankName'),
        cell: ({ row }) => row?.original?.bankName || '-',
      },
      {
        id: 'swiftCode',
        header: t('receiveAccountsPage.swiftCode'),
        cell: ({ row }) => row?.original?.swiftCode || '-',
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
              confirmFunction={changeRemittanceStatus}
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
    [changeRemittanceStatus, refetch, renderCommission, t],
  );
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('setting-payment-remittance-table', allColumns);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {[1, 2].map(type => (
            <RrhButton
              key={type}
              variant={accountType === type ? 'default' : 'outline'}
              type="button"
              onClick={() => {
                setAccountType(type);
                setPageNum(0);
              }}
            >
              {type === 1
                ? t('receiveAccountsPage.wireTransfer')
                : t('receiveAccountsPage.remittance')}
            </RrhButton>
          ))}
        </div>
        <RemittanceDialog mode="add" trigger defaultAccountType={accountType} />
        <RemittanceDialog open={open} setOpen={setOpen} mode="edit" item={item} />
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
        data={remittanceList?.rows || []}
        pageCount={Math.ceil(+(remittanceList?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={remittanceListLoading}
      />

      <RrhDeleteAlert<{
        ids: string;
      }>
        open={deleteAlert}
        setOpen={setDeleteAlert}
        onSuccess={refetch}
        confirmFunction={removeRemittance}
        params={{ ids: String(item?.id || '') }}
        tipsText={t('receiveAccountsPage.remittanceDeleteConfirm')}
      />
    </div>
  );
};
