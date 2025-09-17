import { TradingHistoryItem } from '@/api/hooks/report/types';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { DataTable } from '@/components/table/DataTable';
import { Checkbox } from '@/components/ui/checkbox';
import { transactionTypeMap } from '@/lib/constant';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

const TradingHistoryDetails = ({ data }: { data: TradingHistoryItem }) => {
  const { t } = useTranslation();
  const detailsData = [
    { label: t('table.fullName'), value: data.name },
    { label: t('table.transactionType'), value: data.login },
    {
      label: t('table.transactionType'),
      value: transactionTypeMap[data.type as keyof typeof transactionTypeMap] || data.type,
    },
    { label: t('table.symbol'), value: data.symbol },
    {
      label: t('table.volume'),
      value: data.traderCount && data.lotSize ? (data.traderCount / data.lotSize).toFixed(2) : '-',
    },
    {
      label: t('table.profitAndLoss'),
      value: data.profit !== null ? `${data.profit.toFixed(2)} ${data.currency}` : '-',
    },

    { label: t('table.openPrice'), value: data.openPrice },
    { label: t('table.openTime'), value: data.openTime },
    { label: t('table.closePrice'), value: data.closePrice },
    { label: t('table.closeTime'), value: data.closeTime },
    {
      label: t('table.commission'),
      value: data.commission !== null ? `${data.commission.toFixed(2)} ${data.currency}` : '-',
    },
    {
      label: t('table.swap'),
      value: data.swaps !== null ? `${data.swaps.toFixed(2)} ${data.currency}` : '-',
    },
    { label: t('table.orderNumber'), value: data.ticket?.toString() || '-' },
    { label: t('table.comment'), value: data.comment },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {detailsData.map((item, index) => {
        return (
          <div className="flex items-center gap-2" key={`${item.label}-${index}`}>
            <span>{item.label}:</span>
            <span>{item.value}</span>
          </div>
        );
      })}
    </div>
  );
};
export const TradingHistoryTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: TradingHistoryItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const tradingHistoryColumns: ColumnDef<TradingHistoryItem>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          className="data-[state=checked]:border-slate-700"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="data-[state=checked]:border-slate-700"
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'No.',
      header: t('CRMAccountPage.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'userName',
      header: t('CRMAccountPage.UserName'),
      accessorFn: row => row.name,
    },
    {
      id: 'login',
      header: t('table.transactionType'),
      accessorFn: row => row.login,
    },
    {
      id: 'ticket',
      header: t('table.orderNumber'),
      accessorFn: row => row.ticket,
    },
    {
      id: 'type',
      header: t('table.transactionType'), // 0: buy, 1: sell
      accessorFn: row =>
        transactionTypeMap[row.type as keyof typeof transactionTypeMap] || row.type,
    },
    {
      id: 'symbol',
      header: t('table.symbol'),
      accessorFn: row => row.symbol,
    },
    {
      id: 'tradeCount',
      header: t('table.volume'),
      cell: ({ row }) => {
        const rowData = row.original;
        return rowData.traderCount && rowData.lotSize ? (
          <div>{(rowData.traderCount / rowData.lotSize).toFixed(2)}</div>
        ) : (
          <div>-</div>
        );
      },
    },
    {
      id: 'openPrice',
      header: t('table.openPrice'),
      accessorFn: row => row.openPrice,
    },
    {
      id: 'openTime',
      header: t('table.openTime'),
      accessorFn: row => row.openTime,
    },
    {
      id: 'closePrice',
      header: t('table.closePrice'),
      accessorFn: row => row.closePrice,
    },
    {
      id: 'closeTime',
      header: t('table.closeTime'),
      accessorFn: row => row.closeTime,
    },
    {
      id: 'profit',
      header: t('table.profitAndLoss'),
      cell: ({ row }) => {
        const rowData = row.original;
        return rowData.profit !== null ? (
          <div>
            {rowData.profit.toFixed(2)} {rowData.currency}
          </div>
        ) : (
          <div>-</div>
        );
      },
    },
    {
      id: 'commission',
      header: t('table.commission'),
      cell: ({ row }) => {
        const rowData = row.original;
        return rowData.commission !== null ? (
          <div>
            {rowData.commission.toFixed(2)} {rowData.currency}
          </div>
        ) : (
          <div>-</div>
        );
      },
    },
    {
      id: 'swaps',
      header: t('table.swap'),
      cell: ({ row }) => {
        const rowData = row.original;
        return rowData.swaps !== null ? (
          <div>
            {rowData.swaps.toFixed(2)} {rowData.currency}
          </div>
        ) : (
          <div>-</div>
        );
      },
    },
    {
      id: 'comment',
      header: t('table.comment'),
      accessorFn: row => row.comment,
    },
    {
      id: 'operate',
      header: t('common.Operation'),
      cell: ({ row }) => {
        const onClick = (data: TradingHistoryItem) => {
          console.log('Operate on row:', data);
        };
        return (
          <div>
            <RrhDialog
              trigger={
                <RrhButton variant="ghost" onClick={() => onClick(row.original)}>
                  {t('common.View')}
                </RrhButton>
              }
              cancelText={t('common.close')}
              confirmShow={false}
              title={t('tradingHistoryPage.tradingHistoryDetail')}
            >
              <TradingHistoryDetails data={row.original} />
            </RrhDialog>
          </div>
        );
      },
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
    />
  );
};
