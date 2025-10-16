import { useState, useMemo } from 'react';
import { ExpandedState, RowData } from '@tanstack/react-table';
import { TreeConfig } from '../types';

export interface UseTreeDataResult<TData> {
  expanded: ExpandedState;
  setExpanded: (expanded: ExpandedState) => void;
  getRowId: ((row: TData, index: number) => string) | undefined;
  processedData: TData[];
  getSubRows: ((row: TData) => TData[]) | undefined;
}

export function useTreeData<TData extends RowData>(
  data: TData[],
  treeConfig?: TreeConfig<TData>,
): UseTreeDataResult<TData> {
  // Tree functionality state
  const [expanded, setExpanded] = useState<ExpandedState>(treeConfig?.defaultExpandedRows || {});

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

  // Define getSubRows function
  const getSubRows = useMemo(() => {
    if (!treeConfig?.enabled) return undefined;

    if (treeConfig.getChildren) {
      return treeConfig.getChildren;
    }

    return (row: TData) => {
      const rowWithChildren = row as TData & { children?: TData[] };
      return rowWithChildren.children || [];
    };
  }, [treeConfig]);

  return {
    expanded,
    setExpanded,
    getRowId,
    processedData,
    getSubRows,
  };
}
