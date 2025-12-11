import { WithdrawItem } from '@/api/hooks/review';
import { CRMColumnDef, DataTable } from '@/components/table/DataTable';
import { ReactElement } from 'react';
export const ReviewWithdrawalTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  CustomRow,
  columns,
}: {
  data: WithdrawItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  CustomRow: ReactElement;
  columns: CRMColumnDef<WithdrawItem, unknown>[];
}) => {
  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      pageSize={pageSize}
      pageIndex={pageIndex}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      loading={loading}
      tdCls="text-center"
      thCls="text-center"
      CustomRow={CustomRow}
    />
  );
};
