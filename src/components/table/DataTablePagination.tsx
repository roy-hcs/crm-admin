import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { CrmSelect } from '../common/CrmSelect';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalCount?: number;
  className?: string;
}

export function DataTablePagination<TData>({
  table,
  totalCount,
  className,
}: DataTablePaginationProps<TData>) {
  return (
    <div className={cn('flex items-center justify-between px-2', className)}>
      <div className="text-muted-foreground flex-1 text-sm">
        {/* Show total count provided by API */}
        {totalCount !== undefined && <span>{totalCount} total records</span>}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <CrmSelect
            options={[
              { label: '10', value: '10' },
              { label: '20', value: '20' },
              { label: '30', value: '30' },
              { label: '40', value: '40' },
              { label: '50', value: '50' },
            ]}
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={value => table.setPageSize(Number(value))}
          />
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
