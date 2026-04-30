import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import {
  CrmDealAccountLimitOrderItem,
  CrmDealAccountLimitOrderParams,
  useCrmDealAccountLimitOrder,
} from '@/api/hooks/account';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { useTranslation } from 'react-i18next';
import { TableCell } from '@/components/ui/table';
import { RrhDialog } from '@/components/common/RrhDialog';
import { LabelItem } from '@/components/common/LabelItem';
import { transactionTypeMap } from '@/lib/constant';
import { LimitForm } from './LimitForm';

function formatVolume(row: CrmDealAccountLimitOrderItem, serverType: number) {
  if (!row.volume) return '-';
  if (serverType === 1) {
    return (row.volume / 10000).toFixed(2);
  } else if (serverType === 2) {
    return (row.volume / 100).toFixed(2);
  } else if (serverType === 4) {
    const lotSize = row.lotSize ? row.lotSize : 1;
    return (row.volume / lotSize).toFixed(2);
  } else {
    return row.volume;
  }
}

function totalFormatVolume(volume: number, serverType: number) {
  if (!volume) return '-';
  if (serverType === 1) {
    return (volume / 10000).toFixed(2);
  } else if (serverType === 2) {
    return (volume / 100).toFixed(2);
  } else if (serverType === 4) {
    const lotSize = 1;
    return (volume / lotSize).toFixed(2);
  } else {
    return volume;
  }
}

