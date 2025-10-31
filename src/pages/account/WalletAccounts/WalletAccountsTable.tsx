import { WalletAccountsItem } from '@/api/hooks/system/types';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { DataTable } from '@/components/table/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

export const WalletAccountsTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  CustomRow,
  loading = false,
}: {
  data: WalletAccountsItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  CustomRow: ReactElement;
  loading?: boolean;
}) => {
  const { t } = useTranslation();

  const columns: ColumnDef<WalletAccountsItem>[] = [
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'crmUserName',
      header: t('table.fullName'),
      cell: ({ row }) => {
        if (row.original?.crmUserName || row.original?.crmUserShowId) {
          return (
            <div>{(row.original.crmUserName || '') + `(${row.original.crmUserShowId || ''})`}</div>
          );
        } else {
          return <div className="text-center">-</div>;
        }
      },
    },
    {
      id: 'currency',
      header: t('table.currency'),
      cell: ({ row }) => {
        return <div>{row?.original?.currency || '-'}</div>;
      },
    },
    {
      id: 'balance',
      header: t('table.balance'),
      cell: ({ row }) => {
        if (String(row?.original?.balance).length) {
          return <div>{row?.original?.balance + ' ' + row?.original?.currency}</div>;
        }
        return '-';
      },
    },
    {
      id: 'createTime',
      header: t('common.createTime'),
      cell: ({ row }) => {
        return <div>{row?.original?.createTime || '-'}</div>;
      },
    },
    {
      id: 'operation',
      header: t('common.Operation'),
      cell: () => (
        <div>
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('common.View'), value: 'view' },
              { label: t('common.Edit'), value: 'edit' },
            ]}
            callToAction={action => {
              if (action === 'edit') {
                // Handle edit action
              } else if (action === 'view') {
                // Handle view action
              }
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
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
