import { DepositListItem } from '@/api/hooks/review';
import { DataTable } from '@/components/table';
import { depositMethodsMap } from '@/lib/constant';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

export const DepositRecordTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: DepositListItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const ReviewDepositTableColumns: ColumnDef<DepositListItem>[] = [
    {
      id: 'orderNumber',
      header: t('table.orderNumber'),
      accessorFn: row => row.orderNum,
    },
    {
      id: 'depositMethods',
      header: t('table.depositMethods'),
      cell: ({ row }) => {
        const method = row.original.method;
        return method ? t(`table.${depositMethodsMap[method]}`) : '-';
      },
    },
    {
      id: 'depositAccount',
      header: t('table.depositAccount'),
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
      id: 'payAmount',
      header: t('table.payAmount'),
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.deposit} {row.original.depositCurrency}
        </div>
      ),
    },
    {
      id: 'depositAmount',
      header: t('table.depositAmount'),
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.factDeposit} {row.original.feeCurrency}
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
        row.original.receiptAmount ? (
          <div className="text-center">
            {row.original.receiptAmount} {row.original.receiptCurrency}
          </div>
        ) : (
          <div>-</div>
        ),
    },

    {
      id: 'exchangeRate',
      header: t('common.exchangeRate'),
      cell: ({ row }) =>
        row.original.rate ? (
          <div className="text-center">
            <div>{row.original.rate.toFixed(5)}</div>
            <div>{row.original.currencyPair}</div>
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
