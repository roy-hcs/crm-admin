import { PammAuditLogItem } from '@/api/hooks/pamm/type';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { DataTable } from '@/components/table/DataTable';
import { InvestmentReviewOperTypeOptions, InvestmentReviewStatusOptions } from '@/lib/const';
import { ColumnDef } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

export const InvestmentReviewTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  CustomRow,
}: {
  data: PammAuditLogItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  CustomRow: ReactElement;
}) => {
  const { t } = useTranslation();
  const columns: ColumnDef<PammAuditLogItem>[] = [
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'projectName',
      header: t('table.projectName'),
      cell: ({ row }) => row?.original?.projectName || '-',
    },
    {
      id: 'investor',
      header: t('table.customerName'),
      cell: ({ row }) => row?.original?.investor || '-',
    },
    {
      id: 'operType',
      header: t('investmentReview.operType'),
      cell: ({ row }) => {
        const text = InvestmentReviewOperTypeOptions.find(
          res => res.value === String(row?.original?.operType),
        );
        return text?.label ? t(text.label) : '-';
      },
    },
    {
      id: 'auditStatus',
      header: t('common.status'),
      cell: ({ row }) => {
        const text = InvestmentReviewStatusOptions.find(
          res => res.value === String(row?.original?.auditStatus),
        );
        return text?.label ? t(text.label) : '-';
      },
    },
    {
      id: 'amount',
      header: t('table.amount'),
      cell: ({ row }) => {
        return (row?.original?.amount || '0') + (row?.original?.currency || '');
      },
    },
    {
      id: 'createTime',
      header: t('table.submitTime'),
      cell: ({ row }) => row?.original?.createTime || '-',
    },
    {
      id: 'auditor',
      header: t('table.verifyUser'),
      cell: ({ row }) => row?.original?.auditor || '-',
    },
    {
      id: 'auditTime',
      header: t('table.verifyTime'),
      cell: ({ row }) => row?.original?.auditTime || '-',
    },
    {
      id: 'orderNo',
      header: t('table.orderNumber'),
      cell: ({ row }) => row?.original?.orderNo || '-',
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
      CustomRow={CustomRow}
    />
  );
};
