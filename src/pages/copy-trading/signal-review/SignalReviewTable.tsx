import { MamSignalSourceItem, signalReviewOrderByColumn } from '@/api/hooks/copyTrading/type';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { DataTable } from '@/components/table/DataTable';
import { SignalReviewverifyStatusOptions } from '@/lib/const';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronDown, ChevronUp, Ellipsis } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const SignalReviewTable = ({
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
  data: MamSignalSourceItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  isAsc: 'asc' | 'desc' | '';
  setIsAsc: (isAsc: 'asc' | 'desc' | '') => void;
  orderByColumn: signalReviewOrderByColumn;
  setOrderByColumn: (orderByColumn: signalReviewOrderByColumn) => void;
}) => {
  const { t } = useTranslation();
  const columns: ColumnDef<MamSignalSourceItem>[] = [
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'name',
      header: t('signals.name'),
      cell: ({ row }) => row?.original?.name || '-',
    },
    {
      id: 'userName',
      header: t('signals.signalSourceAuthor'),
      cell: ({ row }) => {
        return (
          <div>
            <div>
              <span>{row?.original?.userLastName}</span>
              <span>{row?.original?.userName}</span>
            </div>
            <span> {row?.original?.email}</span>
          </div>
        );
      },
    },
    {
      id: 'userName',
      header: t('table.tradingAccount'),
      cell: ({ row }) => {
        return (
          <div>
            <div>
              <span>{row?.original?.account}</span>
            </div>
            <span> {row?.original?.server}</span>
          </div>
        );
      },
    },
    {
      id: 'subscribeFee',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('signals.subscribeFee')}</div>
            <button
              className="gap-.5 flex cursor-pointer flex-col"
              onClick={() => {
                setIsAsc(isAsc === 'asc' ? 'desc' : 'asc');
                setOrderByColumn('subscribeFee');
              }}
            >
              {orderByColumn === 'subscribeFee' ? (
                <>
                  <ChevronUp className={cn('h-3 w-3', isAsc === 'asc' ? '' : 'opacity-50')} />
                  <ChevronDown className={cn('h-3 w-3', isAsc === 'asc' ? 'opacity-50' : '')} />
                </>
              ) : (
                <>
                  <ChevronUp className="h-3 w-3" />
                  <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          </div>
        );
      },
      cell: ({ row }) => row?.original?.subscribeFee || '-',
    },
    {
      id: 'performanceFeeRatio',
      header: t('signalReview.performanceFeeRatio'),
      cell: ({ row }) => row?.original?.performanceFeeRatio || '-',
    },
    {
      id: 'publicShow',
      header: t('signals.publicShow'),
      cell: ({ row }) => {
        if (row?.original?.publicShow === 1) {
          return t('signalReview.show');
        } else {
          return t('signalReview.hide');
        }
      },
    },
    {
      id: 'minBalanceForSubscription',
      header: t('signalReview.minBalanceForSubscription'),
      cell: ({ row }) => row?.original?.minBalanceForSubscription || '-',
    },
    {
      id: 'upperLimit',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('signalReview.upperLimit')}</div>
            <button
              className="gap-.5 flex cursor-pointer flex-col"
              onClick={() => {
                setIsAsc(isAsc === 'asc' ? 'desc' : 'asc');
                setOrderByColumn('upperLimit');
              }}
            >
              {orderByColumn === 'upperLimit' ? (
                <>
                  <ChevronUp className={cn('h-3 w-3', isAsc === 'asc' ? '' : 'opacity-50')} />
                  <ChevronDown className={cn('h-3 w-3', isAsc === 'asc' ? 'opacity-50' : '')} />
                </>
              ) : (
                <>
                  <ChevronUp className="h-3 w-3" />
                  <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          </div>
        );
      },
      cell: ({ row }) => row?.original?.upperLimit || '-',
    },
    {
      id: 'verifyStatus',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.status')}</div>
            <button
              className="gap-.5 flex cursor-pointer flex-col"
              onClick={() => {
                setIsAsc(isAsc === 'asc' ? 'desc' : 'asc');
                setOrderByColumn('verifyStatus');
              }}
            >
              {orderByColumn === 'verifyStatus' ? (
                <>
                  <ChevronUp className={cn('h-3 w-3', isAsc === 'asc' ? '' : 'opacity-50')} />
                  <ChevronDown className={cn('h-3 w-3', isAsc === 'asc' ? 'opacity-50' : '')} />
                </>
              ) : (
                <>
                  <ChevronUp className="h-3 w-3" />
                  <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          </div>
        );
      },
      cell: ({ row }) => {
        const text = SignalReviewverifyStatusOptions.find(
          i => Number(i.value) === row.original.verifyStatus,
        );
        return text ? t(text?.label) : '-';
      },
    },
    {
      id: 'createTime',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.applicationTime')}</div>
            <button
              className="gap-.5 flex cursor-pointer flex-col"
              onClick={() => {
                setIsAsc(isAsc === 'asc' ? 'desc' : 'asc');
                setOrderByColumn('createTime');
              }}
            >
              {orderByColumn === 'createTime' ? (
                <>
                  <ChevronUp className={cn('h-3 w-3', isAsc === 'asc' ? '' : 'opacity-50')} />
                  <ChevronDown className={cn('h-3 w-3', isAsc === 'asc' ? 'opacity-50' : '')} />
                </>
              ) : (
                <>
                  <ChevronUp className="h-3 w-3" />
                  <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          </div>
        );
      },
      cell: ({ row }) => row?.original?.createTime || '-',
    },
    {
      id: 'verifyTime',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.verifyTime')}</div>
            <button
              className="gap-.5 flex cursor-pointer flex-col"
              onClick={() => {
                setIsAsc(isAsc === 'asc' ? 'desc' : 'asc');
                setOrderByColumn('verifyTime');
              }}
            >
              {orderByColumn === 'verifyTime' ? (
                <>
                  <ChevronUp className={cn('h-3 w-3', isAsc === 'asc' ? '' : 'opacity-50')} />
                  <ChevronDown className={cn('h-3 w-3', isAsc === 'asc' ? 'opacity-50' : '')} />
                </>
              ) : (
                <>
                  <ChevronUp className="h-3 w-3" />
                  <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          </div>
        );
      },
      cell: ({ row }) => row?.original?.verifyTime || '-',
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
