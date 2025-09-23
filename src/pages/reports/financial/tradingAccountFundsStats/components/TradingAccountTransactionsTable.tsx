import { TradingAccountFundsStatsItem } from '@/api/hooks/report/types';
import { DataTable, CRMColumnDef } from '@/components/table/DataTable';
import { useTranslation } from 'react-i18next';

export const TradingAccountTransactionsTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: TradingAccountFundsStatsItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const Columns: CRMColumnDef<TradingAccountFundsStatsItem, unknown>[] = [
    {
      fixed: true,
      id: 'No.',
      size: 50,
      header: t('ib.overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'name',
      fixed: true,
      header: t('financial.tradingAccountTransactions.name'),

      accessorFn: row => row.name,
    },
    {
      id: 'login',
      fixed: true,
      header: t('financial.tradingAccountTransactions.login'),
      accessorFn: row => row.login,
    },
    {
      id: 'balance',
      fixed: true,
      header: t('financial.tradingAccountFundsStats.balance'),

      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.positiveBalanceCount ?? '0'}</div>
            <div>
              {Number(row?.original?.positiveBalance ?? 0).toFixed(2) + row?.original?.currency}
            </div>
          </div>
        );
      },
    },
    {
      id: 'inputAmountCount',
      fixed: true,
      header: t('financial.tradingAccountFundsStats.inputAmountCount'),

      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.inputAmountCount ?? '0'}</div>
            <div>
              {Number(row?.original?.inputAmount ?? 0).toFixed(2) + row?.original?.currency}
            </div>
          </div>
        );
      },
    },
    {
      id: 'sysInputAmountCount',
      fixed: true,
      header: t('financial.tradingAccountFundsStats.sysInputAmountCount'),

      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.sysInputAmountCount ?? '0'}</div>
            <div>
              {Number(row?.original?.sysInputAmount ?? 0).toFixed(2) + row?.original?.currency}
            </div>
          </div>
        );
      },
    },
    {
      id: 'commissionInputAmountCount',
      fixed: true,
      header: t('financial.tradingAccountFundsStats.commissionInputAmountCount'),

      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.commissionInputAmountCount ?? '0'}</div>
            <div>
              {Number(row?.original?.commissionInputAmount ?? 0).toFixed(2) +
                row?.original?.currency}
            </div>
          </div>
        );
      },
    },
    {
      id: 'insideTransferInputAmountCount',
      fixed: true,
      header: t('financial.tradingAccountFundsStats.insideTransferInputAmountCount'),

      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.insideTransferInputAmountCount ?? '0'}</div>
            <div>
              {Number(row?.original?.insideTransferInputAmount ?? 0).toFixed(2) +
                row?.original?.currency}
            </div>
          </div>
        );
      },
    },
    {
      id: 'negativeBalanceCount',
      fixed: true,
      header: t('financial.tradingAccountFundsStats.negativeBalanceCount'),

      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.negativeBalanceCount ?? '0'}</div>
            <div>
              {Number(row?.original?.negativeBalance ?? 0).toFixed(2) + row?.original?.currency}
            </div>
          </div>
        );
      },
    },
    {
      id: 'outAmountCount',
      fixed: true,
      header: t('financial.tradingAccountFundsStats.outAmountCount'),

      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.outAmountCount ?? '0'}</div>
            <div>{Number(row?.original?.outAmount ?? 0).toFixed(2) + row?.original?.currency}</div>
          </div>
        );
      },
    },
    {
      id: 'sysOutAmountCount',
      fixed: true,
      header: t('financial.tradingAccountFundsStats.sysOutAmountCount'),

      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.sysOutAmountCount ?? '0'}</div>
            <div>
              {Number(row?.original?.sysOutAmount ?? 0).toFixed(2) + row?.original?.currency}
            </div>
          </div>
        );
      },
    },
    {
      id: 'insideTransferOutAmountCount',
      fixed: true,
      header: t('financial.tradingAccountFundsStats.insideTransferOutAmountCount'),

      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.insideTransferOutAmountCount ?? '0'}</div>
            <div>
              {Number(row?.original?.insideTransferOutAmount ?? 0).toFixed(2) +
                row?.original?.currency}
            </div>
          </div>
        );
      },
    },
    {
      id: 'creditInputAmountCount',
      fixed: true,
      header: t('financial.tradingAccountFundsStats.creditInputAmountCount'),

      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.creditInputAmountCount ?? '0'}</div>
            <div>
              {Number(row?.original?.creditInputAmount ?? 0).toFixed(2) + row?.original?.currency}
            </div>
          </div>
        );
      },
    },
    {
      id: 'creditOutAmountCount',
      fixed: true,
      header: t('financial.tradingAccountFundsStats.creditOutAmountCount'),

      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.creditOutAmountCount ?? '0'}</div>
            <div>
              {Number(row?.original?.creditOutAmount ?? 0).toFixed(2) + row?.original?.currency}
            </div>
          </div>
        );
      },
    },
    {
      id: 'profitLoss',
      fixed: true,
      header: t('financial.tradingAccountFundsStats.profitLoss'),

      accessorFn: row => row.profitLoss || `0${row.currency}`,
    },
    {
      id: 'balance',
      fixed: true,
      header: t('financial.tradingAccountFundsStats.currentbalance'),

      accessorFn: row => row.balance || `0${row.currency}`,
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
