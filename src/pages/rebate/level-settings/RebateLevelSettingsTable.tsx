import { RebateLevelItem } from '@/api/hooks/rebate';
import { RrhButton } from '@/components/common/RrhButton';
import { DataTable } from '@/components/table/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

export const RebateLevelSettingsTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: RebateLevelItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const columns: ColumnDef<RebateLevelItem>[] = [
    {
      id: 'No.',
      header: t('ib.overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'level',
      header: t('table.level'),
      accessorFn: row => row.level || '-',
    },
    {
      id: 'levelName',
      header: t('table.levelName'),
      accessorFn: row => row.levelName || '-',
    },
    // TODO:之后的三项都有点击弹窗的交互
    {
      id: 'relatedAccountCount',
      header: t('table.relatedAccountCount'),
      accessorFn: row => row.relatedAccountCount || '-',
    },
    {
      id: 'relatedRebateRuleCount',
      header: t('table.relatedRebateRuleCount'),
      accessorFn: row => row.relatedRebateRuleCount || '-',
    },
    {
      id: 'relatedRebateTemplateCount',
      header: t('table.relatedRebateTemplateCount'),
      accessorFn: row => row.relatedRebateTemplateCount || '-',
    },
    {
      id: 'operation',
      header: () => <div className="text-center">{t('common.Operation')}</div>,
      cell: () => (
        <div className="flex justify-center">
          <RrhButton variant="ghost">{t('common.Edit')}</RrhButton>
          <RrhButton variant="ghost">{t('common.delete')}</RrhButton>
        </div>
      ),
    },
  ];
  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      pageIndex={pageIndex}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      loading={loading}
    />
  );
};
