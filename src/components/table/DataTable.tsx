import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowData,
  getExpandedRowModel,
  ExpandedState,
  RowSelectionState,
} from '@tanstack/react-table';
import { useEffect, useMemo, useRef, forwardRef, useImperativeHandle, useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataTablePagination } from './DataTablePagination';
import { useTranslation } from 'react-i18next';

// Import extracted types and hooks
import type { DataTableProps, DataTableRef, FixedColumnPosition, CRMColumnDef } from './types';

// Re-export types for backward compatibility
export type { DataTableRef, CRMColumnDef, TreeConfig, FixedColumnPosition } from './types';
import { useFixedColumns } from './hooks/useFixedColumns';
import { useTreeData } from './hooks/useTreeData';
import { usePinnedStyles } from './hooks/usePinnedStyles';
import { TableRowSkeleton } from './components/TableRowSkeleton';
import { TreeExpandButton } from './components/TreeExpandButton';
import { cn } from '@/lib/utils';

// Types are now imported from './types'
// Hooks and components are now imported from separate files

// Generic forwardRef function that preserves generic types
function createDataTable<TData extends RowData, TValue>() {
  return forwardRef<DataTableRef, DataTableProps<TData, TValue>>(function DataTable(
    {
      columns,
      data,
      pageCount = 0,
      pageIndex = 0,
      pageSize = 10,
      onPageChange,
      onPageSizeChange,
      thCls,
      tdCls,
      loading = false,
      CustomFooter,
      CustomRow,
      treeConfig,
      tableWrapperCls,
      onSelectionChange,
    }: DataTableProps<TData, TValue>,
    ref: React.Ref<DataTableRef>,
  ) {
    const tableRef = useRef<HTMLTableElement>(null);
    const { t } = useTranslation();
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    // 保存最新的 onSelectionChange，避免在 effect 依赖中导致重复执行
    const latestOnSelectionChange = useRef<typeof onSelectionChange>(null);
    useEffect(() => {
      latestOnSelectionChange.current = onSelectionChange;
    }, [onSelectionChange]);
    // Set up pagination state
    const pagination = useMemo(
      () => ({
        pageIndex,
        pageSize,
      }),
      [pageIndex, pageSize],
    );

    // Use extracted hooks
    const { expanded, setExpanded, getRowId, processedData, getSubRows } = useTreeData(
      data,
      treeConfig,
    );

    const fixedColumnsResult = useFixedColumns(columns as CRMColumnDef<TData, unknown>[], tableRef);
    const { columnPinning } = fixedColumnsResult;

    // Initialize the table
    const table = useReactTable({
      data: processedData,
      columns,
      pageCount,
      getRowId: treeConfig?.enabled ? getRowId : undefined,
      state: {
        pagination,
        expanded: treeConfig?.enabled ? expanded : undefined,
        // Enable TanStack's column pinning by providing state derived from columns
        columnPinning,
        rowSelection, // 新增
      },
      onPaginationChange: updater => {
        if (typeof updater === 'function') {
          const newState = updater(pagination);
          if (newState.pageIndex !== pagination.pageIndex) {
            onPageChange?.(newState.pageIndex);
          }
          if (newState.pageSize !== pagination.pageSize && onPageSizeChange) {
            onPageSizeChange(newState.pageSize);
          }
        }
      },
      onExpandedChange: treeConfig?.enabled
        ? updater => {
            const newExpanded = typeof updater === 'function' ? updater(expanded) : updater;
            setExpanded(newExpanded);
            treeConfig.onExpandedChange?.(newExpanded);
          }
        : undefined,
      manualPagination: true,
      getCoreRowModel: getCoreRowModel(),
      getExpandedRowModel: treeConfig?.enabled ? getExpandedRowModel() : undefined,
      getSubRows: treeConfig?.enabled ? getSubRows : undefined,
      getRowCanExpand: treeConfig?.enabled
        ? row => (treeConfig.getRowCanExpand ? treeConfig.getRowCanExpand(row.original) : false)
        : undefined,
      onRowSelectionChange: updater => {
        // 只更新内部 rowSelection，避免在渲染过程中直接触发父组件 setState
        setRowSelection(prev => (typeof updater === 'function' ? updater(prev) : updater));
      },
    });

    // selection 变化后通过副作用安全地通知父组件
    useEffect(() => {
      if (!latestOnSelectionChange.current) return;
      const selectedFlat = table.getSelectedRowModel().flatRows;
      const selectedRows = selectedFlat.map(r => r.original as TData);
      latestOnSelectionChange.current(selectedRows);
    }, [rowSelection, table]);

    // Use pinned styles hook
    const { getPinnedStyles } = usePinnedStyles(table, columns, fixedColumnsResult);

    // Set column pinning state in the table
    useEffect(() => {
      table.setColumnPinning(columnPinning);
    }, [table, columnPinning]);

    // Expose methods via ref
    useImperativeHandle(
      ref,
      () => ({
        expandAll: () => {
          if (treeConfig?.enabled) {
            table.toggleAllRowsExpanded(true);
          }
        },
        collapseAll: () => {
          if (treeConfig?.enabled) {
            table.toggleAllRowsExpanded(false);
          }
        },
        toggleExpandAll: () => {
          if (treeConfig?.enabled) {
            const isAllExpanded = table.getIsAllRowsExpanded();
            table.toggleAllRowsExpanded(!isAllExpanded);
          }
        },
        isAllExpanded: () => (treeConfig?.enabled ? table.getIsAllRowsExpanded() : false),
        getExpandedRows: () => expanded,
        setExpandedRows: (newExpanded: ExpandedState) => {
          setExpanded(newExpanded);
          treeConfig?.onExpandedChange?.(newExpanded);
        },
        selectionClear: () => {
          setRowSelection({});
          table.resetRowSelection();
        },
      }),
      [table, treeConfig, expanded, setExpanded],
    );

    return (
      <div>
        <div
          className={cn('bg-background relative overflow-auto rounded-md border', tableWrapperCls)}
        >
          <Table ref={tableRef}>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow
                  key={headerGroup.id}
                  className="data-[state=selected]:bg-accent hover:bg-accent/50"
                >
                  {headerGroup.headers.map(header => {
                    const pinDirection = header.column.getIsPinned() as FixedColumnPosition;
                    const { className, style } = getPinnedStyles(header.id, pinDirection, true);

                    return (
                      <TableHead
                        key={header.id}
                        className={cn('!bg-accent', thCls, className)}
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
                    className="data-[state=selected]:bg-accent hover:bg-accent/50 h-12"
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => {
                      const pinDirection = cell.column.getIsPinned() as FixedColumnPosition;
                      const { className, style } = getPinnedStyles(
                        cell.column.id,
                        pinDirection,
                        false,
                      );

                      const isFirstColumn = cellIndex === 0;
                      const isTreeMode = treeConfig?.enabled;
                      const rowDepth = row.depth;

                      return (
                        <TableCell
                          key={cell.id}
                          className={`${tdCls || ''} ${className}`}
                          style={style}
                        >
                          {isTreeMode && isFirstColumn ? (
                            <div className="flex items-center">
                              <TreeExpandButton row={row} depth={rowDepth} />
                              <div className="flex-1">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </div>
                            </div>
                          ) : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow className="data-[state=selected]:bg-accent hover:bg-accent/50">
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {t('common.NoData')}
                  </TableCell>
                </TableRow>
              )}
              {CustomRow && (
                <TableRow className="data-[state=selected]:bg-accent hover:bg-accent/50">
                  {CustomRow}
                </TableRow>
              )}
              {CustomFooter && <TableFooter>{CustomFooter}</TableFooter>}
            </TableBody>
          </Table>
        </div>
        {pageCount > 1 && (
          <DataTablePagination className="mt-4" table={table} totalCount={pageCount * pageSize} />
        )}
      </div>
    );
  });
}

// Export a properly typed DataTable that preserves generic types
export const DataTable = createDataTable() as <TData extends RowData, TValue>(
  props: DataTableProps<TData, TValue> & { ref?: React.Ref<DataTableRef> },
) => React.ReactElement;
