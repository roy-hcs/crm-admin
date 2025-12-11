import { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnVisibilityConfig, ColumnMeta } from '@/api/hooks/common/types';
import { CRMColumnDef } from '@/components/table';

interface UseColumnVisibilityReturn {
  columns: ColumnVisibilityConfig[];
  visibleColumns: string[];
  toggleColumn: (id: string) => void;
  resetColumns: () => void;
  batchUpdateColumns: (newOrder: string[]) => void;
  getSortedColumns: <T>(allColumns: CRMColumnDef<T, unknown>[]) => CRMColumnDef<T, unknown>[];
}

const STORAGE_KEY_PREFIX = 'table-column-visibility-';

const loadFromStorage = (tableId: string): ColumnVisibilityConfig[] | null => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${tableId}`);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveToStorage = (tableId: string, config: ColumnVisibilityConfig[]) => {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${tableId}`, JSON.stringify(config));
  } catch {
    console.error('Failed to save column visibility to local storage.');
  }
};

export const useColumnVisibility = (
  tableId: string,
  columnMeta: ColumnMeta[],
): UseColumnVisibilityReturn => {
  const [columns, setColumns] = useState<ColumnVisibilityConfig[]>(() => {
    const stored = loadFromStorage(tableId);
    if (stored) {
      return columnMeta.map((meta, index) => {
        const storedColumn = stored.find(col => col.id === meta.id);
        return {
          id: meta.id,
          display: storedColumn ? storedColumn.display : meta.defaultVisible,
          order: storedColumn ? storedColumn.order : index,
        };
      });
    } else {
      return columnMeta.map((meta, index) => ({
        id: meta.id,
        display: meta.defaultVisible,
        order: index,
      }));
    }
  });

  useEffect(() => {
    saveToStorage(tableId, columns);
  }, [tableId, columns]);

  const visibleColumns = useMemo(() => {
    return columns
      .filter(col => col.display)
      .sort((a, b) => a.order - b.order)
      .map(col => col.id);
  }, [columns]);

  const toggleColumn = (id: string) => {
    setColumns(prev => prev.map(col => (col.id === id ? { ...col, display: !col.display } : col)));
  };

  const resetColumns = () => {
    setColumns(
      columnMeta.map((meta, index) => ({
        id: meta.id,
        display: meta.defaultVisible,
        order: index,
      })),
    );
  };

  const batchUpdateColumns = (newOrder: string[]) => {
    setColumns(prev => {
      const reorderedColumns = newOrder
        .map(id => prev.find(col => col.id === id))
        .filter(Boolean) as ColumnVisibilityConfig[];

      return reorderedColumns.map((col, index) => ({
        ...col,
        order: index,
      }));
    });
  };
  // 新增：根据可见性和顺序过滤、排序列
  const getSortedColumns = useCallback(
    <T>(allColumns: CRMColumnDef<T, unknown>[]) => {
      const visibleSet = new Set(visibleColumns);
      const filteredColumns = allColumns.filter(col => col.id && visibleSet.has(col.id));

      if (!columns || columns.length === 0) {
        return filteredColumns;
      }

      // 创建位置映射
      const positionMap = new Map(
        columns
          .filter(col => visibleSet.has(col.id))
          .sort((a, b) => a.order - b.order)
          .map((col, index) => [col.id, index]),
      );

      // 根据位置排序
      return filteredColumns.sort((a, b) => {
        const posA = positionMap.get(a.id!) ?? Infinity;
        const posB = positionMap.get(b.id!) ?? Infinity;
        return posA - posB;
      });
    },
    [columns, visibleColumns],
  );

  return {
    columns,
    visibleColumns,
    toggleColumn,
    resetColumns,
    batchUpdateColumns,
    getSortedColumns,
  };
};
