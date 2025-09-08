import { AgencyClientTrackingItem } from '@/api/hooks/report/types';
import { DataTable } from '@/components/table/DataTable';
import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';

export const ClientTrackingTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: AgencyClientTrackingItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const crmColumns: ColumnDef<AgencyClientTrackingItem>[] = [
    {
      id: 'select',
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
      id: 'No.',
      header: t('ib.CustomerTracking.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'userName',
      header: t('ib.CustomerTracking.userName'),
      accessorFn: row => row.userName,
      cell: ({ row }) => (
        <div>
          <div>{row.original.userName}</div>
          <div>{row.original.email}</div>
        </div>
      ),
    },
    {
      id: 'levelName',
      header: t('ib.CustomerTracking.levelName'),
      cell: ({ row }) => (
        <div className="max-w-25 whitespace-pre-wrap">
          <span>{row.original.levelName}</span>
          <span>{row.original.level}</span>
        </div>
      ),
    },
    {
      id: 'statisticMonthStr',
      header: t('ib.CustomerTracking.statisticMonthStr'),
      accessorFn: row => row.statisticMonthStr,
    },
    {
      accessorKey: 'allFirstDeposit',
      header: t('ib.CustomerTracking.allFirstDeposit'),
      accessorFn: row => row.allFirstDeposit,
    },
    {
      accessorKey: 'newClient',
      header: t('ib.CustomerTracking.newClient'),
      accessorFn: row => row.newClient,
    },
    {
      accessorKey: 'kycProved',
      header: t('ib.CustomerTracking.kycProved'),
      accessorFn: row => row.kycProved,
    },
    {
      accessorKey: 'taCreateLive',
      header: t('ib.CustomerTracking.taCreateLive'),
      accessorFn: row => row.taCreateLive,
    },
    {
      accessorKey: 'newFirstDeposit',
      header: t('ib.CustomerTracking.newFirstDeposit'),
      accessorFn: row => row.newFirstDeposit,
    },
    {
      accessorKey: 'depositClient',
      header: t('ib.CustomerTracking.depositClient'),
      accessorFn: row => row.depositClient,
    },
    {
      accessorKey: 'tradeClient',
      header: t('ib.CustomerTracking.tradeClient'),
      accessorFn: row => row.tradeClient,
    },
    {
      accessorKey: 'depositFirstStr',
      header: t('ib.CustomerTracking.depositFirstStr'),
      accessorFn: row => row.depositFirstStr,
    },
    {
      accessorKey: 'depositTotalStr',
      header: t('ib.CustomerTracking.depositTotalStr'),
      accessorFn: row => row.depositTotalStr,
    },
    {
      accessorKey: 'withdrawTotalStr',
      header: t('ib.CustomerTracking.withdrawTotalStr'),
      accessorFn: row => row.withdrawTotalStr,
    },
    {
      accessorKey: 'netTotalStr',
      header: t('ib.CustomerTracking.netTotalStr'),
      accessorFn: row => row.netTotalStr,
    },
  ];
  return (
    <DataTable
      columns={crmColumns}
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
