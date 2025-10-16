import { Row, RowData } from '@tanstack/react-table';
import { ChevronRight, ChevronDown } from 'lucide-react';

export interface TreeExpandButtonProps<TData extends RowData> {
  row: Row<TData>;
  depth?: number;
}

export const TreeExpandButton = <TData extends RowData>({
  row,
  depth = 0,
}: TreeExpandButtonProps<TData>) => {
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
