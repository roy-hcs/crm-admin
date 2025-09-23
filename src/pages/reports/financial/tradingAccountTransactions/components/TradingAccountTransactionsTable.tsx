import { CrmUserDealItem } from '@/api/hooks/report/types';
import { DataTable, CRMColumnDef } from '@/components/table/DataTable';
import { useTranslation } from 'react-i18next';

export const TradingAccountTransactionsTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: CrmUserDealItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const Columns: CRMColumnDef<CrmUserDealItem, unknown>[] = [
    {
      id: 'No.',
      size: 50,
      header: t('ib.overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'login',

      header: t('financial.tradingAccountTransactions.login'),
      accessorFn: row => row.login,
    },
    {
      id: 'name',

      header: t('financial.tradingAccountTransactions.name'),
      accessorFn: row => row.name,
    },
    {
      id: 'crmLastName',

      header: t('financial.tradingAccountTransactions.crmLastName'),

      cell: ({ row }) => {
        if (row?.original?.crmLastName || row?.original?.crmName || row?.original?.crmShowId) {
          return (
            <div>
              <div>{(row?.original?.crmLastName ?? '') + (row?.original?.crmName ?? '')}</div>
              <div>{row.original.crmShowId ?? '--'}</div>
            </div>
          );
        }
        return '--';
      },
    },
    {
      accessorKey: 'type',
      header: t('financial.tradingAccountTransactions.type'),
      accessorFn: row => row.type,
    },
    {
      accessorKey: 'profit',
      header: t('financial.tradingAccountTransactions.profit'),
      accessorFn: row => row.profit,
    },
    {
      accessorKey: 'time',
      header: t('financial.tradingAccountTransactions.time'),
      accessorFn: row => row.time,
    },
    {
      accessorKey: 'ticket',
      header: t('financial.tradingAccountTransactions.ticket'),
      accessorFn: row => row.ticket,
    },
    {
      accessorKey: 'order_num',
      header: t('financial.tradingAccountTransactions.order_num'),
      accessorFn: row => row.order_num,
    },
    {
      accessorKey: 'comment',
      header: t('financial.tradingAccountTransactions.comment'),
      accessorFn: row => row.comment,
    },
  ];
  return (
    <DataTable
      columns={Columns}
      data={data}
      pageCount={pageCount}
      pageIndex={pageIndex}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      loading={loading}
      thCls="text-left"
      tdCls="text-left"
    />
  );
};
