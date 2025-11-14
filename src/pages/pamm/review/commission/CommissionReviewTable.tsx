import { PammCommissionItem } from '@/api/hooks/pamm/type';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { DataTable } from '@/components/table/DataTable';
import { commissionReviewOptions } from '@/lib/const';
import { serverMap } from '@/lib/constant';
import { ColumnDef } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

export const CommissionReviewTable = ({
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
      id: 'serverName',
      header: t('table.server'),
      cell: ({ row }) => {
        return (
          <div>
            {row?.original?.serverName + ' ' + row?.original?.serverType && (
              <span> {serverMap[row?.original?.serverType] || ''}</span>
            )}
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
      id: 'businessAmount',
      header: t('table.amount'),
      cell: ({ row }) => {
        return (row?.original?.businessAmount || '0') + row?.original?.currency || '';
      },
    },
    {
      id: 'orderNo',
      header: t('table.orderNumber'),
      cell: ({ row }) => row?.original?.orderNo || '-',
    },
    {
      id: 'commission',
      header: t('commissionReview.commission'),
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
