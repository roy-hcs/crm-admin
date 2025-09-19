import { SystemFundOperationRecordItem } from '@/api/hooks/report/types';
import { DataTable } from '@/components/table/DataTable';
import { financeTypeMap } from '@/lib/constant';
import { ColumnDef } from '@tanstack/react-table';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

export const SystemFundOperationsTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  CustomRow,
}: {
  data: SystemFundOperationRecordItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  CustomRow: ReactElement;
}) => {
  const { t } = useTranslation();
  const tradingHistoryColumns: ColumnDef<SystemFundOperationRecordItem>[] = [
    {
      id: 'orderNumber',
      header: t('table.orderNumber'),
      accessorFn: row => row.orderNumber,
    },
    {
      id: 'CRMAccount',
      header: t('table.CRMAccount'),
      cell: ({ row }) => {
        return !row.original.crmName && !row.original.crmShowId ? (
          <div className="text-center">-</div>
        ) : (
          <div>
            <div>{row.original.crmName}</div>
            <div>{row.original.crmShowId}</div>
          </div>
        );
      },
    },
    {
      id: 'fundAccount',
      header: t('table.fundAccount'),
      cell: ({ row }) => (
        <div className="flex flex-col items-center">
          <div>{row.original.server}</div>
          <div>{row.original.accountId}</div>
        </div>
      ),
    },
    {
      id: 'way',
      header: t('table.way'),
      accessorFn: row => t(financeTypeMap[row.type as keyof typeof financeTypeMap] || ''),
    },
    {
      id: 'amount',
      header: t('table.amount'),
      cell: ({ row }) => (
        <div>
          {row.original.amount} {row.original.currency}
        </div>
      ),
    },
    {
      id: 'remarks',
      header: t('table.remarks'),
      accessorFn: row => row.comment,
    },
    {
      id: 'operationPerson',
      header: t('table.operationPerson'),
      accessorFn: row => row.operName,
    },
    {
      id: 'operationIP',
      header: t('table.operationIP'),
      cell: ({ row }) => (
        <div>
          {row.original.operIp} ({row.original.operAddress})
        </div>
      ),
    },
    {
      id: 'operationTime',
      header: t('table.operationTime'),
      accessorFn: row => row.operTime,
    },
    {
      id: 'tradingServerOrderNumber',
      header: t('table.tradingServerOrderNumber'),
      accessorFn: row => row.serverOrder || '-',
    },
  ];
  return (
    <DataTable
      columns={tradingHistoryColumns}
      data={data}
      pageCount={pageCount}
      pageSize={pageSize}
      pageIndex={pageIndex}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      loading={loading}
      CustomRow={CustomRow}
    />
  );
};
