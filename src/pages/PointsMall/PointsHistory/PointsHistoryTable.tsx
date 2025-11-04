import { PointsChangeItem } from '@/api/hooks/pointsMall/types';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { DataTable } from '@/components/table/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const PointsHistoryTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  operTypeList,
}: {
  data: PointsChangeItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  operTypeList: { dictLabel: string; dictValue: string }[];
}) => {
  const { t } = useTranslation();
  const columns: ColumnDef<PointsChangeItem>[] = [
    {
      id: 'serialNo',
      header: t('redemptionRecords.orderNo'),
      cell: ({ row }) => <div>{row?.original?.serialNo}</div>,
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
      id: 'businessType',
      header: t('PointsHistory.businessType'),
      cell: ({ row }) => {
        const type = operTypeList?.find(
          item => item.dictValue === String(row?.original?.businessType),
        );
        console.log(type, 'type');
        return <div>{type ? type.dictLabel : '-'}</div>;
      },
    },
    {
      id: 'bonusPoints',
      header: t('PointsHistory.bonusPoints'),
      cell: ({ row }) => <div>+{row?.original?.bonusPoints || '-'}</div>,
    },
    {
      id: 'pointsBalance',
      header: t('PointsHistory.pointsBalance'),
      cell: ({ row }) => <div>{row?.original?.pointsBalance || '-'}</div>,
    },
    {
      id: 'createBy',
      header: t('products.updateBy'),
      cell: ({ row }) => <div>{row?.original?.createBy || '-'}</div>,
    },
    {
      id: 'createTime',
      header: t('table.operationTime'),
      cell: ({ row }) => <div>{row?.original?.createTime || '-'}</div>,
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
