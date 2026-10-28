import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { Ellipsis, RefreshCcw } from 'lucide-react';
import { useExchangeRateList, useRemoveExchangeRate } from '@/api/hooks/setting/payment';
import { ExchangeRateItem } from '@/api/hooks/setting/types';
import { ExchangeRateDialog } from './components/ExchangeRateDialog';

export const ExchangeRateSettingsPage = () => {
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const {
    data: exchangeRateList,
    isLoading: exchangeRateListLoading,
    refetch,
  } = useExchangeRateList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
  });

  const { mutateAsync: removeExchangeRate } = useRemoveExchangeRate();

  const [item, setItem] = useState<ExchangeRateItem | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);

  const renderRate = (value: number | null | undefined) =>
    value === null || value === undefined ? '-' : String(value);

  const allColumns = useMemo<CRMColumnDef<ExchangeRateItem, unknown>[]>(
    () => [
      {
        id: 'No',
        header: t('table.index'),
        cell: ({ row }) => row?.index + 1,
      },
      {
        id: 'currencyPair',
        header: t('exchangeRateSettingPage.currencyPair'),
        cell: ({ row }) => `${row?.original?.sCurrency || '-'}/${row?.original?.tCurrency || '-'}`,
      },
      {
        id: 'updateType',
        header: t('exchangeRateSettingPage.updateType'),
        cell: ({ row }) =>
          row?.original?.updateType === 2
            ? t('exchangeRateSettingPage.updateTypeAuto')
            : t('exchangeRateSettingPage.updateTypeManual'),
      },
      {
        id: 'marketPrice',
        header: t('exchangeRateSettingPage.marketPrice'),
        cell: ({ row }) => renderRate(row?.original?.marketPrice),
      },
      {
        id: 'buyRateFloat',
        header: t('exchangeRateSettingPage.buyRateFloat'),
        cell: ({ row }) => renderRate(row?.original?.buyRateFloat),
      },
      {
        id: 'inRate',
        header: t('exchangeRateSettingPage.inRate'),
        cell: ({ row }) => renderRate(row?.original?.inRate),
      },
      {
        id: 'sellRateRise',
        header: t('exchangeRateSettingPage.sellRateRise'),
        cell: ({ row }) => renderRate(row?.original?.sellRateRise),
      },
      {
        id: 'outRate',
        header: t('exchangeRateSettingPage.outRate'),
        cell: ({ row }) => renderRate(row?.original?.outRate),
      },
      {
        id: 'updateTime',
        header: t('table.updateTime'),
        cell: ({ row }) => row?.original?.updateTime || '-',
      },
      {
        id: 'operate',
        header: () => t('common.Operation'),
        cell: ({ row }) => (
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('common.Edit'), value: 'edit' },
              { label: t('common.delete'), value: 'delete' },
            ]}
            callToAction={action => {
              setItem(row.original);
              switch (action) {
                case 'edit':
                  setOpen(true);
                  break;
                case 'delete':
                  setDeleteAlert(true);
                  break;
                default:
                  break;
              }
            }}
          />
        ),
        fixed: 'right',
      },
    ],
    [t],
  );
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('setting-payment-exchange-rate-table', allColumns);

  const reset = () => {
    setPageNum(0);
    setPageSize(10);
  };

  return (
    <div>
      <PageInfo title={t('exchangeRateSettingPage.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex items-center justify-end gap-2">
          <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
            <RefreshCcw className="size-3.5" />
          </RrhButton>
          <ColumnVisibilityButton
            columnMeta={columnMeta}
            visibleColumns={visibleColumns}
            onToggle={toggleColumn}
            onBatchReorder={batchUpdateColumns}
            columns={columns}
          />
          <ExchangeRateDialog mode="add" trigger />
          <ExchangeRateDialog open={open} setOpen={setOpen} mode="edit" item={item} />
        </div>
        <DataTable
          columns={tableColumns}
          data={exchangeRateList?.rows || []}
          pageCount={Math.ceil(+(exchangeRateList?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={exchangeRateListLoading}
        />

        <RrhDeleteAlert<{
          ids: string;
        }>
          open={deleteAlert}
          setOpen={setDeleteAlert}
          onSuccess={refetch}
          confirmFunction={removeExchangeRate}
          params={{ ids: String(item?.id || '') }}
          tipsText={t('exchangeRateSettingPage.deleteConfirm')}
        />
      </TableContentWrapper>
    </div>
  );
};
