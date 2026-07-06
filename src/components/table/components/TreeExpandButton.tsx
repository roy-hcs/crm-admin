import { Row, RowData } from '@tanstack/react-table';

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
          className="mr-1 flex h-6 w-6 items-center justify-center rounded bg-gray-100"
        >
          {isExpanded ? '-' : '+'}
        </button>
      ) : (
        <div className="mr-2 h-4 w-4" />
      )}
    </div>
  );
};
