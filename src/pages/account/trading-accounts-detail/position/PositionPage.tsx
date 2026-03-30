import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import {
  CrmDealAccountPositionOrderItem,
  CrmDealAccountPositionOrderParams,
  useCrmDealAccountPositionOrder,
} from '@/api/hooks/account';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { useTranslation } from 'react-i18next';
import { TableCell } from '@/components/ui/table';
import { RrhDialog } from '@/components/common/RrhDialog';
import { LabelItem } from '@/components/common/LabelItem';
import { entryMap, transactionTypeMap } from '@/lib/constant';
import { PositionForm } from './PositionForm';

function formatVolume(row: CrmDealAccountPositionOrderItem, serverType: number) {
  if (!row.volume) return '-';
  if (serverType == 1) {
    return (row.volume / 10000.0).toFixed(2);
  } else if (serverType == 2) {
    return (row.volume / 100.0).toFixed(2);
  } else if (serverType == 4) {
    const lotSize = row.lotSize ? row.lotSize : 1.0;
    return (row.volume / lotSize).toFixed(2);
  } else {
    return row.volume;
  }
}

function totalFormatVolume(volume: number, serverType: number) {
  if (!volume) return '-';
  if (serverType == 1) {
    return (volume / 10000.0).toFixed(2);
  } else if (serverType == 2) {
    return (volume / 100.0).toFixed(2);
  } else if (serverType == 4) {
    const lotSize = 1.0;
    return (volume / lotSize).toFixed(2);
  } else {
    return volume;
  }
}

const DetailInfo = ({ itemInfo }: { itemInfo: CrmDealAccountPositionOrderItem }) => {
  const { t } = useTranslation();

  const accountInfo = [
    {
      label: t('walletTransactions.lastName'),
      value: `${itemInfo.params?.accountName || '-'}`,
    },
    {
      label: t('table.tradeAccount'),
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

export const PositionPage = ({ id }: { id: string }) => {
  const [params, setParams] = useState<CrmDealAccountPositionOrderParams['params']>({
    positionDealBJStartTime: '',
    positionDealBJEndTime: '',
    positionFuzzyTicket: '',
    positionFuzzySymbol: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<
      CrmDealAccountPositionOrderParams,
      'params' | 'pageSize' | 'pageNum' | 'orderByColumn' | 'isAsc'
    >
  >({
    type: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const { t } = useTranslation();
  const { data: data, isLoading: loading } = useCrmDealAccountPositionOrder(id, {
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
    params,
  });

  const reset = () => {
    setParams(pre => ({
      ...pre,
      positionDealBJStartTime: '',
      positionDealBJEndTime: '',
      positionFuzzyTicket: '',
      positionFuzzySymbol: '',
    }));
    setOtherParams({
      type: '',
    });
    setKeyword('');
    setPageNum(0);
  };

  const allColumns: CRMColumnDef<CrmDealAccountPositionOrderItem, unknown>[] = [
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
      id: 'tp',
      header: t('table.price'),
      cell: ({ row }) => row?.original?.tp || '-',
    },
    {
      id: 'time',
      header: t('table.tradingTime'),
      cell: ({ row }) => row?.original?.time || '-',
    },
    {
      id: 'priceCur',
      header: t('table.currentPrice'),
      cell: ({ row }) => row?.original?.priceCur || '-',
    },
    {
      id: 'profit',
      header: t('table.profitAndLoss'),
      cell: ({ row }) => `${row?.original?.profit || 0} ${row?.original?.params?.currency || ''}`,
    },
    {
      id: 'swaps',
      header: t('table.swap'),
      cell: ({ row }) => `${row?.original?.swaps || 0} ${row?.original?.params?.currency || ''}`,
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
          title={t('common.detail', { field: t('positionOrderPage.positionOrder') })}
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
    useColumnVisibility('wallet-accounts-table', allColumns);

  const typeOptions = Object.entries(transactionTypeMap).map(([value, label]) => ({
    value,
    label,
  }));

  const entryOptions = Object.entries(entryMap).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div>
      <TableContentWrapper>
        <div className="mb-3 flex items-center justify-between">
          <RrhInputWithIcon
            placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
            className="h-9"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
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
              <PositionForm
                setParams={setParams}
                setOtherParams={setOtherParams}
                loading={loading}
                reset={reset}
                typeOptions={typeOptions}
                entryOptions={entryOptions}
                params={params}
                otherParams={otherParams}
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
                  <TableCell colSpan={4}>
                    <div>
                      {totalFormatVolume(data?.totalVolume || 0, data?.rows?.[0]?.serverType || 0)}
                    </div>
                  </TableCell>
                  <TableCell colSpan={1}>
                    <div>
                      {totalFormatVolume(data?.totalProfit || 0, data?.rows?.[0]?.serverType || 0)}
                    </div>
                  </TableCell>
                  <TableCell colSpan={1}>
                    <div>
                      {totalFormatVolume(data?.totalSwaps || 0, data?.rows?.[0]?.serverType || 0)}
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
