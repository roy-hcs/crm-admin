import { useMemo } from 'react';
import { Table, RowData } from '@tanstack/react-table';
import { CRMColumnDef, PinnedStyleResult, FixedColumnPosition } from '../types';
import { UseFixedColumnsResult } from './useFixedColumns';

export interface UsePinnedStylesResult {
  calculateOffsets: {
    leftOffsets: Record<string, number>;
    rightOffsets: Record<string, number>;
  };
  getPinnedStyles: (
    columnId: string,
    pinDirection: FixedColumnPosition | null,
    isHeader: boolean,
  ) => PinnedStyleResult;
}

export function usePinnedStyles<TData extends RowData, TValue>(
  table: Table<TData>,
  columns: CRMColumnDef<TData, TValue>[],
  fixedColumnsResult: UseFixedColumnsResult,
): UsePinnedStylesResult {
  const { columnPinning, canScroll } = fixedColumnsResult;

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

  return {
    calculateOffsets,
    getPinnedStyles,
  };
}
