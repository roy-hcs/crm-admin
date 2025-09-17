import { OverviewItem } from '@/api/hooks/report/types';
import { DataTable, CRMColumnDef } from '@/components/table/DataTable';
import { useTranslation } from 'react-i18next';
// import { Checkbox } from '@/components/ui/checkbox';

export const OverviewTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: OverviewItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const Columns: CRMColumnDef<OverviewItem, unknown>[] = [
    {
      fixed: true,
      id: 'No.',
      size: 50,
      header: t('ib.overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'userName',
      fixed: true,
      header: t('ib.overview.userName'),
      accessorFn: row => row.username,
    },
    {
      id: 'email',
      fixed: true,
      header: t('ib.overview.email'),
      size: 180,
      accessorFn: row => row.email,
    },
    {
      id: 'rebateLevel',
      fixed: true,
      header: t('ib.overview.rebateLevelId'),
      size: 180,
      accessorFn: row => row.rebateLevel,
    },
    {
      accessorKey: 'userNumber',
      header: t('ib.overview.userNumber'),
      accessorFn: row => row.userNumber,
    },
    {
      accessorKey: 'depositUserNumber',
      header: t('ib.overview.depositUserNumber'),
      accessorFn: row => row.depositUserNumber,
    },
    {
      accessorKey: 'accountNumber',
      header: t('ib.overview.accountNumber'),
      accessorFn: row => row.accountNumber,
    },
    {
      accessorKey: 'balance',
      header: t('ib.overview.balance'),
      accessorFn: row => row.balance,
    },
    {
      accessorKey: 'depositAmount',
      header: t('ib.overview.depositAmount'),
      accessorFn: row => row.depositAmount,
    },
    {
      accessorKey: 'withdrawAmount',
      header: t('ib.overview.withdrawAmount'),
      accessorFn: row => row.withdrawAmount,
    },
    {
      accessorKey: 'netDeposit',
      header: t('ib.overview.netDeposit'),
      accessorFn: row => row.netDeposit,
    },
    {
      accessorKey: 'volume',
      header: t('ib.overview.volume'),

      accessorFn: row => row.volume,
    },
    {
      accessorKey: 'profitAndLoss',
      header: t('ib.overview.profitAndLoss'),
      accessorFn: row => row.profitAndLoss,
    },
    {
      accessorKey: 'commission',
      header: t('ib.overview.commission'),

      accessorFn: row => row.commission,
    },
    {
      accessorKey: 'swaps',
      header: t('ib.overview.swaps'),
      accessorFn: row => row.swaps,
    },
    {
      accessorKey: 'rebateOnTrade',
      header: t('ib.overview.rebateOnTrade'),
      accessorFn: row => row.rebateOnTrade,
    },
    {
      accessorKey: 'rebateOnCommission',
      header: t('ib.overview.rebateOnCommission'),
      accessorFn: row => row.rebateOnCommission,
    },
    {
      accessorKey: 'rebateOnDeposit',
      header: t('ib.overview.rebateOnDeposit'),
      accessorFn: row => row.rebateOnDeposit,
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
