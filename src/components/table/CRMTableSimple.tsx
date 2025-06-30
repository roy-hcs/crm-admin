import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './DataTable';
import { CrmUserItem } from '@/api/hooks/system/types';

export const CRMTableSimple = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  loading = false,
  onPageChange,
  onPageSizeChange,
  onRowSelect,
}: {
  data: CrmUserItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  loading?: boolean;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRowSelect?: (rowData: CrmUserItem) => void;
}) => {
  const crmColumns: ColumnDef<CrmUserItem>[] = [
    {
      id: 'select',
      header: () => <div></div>,
      cell: ({ row, table }) => (
        <input
          type="radio"
          name="tableRowSelection"
          checked={row.getIsSelected()}
          onChange={() => {
            table.getRowModel().rows.forEach(r => {
              r.toggleSelected(false);
            });
            row.toggleSelected(true);
            onRowSelect?.(row.original);
          }}
          className="h-4 w-4 cursor-pointer accent-blue-500"
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'userName',
      header: 'userName',
      accessorFn: row => row.userName,
      cell: ({ row }) => (
        <div>
          <div>{row.original.userName}</div>
          <div>{row.original.showId}</div>
        </div>
      ),
    },
    {
      id: 'mobile',
      header: 'Mobile',
      cell: ({ row }) => (
        <div className="max-w-25 whitespace-pre-wrap">
          <span>{row.original.mzone ? `+${row.original.mzone} ` : ''}</span>
          <span>{row.original.mobile}</span>
        </div>
      ),
    },
    {
      accessorKey: 'crmRebateLevel',
      header: 'Level',
      cell: ({ row }) => (
        <div className="max-w-25 whitespace-pre-wrap">
          <span>{row.original.crmRebateLevel || '-'}</span>
        </div>
      ),
    },
  ];
  return data ? (
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
  ) : null; // Replace with actual data
};
