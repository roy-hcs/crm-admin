import { RefundFailLogItem } from '@/api/hooks/report/types';
import { DataTable, CRMColumnDef } from '@/components/table/DataTable';
import { RrhTag } from '@/components/common/RrhTag';
import { Ellipsis } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RrhDropdown } from '@/components/common/RrhDropdown';

export const RefundFailureLogsTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: RefundFailLogItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const Columns: CRMColumnDef<RefundFailLogItem, unknown>[] = [
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
        if (row.original.lastName || row.original.name || row.original.showId) {
          return (
            <div>
              <div>{(row.original.lastName ?? '') + (row.original.name ?? '')}</div>
              <div>{row.original.showId ?? ''}</div>
            </div>
          );
        }
        return '--';
      },
    },
    {
      id: 'operType',
      header: t('common.operType'),
      accessorFn: row => row.operType,
    },
    {
      id: 'operTime',
      header: t('common.operationTime'),
      accessorFn: row => row.operTime,
    },
    {
      id: 'refundAmount',
      header: t('financial.refundFailLog.refundAmount'),
      accessorFn: row => row.refundAmount,
    },
    {
      id: 'refundAccount',
      header: t('financial.refundFailLog.refundAccount'),
      cell: ({ row }) => {
        const name = row?.original?.refundAccount?.split('</br>') ?? [];
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
      id: 'status',
      header: t('common.status'),
      cell: ({ row }) => <RrhTag status={String(row.original.status)} />,
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
