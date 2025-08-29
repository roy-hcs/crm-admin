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
      header: t('Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'userName',
      fixed: true,
      header: '代理姓名',
      accessorFn: row => row.username,
    },
    {
      id: 'email',
      header: '邮箱',
      accessorFn: row => row.email,
    },
    {
      id: 'rebateLevelId',
      header: '返佣等级',
      accessorFn: row => row.rebateLevelId,
    },
    {
      accessorKey: 'userNumber',
      header: 'CRM账户数',
      accessorFn: row => row.userNumber,
    },
    {
      accessorKey: 'depositUserNumber',
      header: 'CRM账户数(入金)',
      accessorFn: row => row.depositUserNumber,
    },
    {
      accessorKey: 'accountNumber',
      header: '交易账号数',
      accessorFn: row => row.accountNumber,
    },
    {
      accessorKey: 'balance',
      header: '余额（当前）',
      accessorFn: row => row.balance,
    },
    {
      accessorKey: 'depositAmount',
      header: '入金（统计）',
      accessorFn: row => row.depositAmount,
    },
    {
      accessorKey: 'withdrawAmount',
      header: '出金（统计）',
      accessorFn: row => row.withdrawAmount,
    },
    {
      accessorKey: 'netDeposit',
      header: '净入金',
      accessorFn: row => row.netDeposit,
    },
    {
      accessorKey: 'volume',
      header: '交易量',
      accessorFn: row => row.volume,
    },
    {
      accessorKey: 'profitAndLoss',
      header: '盈亏',
      accessorFn: row => row.profitAndLoss,
    },
    {
      accessorKey: 'commission',
      header: '手续费',
      accessorFn: row => row.commission,
    },
    {
      accessorKey: 'swaps',
      header: '库存费',
      accessorFn: row => row.swaps,
    },
    {
      accessorKey: 'rebateOnTrade',
      header: '交易返佣',
      accessorFn: row => row.rebateOnTrade,
    },
    {
      accessorKey: 'rebateOnCommission',
      header: '手续费返佣',
      accessorFn: row => row.rebateOnCommission,
    },
    {
      accessorKey: 'rebateOnDeposit',
      header: '入金返佣',
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
