import { ProductReviewItem } from '@/api/hooks/pamm/type';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { RrhTag } from '@/components/common/RrhTag';
import { DataTable } from '@/components/table/DataTable';
import { commissionReviewOptions } from '@/lib/const';
import { ColumnDef } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ProductReviewTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: ProductReviewItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const columns: ColumnDef<ProductReviewItem>[] = [
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'createBy',
      header: t('productReview.investmentManager'),
      cell: ({ row }) => row?.original?.createBy || '-',
    },
    {
      id: 'projectName',
      header: t('table.projectName'),
      cell: ({ row }) => row?.original?.projectName || '-',
    },
    {
      id: 'model',
      header: t('productReview.model'),
      cell: ({ row }) => {
        if ([2].includes(row?.original?.model || 0)) {
          return t(`productReview.modelOptions.${row?.original?.model}`);
        }
        return '-';
      },
    },
    {
      id: 'login',
      header: t('table.login'),
      cell: ({ row }) => row?.original?.login || '-',
    },
    {
      id: 'applyStatus',
      header: t('common.status'),
      cell: ({ row }) => {
        const typeMap: Record<number | string, 'error' | 'success' | 'warning' | 'info'> = {
          0: 'warning',
          1: 'success',
          2: 'error',
        };
        const text = commissionReviewOptions.find(
          res => res.value === String(row?.original?.applyStatus),
        );
        return (
          <RrhTag type={typeMap[row?.original?.applyStatus || 0]}>
            {text?.label ? t(text.label) : '-'}
          </RrhTag>
        );
      },
    },
    {
      id: 'createTime',
      header: t('table.submitTime'),
      cell: ({ row }) => row?.original?.createTime || '-',
    },
    {
      id: 'verifyBy',
      header: t('table.verifyUser'),
      cell: ({ row }) => row?.original?.verifyBy || '-',
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
    />
  );
};
