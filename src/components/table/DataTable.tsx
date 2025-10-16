import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowData,
  getExpandedRowModel,
  ExpandedState,
  Row,
} from '@tanstack/react-table';
import {
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

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

// Tree functionality types
export interface TreeDataRow {
  id: string | number;
  parentId?: string | number | null;
  children?: TreeDataRow[];
  isExpanded?: boolean;
}

// DataTable ref interface for external control
export interface DataTableRef {
  expandAll: () => void;
  collapseAll: () => void;
  toggleExpandAll: () => void;
  isAllExpanded: () => boolean;
  getExpandedRows: () => ExpandedState;
  setExpandedRows: (expanded: ExpandedState) => void;
}

export interface TreeConfig<TData = unknown> {
  /** Enable tree functionality */
  enabled: boolean;
  /** Function to get the unique identifier for each row */
  getRowId?: (row: TData) => string | number;
  /** Function to get the parent ID for each row */
  getParentId?: (row: TData) => string | number | null;
  /** Function to get children for each row (optional - can be derived from parentId) */
  getChildren?: (row: TData) => TData[];
  /** Default expanded state for rows */
  defaultExpandedRows?: Record<string, boolean>;
  /** Callback when expansion state changes */
  onExpandedChange?: (expanded: ExpandedState) => void;
}

interface PinnedStyleResult {
  className: string;
  style: React.CSSProperties;
}

interface DataTableProps<TData extends RowData, TValue> {
  columns: CRMColumnDef<TData, TValue>[];
  data: TData[];
  pageCount?: number;
  pageIndex?: number;
  pageSize?: number;
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  thCls?: string;
  tdCls?: string;
  loading?: boolean;
  CustomRow?: ReactElement;
  CustomFooter?: ReactElement;
  /** Tree functionality configuration */
  treeConfig?: TreeConfig<TData>;
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

// Tree row expand/collapse button component
const TreeExpandButton = <TData extends RowData>({
  row,
  depth = 0,
}: {
  row: Row<TData>;
  depth?: number;
}) => {
  const hasChildren = row.getCanExpand();
  const isExpanded = row.getIsExpanded();

  return (
    <div className="flex items-center" style={{ paddingLeft: `${depth * 20}px` }}>
      {hasChildren ? (
        <button
          onClick={e => {
            e.stopPropagation();
            row.toggleExpanded();
          }}
          className="hover:bg-accent mr-2 flex h-4 w-4 items-center justify-center rounded"
        >
          {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </button>
      ) : (
        <div className="mr-2 h-4 w-4" />
      )}
    </div>
  );
};

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
    }: DataTableProps<TData, TValue>,
    ref: React.Ref<DataTableRef>,
  ) {
    const tableRef = useRef<HTMLTableElement>(null);
    const { t } = useTranslation();

    // Tree functionality state
    const [expanded, setExpanded] = useState<ExpandedState>(treeConfig?.defaultExpandedRows || {});

    // Set up pagination state
    const pagination = useMemo(
      () => ({
        pageIndex,
        pageSize,
      }),
      [pageIndex, pageSize],
    );

    // Tree helper functions
    const getRowId = useMemo(() => {
      if (!treeConfig?.enabled) return undefined;
      return treeConfig.getRowId
        ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
          (row: TData, _index: number) => String(treeConfig.getRowId!(row))
        : (row: TData, index: number) => {
            // Default: try to get id from row, fallback to index
            const rowWithId = row as TData & { id?: string | number };
            return String(rowWithId?.id || index);
          };
    }, [treeConfig]);

    // Transform flat data to hierarchical structure if needed
    const processedData = useMemo(() => {
      if (!treeConfig?.enabled || !treeConfig.getParentId) {
        return data;
      }

      // If getChildren is provided, use it directly
      if (treeConfig.getChildren) {
        return data;
      }

      // Otherwise, build hierarchy from flat structure using parentId
      const buildHierarchy = (items: TData[]): TData[] => {
        const itemMap = new Map<string | number, TData & { children?: TData[] }>();
        const result: TData[] = [];

        // First pass: create map of all items
        items.forEach(item => {
          const id = getRowId?.(item, items.indexOf(item)) || items.indexOf(item);
          const itemWithChildren = Object.assign({}, item, { children: [] }) as TData & {
            children?: TData[];
          };
          itemMap.set(id, itemWithChildren);
        });

        // Second pass: build hierarchy
        items.forEach(item => {
          const id = getRowId?.(item, items.indexOf(item)) || items.indexOf(item);
          const parentId = treeConfig.getParentId!(item);
          const itemWithChildren = itemMap.get(id);

          if (parentId && itemMap.has(parentId)) {
            const parent = itemMap.get(parentId);
            if (parent && itemWithChildren) {
              parent.children = parent.children || [];
              parent.children.push(itemWithChildren);
            }
          } else if (itemWithChildren) {
            // Root level item
            result.push(itemWithChildren);
          }
        });

        return result;
      };

      return buildHierarchy(data);
    }, [data, treeConfig, getRowId]);

    // Get fixed column handling utilities
    const { columnPinning, canScroll } = useFixedColumns<TData>(
      columns as CRMColumnDef<TData, unknown>[],
      tableRef,
    );

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
      getSubRows:
        treeConfig?.enabled && treeConfig.getChildren
          ? treeConfig.getChildren
          : treeConfig?.enabled
            ? (row: TData) => {
                const rowWithChildren = row as TData & { children?: TData[] };
                return rowWithChildren.children || [];
              }
            : undefined,
    });

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
      }),
      [table, treeConfig, expanded],
    );

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
      const baseClass = isHeader
        ? 'sticky top-0 z-20 bg-background hover:bg-accent/50 data-[state=selected]:bg-accent'
        : 'sticky z-10 bg-background hover:bg-accent/50 data-[state=selected]:bg-accent';

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
          canScroll.left && isLeftBoundary
            ? 'shadow-[8px_0_8px_-6px_rgba(0,0,0,0.28)] border-r'
            : '';

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
