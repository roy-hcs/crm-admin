import { WithdrawItem } from '@/api/hooks/review';
import { DataTable } from '@/components/table';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

export const WithdrawalRecordTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  withdrawMethodList,
}: {
  data: WithdrawItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  withdrawMethodList: { id: string; name: string }[];
}) => {
  const { t } = useTranslation();
  const ReviewDepositTableColumns: ColumnDef<WithdrawItem>[] = [
    {
      id: 'orderNumber',
      header: t('table.orderNumber'),
      accessorFn: row => row.orderNum,
    },
    {
      id: 'withdrawalMethods',
      header: t('table.withdrawMethods'),
      cell: ({ row }) => {
        const method = row.original.method;
        return method
          ? withdrawMethodList?.find(item => item.id === method.toString())?.name || '-'
          : '-';
      },
    },
    {
      id: 'withdrawalAccount',
      header: t('table.withdrawAccount'),
      cell: ({ row }) => {
        if (row.original.login) {
          return row.original.aliasName ? (
            <div className="flex flex-col items-center">
              <div>{row.original.aliasName}</div>
              <div>{row.original.login}</div>
            </div>
          ) : (
            <div>{row.original.login}</div>
          );
        } else if (row.original.walletId) {
          return (
            <div>
              {t('table.wallet')} ({row.original.walletCurrency})
            </div>
          );
        }
      },
    },
    {
      id: 'balance',
      header: t('table.balance'),
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.balance} {row.original.withdrawCurrency}
        </div>
      ),
    },
    {
      id: 'withdrawAmount',
      header: t('table.withdrawAmount'),
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.withdraw} {row.original.withdrawCurrency}
        </div>
      ),
    },
    {
      id: 'commission',
      header: t('table.commission'),
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.fee} {row.original.feeCurrency}
        </div>
      ),
    },
    {
      id: 'amountOfReceipt',
      header: t('table.amountOfReceipt'),
      cell: ({ row }) =>
        row.original.factWithdraw ? (
          <div className="text-center">
            {row.original.factWithdraw} {row.original.targetCurrency}
          </div>
        ) : (
          <div>-</div>
        ),
    },
    {
      id: 'finishTime',
      header: t('table.finishTime'),
      accessorFn: row => row.verifyTime,
      cell: ({ row }) => <div>{row.original.verifyTime || '-'}</div>,
    },
  ];
  return (
    <DataTable
      columns={ReviewDepositTableColumns}
      data={data}
      pageCount={pageCount}
      pageSize={pageSize}
      pageIndex={pageIndex}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      loading={loading}
      tdCls="text-center"
      thCls="text-center"
      tableWrapperCls="border-none"
    />
  );
};
