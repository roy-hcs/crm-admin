import { LimitOrderListItem } from '@/api/hooks/report/types';
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
    return (volume / 10000).toFixed(2);
  } else if (serverType == 2) {
    return (volume / 100).toFixed(2);
  } else if (serverType == 4) {
    return (volume / (lotSize || 1.0)).toFixed(2);
  } else {
    return volume.toFixed(2);
  }
};
const LimitOrderDetails = ({
  data,
  serviceType,
}: {
  data: LimitOrderListItem;
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
    { label: t('table.orderPlacementPrice'), value: (data.price || 0).toFixed(data.digits || 2) },
    { label: t('table.orderPlacementTime'), value: data.time },
    // UI上存在以下字段，但接口返回数据中似乎没有相关数据，暂时隐藏
    // { label: t('table.takeProfitPrice'), value: data.takeProfitPrice },
    // { label: t('table.stopLossPrice'), value: data.stopLossPrice },
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
export const LimitOrderTable = ({
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
  data: LimitOrderListItem[];
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
  const serviceType = selectedServer?.serviceType;
  const tradingHistoryColumns: ColumnDef<LimitOrderListItem>[] = [
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
          <div>{formatVolume(serviceType, rowData.volume, rowData.lotSize)} </div>
        ) : (
          <div>-</div>
        );
      },
    },
    {
      id: 'openPrice',
      header: t('table.orderPlacementPrice'),
      cell: ({ row }) => {
        return <div>{(row.original.price || 0).toFixed(row.original.digits || 2)}</div>;
      },
    },
    {
      id: 'openTime',
      header: t('table.orderPlacementTime'),
      accessorFn: row => row.time,
    },
    {
      id: 'currentPrice',
      header: t('table.currentPrice'),
      cell: ({ row }) => {
        return <div>{(row.original.priceCur || 0).toFixed(row.original.digits || 2)}</div>;
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
              <LimitOrderDetails data={row.original} serviceType={selectedServer?.serviceType} />
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
