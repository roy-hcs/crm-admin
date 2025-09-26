import { WithdrawItem } from '@/api/hooks/review/types';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhTag } from '@/components/common/RrhTag';
import { DataTable } from '@/components/table/DataTable';
import { Checkbox } from '@/components/ui/checkbox';
import { withdrawalReviewStatusMap, withdrawOrDepositMethodsMap } from '@/lib/constant';
import { ColumnDef } from '@tanstack/react-table';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

export const ReviewWithdrawalTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  CustomRow,
}: {
  data: WithdrawItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  CustomRow: ReactElement;
}) => {
  const { t } = useTranslation();
  const ReviewWithdrawalTable: ColumnDef<WithdrawItem>[] = [
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
      id: 'orderNumber',
      header: t('table.orderNumber'),
      accessorFn: row => row.orderNum,
    },
    {
      id: 'status',
      header: t('table.status'),
      accessorFn: row => row.status,
      cell: ({ row }) => {
        const status = row.original.exceptionFlag;
        return (
          <RrhTag type={Number(status) === 1 ? 'error' : 'success'}>
            {Number(status) === 1 ? t('common.abnormal') : t('common.normal')}
          </RrhTag>
        );
      },
    },
    {
      id: 'userName',
      header: t('CRMAccountPage.UserName'),
      cell: ({ row }) => (
        <div className="flex flex-col items-center justify-center">
          <div>
            {row.original.userLastName} {row.original.userName}
          </div>
          <div>{row.original.userShowId}</div>
        </div>
      ),
    },
    {
      id: 'email',
      header: t('table.email'),
      accessorFn: row => row.userEmail,
    },
    {
      id: 'withdrawMethods',
      header: t('table.withdrawMethods'),
      cell: ({ row }) => {
        const method = row.original.method;
        return method ? t(`table.${withdrawOrDepositMethodsMap[method]}`) : '-';
      },
    },
    {
      id: 'withdrawAccount',
      header: t('table.withdrawAccount'),
      cell: ({ row }) => {
        if (row.original.login) {
          return row.original.aliasName ? (
            <div className="flex flex-col items-center">
              <div>{row.original.aliasName}</div>
              <div>{row.original.login}</div>
            </div>
          ) : (
            <div>{row.original.login}</div>
          );
        } else if (row.original.walletId) {
          return (
            <div>
              {t('table.wallet')} ({row.original.walletCurrency})
            </div>
          );
        }
      },
    },
    {
      id: 'balance',
      header: t('table.balance'),
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.balance} {row.original.withdrawCurrency}
        </div>
      ),
    },
    {
      id: 'reviewStatus',
      header: t('table.reviewStatus'),
      accessorFn: row => row.status,
      cell: ({ row }) => {
        const typeMap: Record<number, 'error' | 'success' | 'warning' | 'info' | 'default'> = {
          0: 'error',
          1: 'success',
          2: 'warning',
          '-1': 'info',
          '-2': 'default',
        };
        return (
          <RrhTag type={typeMap[row.original.status]}>
            {t(`table.${withdrawalReviewStatusMap[row.original.status]}`)}
          </RrhTag>
        );
      },
    },
    {
      id: 'withdrawAmount',
      header: t('table.withdrawAmount'),
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.withdraw} {row.original.walletCurrency}
        </div>
      ),
    },
    {
      id: 'commission',
      header: t('table.commission'),
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.fee} {row.original.feeCurrency}
        </div>
      ),
    },
    {
      id: 'amountOfReceipt',
      header: t('table.amountOfReceipt'),
      cell: ({ row }) =>
        row.original.factWithdraw ? (
          <div className="text-center">
            {row.original.factWithdraw} {row.original.targetCurrency}
          </div>
        ) : (
          <div>-</div>
        ),
    },
    {
      id: 'role',
      header: t('table.role'),
      accessorFn: row => row.roleName,
    },
    {
      id: 'submitAuditTime',
      header: t('table.submitAuditTime'),
      accessorFn: row => row.subTime,
    },
    {
      id: 'currentAuditor',
      header: t('table.currentAuditor'),
      cell: ({ row }) => {
        if (row.original.vUserLastName && row.original.status !== 2) {
          return (
            <div>
              {row.original.vUserLastName} {row.original.vUserName}
            </div>
          );
        } else {
          return <div>-</div>;
        }
      },
    },
    {
      id: 'finishTime',
      header: t('table.finishTime'),
      accessorFn: row => row.verifyTime,
      cell: ({ row }) => <div>{row.original.verifyTime || '-'}</div>,
    },
    {
      id: 'tradeServerOrderNumber',
      header: t('table.tradeServerOrderNumber'),
      accessorFn: row => row.dealTicket,
    },
    {
      id: 'operate',
      header: t('common.Operation'),
      cell: ({ row }) => {
        // TODO: need to add view detail page later
        return (
          <RrhButton variant="ghost">
            {row.original.status !== 2 ? t('common.View') : t('table.audit')}
          </RrhButton>
        );
      },
    },
  ];
  return (
    <DataTable
      columns={ReviewWithdrawalTable}
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
