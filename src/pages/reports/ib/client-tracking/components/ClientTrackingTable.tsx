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
      header: t('Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'userName',
      header: t('User Name'),
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
      header: '返佣等级',
      cell: ({ row }) => (
        <div className="max-w-25 whitespace-pre-wrap">
          <span>{row.original.levelName}</span>
          <span>{row.original.level}</span>
        </div>
      ),
    },
    {
      id: 'statisticMonthStr',
      header: '月份',
      accessorFn: row => row.statisticMonthStr,
    },
    {
      accessorKey: 'allFirstDeposit',
      header: '首次入金数(全部)',
      accessorFn: row => row.allFirstDeposit,
    },
    {
      accessorKey: 'newClient',
      header: '新增客户',
      accessorFn: row => row.newClient,
    },
    {
      accessorKey: 'kycProved',
      header: 'kyc通过',
      accessorFn: row => row.kycProved,
    },
    {
      accessorKey: 'taCreateLive',
      header: '创建交易账号用户数',
      accessorFn: row => row.taCreateLive,
    },
    {
      accessorKey: 'newFirstDeposit',
      header: '首次入金数(新)',
      accessorFn: row => row.newFirstDeposit,
    },
    {
      accessorKey: 'depositClient',
      header: '入金用户数',
      accessorFn: row => row.depositClient,
    },
    {
      accessorKey: 'tradeClient',
      header: '交易用户数',
      accessorFn: row => row.tradeClient,
    },
    {
      accessorKey: 'depositFirstStr',
      header: '首次入金金额',
      accessorFn: row => row.depositFirstStr,
    },
    {
      accessorKey: 'depositTotalStr',
      header: '累计入金金额',
      accessorFn: row => row.depositTotalStr,
    },
    {
      accessorKey: 'withdrawTotalStr',
      header: '累计出金金额',
      accessorFn: row => row.withdrawTotalStr,
    },
    {
      accessorKey: 'netTotalStr',
      header: '净入金',
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
