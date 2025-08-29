import { overviewItem } from '@/api/hooks/report/types';
import { DataTable, CRMColumnDef } from '@/components/table/DataTable';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '@/components/ui/checkbox';

export const OverviewTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: overviewItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const Columns: CRMColumnDef<overviewItem, unknown>[] = [
    {
      id: 'select',
      size: 50,
      fixed: true,
      header: ({ table }) => (
        <Checkbox
          className="data-[state=checked]:border-blue-500 data-[state=checked]:bg-[#1E1E1E]"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="data-[state=checked]:border-blue-500 data-[state=checked]:bg-[#1E1E1E]"
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      fixed: true,
      size: 50,
      id: 'No.',
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
      header: t('ib.overview.email'),
      accessorFn: row => row.email,
    },
    {
      id: 'rebateLevelId',
      header: t('ib.overview.rebateLevelId'),
      accessorFn: row => row.rebateLevelId,
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
      thCls="text-center text-[13px]"
      tdCls="text-center text-xs"
    />
  );
};
