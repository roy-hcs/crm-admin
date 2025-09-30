import { InternalTransferItem } from '@/api/hooks/review/types';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhTag } from '@/components/common/RrhTag';
import { DataTable } from '@/components/table/DataTable';
import { internalTransferReviewStatusMap } from '@/lib/constant';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

export const ReviewInternalTransferTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: InternalTransferItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const ReviewInternalTransferColumns: ColumnDef<InternalTransferItem>[] = [
    {
      id: 'No.',
      header: t('CRMAccountPage.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
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
      id: 'outAccount',
      header: t('table.transferOutAccount'),
      cell: ({ row }) => {
        const type = row.original.type;
        if ([1, 2].includes(type)) {
          return `${t('table.myWallet')} (${row.original.outUnit})`;
        }
        if ([3, 4].includes(type)) {
          return (
            <div>
              <div>{row.original.outAliasName}</div>
              <div>{row.original.outAccount}</div>
            </div>
          );
        }
        return '-';
      },
    },
    {
      id: 'transferInAccount',
      header: t('table.transferInAccount'),
      cell: ({ row }) => {
        const type = row.original.type;
        if ([1, 3].includes(type)) {
          return `${t('table.myWallet')} (${row.original.inUnit})`;
        }
        if ([2, 4].includes(type)) {
          return (
            <div>
              <div>{row.original.inAliasName}</div>
              <div>{row.original.inAccount}</div>
            </div>
          );
        }
        return '-';
      },
    },
    {
      id: 'status',
      header: t('table.status'),
      accessorFn: row => row.status,
      cell: ({ row }) => {
        const typeMap: Record<number, 'error' | 'success' | 'warning' | 'info'> = {
          0: 'error',
          1: 'success',
          2: 'warning',
          '-1': 'info',
        };
        return (
          <RrhTag type={typeMap[row.original.status]}>
            {t(`table.${internalTransferReviewStatusMap[row.original.status]}`)}
          </RrhTag>
        );
      },
    },
    {
      id: 'transferAmount',
      header: t('table.transferAmount'),
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.outMoney} {row.original.outUnit}
        </div>
      ),
    },
    {
      id: 'submitAuditTime',
      header: t('table.submitAuditTime'),
      accessorFn: row => row.subTime,
    },
    {
      id: 'currentAuditor',
      header: t('table.currentAuditor'),
      cell: ({ row }) => (
        <div>
          {row.original.vUserLastName} {row.original.vUserName}
        </div>
      ),
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
            {row.original.status === 2 ? t('table.audit') : t('common.View')}
          </RrhButton>
        );
      },
    },
  ];
  return (
    <DataTable
      columns={ReviewInternalTransferColumns}
      data={data}
      pageCount={pageCount}
      pageSize={pageSize}
      pageIndex={pageIndex}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      loading={loading}
      tdCls="text-center"
      thCls="text-center"
    />
  );
};
