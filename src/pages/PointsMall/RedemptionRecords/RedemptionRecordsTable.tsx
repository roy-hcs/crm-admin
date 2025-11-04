import { PointsHistoryItem } from '@/api/hooks/pointsMall/types';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { RrhTag } from '@/components/common/RrhTag';
import { DataTable } from '@/components/table/DataTable';
import { withdrawalReviewStatusMap } from '@/lib/constant';
import { ColumnDef } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const RedemptionRecordsTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: PointsHistoryItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const columns: ColumnDef<PointsHistoryItem>[] = [
    {
      id: 'orderNo',
      header: t('redemptionRecords.orderNo'),
      cell: ({ row }) => <div>{row?.original?.orderNo}</div>,
    },
    {
      id: 'userName',
      header: t('table.CRMAccount'),
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.userName || '-'}</div>
            <div>({row?.original?.showId})</div>
          </div>
        );
      },
    },
    {
      id: 'goodsId',
      header: t('redemptionRecords.goodsId'),
      cell: ({ row }) => <div>{row?.original?.goodsId || '-'}</div>,
    },
    {
      id: 'payType',
      header: t('redemptionRecords.payType'),
      cell: ({ row }) => (
        <div>
          {String(row?.original?.payType) === '1'
            ? t('redemptionRecords.pointsPayment')
            : t('redemptionRecords.combinedPayment')}
        </div>
      ),
    },
    {
      id: 'exchangePoints',
      header: t('redemptionRecords.exchangePoints'),
      cell: ({ row }) => <div>-{row?.original?.exchangePoints}</div>,
    },
    {
      id: 'paymentAmount',
      header: t('redemptionRecords.paymentAmount'),
      cell: ({ row }) => {
        if (row?.original?.paymentAmount) {
          return <div>{row?.original?.paymentAmount}USD</div>;
        }
        return '-';
      },
    },
    {
      id: 'exchangeTime',
      header: t('redemptionRecords.exchangeTime'),
      cell: ({ row }) => <div>{row?.original?.exchangeTime || '-'}</div>,
    },
    {
      id: 'verifyStatus',
      header: t('table.status'),
      cell: ({ row }) => {
        const typeMap: Record<number, 'error' | 'success' | 'warning' | 'info' | 'default'> = {
          0: 'error',
          1: 'success',
          2: 'warning',
          '-1': 'info',
          '-2': 'default',
        };
        return (
          <RrhTag type={typeMap[row.original.verifyStatus]}>
            {t(`table.${withdrawalReviewStatusMap[row.original.verifyStatus]}`)}
          </RrhTag>
        );
      },
    },
    {
      id: 'updateBy',
      header: t('products.updateBy'),
      cell: ({ row }) => <div>{row?.original?.updateBy || '-'}</div>,
    },
    {
      id: 'updateTime',
      header: t('table.updateTime'),
      cell: ({ row }) => <div>{row?.original?.updateTime || '-'}</div>,
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
      columns={columns}
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
