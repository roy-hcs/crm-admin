import { MamSignalSourceItem, signalReviewOrderByColumn } from '@/api/hooks/copyTrading/type';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { RrhSorter } from '@/components/common/RrhSorter';
import { DataTable } from '@/components/table/DataTable';
import { SignalReviewVerifyStatusOptions } from '@/lib/const';
import { ColumnDef } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
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
  setIsAsc: Dispatch<SetStateAction<'asc' | 'desc' | ''>>;
  orderByColumn: signalReviewOrderByColumn | string;
  setOrderByColumn: Dispatch<SetStateAction<signalReviewOrderByColumn | string>>;
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
            <RrhSorter
              isAsc={isAsc}
              setIsAsc={setIsAsc}
              setOrderByColumn={setOrderByColumn}
              orderByColumn={orderByColumn}
              column="subscribeFee"
            />
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
            <RrhSorter
              isAsc={isAsc}
              setIsAsc={setIsAsc}
              setOrderByColumn={setOrderByColumn}
              orderByColumn={orderByColumn}
              column="upperLimit"
            />
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
            <RrhSorter
              isAsc={isAsc}
              setIsAsc={setIsAsc}
              setOrderByColumn={setOrderByColumn}
              orderByColumn={orderByColumn}
              column="verifyStatus"
            />
          </div>
        );
      },
      cell: ({ row }) => {
        const text = SignalReviewVerifyStatusOptions.find(
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
            <RrhSorter
              isAsc={isAsc}
              setIsAsc={setIsAsc}
              setOrderByColumn={setOrderByColumn}
              orderByColumn={orderByColumn}
              column="createTime"
            />
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
            <RrhSorter
              isAsc={isAsc}
              setIsAsc={setIsAsc}
              setOrderByColumn={setOrderByColumn}
              orderByColumn={orderByColumn}
              column="verifyTime"
            />
          </div>
        );
      },
      cell: ({ row }) => row?.original?.verifyTime || '-',
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
