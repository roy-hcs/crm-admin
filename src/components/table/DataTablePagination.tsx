import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { RrhSelect } from '../common/RrhSelect';
import { useTranslation } from 'react-i18next';
import { useMemo, useRef, useEffect } from 'react';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalCount?: number;
  pageSizeSelectorShow?: false;
  className?: string;
}

export function DataTablePagination<TData>({
  table,
  totalCount,
  pageSizeSelectorShow,
  className,
}: DataTablePaginationProps<TData>) {
  const { t } = useTranslation();
  const lastPage = table.getPageCount();
  const activePage = table.getState().pagination.pageIndex + 1;

  // Store the last valid page count to prevent flashing
  const lastValidPageCountRef = useRef<number>(lastPage || 1);

  // Update the ref only when we get a valid page count
  useEffect(() => {
    if (lastPage > 0) {
      lastValidPageCountRef.current = lastPage;
    }
  }, [lastPage]);

  const effectiveLastPage = lastPage || lastValidPageCountRef.current;

  const pageArr = useMemo(() => {
    if (effectiveLastPage <= 6) {
      return Array.from({ length: effectiveLastPage }, (_, index) => index + 1);
    } else if (activePage < 4) {
      return [1, 2, 3, 4, '...', effectiveLastPage];
    } else if (activePage >= 4 && activePage < effectiveLastPage - 2) {
      return [1, '...', activePage - 1, activePage, activePage + 1, '...', effectiveLastPage];
    } else {
      return [
        1,
        '...',
        effectiveLastPage - 3,
        effectiveLastPage - 2,
        effectiveLastPage - 1,
        effectiveLastPage,
      ];
    }
  }, [effectiveLastPage, activePage]);

  return (
    <div className={cn('flex items-center justify-between px-2', className)}>
      <div className="text-muted-foreground flex-1 text-sm">
        {/* Show total count provided by API */}
        {totalCount !== undefined && <span>{t('common.TotalRecords', { count: totalCount })}</span>}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        {pageSizeSelectorShow && (
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">{t('common.RowsPerPage')}</p>
            <RrhSelect
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
        )}
        <div className="flex items-center gap-x-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'h-8 w-auto gap-1 p-1',
              !table.getCanPreviousPage() ? '' : 'cursor-pointer',
            )}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
            <span>{t('common.Previous')}</span>
          </Button>
          {pageArr?.map((item, index) => {
            if (typeof item === 'string') {
              return (
                <Button
                  variant="ghost"
                  disabled
                  key={`${index}item`}
                  className="flex size-8 justify-center hover:bg-transparent"
                >
                  {item}
                </Button>
              );
            }
            return (
              <Button
                variant={activePage === item ? 'outline' : 'ghost'}
                size="icon"
                className={cn(
                  'h-8 w-auto min-w-8 p-1',
                  activePage === item ? '' : 'cursor-pointer',
                )}
                onClick={() => table.setPageIndex(item - 1)}
                key={item}
              >
                {item}
              </Button>
            );
          })}
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-auto gap-1 p-1', !table.getCanNextPage() ? '' : 'cursor-pointer')}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span>{t('common.Next')}</span>
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
