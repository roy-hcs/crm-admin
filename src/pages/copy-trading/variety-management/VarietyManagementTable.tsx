import { MamSymbolItem } from '@/api/hooks/copyTrading/type';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { DataTable } from '@/components/table/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const VarietyManagementTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: MamSymbolItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const columns: ColumnDef<MamSymbolItem>[] = [
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'name',
      header: t('varietyManagement.symbolCategory'),
      cell: ({ row }) => row?.original?.symbolCategory || '-',
    },
    {
      id: 'symbol',
      header: t('varietyManagement.symbol'),
      cell: ({ row }) => row?.original?.symbol || '-',
    },
    {
      id: 'cname',
      header: t('varietyManagement.cname'),
      cell: ({ row }) => row?.original?.cname || '-',
    },
    {
      id: 'enname',
      header: t('varietyManagement.enname'),
      cell: ({ row }) => row?.original?.enname || '-',
    },
    {
      id: 'name',
      header: t('varietyManagement.name'),
      cell: ({ row }) => row?.original?.name || '-',
    },
    {
      id: 'sort',
      header: t('table.sort'),
      cell: ({ row }) => row?.original?.sort || '-',
    },
    {
      id: 'operation',
      header: t('common.Operation'),
      cell: () => (
        <div>
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[{ label: t('table.audit'), value: 'edit' }]}
            callToAction={() => {}}
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
    />
  );
};
