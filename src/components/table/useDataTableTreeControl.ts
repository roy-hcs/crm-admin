import { RefObject } from 'react';
import { DataTableRef } from './DataTable';

/**
 * Custom hook to provide convenient methods for controlling DataTable tree functionality
 * @param tableRef - Reference to the DataTable component
 * @returns Object with tree control methods
 */
export const useDataTableTreeControl = (tableRef: RefObject<DataTableRef | null>) => {
  return {
    expandAll: () => tableRef.current?.expandAll(),
    collapseAll: () => tableRef.current?.collapseAll(),
    toggleExpandAll: () => tableRef.current?.toggleExpandAll(),
    isAllExpanded: () => tableRef.current?.isAllExpanded() ?? false,
    getExpandedRows: () => tableRef.current?.getExpandedRows() ?? {},
    setExpandedRows: (expanded: Record<string, boolean>) =>
      tableRef.current?.setExpandedRows(expanded),
  };
};
