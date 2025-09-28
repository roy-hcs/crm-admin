import { DepositListItem } from '@/api/hooks/review/types';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhTag } from '@/components/common/RrhTag';
import { DataTable } from '@/components/table/DataTable';
import { depositMethodsMap, withdrawalReviewStatusMap } from '@/lib/constant';
import { ColumnDef } from '@tanstack/react-table';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

export const ReviewDepositTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  CustomRow,
  channelList,
}: {
  data: DepositListItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  CustomRow: ReactElement;
  channelList: { id: number; channelName: string }[];
}) => {
  const { t } = useTranslation();
  const ReviewDepositTableColumns: ColumnDef<DepositListItem>[] = [
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
      id: 'depositMethods',
      header: t('table.depositMethods'),
      cell: ({ row }) => {
        const method = row.original.method;
        return method ? t(`table.${depositMethodsMap[method]}`) : '-';
      },
    },
    {
      id: 'channel',
      header: t('table.paymentChannel'),
      cell: ({ row }) => {
        if (row.original.method === 5) {
          return (
            channelList.find(channel => `${channel.id}` === row.original.channelId)?.channelName ||
            '-'
          );
        }
        return '-';
      },
    },
    {
      id: 'depositAccount',
      header: t('table.depositAccount'),
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
      id: 'payAmount',
      header: t('table.payAmount'),
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.deposit} {row.original.depositCurrency}
        </div>
      ),
    },
    {
      id: 'depositAmount',
      header: t('table.depositAmount'),
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.factDeposit} {row.original.feeCurrency}
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
        row.original.receiptAmount ? (
          <div className="text-center">
            {row.original.receiptAmount} {row.original.receiptCurrency}
          </div>
        ) : (
          <div>-</div>
        ),
    },
    {
      id: 'exchangeRate',
      header: t('common.exchangeRate'),
      cell: ({ row }) =>
        row.original.rate ? (
          <div className="text-center">
            <div>{row.original.rate.toFixed(5)}</div>
            <div>{row.original.currencyPair}</div>
          </div>
        ) : (
          <div>-</div>
        ),
    },
    {
      id: 'directAgent',
      header: t('table.directAgent'),
      accessorFn: row => row.directBroker,
    },
    {
      id: 'role',
      header: t('table.role'),
      accessorFn: row => row.roleName,
    },
    {
      id: 'submitTime',
      header: t('table.submitTime'),
      accessorFn: row => row.subTime,
    },
    {
      id: 'currentAuditor',
      header: t('table.currentAuditor'),
      cell: ({ row }) => {
        if (row.original.status !== 2) {
          if (row.original.vUserLastName) {
            return (
              <div>
                {row.original.vUserLastName} {row.original.vUserName}
              </div>
            );
          } else {
            return <div>{t('common.system')}</div>;
          }
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
      id: 'paymentOrderNumber',
      header: t('table.paymentOrderNumber'),
      cell: ({ row }) => {
        if (row.original.method === 5) {
          return row.original.orderId;
        } else {
          return '-';
        }
      },
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
      columns={ReviewDepositTableColumns}
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
