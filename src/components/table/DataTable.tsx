import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataTablePagination } from './DataTablePagination';

// Extend ColumnDef to accept an optional `fixed` flag similar to Element UI
export type CRMColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  fixed?: boolean | 'left' | 'right';
};

interface DataTableProps<TData, TValue> {
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
  // Derive pinning from custom `fixed` on column defs: true|'left' -> left, 'right' -> right
  const columnPinning = React.useMemo(() => {
    type MaybeFixed = {
      id?: string;
      accessorKey?: string;
      fixed?: boolean | 'left' | 'right';
    };
    const left: string[] = [];
    const right: string[] = [];
    (columns as unknown as MaybeFixed[]).forEach(col => {
      const fixed = col?.fixed;
      const id = (col?.id ?? col?.accessorKey) as string | undefined;
      if (!id || fixed == null || fixed === false) return;
      if (fixed === 'right') right.push(String(id));
      else left.push(String(id)); // true | 'left' -> left
    });
    return { left, right };
  }, [columns]);

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
      // Enable TanStack's column pinning by providing state derived from columns
      columnPinning,
    },
    onPaginationChange: updater => {
      if (typeof updater === 'function') {
        const newState = updater(pagination);
        if (newState.pageIndex !== pagination.pageIndex) {
          onPageChange(newState.pageIndex);
        }
        if (newState.pageSize !== pagination.pageSize) {
          onPageSizeChange?.(newState.pageSize);
        }
      }
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  // Compute sticky offsets for pinned columns based on visible column sizes
  const leafCols = table.getVisibleLeafColumns();
  const leftOffsetMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    let acc = 0;
    leafCols.forEach(col => {
      map[col.id] = acc;
      acc += (typeof col.getSize === 'function' ? col.getSize() : 0) || 0;
    });
    return map;
  }, [leafCols]);
  const rightOffsetMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    let acc = 0;
    for (let i = leafCols.length - 1; i >= 0; i--) {
      const col = leafCols[i];
      map[col.id] = acc;
      acc += (typeof col.getSize === 'function' ? col.getSize() : 0) || 0;
    }
    return map;
  }, [leafCols]);

  // Track horizontal scroll to toggle shadows for pinned columns
  const tableRef = React.useRef<HTMLTableElement | null>(null);
  const [canScroll, setCanScroll] = React.useState({ left: false, right: false });
  React.useEffect(() => {
    // the scroll container is the parent of <table>
    const el = tableRef.current?.parentElement;
    if (!el) return;
    const update = () => {
      setCanScroll({
        left: el.scrollLeft > 0,
        right: el.scrollLeft + el.clientWidth < el.scrollWidth,
      });
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, []);

  return (
    <div>
      <div className="relative rounded-md border">
        <Table ref={tableRef}>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const pinState = table.getState().columnPinning || { left: [], right: [] };
                  const leftPinned = pinState.left ?? [];
                  const rightPinned = pinState.right ?? [];
                  const pinned = header.column.getIsPinned?.() as false | 'left' | 'right';
                  const baseSticky = 'sticky z-20 bg-background';
                  const isLeftBoundary =
                    pinned === 'left' && leftPinned[leftPinned.length - 1] === header.column.id;
                  const isRightBoundary = pinned === 'right' && rightPinned[0] === header.column.id;
                  const leftShade =
                    canScroll.left && isLeftBoundary
                      ? 'shadow-[8px_0_8px_-6px_rgba(0,0,0,0.28)] border-r'
                      : '';
                  const rightShade =
                    canScroll.right && isRightBoundary
                      ? 'shadow-[-8px_0_8px_-6px_rgba(0,0,0,0.28)] border-l'
                      : '';
                  const stickyCls = pinned
                    ? `${baseSticky} ${pinned === 'left' ? leftShade : rightShade}`
                    : '';
                  const colId = header.column.id;
                  const size = typeof header.getSize === 'function' ? header.getSize() : undefined;
                  const style: React.CSSProperties = {
                    width: size,
                    minWidth: size,
                    left: pinned === 'left' ? leftOffsetMap[colId] : undefined,
                    right: pinned === 'right' ? rightOffsetMap[colId] : undefined,
                  };
                  return (
                    <TableHead
                      key={header.id}
                      className={`${thCls ?? ''} ${stickyCls}`}
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
              // Show skeleton rows when loading
              Array.from({ length: pageSize || 5 }).map((_, index) => (
                <TableRowSkeleton key={`skeleton-${index}`} columns={columns.length} />
              ))
            ) : table.getRowModel().rows?.length ? (
              // Show actual data when not loading
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => {
                    const pinState = table.getState().columnPinning || { left: [], right: [] };
                    const leftPinned = pinState.left ?? [];
                    const rightPinned = pinState.right ?? [];
                    const pinned = cell.column.getIsPinned?.() as false | 'left' | 'right';
                    const baseSticky = 'sticky z-10 bg-background';
                    const isLeftBoundary =
                      pinned === 'left' && leftPinned[leftPinned.length - 1] === cell.column.id;
                    const isRightBoundary = pinned === 'right' && rightPinned[0] === cell.column.id;
                    const leftShade =
                      canScroll.left && isLeftBoundary
                        ? 'shadow-[8px_0_8px_-6px_rgba(0,0,0,0.28)] border-r'
                        : '';
                    const rightShade =
                      canScroll.right && isRightBoundary
                        ? 'shadow-[-8px_0_8px_-6px_rgba(0,0,0,0.28)] border-l'
                        : '';
                    const stickyCls = pinned
                      ? `${baseSticky} ${pinned === 'left' ? leftShade : rightShade}`
                      : '';
                    const colId = cell.column.id;
                    const size =
                      typeof cell.column.getSize === 'function' ? cell.column.getSize() : undefined;
                    const style: React.CSSProperties = {
                      width: size,
                      minWidth: size,
                      left: pinned === 'left' ? leftOffsetMap[colId] : undefined,
                      right: pinned === 'right' ? rightOffsetMap[colId] : undefined,
                    };
                    return (
                      <TableCell
                        key={cell.id}
                        className={`${tdCls ?? ''} ${stickyCls}`}
                        style={style}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
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
      <DataTablePagination className="mt-4" table={table} totalCount={pageCount * pageSize} />
    </div>
  );
}
