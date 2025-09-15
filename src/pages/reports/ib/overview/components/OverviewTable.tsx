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
      size: 50,
      id: 'No.',
      header: t('ib.overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'userName',
      size: 180,
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
      size: 180,

      accessorFn: row => row.userNumber,
    },
    {
      accessorKey: 'depositUserNumber',
      header: t('ib.overview.depositUserNumber'),
      size: 180,

      accessorFn: row => row.depositUserNumber,
    },
    {
      accessorKey: 'accountNumber',
      header: t('ib.overview.accountNumber'),
      size: 180,

      accessorFn: row => row.accountNumber,
    },
    {
      accessorKey: 'balance',
      header: t('ib.overview.balance'),
      size: 180,

      accessorFn: row => row.balance,
    },
    {
      accessorKey: 'depositAmount',
      header: t('ib.overview.depositAmount'),
      size: 180,

      accessorFn: row => row.depositAmount,
    },
    {
      accessorKey: 'withdrawAmount',
      header: t('ib.overview.withdrawAmount'),
      size: 180,

      accessorFn: row => row.withdrawAmount,
    },
    {
      accessorKey: 'netDeposit',
      header: t('ib.overview.netDeposit'),
      size: 180,

      accessorFn: row => row.netDeposit,
    },
    {
      accessorKey: 'volume',
      header: t('ib.overview.volume'),
      size: 180,

      accessorFn: row => row.volume,
    },
    {
      accessorKey: 'profitAndLoss',
      header: t('ib.overview.profitAndLoss'),
      size: 180,

      accessorFn: row => row.profitAndLoss,
    },
    {
      accessorKey: 'commission',
      header: t('ib.overview.commission'),
      size: 180,

      accessorFn: row => row.commission,
    },
    {
      accessorKey: 'swaps',
      header: t('ib.overview.swaps'),
      size: 180,

      accessorFn: row => row.swaps,
    },
    {
      accessorKey: 'rebateOnTrade',
      header: t('ib.overview.rebateOnTrade'),
      size: 180,

      accessorFn: row => row.rebateOnTrade,
    },
    {
      accessorKey: 'rebateOnCommission',
      header: t('ib.overview.rebateOnCommission'),
      size: 180,

      accessorFn: row => row.rebateOnCommission,
    },
    {
      accessorKey: 'rebateOnDeposit',
      header: t('ib.overview.rebateOnDeposit'),
      size: 180,

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
