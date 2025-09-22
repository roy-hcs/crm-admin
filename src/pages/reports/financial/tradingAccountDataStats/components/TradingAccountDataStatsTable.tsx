import { DataStatisticsItem } from '@/api/hooks/report/types';
import { DataTable, CRMColumnDef } from '@/components/table/DataTable';
import { useTranslation } from 'react-i18next';

export const TradingAccountDataStatsTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: DataStatisticsItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const Columns: CRMColumnDef<DataStatisticsItem, unknown>[] = [
    {
      id: 'No.',
      size: 50,
      header: t('ib.overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'login',

      header: t('financial.tradingAccountTransactions.name'),
      size: 180,
      accessorFn: row => row.login,
    },
    {
      id: 'login',

      header: t('financial.tradingAccountTransactions.login'),
      accessorFn: row => row.login,
    },
    {
      id: 'username',

      header: t('financial.tradingAccountDataStats.username'),
      size: 180,
      cell: ({ row }) => {
        if (row?.original?.username) {
          return row.original.username;
        }
        return '--';
      },
    },
    {
      id: 'userLevel',

      header: t('financial.tradingAccountDataStats.userLevel'),
      size: 180,
      cell: ({ row }) => {
        if (row?.original?.userLevel) {
          return row.original.userLevel;
        }
        return '--';
      },
    },
    {
      id: 'directBrokerName',

      header: t('financial.tradingAccountDataStats.directBrokerName'),
      size: 180,
      cell: ({ row }) => {
        if (row?.original?.directBrokerName) {
          return row.original.directBrokerName;
        }
        return '--';
      },
    },
    {
      id: 'positiveBalance',

      header: t('financial.tradingAccountDataStats.positiveBalance'),
      size: 180,
      cell: ({ row }) => {
        if (row?.original?.positiveBalanceCount || row?.original?.positiveBalance) {
          return (
            <div>
              <div>{row?.original?.positiveBalanceCount || '0'}</div>
              <div>{row?.original?.positiveBalance || '0'}</div>
              <div>{row?.original?.currency}</div>
            </div>
          );
        }
        return '--';
      },
    },
    {
      id: 'negativeBalance',

      header: t('financial.tradingAccountDataStats.negativeBalance'),
      size: 180,
      cell: ({ row }) => {
        if (row?.original?.negativeBalanceCount || row?.original?.negativeBalance) {
          return (
            <div>
              <div>{row?.original?.negativeBalanceCount || '0'}</div>
              <div>{row?.original?.negativeBalance || '0'}</div>
              <div>{row?.original?.currency}</div>
            </div>
          );
        }
        return '--';
      },
    },
    {
      id: 'netDeposit',

      header: t('financial.tradingAccountDataStats.netDeposit'),
      size: 180,
      cell: ({ row }) => {
        if (row?.original?.positiveBalance || row?.original?.negativeBalance) {
          return (
            <div>
              <div>{row?.original?.positiveBalance || '0'}</div>
              <div>{row?.original?.negativeBalance || '0'}</div>
              <div>{row?.original?.currency}</div>
            </div>
          );
        }
        return '--';
      },
    },
    {
      id: 'balance',

      header: t('financial.tradingAccountDataStats.balance'),
      size: 180,
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.balance || '0'}</div>
            <div>{row?.original?.currency}</div>
          </div>
        );
      },
    },
    {
      id: 'netWorth',

      header: t('financial.tradingAccountDataStats.netWorth'),
      size: 180,
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.netWorth || '0'}</div>
            <div>{row?.original?.currency}</div>
          </div>
        );
      },
    },
    {
      id: 'credit',

      header: t('financial.tradingAccountDataStats.credit'),
      size: 180,
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.credit || '0'}</div>
            <div>{row?.original?.currency}</div>
          </div>
        );
      },
    },
    {
      id: 'usedAdvance',

      header: t('financial.tradingAccountDataStats.usedAdvance'),
      size: 180,
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.usedAdvance || '0'}</div>
            <div>{row?.original?.currency}</div>
          </div>
        );
      },
    },
    {
      id: 'usableAdvance',

      header: t('financial.tradingAccountDataStats.usableAdvance'),
      size: 180,
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.usableAdvance || '0'}</div>
            <div>{row?.original?.currency}</div>
          </div>
        );
      },
    },
    {
      id: 'advanceScale',

      header: t('financial.tradingAccountDataStats.advanceScale'),
      size: 180,
      cell: ({ row }) => {
        if (row?.original?.advanceScale) {
          return `${row?.original?.advanceScale}%`;
        }
        return '--';
      },
    },
    {
      id: 'riskScale',

      header: t('financial.tradingAccountDataStats.riskScale'),
      size: 180,
      cell: ({ row }) => {
        if (row?.original?.riskScale) {
          return `${row?.original?.riskScale}%`;
        }
        return '--';
      },
    },
    {
      id: 'profitPosition',

      header: t('financial.tradingAccountDataStats.profitPosition'),
      size: 180,
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.profitPosition || '0'}</div>
            <div>{row?.original?.currency}</div>
          </div>
        );
      },
    },
    {
      id: 'profitPosition',

      header: t('financial.tradingAccountDataStats.volumePosition'),
      size: 180,
      accessorFn: row => row.volumePosition || 0,
    },
    {
      id: 'swapsPosition',

      header: t('financial.tradingAccountDataStats.swapsPosition'),
      size: 180,
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.swapsPosition || '0'}</div>
            <div>{row?.original?.currency}</div>
          </div>
        );
      },
    },
    {
      id: 'profitLoss',

      header: t('financial.tradingAccountDataStats.profitLoss'),
      size: 180,
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.profitLoss || '0'}</div>
            <div>{row?.original?.currency}</div>
          </div>
        );
      },
    },
    {
      id: 'volumeLoss',

      header: t('financial.tradingAccountDataStats.volumeLoss'),
      size: 180,
      accessorFn: row => row.volumeLoss || 0,
    },
    {
      id: 'commission',

      header: t('financial.tradingAccountDataStats.commission'),
      size: 180,
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.commission || '0'}</div>
            <div>{row?.original?.currency}</div>
          </div>
        );
      },
    },
    {
      id: 'swaps',

      header: t('financial.tradingAccountDataStats.swaps'),
      size: 180,
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.swaps || '0'}</div>
            <div>{row?.original?.currency}</div>
          </div>
        );
      },
    },
    {
      id: 'netProfit',

      header: t('financial.tradingAccountDataStats.netProfit'),
      size: 180,
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.netProfit || '0'}</div>
            <div>{row?.original?.currency}</div>
          </div>
        );
      },
    },
    {
      id: 'netProfitRatio',

      header: t('financial.tradingAccountDataStats.netProfitRatio'),
      size: 180,
      cell: ({ row }) => {
        if (row?.original?.netProfitRatio) {
          return `${row?.original?.netProfitRatio}%`;
        }
        return '--';
      },
    },
    {
      id: 'rebateTraderAmount',

      header: t('financial.tradingAccountDataStats.rebateTraderAmount'),
      size: 180,
      accessorFn: row => row.rebateTraderAmount || 0,
    },
    {
      id: 'rebateCommissionAmount',

      header: t('financial.tradingAccountDataStats.rebateCommissionAmount'),
      size: 180,
      accessorFn: row => row.rebateCommissionAmount || 0,
    },
    {
      id: 'rebateDepositAmount',

      header: t('financial.tradingAccountDataStats.rebateDepositAmount'),
      size: 180,
      accessorFn: row => row.rebateDepositAmount || 0,
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
