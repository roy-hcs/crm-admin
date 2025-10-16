import { useState, useMemo, useEffect } from 'react';
import { RowData } from '@tanstack/react-table';
import { CRMColumnDef } from '../types';

export interface UseFixedColumnsResult {
  columnPinning: {
    left: string[];
    right: string[];
  };
  canScroll: {
    left: boolean;
    right: boolean;
  };
}

export function useFixedColumns<TData extends RowData>(
  columns: CRMColumnDef<TData, unknown>[],
  tableRef: React.RefObject<HTMLTableElement | null>,
): UseFixedColumnsResult {
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
