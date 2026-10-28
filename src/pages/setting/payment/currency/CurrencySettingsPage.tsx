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
import { useCurrencyList, useRemoveCurrency } from '@/api/hooks/setting/payment';
import { CurrencyItem } from '@/api/hooks/setting/types';
import { CurrencyDialog } from './components/CurrencyDialog';

export const CurrencySettingsPage = () => {
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const {
    data: currencyList,
    isLoading: currencyListLoading,
    refetch,
  } = useCurrencyList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
  });

  const { mutateAsync: removeCurrency } = useRemoveCurrency();

  const [item, setItem] = useState<CurrencyItem | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);

  const allColumns = useMemo<CRMColumnDef<CurrencyItem, unknown>[]>(
    () => [
      {
        id: 'No',
        header: t('table.index'),
        cell: ({ row }) => row?.index + 1,
      },
      {
        id: 'sort',
        header: t('table.sort'),
        cell: ({ row }) => row?.original?.sort ?? '-',
      },
      {
        id: 'currencyAbbr',
        header: t('currencySettingPage.currencyAbbr'),
        cell: ({ row }) => row?.original?.currencyAbbr || '-',
      },
      {
        id: 'currencyNameChn',
        header: t('currencySettingPage.currencyNameChn'),
        cell: ({ row }) => row?.original?.currencyNameChn || '-',
      },
      {
        id: 'currencyNameEng',
        header: t('currencySettingPage.currencyNameEng'),
        cell: ({ row }) => row?.original?.currencyNameEng || '-',
      },
      {
        id: 'currencyType',
        header: t('currencySettingPage.currencyType'),
        cell: ({ row }) =>
          row?.original?.currencyType === 2
            ? t('currencySettingPage.currencyTypeCrypto')
            : t('currencySettingPage.currencyTypeFiat'),
      },
      {
        id: 'network',
        header: t('currencySettingPage.network'),
        cell: ({ row }) => row?.original?.network || '-',
      },
      {
        id: 'decimalPrecision',
        header: t('currencySettingPage.decimalPrecision'),
        cell: ({ row }) => row?.original?.decimalPrecision ?? '-',
      },
      {
        id: 'isDefault',
        header: t('currencySettingPage.defaultCurrency'),
        cell: ({ row }) =>
          row?.original?.isDefault === 1 ? (
            <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700">
              {t('common.yes')}
            </span>
          ) : (
            '-'
          ),
      },
      {
        id: 'status',
        header: t('table.status'),
        cell: ({ row }) =>
          row?.original?.status === 1 ? (
            <span className="text-green-600">{t('common.enable')}</span>
          ) : (
            <span className="text-red-500">{t('common.disable')}</span>
          ),
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
    useColumnVisibility('setting-payment-currency-table', allColumns);

  const reset = () => {
    setPageNum(0);
    setPageSize(10);
  };

  return (
    <div>
      <PageInfo title={t('currencySettingPage.title')} />
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
          <CurrencyDialog mode="add" trigger />
          <CurrencyDialog open={open} setOpen={setOpen} mode="edit" item={item} />
        </div>
        <DataTable
          columns={tableColumns}
          data={currencyList?.rows || []}
          pageCount={Math.ceil(+(currencyList?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={currencyListLoading}
        />

        <RrhDeleteAlert<{
          ids: string;
        }>
          open={deleteAlert}
          setOpen={setDeleteAlert}
          onSuccess={refetch}
          confirmFunction={removeCurrency}
          params={{ ids: item?.id || '' }}
          tipsText={t('currencySettingPage.deleteConfirm')}
        />
      </TableContentWrapper>
    </div>
  );
};
