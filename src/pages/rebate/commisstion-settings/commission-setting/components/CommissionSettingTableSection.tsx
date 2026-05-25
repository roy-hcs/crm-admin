import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { CRMColumnDef, DataTable } from '@/components/table';
import { Button } from '@/components/ui/button';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { RefreshCcw } from 'lucide-react';
import { ReactNode } from 'react';
import { TwoCommissionGroupItem } from '@/api/hooks/rebate';

type CommissionSettingTableProps = {
  tableId: string;
  allColumns: CRMColumnDef<TwoCommissionGroupItem, unknown>[];
  data: TwoCommissionGroupItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  loading: boolean;
  onRefresh: () => void;
  addAction: ReactNode;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

type CommissionSettingTableSectionProps = Omit<CommissionSettingTableProps, 'tableId'> & {
  isColumnReady: boolean;
  tableId: string;
};

function CommissionSettingTableWithVisibility({
  tableId,
  allColumns,
  data,
  pageCount,
  pageIndex,
  pageSize,
  loading,
  onRefresh,
  addAction,
  onPageChange,
  onPageSizeChange,
}: CommissionSettingTableProps) {
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility(tableId, allColumns);

  return (
    <>
      <div className="mb-3 flex justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="size-8 cursor-pointer" onClick={onRefresh}>
            <RefreshCcw className="size-3.5" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <ColumnVisibilityButton
            columnMeta={columnMeta}
            visibleColumns={visibleColumns}
            onToggle={toggleColumn}
            onBatchReorder={batchUpdateColumns}
            columns={columns}
          />
          {addAction}
        </div>
      </div>
      <DataTable
        data={data}
        pageCount={pageCount}
        pageIndex={pageIndex}
        pageSize={pageSize}
        columns={tableColumns}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        loading={loading}
      />
    </>
  );
}

export function CommissionSettingTableSection({
  isColumnReady,
  onRefresh,
  addAction,
  tableId,
  allColumns,
  data,
  pageCount,
  pageIndex,
  pageSize,
  loading,
  onPageChange,
  onPageSizeChange,
}: CommissionSettingTableSectionProps) {
  return (
    <TableContentWrapper>
      {isColumnReady ? (
        <CommissionSettingTableWithVisibility
          tableId={tableId}
          allColumns={allColumns}
          data={data}
          pageCount={pageCount}
          pageIndex={pageIndex}
          pageSize={pageSize}
          loading={loading}
          onRefresh={onRefresh}
          addAction={addAction}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      ) : (
        <>
          <div className="mb-3 flex justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="size-8 cursor-pointer" onClick={onRefresh}>
                <RefreshCcw className="size-3.5" />
              </Button>
            </div>
            <div className="flex items-center gap-2">{addAction}</div>
          </div>
          <DataTable
            columns={allColumns}
            data={data}
            pageCount={pageCount}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            loading={loading}
          />
        </>
      )}
    </TableContentWrapper>
  );
}
