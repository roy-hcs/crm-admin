import { RebateCommissionItem } from '@/api/hooks/review/types';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhTag } from '@/components/common/RrhTag';
import { DataTable } from '@/components/table/DataTable';
import { Checkbox } from '@/components/ui/checkbox';
import { depositRebateStatusMap } from '@/lib/constant';
import { ColumnDef } from '@tanstack/react-table';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
export const ReviewTradingRebateTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  CustomRow,
}: {
  data: RebateCommissionItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  CustomRow: ReactElement;
}) => {
  const { t } = useTranslation();
  const TradingRebateColumns: ColumnDef<RebateCommissionItem>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          className="data-[state=checked]:border-slate-700"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="data-[state=checked]:border-slate-700"
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'No.',
      header: t('CRMAccountPage.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'serverName',
      header: t('table.server'),
      accessorFn: row => row.serverName,
    },
    {
      id: 'mtOrder',
      header: t('table.tradingOrderNumber'),
      accessorFn: row => row.mtOrder,
    },
    {
      id: 'login',
      header: t('table.tradingAccount'),
      accessorFn: row => row.login,
    },
    {
      id: 'symbol',
      header: t('table.symbol'),
      accessorFn: row => row.symbol,
    },
    {
      id: 'volume',
      header: t('table.volume'),
      accessorFn: row => parseFloat(row.volume).toFixed(2),
    },
    {
      id: 'traderTime',
      header: t('table.tradingTime'),
      accessorFn: row => row.traderTimeStr,
      cell: ({ row }) => (
        <div>
          {row.original.traderTimeStr.split(' ').map(item => {
            return <div key={item}>{item}</div>;
          })}
        </div>
      ),
    },
    {
      id: 'rebateUser',
      header: t('table.rebateUser'),
      cell: ({ row }) => (
        <div>
          <div>{row.original.userName}</div>
          <div>({row.original.showId})</div>
        </div>
      ),
    },
    {
      id: 'rebateTotalAmt',
      header: t('table.rebateAmount'),
      cell: ({ row }) => {
        const currency = ` ${row.original.amtUnit}`;
        return (
          <div>
            <div>
              {row.original.rebateFixedAmt}
              {currency}
            </div>
            <div>
              (
              {`${row.original.rebateFixedAmt + currency} + ${row.original.rebatePointsAmt + currency}`}
              )
            </div>
          </div>
        );
      },
    },
    {
      id: 'status',
      header: t('table.status'),
      cell: ({ row }) => {
        const typeMap: Record<number | string, 'error' | 'success' | 'warning' | 'info'> = {
          0: 'warning',
          1: 'success',
          '-1': 'info',
          2: 'error',
        };
        return (
          <RrhTag type={typeMap[row.original.rebateStatus]}>
            {t(`table.${depositRebateStatusMap[row.original.rebateStatus]}`)}
          </RrhTag>
        );
      },
    },
    {
      id: 'rule',
      header: t('table.targetRule'),
      accessorFn: row => row.rebateTraderName,
    },
    {
      id: 'rebateTime',
      header: t('table.submitTime'),
      accessorFn: row => row.rebateTime,
    },
    {
      id: 'verifyUserName',
      header: t('table.currentAuditor'),
      accessorFn: row => row.verifyUserName,
    },
    {
      id: 'verifyTime',
      header: t('table.finishTime'),
      accessorFn: row => row.verifyTime,
    },
    {
      id: 'orderNumber',
      header: t('table.orderNumber'),
      accessorFn: row => row.id,
    },
    {
      id: 'operate',
      header: t('common.Operation'),
      cell: ({ row }) => {
        const onClick = (data: RebateCommissionItem) => {
          console.log('Operate on row:', data);
        };
        return (
          <div className="flex flex-col gap-2">
            <RrhButton variant="ghost" onClick={() => onClick(row.original)}>
              {t('table.audit')}
            </RrhButton>
            <RrhButton variant="ghost" onClick={() => onClick(row.original)}>
              {t('common.delete')}
            </RrhButton>
          </div>
        );
      },
    },
  ];
  return (
    <DataTable
      columns={TradingRebateColumns}
      data={data}
      pageCount={pageCount}
      pageSize={pageSize}
      pageIndex={pageIndex}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      loading={loading}
      tdCls="text-center"
      thCls="text-center"
      CustomRow={CustomRow}
    />
  );
};