const DetailInfo = ({ itemInfo }: { itemInfo: CrmDealAccountLimitOrderItem }) => {
  const { t } = useTranslation();

  const accountInfo = [
    {
      label: t('walletTransactions.lastName'),
      value: `${itemInfo.params?.accountName || '-'}`,
    },
    {
      label: t('table.tradingAccount'),
      value: itemInfo.login || '-',
    },
    {
      label: t('table.transactionType'),
      value: transactionTypeMap[itemInfo.type || 0] || '-',
    },
    {
      label: t('table.symbol'),
      value: itemInfo.symbol || '-',
    },
    {
      label: t('table.volume'),
      value: formatVolume(itemInfo, itemInfo.serverType || 0),
    },
    {
      label: t('table.price'),
      value: itemInfo.tp || '0',
    },
    {
      label: t('table.tradingTime'),
      value: itemInfo.time || '-',
    },
    {
      label: t('table.profitAndLoss'),
      value: itemInfo.profit ? `${itemInfo.profit} ${itemInfo.currency || ''}` : '-',
    },
    {
      label: t('table.takeProfitPrice'),
      value: itemInfo.tp || '0',
    },
    {
      label: t('table.stopLossPrice'),
      value: itemInfo.sl || '0',
    },
    {
      label: t('table.commission'),
      value: itemInfo.commission ? `${itemInfo.commission} ${itemInfo.currency || ''}` : '-',
    },
    {
      label: t('table.swap'),
      value: itemInfo.swaps ? `${itemInfo.swaps} ${itemInfo.currency || ''}` : '-',
    },
    {
      label: t('table.orderNumber'),
      value: itemInfo.ticket || '-',
    },
    {
      label: t('table.comment'),
      value: itemInfo.comment || '-',
    },
  ];
  return (
    <div>
      <div className="mb-3">
        <h3 className="text-card-foreground font-semibold">{t('table.accountInformation')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {accountInfo.map(item => (
            <LabelItem key={item.label} label={item.label} ContentDom={<div>{item.value}</div>} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const LimitPage = ({ id }: { id: string }) => {
  const [params, setParams] = useState<CrmDealAccountLimitOrderParams['params']>({
    positionFuzzyTicket: '',
    positionFuzzyType: '',
    positionFuzzySymbol: '',
    positionDealBJStartTime: '',
    positionDealBJEndTime: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [resetKey, setResetKey] = useState(0);
  const { t } = useTranslation();
  const { data: data, isLoading: loading } = useCrmDealAccountLimitOrder(id, {
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    params,
  });

  const reset = () => {
    setParams(pre => ({
      ...pre,
      positionFuzzyTicket: '',
      positionFuzzyType: '',
      positionFuzzySymbol: '',
      positionDealBJStartTime: '',
      positionDealBJEndTime: '',
    }));
    setResetKey(k => k + 1);
    setPageNum(0);
  };

  const allColumns: CRMColumnDef<CrmDealAccountLimitOrderItem, unknown>[] = [
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'accountName',
      header: t('table.fullName'),
      cell: ({ row }) => row?.original?.params?.accountName || '-',
    },
    {
      id: 'login',
      header: t('table.tradingAccount'),
      cell: ({ row }) => row?.original?.login || '-',
    },
    {
      id: 'type',
      header: t('table.transactionType'),
      cell: ({ row }) => transactionTypeMap[row?.original?.type || 0] || '-',
    },
    {
      id: 'symbol',
      header: t('table.symbol'),
      cell: ({ row }) => row?.original?.symbol || '-',
    },
    {
      id: 'volume',
      header: t('table.volume'),
      cell: ({ row }) => formatVolume(row?.original, row?.original?.serverType || 0),
    },
    {
      id: 'price',
      header: t('table.orderPlacementPrice'),
      cell: ({ row }) => row?.original?.price || '-',
    },
    {
      id: 'time',
      header: t('table.orderPlacementTime'),
      cell: ({ row }) => row?.original?.time || '-',
    },
    {
      id: 'priceCur',
      header: t('table.currentPrice'),
      cell: ({ row }) => row?.original?.priceCur || '-',
    },
    {
      id: 'ticket',
      header: t('table.orderNumber'),
      cell: ({ row }) => row?.original?.ticket || '-',
    },
    {
      id: 'comment',
      header: t('table.comment'),
      cell: ({ row }) => row?.original?.comment || '-',
    },
    {
      id: 'operation',
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      cell: ({ row }) => (
        <RrhDialog
          title={t('common.detail', { field: t('limitOrderPage.limitOrder') })}
          trigger={
            <RrhButton variant="ghost" type="button">
              {t('common.View')}
            </RrhButton>
          }
          confirmShow={false}
          variant="large"
        >
          <DetailInfo itemInfo={row.original} />
        </RrhDialog>
      ),
      fixed: 'right',
      size: 50,
    },
  ];
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('limit-table', allColumns);

  const typeOptions = Object.entries(transactionTypeMap).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div>
      <TableContentWrapper>
        <div className="mb-3 flex items-center justify-between">
          <RrhInputWithIcon
            key={resetKey}
            placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
            className="h-9"
            leftIcon={<Search className="size-4 cursor-pointer" />}
            onLeftIconClick={e => {
              setParams(prev => ({ ...prev, positionFuzzyTicket: e }));
              setPageNum(0);
            }}
          />
          <div className="flex items-center justify-end gap-2">
            <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
              <RefreshCcw className="size-3.5" />
            </RrhButton>
            <RrhDrawer
              headerShow={false}
              asChild
              responsiveDirection={{
                mobile: 'bottom',
                desktop: 'right',
              }}
              footerShow={false}
              Trigger={
                <RrhButton variant="ghost" className="size-8">
                  <Funnel />
                </RrhButton>
              }
            >
              <LimitForm
                setParams={setParams}
                loading={loading}
                reset={reset}
                typeOptions={typeOptions}
                params={params}
              />
            </RrhDrawer>
            <ColumnVisibilityButton
              columnMeta={columnMeta}
              visibleColumns={visibleColumns}
              onToggle={toggleColumn}
              onBatchReorder={batchUpdateColumns}
              columns={columns}
            />
          </div>
        </div>
        <DataTable
          columns={tableColumns}
          data={data?.rows || []}
          pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={loading}
          CustomRow={
            <>
              <TableCell colSpan={5}>{t('table.total')}</TableCell>
              {loading ? (
                <TableCell>{t('common.loading')}</TableCell>
              ) : (
                <>
                  <TableCell colSpan={1}>
                    <div>
                      {totalFormatVolume(data?.totalVolume || 0, data?.rows?.[0]?.serverType || 0)}
                    </div>
                  </TableCell>
                </>
              )}
            </>
          }
        />
      </TableContentWrapper>
    </div>
  );
};
