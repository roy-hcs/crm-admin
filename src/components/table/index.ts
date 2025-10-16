// Main DataTable component
export { DataTable } from './DataTable';

// Re-export essential types for public API
export type { CRMColumnDef, DataTableRef, TreeConfig, FixedColumnPosition } from './types';

// Re-export hook for tree control
export { useDataTableTreeControl } from './useDataTableTreeControl';

// Re-export utility components (optional - for advanced usage)
export { TableRowSkeleton } from './components/TableRowSkeleton';
export { TreeExpandButton } from './components/TreeExpandButton';

// Re-export hooks (optional - for advanced usage)
export { useFixedColumns } from './hooks/useFixedColumns';
export { useTreeData } from './hooks/useTreeData';
export { usePinnedStyles } from './hooks/usePinnedStyles';
