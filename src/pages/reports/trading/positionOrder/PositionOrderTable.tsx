import { PositionOrderItem } from '@/api/hooks/report/types';
import { ServerItem } from '@/api/hooks/system/types';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { DataTable } from '@/components/table/DataTable';
import { transactionTypeMap } from '@/lib/constant';
import { ColumnDef } from '@tanstack/react-table';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

const formatVolume = (serverType: number | undefined, volume: number, lotSize: number) => {
  if (serverType == 1) {
    //MT5
    return (volume / 10000.0).toFixed(4);
  } else if (serverType == 4) {
    //XForce
    return (volume / (lotSize || 1.0)).toFixed(2);
  } else if (serverType == 5) {
    //XOH
    return volume.toFixed(4);
  } else {
    return (volume / 100.0).toFixed(4);
  }
};
const PositionOrderDetails = ({
  data,
  serviceType,
}: {
  data: PositionOrderItem;
  serviceType: number | undefined;
}) => {
  const { t } = useTranslation();
  const detailsData = [
    { label: t('table.fullName'), value: data.params.accountName },
    { label: t('table.tradingAccount'), value: data.login },
    {
      label: t('table.transactionType'),
      value: transactionTypeMap[data.type as keyof typeof transactionTypeMap] || data.type,
    },
    { label: t('table.symbol'), value: data.symbol },
    {
      label: t('table.volume'),
      value:
        data.volume && data.lotSize ? formatVolume(serviceType, data.volume, data.lotSize) : '-',
    },
    { label: t('table.openPrice'), value: data.price },
    { label: t('table.openTime'), value: data.time },
    // UI上存在以下字段，但接口返回数据中似乎没有相关数据，暂时隐藏
    // { label: t('table.takeProfitPrice'), value: data.takeProfitPrice },
    // { label: t('table.stopLossPrice'), value: data.stopLossPrice },

    {
      label: t('table.profitAndLoss'),
      value: data.profit !== null ? `${data.profit.toFixed(2)} ${data.currency}` : '-',
    },

    {
      label: t('table.commission'),
      value: data.commission !== null ? `${data.commission.toFixed(2)} ${data.currency}` : '-',
    },
    {
      label: t('table.swap'),
      value: data.swaps !== null ? `${data.swaps.toFixed(2)} ${data.currency}` : '-',
    },
    { label: t('table.comment'), value: data.comment },
    { label: t('table.orderNumber'), value: data.ticket?.toString() || '-' },
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

export const PositionOrderTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  CustomRow,
  selectedServer,
}: {
  data: PositionOrderItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  CustomRow: ReactElement;
  selectedServer: ServerItem | undefined;
}) => {
  const { t } = useTranslation();
  const serverType = selectedServer?.serviceType;
  const tradingHistoryColumns: ColumnDef<PositionOrderItem>[] = [
    {
      id: 'No.',
      header: t('CRMAccountPage.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'userName',
      header: t('CRMAccountPage.UserName'),
      accessorFn: row => row.params.accountName,
    },
    {
      id: 'login',
      header: t('table.tradingAccount'),
      accessorFn: row => row.login,
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

        return rowData.volume && rowData.lotSize ? (
          <div>{formatVolume(serverType, rowData.volume, rowData.lotSize)}</div>
        ) : (
          <div>-</div>
        );
      },
    },
    {
      id: 'openPrice',
      header: t('table.openPrice'),
      accessorFn: row => row.price,
    },
    {
      id: 'openTime',
      header: t('table.openTime'),
      accessorFn: row => row.time,
    },
    {
      id: 'currentPrice',
      header: t('table.currentPrice'),
      accessorFn: row => row.priceCur,
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
      id: 'ticket',
      header: t('table.orderNumber'),
      accessorFn: row => row.ticket,
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
        return (
          <div>
            <RrhDialog
              trigger={<RrhButton variant="ghost">{t('common.View')}</RrhButton>}
              cancelText={t('common.close')}
              confirmShow={false}
              title={t('tradingHistoryPage.tradingHistoryDetail')}
            >
              <PositionOrderDetails data={row.original} serviceType={selectedServer?.serviceType} />
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
      CustomRow={CustomRow}
    />
  );
};
