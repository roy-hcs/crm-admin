import { TableRow, TableCell } from '@/components/ui/table';

export interface TableRowSkeletonProps {
  columns: number;
}

export const TableRowSkeleton = ({ columns }: TableRowSkeletonProps) => {
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
