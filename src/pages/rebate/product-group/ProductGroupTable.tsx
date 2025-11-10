import { RebateBaseTypeItem } from '@/api/hooks/rebate';
import { RrhButton } from '@/components/common/RrhButton';
import { ToolTip } from '@/components/common/ToolTip';
import { DataTable } from '@/components/table/DataTable';
import { serverMap } from '@/lib/constant';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

export const ProductGroupTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: RebateBaseTypeItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const columns: ColumnDef<RebateBaseTypeItem>[] = [
    {
      id: 'No.',
      header: t('ib.overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'typeGroupName',
      header: t('table.typeGroup'),
      accessorFn: row => row.typeGroupName || '-',
    },
    {
      id: 'serverType',
      header: t('table.transactionPlatform'),
      cell: ({ row }) => {
        return row.original.serverType ? serverMap[row.original.serverType] : '-';
      },
    },
    {
      id: 'serverName',
      header: t('table.server'),
      accessorFn: row => row.serverName || '-',
    },
    {
      id: 'typeName',
      header: t('table.rebateType'),
      cell: ({ row }) => {
        const exceedLength = row.original.typeName.length > 50;
        const content = exceedLength
          ? row.original.typeName.slice(0, 50) + '...'
          : row.original.typeName;
        return exceedLength ? (
          <ToolTip
            maxWidth="800px"
            content={<div className="break-all">{row.original.typeName}</div>}
          >
            <div>{content}</div>
          </ToolTip>
        ) : (
          <div>{content}</div>
        );
      },
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
