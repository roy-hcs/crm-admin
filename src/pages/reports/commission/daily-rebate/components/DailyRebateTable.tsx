import { DailyRebateItem } from '@/api/hooks/report/types';
import { DataTable, CRMColumnDef } from '@/components/table/DataTable';
import { useTranslation } from 'react-i18next';
import { RebateTypeOptions, RebateStatusOptions } from '@/lib/const';

export const DailyRebateTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: DailyRebateItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const Columns: CRMColumnDef<DailyRebateItem, unknown>[] = [
    {
      fixed: true,
      size: 50,
      id: 'No.',
      header: t('ib.overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'settleTime',
      fixed: true,
      size: 180,
      header: t('commission.daily-rebate.settleTime'),
      accessorFn: row => row.settleTime,
    },
    {
      id: 'lastName',
      size: 180,
      header: t('commission.daily-rebate.userName'),
      cell: ({ row }) => (
        <div>
          <div>{(row.original.lastName || '') + (row.original.name || '')}</div>
          <div>{row.original.showId || ''}</div>
        </div>
      ),
    },
    {
      id: 'rebateType',
      size: 180,
      header: t('commission.daily-rebate.rebateType'),
      accessorFn: row => row.rebateType,
      cell: ({ row }) => {
        const find = RebateTypeOptions.find(item => item.value === row.original.rebateType);
        if (find) {
          return t(find.label);
        }
        return '--';
      },
    },
    {
      accessorKey: 'account',
      size: 180,
      header: t('commission.daily-rebate.account'),
      cell: ({ row }) => {
        if (row.original.account) {
          return row.original.account;
        }
        return '--';
      },
    },
    {
      accessorKey: 'volume',
      size: 180,
      header: t('commission.daily-rebate.volume'),
      accessorFn: row => row.volume,
    },
    {
      accessorKey: 'rebateTotalAmt',
      size: 180,
      header: t('commission.daily-rebate.rebateTotalAmt'),
    },
    {
      accessorKey: 'rebateStatus',
      size: 180,
      header: t('commission.daily-rebate.rebateStatus'),
      cell: ({ row }) => {
        const find = RebateStatusOptions.find(
          item => String(item.value) === String(row.original.rebateStatus),
        );
        if (find) {
          return t(find.label);
        }
        return '--';
      },
    },
    {
      accessorKey: 'updateTime',
      size: 180,
      header: t('commission.daily-rebate.updateTime'),
      cell: ({ row }) => {
        if (row.original.updateTime) {
          return row.original.updateTime;
        }
        return '--';
      },
    },
    {
      accessorKey: 'relatedCount',
      size: 180,
      header: t('commission.daily-rebate.relatedCount'),
      accessorFn: row => row.relatedCount,
    },
    {
      accessorKey: 'id',
      size: 180,
      header: t('commission.daily-rebate.id'),
      accessorFn: row => row.id,
    },
  ];
  return (
    <DataTable
      columns={Columns}
      data={data}
      pageCount={pageCount}
      pageIndex={pageIndex}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      loading={loading}
      thCls="text-left"
      tdCls="text-left"
    />
  );
};
