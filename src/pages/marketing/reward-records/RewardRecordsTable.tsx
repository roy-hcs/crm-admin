import { RewardRecordsListItem } from '@/api/hooks/marketing';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { RrhTag } from '@/components/common/RrhTag';
import { DataTable } from '@/components/table/DataTable';
import { depositRebateStatusMap } from '@/lib/constant';
import { ColumnDef } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const RewardRecordsTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  bonusDictType,
}: {
  data: RewardRecordsListItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  bonusDictType: { dictLabel: string; dictValue: string }[];
}) => {
  const { t } = useTranslation();

  const columns: ColumnDef<RewardRecordsListItem>[] = [
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'orderNo',
      header: t('table.orderNo'),
      cell: ({ row }) => {
        return <div>{row?.original?.orderNo || '-'}</div>;
      },
    },
    {
      id: 'lastName',
      header: t('table.CRMAccount'),
      cell: ({ row }) => {
        if (row?.original?.lastName || row?.original?.name || row?.original?.showId) {
          return (
            <div>
              <div>{`${row?.original?.lastName || ''} ${row?.original?.name || ''}`}</div>
              <div>{row?.original?.showId || '-'}</div>
            </div>
          );
        }
        return '-';
      },
    },
    {
      id: 'rewardTitle',
      header: t('table.activityName'),
      cell: ({ row }) => {
        return <div>{row?.original?.rewardTitle || '-'}</div>;
      },
    },
    {
      id: 'businessType',
      header: t('table.triggerBusiness'),
      cell: ({ row }) => {
        const text = bonusDictType.find(
          item => item.dictValue === String(row?.original?.businessType),
        )?.dictLabel;
        return <div>{text || '-'}</div>;
      },
    },
    {
      id: 'targetType',
      header: t('common.type'),
      cell: ({ row }) => {
        return <div>{row?.original?.targetType || '-'}</div>;
      },
    },
    {
      id: 'rewardType',
      header: t('marketing.rewardRecords.rewardType'),
      cell: ({ row }) => {
        return <div>{row?.original?.rewardType || '-'}</div>;
      },
    },
    {
      id: 'rewardTarget',
      header: t('marketing.rewardRecords.rewardTarget'),
      cell: ({ row }) => {
        return <div>{row?.original?.rewardTarget || '-'}</div>;
      },
    },
    {
      id: 'amount',
      header: t('marketing.rewardRecords.amount'),
      cell: ({ row }) => {
        return <div>{row?.original?.amount || '-'}</div>;
      },
    },
    {
      id: 'createBy',
      header: t('common.system'),
      cell: ({ row }) => {
        return <div>{row?.original?.createBy || '-'}</div>;
      },
    },
    {
      id: 'status',
      header: t('common.status'),
      cell: ({ row }) => {
        const typeMap: Record<number | string, 'error' | 'success' | 'warning' | 'info'> = {
          0: 'warning',
          1: 'success',
          '-1': 'info',
          2: 'error',
        };
        return (
          <RrhTag type={typeMap[row?.original?.status]}>
            {t(`table.${depositRebateStatusMap[row?.original?.status]}`)}
          </RrhTag>
        );
      },
    },
    {
      id: 'createTime',
      header: t('common.createTime'),
      cell: ({ row }) => {
        return <div>{row?.original?.createTime || '-'}</div>;
      },
    },
    {
      id: 'updateTime',
      header: t('table.updateTime'),
      cell: ({ row }) => {
        return <div>{row?.original?.updateTime || '-'}</div>;
      },
    },
    {
      id: 'lockStatus',
      header: t('marketing.rewardRecords.lockStatus'),
      cell: ({ row }) => {
        return <div>{row?.original?.lockStatus || '-'}</div>;
      },
    },
    {
      id: 'unlockAmount',
      header: t('table.unlockAmount'),
      cell: ({ row }) => {
        return <div>{row?.original?.unlockAmount || '-'}</div>;
      },
    },
    {
      id: 'unlockTime',
      header: t('table.unlockTime'),
      cell: ({ row }) => {
        return <div>{row?.original?.unlockTime || '-'}</div>;
      },
    },
    {
      id: 'operation',
      header: t('common.Operation'),
      cell: () => (
        <div>
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('common.View'), value: 'view' },
              { label: t('common.Edit'), value: 'edit' },
            ]}
            callToAction={action => {
              if (action === 'edit') {
                // Handle edit action
              } else if (action === 'view') {
                // Handle view action
              }
            }}
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
