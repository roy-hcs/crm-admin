import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowData,
} from '@tanstack/react-table';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataTablePagination } from './DataTablePagination';
import { useTranslation } from 'react-i18next';

export type FixedColumnPosition = boolean | 'left' | 'right';

interface WithAccessorKey {
  accessorKey?: string;
}

export type CRMColumnDef<TData extends RowData, TValue> = ColumnDef<TData, TValue> &
  WithAccessorKey & {
    fixed?: FixedColumnPosition;
    width?: number | string;
    minWidth?: number | string;
  };

interface PinnedStyleResult {
  className: string;
  style: React.CSSProperties;
}

interface DataTableProps<TData extends RowData, TValue> {
  columns: CRMColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  thCls?: string;
  tdCls?: string;
  loading?: boolean;
}

function useFixedColumns<TData extends RowData>(
  columns: CRMColumnDef<TData, unknown>[],
  tableRef: React.RefObject<HTMLTableElement | null>,
) {
  const [canScroll, setCanScroll] = useState({
    left: false,
    right: false,
  });

  const columnPinning = useMemo(() => {
    const left: string[] = [];
    const right: string[] = [];

    columns.forEach(col => {
      const fixed = col.fixed;
      // Get column identifier - try id first, then accessorKey, or accessorFn's debug name
      const id = col.id || col.accessorKey || '';

      if (!id || !fixed) return;

      if (fixed === 'right') {
        right.push(id);
      } else {
        // Both true and 'left' values will pin to left
        left.push(id);
      }
    });

    return { left, right };
  }, [columns]);

  // Set up scroll event listener for shadow effects
  useEffect(() => {
    const scrollContainer = tableRef.current?.parentElement;
    if (!scrollContainer) return;

    const updateScrollState = () => {
      setCanScroll({
        left: scrollContainer.scrollLeft > 0,
        right:
          scrollContainer.scrollLeft + scrollContainer.clientWidth < scrollContainer.scrollWidth,
      });
    };

    // Initial update
    updateScrollState();

    // Listen for scroll events
    scrollContainer.addEventListener('scroll', updateScrollState, { passive: true });

    // Watch for size changes with ResizeObserver
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(scrollContainer);

    // Cleanup
    return () => {
      scrollContainer.removeEventListener('scroll', updateScrollState);
      resizeObserver.disconnect();
    };
  }, [tableRef]);

  return { columnPinning, canScroll };
}

const TableRowSkeleton = ({ columns }: { columns: number }) => {
  return (
    <TableRow className="h-12 animate-pulse">
      {Array.from({ length: columns }).map((_, index) => (
        <TableCell key={index}>
          <div className="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></div>
        </TableCell>
      ))}
    </TableRow>
  );
};

export function DataTable<TData extends RowData, TValue>({
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
  const tableRef = useRef<HTMLTableElement>(null);
  const { t } = useTranslation();

  // Set up pagination state
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  // Get fixed column handling utilities
  const { columnPinning, canScroll } = useFixedColumns<TData>(
    columns as CRMColumnDef<TData, unknown>[],
    tableRef,
  );

  // Initialize the table
  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination,
      // Enable TanStack's column pinning by providing state derived from columns
      columnPinning,
    },
    onPaginationChange: updater => {
      if (typeof updater === 'function') {
        const newState = updater(pagination);
        if (newState.pageIndex !== pagination.pageIndex) {
          onPageChange(newState.pageIndex);
        }
        if (newState.pageSize !== pagination.pageSize && onPageSizeChange) {
          onPageSizeChange(newState.pageSize);
        }
      }
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  // Set column pinning state in the table
  useEffect(() => {
    table.setColumnPinning(columnPinning);
  }, [table, columnPinning]);

  // Calculate column offsets for fixed positioning
  const calculateOffsets = useMemo(() => {
    const leftOffsets: Record<string, number> = {};
    const rightOffsets: Record<string, number> = {};

    let leftAcc = 0;
    table.getLeftHeaderGroups()[0].headers.forEach(header => {
      leftOffsets[header.id] = leftAcc;
      leftAcc += header.getSize();
    });

    let rightAcc = 0;
    table
      .getRightHeaderGroups()[0]
      .headers.reverse()
      .forEach(header => {
        rightOffsets[header.id] = rightAcc;
        rightAcc += header.getSize();
      });

    return { leftOffsets, rightOffsets };
  }, [table]);

  const getPinnedStyles = (
    columnId: string,
    pinDirection: FixedColumnPosition | null,
    isHeader: boolean,
  ): PinnedStyleResult => {
    if (!pinDirection) {
      return { className: '', style: {} };
    }
    // Base sticky style for headers and cells
    const baseClass = isHeader ? 'sticky top-0 z-20 bg-background' : 'sticky z-10 bg-background';

    // Find column definition for width properties
    const columnDef = columns.find(col => col.id === columnId || col.accessorKey === columnId) as
      | CRMColumnDef<TData, TValue>
      | undefined;

    // Get column width preferences
    const width = columnDef?.width;
    const minWidth = columnDef?.minWidth;

    // Get current column size from table
    const column = table.getColumn(columnId);
    const size = column?.getSize();

    // Position styles
    const style: React.CSSProperties = {
      width: width || size,
      minWidth: minWidth || size,
    };

    if (pinDirection === 'left' || pinDirection === true) {
      const isLeftBoundary = columnPinning.left[columnPinning.left.length - 1] === columnId;
      const shadowClass =
        canScroll.left && isLeftBoundary ? 'shadow-[8px_0_8px_-6px_rgba(0,0,0,0.28)] border-r' : '';

      style.left = calculateOffsets.leftOffsets[columnId];
      return {
        className: `${baseClass} ${shadowClass}`,
        style,
      };
    } else if (pinDirection === 'right') {
      const isRightBoundary = columnPinning.right[0] === columnId;
      const shadowClass =
        canScroll.right && isRightBoundary
          ? 'shadow-[-8px_0_8px_-6px_rgba(0,0,0,0.28)] border-l'
          : '';

      style.right = calculateOffsets.rightOffsets[columnId];
      return {
        className: `${baseClass} ${shadowClass}`,
        style,
      };
    }
    return { className: '', style: {} };
  };

  return (
    <div>
      <div className="relative overflow-auto rounded-md border">
        <Table ref={tableRef}>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const pinDirection = header.column.getIsPinned() as FixedColumnPosition;
                  const { className, style } = getPinnedStyles(header.id, pinDirection, true);

                  return (
                    <TableHead
                      key={header.id}
                      className={`${thCls || ''} ${className}`}
                      style={style}
                    >
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
              Array.from({ length: pageSize || 5 }).map((_, index) => (
                <TableRowSkeleton key={`skeleton-${index}`} columns={columns.length} />
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="h-12"
                >
                  {row.getVisibleCells().map(cell => {
                    const pinDirection = cell.column.getIsPinned() as FixedColumnPosition;
                    const { className, style } = getPinnedStyles(
                      cell.column.id,
                      pinDirection,
                      false,
                    );

                    return (
                      <TableCell
                        key={cell.id}
                        className={`${tdCls || ''} ${className}`}
                        style={style}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t('common.NoData')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination className="mt-4" table={table} totalCount={pageCount * pageSize} />
    </div>
  );
}
