import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  // getPaginationRowModel,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataTablePagination } from './DataTablePagination';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  thCls?: string;
  tdCls?: string;
  loading?: boolean;
}

const TableRowSkeleton = ({ columns }: { columns: number }) => {
  return (
    <TableRow className="h-16 animate-pulse">
      {Array.from({ length: columns }).map((_, index) => (
        <TableCell key={index}>
          <div className="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></div>
        </TableCell>
      ))}
    </TableRow>
  );
};

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  thCls,
  tdCls,
  loading = false,
}: DataTableProps<TData, TValue>) {
  const pagination = {
    pageIndex,
    pageSize,
  };
  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    state: {
      pagination,
    },
    onPaginationChange: updater => {
      if (typeof updater === 'function') {
        const newState = updater(pagination);
        if (newState.pageIndex !== pagination.pageIndex) {
          console.log('onPageChange', newState.pageIndex);
          onPageChange(newState.pageIndex);
        }
        if (newState.pageSize !== pagination.pageSize) {
          onPageSizeChange(newState.pageSize);
        }
      }
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} className={thCls}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              // Show skeleton rows when loading
              Array.from({ length: pageSize || 5 }).map((_, index) => (
                <TableRowSkeleton key={`skeleton-${index}`} columns={columns.length} />
              ))
            ) : table.getRowModel().rows?.length ? (
              // Show actual data when not loading
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className={tdCls}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Show empty state when not loading and no data
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} totalCount={pageCount * pageSize} />
    </div>
  );
}
