import { DataTable, CRMColumnDef } from '@/components/table/DataTable';
import { useTranslation } from 'react-i18next';
import { CrmInfoVerifyItem } from '@/api/hooks/review/types';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { Ellipsis } from 'lucide-react';

export const InFormationTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: CrmInfoVerifyItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const baseColumns: CRMColumnDef<CrmInfoVerifyItem, unknown>[] = [
    {
      fixed: true,
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'name',
      header: t('table.fullName'),
      accessorFn: row => `${row.userLastName} ${row.userName}`,
      cell: ({ row }) => {
        return !row.original.userLastName && !row.original.userShowId ? (
          <div className="text-center">-</div>
        ) : (
          <div>
            <div>{row.original.userLastName}</div>
            <div>{row.original.userShowId}</div>
          </div>
        );
      },
    },
  ];
  const commonColumns: CRMColumnDef<CrmInfoVerifyItem, unknown>[] = [
    {
      id: 'infoType',
      header: t('review.information.infoType'),
      accessorKey: 'infoType',
      cell: ({ row }) => row.original.infoType || '-',
    },
    {
      id: 'status',
      header: t('common.status'),
      accessorKey: 'status',
      cell: ({ row }) => row.original.status || '-',
    },
    {
      id: 'subTime',
      header: t('common.subTime'),
      accessorKey: 'subTime',
      cell: ({ row }) => row.original.subTime || '-',
    },
    {
      id: 'verifyUserName',
      header: t('review.information.verifyUserName'),
      accessorKey: 'verifyUserName',
      cell: ({ row }) => row.original.verifyUserName || '-',
    },
    {
      id: 'verifyTime',
      header: t('review.information.verifyTime'),
      accessorKey: 'verifyTime',
      cell: ({ row }) => row.original.verifyTime || '-',
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
  const Columns: CRMColumnDef<CrmInfoVerifyItem, unknown>[] = [...baseColumns, ...commonColumns];
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
