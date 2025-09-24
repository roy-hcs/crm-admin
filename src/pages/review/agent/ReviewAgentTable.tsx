import { AgentApplyItem } from '@/api/hooks/review/types';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhTag } from '@/components/common/RrhTag';
import { DataTable } from '@/components/table/DataTable';
import { applySourceMap, reviewStatusMap } from '@/lib/constant';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

export const ReviewAgentTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: AgentApplyItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const limitOrderColumns: ColumnDef<AgentApplyItem>[] = [
    {
      id: 'No.',
      header: t('CRMAccountPage.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'userName',
      header: t('CRMAccountPage.UserName'),
      cell: ({ row }) => (
        <div>
          {row.original.lastName} {row.original.name}
        </div>
      ),
    },
    {
      id: 'email',
      header: t('table.email'),
      accessorFn: row => row.email,
    },
    {
      id: 'applySource',
      header: t('table.applySource'),
      accessorFn: row =>
        applySourceMap[row.applySource as keyof typeof applySourceMap] || row.applySource,
    },
    {
      id: 'status',
      header: t('table.status'),
      accessorFn: row => row.verifyStatus,
      cell: ({ row }) => {
        const typeMap: Record<number, 'error' | 'success' | 'warning' | 'info'> = {
          0: 'error',
          1: 'success',
          2: 'warning',
          3: 'info',
        };
        return (
          <RrhTag type={typeMap[row.original.verifyStatus]}>
            {t(`table.${reviewStatusMap[row.original.verifyStatus]}`)}
          </RrhTag>
        );
      },
    },
    {
      id: 'submitTime',
      header: t('table.submitTime'),
      accessorFn: row => row.createTime,
    },
    {
      id: 'currentAuditor',
      header: t('table.currentAuditor'),
      accessorFn: row => row.verifyUserName,
    },
    {
      id: 'finishTime',
      header: t('table.finishTime'),
      accessorFn: row => row.verifyTime,
      cell: ({ row }) => <div>{row.original.verifyTime || '-'}</div>,
    },
    {
      id: 'operate',
      header: t('common.Operation'),
      cell: ({ row }) => {
        // TODO: need to add view detail page later
        return (
          <RrhButton variant="ghost">
            {[0, 1].includes(row.original.verifyStatus) ? t('common.View') : t('table.audit')}
          </RrhButton>
        );
      },
    },
  ];
  return (
    <DataTable
      columns={limitOrderColumns}
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
