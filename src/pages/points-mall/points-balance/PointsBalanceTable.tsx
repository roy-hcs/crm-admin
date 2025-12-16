import { PointsBalanceItem } from '@/api/hooks/pointsMall';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { RrhSorter } from '@/components/common/RrhSorter';
import { DataTable } from '@/components/table/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

export const PointsBalanceTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  isAsc,
  setIsAsc,
  orderByColumn,
  setOrderByColumn,
}: {
  data: PointsBalanceItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  isAsc: 'asc' | 'desc' | '';
  setIsAsc: Dispatch<SetStateAction<'asc' | 'desc' | ''>>;
  orderByColumn: string;
  setOrderByColumn: Dispatch<SetStateAction<string>>;
}) => {
  const { t } = useTranslation();
  const columns: ColumnDef<PointsBalanceItem>[] = [
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'lastName',
      header: t('table.fullName'),
      cell: ({ row }) => {
        if (row.original?.lastName && row.original?.name) {
          return <div>{row.original.lastName + ' ' + row.original.name}</div>;
        } else {
          return '-';
        }
      },
    },
    {
      id: 'showId',
      header: t('pointspBalance.CRMID'),
      cell: ({ row }) => row?.original?.showId || '-',
    },
    {
      id: 'email',
      header: t('table.email'),
      cell: ({ row }) => row?.original?.email || '-',
    },
    {
      id: 'pointsBalance',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('PointsHistory.pointsBalance')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="pointsBalance"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      cell: ({ row }) => row?.original?.pointsBalance || '-',
    },
    {
      id: 'earnPoints',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('pointspBalance.earnPoints')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="earnPoints"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      cell: ({ row }) => row?.original?.earnPoints || '-',
    },
    {
      id: 'usedPoints',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('pointspBalance.usedPoints')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="usedPoints"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      cell: ({ row }) => row?.original?.usedPoints || '-',
    },
    {
      id: 'operation',
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      cell: () => (
        <div>
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[{ label: t('common.View'), value: 'view' }]}
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
