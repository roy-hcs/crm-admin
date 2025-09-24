import { PaymentOrderItem } from '@/api/hooks/report/types';
import { DataTable, CRMColumnDef } from '@/components/table/DataTable';
import { RrhOrderStatusTag } from '@/components/common/RrhOrderStatusTag';
import { Ellipsis } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RrhDropdown } from '@/components/common/RrhDropdown';

export const PaymentOrdersTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: PaymentOrderItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const Columns: CRMColumnDef<PaymentOrderItem, unknown>[] = [
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
      header: t('financial.paymentOrders.userName'),
      cell: ({ row }) => {
        const name = row?.original?.userName?.split('<br/>') ?? [];
        if (name.length === 0) {
          return '--';
        }
        return (
          <div>
            <div>{name[0]}</div>
            <div>{name[1]}</div>
          </div>
        );
      },
    },
    {
      id: 'account',
      header: t('financial.paymentOrders.account'),
      accessorFn: row => row.account,
    },
    {
      id: 'payAmount',
      header: t('financial.paymentOrders.payAmount'),
      accessorFn: row => row.payAmount,
    },
    {
      id: 'receiptAmount',
      header: t('financial.paymentOrders.receiptAmount'),
      accessorFn: row => row.receiptAmount || '--',
    },
    {
      id: 'orderStatus',
      header: t('financial.paymentOrders.orderStatus'),
      cell: ({ row }) => <RrhOrderStatusTag status={String(row.original.orderStatus)} />,
    },
    {
      id: 'channelName',
      header: t('financial.paymentOrders.channelName'),
      accessorFn: row => row.channelName || '--',
    },
    {
      id: 'createTime',
      header: t('financial.paymentOrders.createTime'),
      accessorFn: row => row.createTime || '--',
    },
    {
      id: 'orderId',
      header: t('financial.paymentOrders.orderId'),
      accessorFn: row => row.orderId || '--',
    },
    {
      id: 'operation',
      header: t('common.Operation'),
      cell: () => (
        <div>
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('common.View'), value: 'view' },
              { label: t('common.Edit'), value: 'edit' },
            ]}
            callToAction={action => {
              if (action === 'edit') {
                // Handle edit action
              } else if (action === 'view') {
                // Handle view action
              }
            }}
          />
        </div>
      ),
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
