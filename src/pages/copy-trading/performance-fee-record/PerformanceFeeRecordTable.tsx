import { PerformanceFeeItem } from '@/api/hooks/copyTrading/type';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { RrhSorter } from '@/components/common/RrhSorter';
import { DataTable } from '@/components/table/DataTable';
import { PerformanceFeePayStatusOptions } from '@/lib/const';
import { ColumnDef } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

export const PerformanceFeeRecordTable = ({
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
  data: PerformanceFeeItem[];
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
  const columns: ColumnDef<PerformanceFeeItem>[] = [
    {
      id: 'orderNo',
      header: t('table.orderNumber'),
      cell: ({ row }) => row?.original?.orderNo || '-',
    },
    {
      id: 'signalSourceName',
      header: t('signals.name'),
      cell: ({ row }) => {
        return (
          <div>
            <div>
              <span>{row?.original?.signalSourceName}</span>
              <span>{row?.original?.traderServer}</span>
            </div>
          </div>
        );
      },
    },
    {
      id: 'clientName',
      header: t('performanceFeeRecord.clientName'),
      cell: ({ row }) => {
        return (
          <div>
            <div>
              <span>{row?.original?.clientName}</span>
              <span>{row?.original?.clientEmail}</span>
            </div>
          </div>
        );
      },
    },
    {
      id: 'payAccountName',
      header: t('performanceFeeRecord.payAccountName'),
      cell: ({ row }) => row?.original?.payAccountName || '-',
    },
    {
      id: 'performanceFee',
      header: t('performanceFeeRecord.performanceFee'),
      cell: ({ row }) => row?.original?.performanceFee || '-',
    },
    {
      id: 'managementFee',
      header: t('performanceFeeRecord.managementFee'),
      cell: ({ row }) => row?.original?.managementFee || '-',
    },
    {
      id: 'createTime',
      header: t('common.createTime'),
      cell: ({ row }) => row?.original?.createTime || '-',
    },
    {
      id: 'payStatus',
      header: t('table.payResult'),
      cell: ({ row }) => {
        const text = PerformanceFeePayStatusOptions.find(
          i => i.value === String(row?.original?.payStatus),
        );
        return <span>{text ? t(text.label) : '-'}</span>;
      },
    },
    {
      id: 'payAccountName',
      header: t('performanceFeeRecord.payAccount'),
      cell: ({ row }) => row?.original?.payAccountName || '-',
    },
    {
      id: 'payTime',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('performanceFeeRecord.payTime')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="payTime"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      cell: ({ row }) => row?.original?.payTime || '-',
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
