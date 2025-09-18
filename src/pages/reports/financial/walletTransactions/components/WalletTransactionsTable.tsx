import { WalletTransactionItem } from '@/api/hooks/report/types';
import { DataTable, CRMColumnDef } from '@/components/table/DataTable';
import { useTranslation } from 'react-i18next';

export const WalletTransactionsTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: WalletTransactionItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const Columns: CRMColumnDef<WalletTransactionItem, unknown>[] = [
    {
      fixed: true,
      size: 50,
      id: 'No.',
      header: t('ib.overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'lastName',
      fixed: true,
      size: 180,
      header: t('financial.walletTransactions.lastName'),
      cell: ({ row }) => (
        <div>
          <div>{(row.original.lastName ?? '') + (row.original.name ?? '')}</div>
          <div>{row.original.showId}</div>
        </div>
      ),
    },
    {
      id: 'operationType',
      size: 180,
      header: t('financial.walletTransactions.operationType'),
      accessorFn: row => row.operationType,
    },
    {
      id: 'operationMethod',
      size: 180,
      header: t('financial.walletTransactions.inMethod'),
      accessorFn: row => row.operationMethod,
    },
    {
      accessorKey: 'currency',
      size: 180,
      header: t('financial.walletTransactions.wallet'),
      accessorFn: row => row.currency,
    },
    {
      accessorKey: 'preAmount',
      size: 180,
      header: t('financial.walletTransactions.preAmount'),
      accessorFn: row => row.preAmount,
    },
    {
      accessorKey: 'amount',
      size: 180,
      header: t('financial.walletTransactions.amount'),
      accessorFn: row => row.amount,
    },
    {
      accessorKey: 'postAmount',
      size: 180,
      header: t('financial.walletTransactions.postAmount'),
      accessorFn: row => row.postAmount,
    },
    {
      accessorKey: 'operationTime',
      size: 180,
      header: t('financial.walletTransactions.operationTimeTable'),
      accessorFn: row => row.operationTime,
    },
    {
      accessorKey: 'serialNum',
      size: 180,
      header: t('financial.walletTransactions.serialNumTable'),
      accessorFn: row => row.serialNum,
    },
    {
      accessorKey: 'mtOrder',
      size: 180,
      header: t('financial.walletTransactions.mtOrder'),
      accessorFn: row => row.mtOrder || '--',
    },
    {
      accessorKey: 'remark',
      size: 180,
      header: t('financial.walletTransactions.remark'),
      accessorFn: row => row.remark || '--',
    },
  ];
  return (
    <DataTable
      columns={Columns}
      data={data}
      pageCount={pageCount}
      pageIndex={pageIndex}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      loading={loading}
      thCls="text-left"
      tdCls="text-left"
    />
  );
};
