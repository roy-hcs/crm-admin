import { CurrencyListItem, WalletBalanceItem } from '@/api/hooks/report/types';
import { CRMColumnDef, DataTable } from '@/components/table/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

function optPrecision(value: number, currency: string, currencyList: CurrencyListItem[]) {
  if (value !== undefined && currencyList && currencyList.length) {
    const currencyItem = currencyList.find(item => item.currencyAbbr === currency);
    let finalPrecision;
    //若未找到或没有配置精度 则默认为2
    if (currencyItem && currencyItem.decimalPrecision != null) {
      finalPrecision = currencyItem.decimalPrecision;
    } else {
      finalPrecision = 2;
    }
    return value.toFixed(finalPrecision);
  }
}
export const WalletBalanceTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  CustomRow,
  currencyList,
}: {
  data: WalletBalanceItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  CustomRow: ReactElement;
  currencyList: CurrencyListItem[];
}) => {
  const { t } = useTranslation();

  const baseColumns: ColumnDef<WalletBalanceItem>[] = [
    {
      id: 'No',
      header: t('table.index'),
      accessorFn: row => row.index,
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'name',
      header: t('table.fullName'),
      accessorFn: row => `${row.name} ${row.lastName}`,
      cell: ({ row }) => {
        return !row.original.lastName && !row.original.showId ? (
          <div className="text-center">-</div>
        ) : (
          <div>
            <div>{row.original.lastName}</div>
            <div>{row.original.showId}</div>
          </div>
        );
      },
    },
    {
      id: 'email',
      header: t('table.email'),
      accessorFn: row => row.email,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <div>{row.original.email}</div>
        </div>
      ),
    },
  ];

  // Get all unique currency keys from the data
  const knownFields = ['email', 'lastName', 'name', 'showId'];
  const currencyKeys = new Set<string>();

  data.forEach(item => {
    Object.keys(item).forEach(key => {
      if (!knownFields.includes(key)) {
        currencyKeys.add(key);
      }
    });
  });

  // Create currency columns
  const currencyColumns: ColumnDef<WalletBalanceItem>[] = Array.from(currencyKeys).map(key => ({
    id: key,
    header: `Wallet(${key})`,
    accessorFn: row => row[key],
    cell: ({ row }) => {
      const value = row.original[key] as number;
      return <div className="text-center">{optPrecision(value, key, currencyList)}</div>;
    },
  }));
  const columns = [...baseColumns, ...currencyColumns];

  return (
    <DataTable
      columns={columns as CRMColumnDef<WalletBalanceItem, unknown>[]}
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
