import { PointsBalanceItem } from '@/api/hooks/pointsMall/types';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { DataTable } from '@/components/table/DataTable';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronDown, ChevronUp, Ellipsis } from 'lucide-react';
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
  isAsc: 'asc' | 'desc';
  setIsAsc: (isAsc: 'asc' | 'desc') => void;
  orderByColumn: 'pointsBalance' | 'earnPoints' | 'usedPoints' | '';
  setOrderByColumn: (orderByColumn: 'pointsBalance' | 'earnPoints' | 'usedPoints' | '') => void;
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
            <button
              className="gap-.5 flex cursor-pointer flex-col"
              onClick={() => {
                setIsAsc(isAsc === 'asc' ? 'desc' : 'asc');
                setOrderByColumn('pointsBalance');
              }}
            >
              {orderByColumn === 'pointsBalance' ? (
                <>
                  <ChevronUp className={cn('h-3 w-3', isAsc === 'asc' ? '' : 'opacity-50')} />
                  <ChevronDown className={cn('h-3 w-3', isAsc === 'asc' ? 'opacity-50' : '')} />
                </>
              ) : (
                <>
                  <ChevronUp className={cn('h-3 w-3')} />
                  <ChevronDown className={cn('h-3 w-3')} />
                </>
              )}
            </button>
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
            <button
              className="gap-.5 flex cursor-pointer flex-col"
              onClick={() => {
                setIsAsc(isAsc === 'asc' ? 'desc' : 'asc');
                setOrderByColumn('earnPoints');
              }}
            >
              {orderByColumn === 'earnPoints' ? (
                <>
                  <ChevronUp className={cn('h-3 w-3', isAsc === 'asc' ? '' : 'opacity-50')} />
                  <ChevronDown className={cn('h-3 w-3', isAsc === 'asc' ? 'opacity-50' : '')} />
                </>
              ) : (
                <>
                  <ChevronUp className={cn('h-3 w-3')} />
                  <ChevronDown className={cn('h-3 w-3')} />
                </>
              )}
            </button>
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
            <button
              className="gap-.5 flex cursor-pointer flex-col"
              onClick={() => {
                setIsAsc(isAsc === 'asc' ? 'desc' : 'asc');
                setOrderByColumn('usedPoints');
              }}
            >
              {orderByColumn === 'usedPoints' ? (
                <>
                  <ChevronUp className={cn('h-3 w-3', isAsc === 'asc' ? '' : 'opacity-50')} />
                  <ChevronDown className={cn('h-3 w-3', isAsc === 'asc' ? 'opacity-50' : '')} />
                </>
              ) : (
                <>
                  <ChevronUp className={cn('h-3 w-3')} />
                  <ChevronDown className={cn('h-3 w-3')} />
                </>
              )}
            </button>
          </div>
        );
      },
      cell: ({ row }) => row?.original?.usedPoints || '-',
    },
    {
      id: 'operation',
      header: t('common.Operation'),
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
