import { ColumnDef, ExpandedState, RowData } from '@tanstack/react-table';
import { ReactElement } from 'react';

export type FixedColumnPosition = boolean | 'left' | 'right';

interface WithAccessorKey {
  accessorKey?: string;
}

export type CRMColumnDef<TData extends RowData, TValue> = ColumnDef<TData, TValue> &
  WithAccessorKey & {
    fixed?: FixedColumnPosition;
    width?: number | string;
    minWidth?: number | string;
    label?: string;
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
  selectionClear: () => void;
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

export interface PinnedStyleResult {
  className: string;
  style: React.CSSProperties;
}

export interface DataTableProps<TData extends RowData, TValue> {
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
  tableWrapperCls?: string;

  /** 行选择变化时回调：selectedRows 为原始数据 */
  onSelectionChange?: (selectedRows: TData[]) => void;
}
