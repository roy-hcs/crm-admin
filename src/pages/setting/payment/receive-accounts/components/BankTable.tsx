import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { RrhStatusAlert } from '@/components/common/RrhStatusAlert';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { Ellipsis } from 'lucide-react';
import {
  useCrmBankList,
  useChangeCrmBankStatus,
  useRemoveCrmBank,
} from '@/api/hooks/setting/payment';
import { CrmBankItem } from '@/api/hooks/setting/types';
import { BankDialog } from './BankDialog';

export const BankTable = () => {
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const {
    data: bankList,
    isLoading: bankListLoading,
    refetch,
  } = useCrmBankList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
  });

  const { mutateAsync: changeBankStatus } = useChangeCrmBankStatus();
  const { mutateAsync: removeBank } = useRemoveCrmBank();

  const [item, setItem] = useState<CrmBankItem | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);

  const allColumns = useMemo<CRMColumnDef<CrmBankItem, unknown>[]>(
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
        id: 'name',
        header: t('receiveAccountsPage.bankName'),
        cell: ({ row }) => row?.original?.name || '-',
      },
      {
        id: 'code',
        header: t('receiveAccountsPage.bankCode'),
        cell: ({ row }) => row?.original?.code || '-',
      },
      {
        id: 'currency',
        header: t('receiveAccountsPage.currency'),
        cell: ({ row }) => row?.original?.currency || '-',
      },
      {
        id: 'country',
        header: t('receiveAccountsPage.country'),
        cell: ({ row }) => row?.original?.countryName || row?.original?.country || '-',
      },
      {
        id: 'swiftCode',
        header: t('receiveAccountsPage.swiftCode'),
        cell: ({ row }) => row?.original?.swiftCode || '-',
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
              tipsText={
                row.original.status === 1
                  ? t('receiveAccountsPage.statusConfirm.disable')
                  : t('receiveAccountsPage.statusConfirm.enable')
              }
              checked={row.original.status === 1}
              confirmFunction={changeBankStatus}
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
    [changeBankStatus, refetch, t],
  );
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('setting-payment-bank-table', allColumns);

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
        <BankDialog mode="add" trigger />
        <BankDialog open={open} setOpen={setOpen} mode="edit" item={item} />
      </div>
      <DataTable
        columns={tableColumns}
        data={bankList?.rows || []}
        pageCount={Math.ceil(+(bankList?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={bankListLoading}
      />

      <RrhDeleteAlert<{
        ids: string;
      }>
        open={deleteAlert}
        setOpen={setDeleteAlert}
        onSuccess={refetch}
        confirmFunction={removeBank}
        params={{ ids: item?.id || '' }}
        tipsText={t('receiveAccountsPage.bankDeleteConfirm')}
      />
    </div>
  );
};
