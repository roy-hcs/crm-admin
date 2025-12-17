import { PammCommissionItem } from '@/api/hooks/pamm/type';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { DataTable } from '@/components/table/DataTable';
import { commissionReviewOptions, settlementTypeOptions } from '@/lib/const';
import { serverMap } from '@/lib/constant';
import { ColumnDef } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

export const ProfitSharingReviewTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  CustomRow,
}: {
  data: PammCommissionItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  CustomRow: ReactElement;
}) => {
  const { t } = useTranslation();
  const columns: ColumnDef<PammCommissionItem>[] = [
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'serverName',
      header: t('table.server'),
      cell: ({ row }) => {
        return (
          <div>
            {row?.original?.serverName}
            <span> {serverMap[row?.original?.serverType] || ''}</span>
          </div>
        );
      },
    },
    {
      id: 'projectName',
      header: t('table.projectName'),
      cell: ({ row }) => row?.original?.projectName || '-',
    },
    {
      id: 'customerName',
      header: t('table.customerName'),
      cell: ({ row }) => row?.original?.customerName || '-',
    },

    {
      id: 'orderNo',
      header: t('table.orderNumber'),
      cell: ({ row }) => row?.original?.orderNo || '-',
    },
    {
      id: 'settlementType',
      header: t('profitSharingReview.settlementType'),
      cell: ({ row }) => {
        const text = settlementTypeOptions.find(
          res => res.value === String(row?.original?.settlementType),
        );
        return text?.label ? t(text.label) : '-';
      },
    },
    {
      id: 'businessAmount',
      header: t('profitSharingReview.businessAmount'),
      cell: ({ row }) => {
        return (row?.original?.businessAmount || '0') + row?.original?.currency || '';
      },
    },
    {
      id: 'rewardAmount',
      header: t('profitSharingReview.rewardAmount'),
      cell: ({ row }) => {
        return (row?.original?.rewardAmount || '0') + row?.original?.currency || '';
      },
    },
    {
      id: 'performanceReward',
      header: t('profitSharingReview.performanceReward'),
      cell: ({ row }) => {
        return (row?.original?.performanceReward || '0') + '%';
      },
    },
    {
      id: 'commission',
      header: t('profitSharingReview.commission'),
      cell: ({ row }) => {
        return (row?.original?.commission || '0') + row?.original?.currency || '';
      },
    },
    {
      id: 'verifyStatus',
      header: t('common.status'),
      cell: ({ row }) => {
        const text = commissionReviewOptions.find(
          res => res.value === String(row?.original?.verifyStatus),
        );
        return text?.label ? t(text.label) : '-';
      },
    },
    {
      id: 'submitTime',
      header: t('table.submitTime'),
      cell: ({ row }) => row?.original?.submitTime || '-',
    },
    {
      id: 'verifyUser',
      header: t('table.verifyUser'),
      cell: ({ row }) => row?.original?.verifyUser || '-',
    },
    {
      id: 'verifyTime',
      header: t('table.verifyTime'),
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
      CustomRow={CustomRow}
    />
  );
};
