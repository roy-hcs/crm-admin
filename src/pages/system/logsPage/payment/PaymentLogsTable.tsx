import { UserOrderLogItem } from '@/api/hooks/system/types';
import { ToolTip } from '@/components/common/ToolTip';
import { DataTable } from '@/components/table/DataTable';
import { Checkbox } from '@/components/ui/checkbox';
import { OrderStatusOptions } from '@/lib/const';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

export const PaymentLogsTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: UserOrderLogItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const tradingHistoryColumns: ColumnDef<UserOrderLogItem>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          className="data-[state=checked]:border-slate-700"
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
          className="data-[state=checked]:border-slate-700"
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
      header: t('CRMAccountPage.Index'),
      cell: ({ row }) => row.index + 1,
    },
    {
      id: 'orderNumber',
      header: t('table.orderNumber'),
      accessorFn: row => row.orderId,
    },
    {
      id: 'orderTime',
      header: t('table.orderTime'),
      accessorFn: row => row.logTime,
    },
    {
      id: 'nameOrId',
      header: t('table.nameOrId'),
      cell: ({ row }) => {
        return (
          <div>
            <div>{row.original.userName}</div>
            <div>{row.original.showId}</div>
          </div>
        );
      },
    },
    {
      id: 'channelName',
      header: t('table.paymentChannel'),
      accessorFn: row => row.channelName,
    },
    {
      id: 'orderStatus',
      header: t('financial.paymentOrders.orderStatus'),
      cell: ({ row }) => {
        const status = OrderStatusOptions.find(
          item => item.value === row.original.orderStatus.toString(),
        );
        return status?.label ? t(status.label) : '-';
      },
    },
    {
      id: 'payResult',
      header: t('table.payResult'),
      cell: ({ row }) => {
        switch (row.original.payResult) {
          case 1:
            return t('table.paySuccess');
          case 0:
            return t('table.payFailed');
          default:
            return '-';
        }
      },
    },
    {
      id: 'reason',
      header: t('table.reason'),
      cell: ({ row }) => {
        const exceedLength = row.original.msg && row.original.msg.length > 40;
        const reasonText = exceedLength ? row.original.msg?.slice(0, 40) + '...' : row.original.msg;
        return exceedLength ? (
          <ToolTip content={<div className="break-all">{row.original.msg}</div>}>
            <div>{reasonText}</div>
          </ToolTip>
        ) : (
          <div>{reasonText}</div>
        );
      },
    },
  ];
  return (
    <DataTable
      columns={tradingHistoryColumns}
      data={data}
      pageCount={pageCount}
      pageSize={pageSize}
      pageIndex={pageIndex}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      loading={loading}
    />
  );
};
