import { RebateBasePointItem } from '@/api/hooks/rebate';
import { RrhButton } from '@/components/common/RrhButton';
import { ToolTip } from '@/components/common/ToolTip';
import { DataTable } from '@/components/table/DataTable';
import { serverMap } from '@/lib/constant';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

export const PipValueTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: RebateBasePointItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const Columns: ColumnDef<RebateBasePointItem>[] = [
    {
      id: 'serialNumber',
      header: t('table.sort'),
      accessorFn: row => row.serialNumber,
    },
    {
      id: 'No.',
      header: t('ib.overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
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
      header: t('table.serverName'),
      accessorFn: row => row.serverName || '-',
    },
    {
      id: 'rebateType',
      header: t('table.rebateType'),
      cell: ({ row }) => {
        const exceedLength = row.original.rebateType.length > 20;
        const content = exceedLength
          ? row.original.rebateType.slice(0, 20) + '...'
          : row.original.rebateType;
        return exceedLength ? (
          <ToolTip
            maxWidth="800px"
            content={<div className="break-all">{row.original.rebateType}</div>}
          >
            <div>{content}</div>
          </ToolTip>
        ) : (
          <div>{content}</div>
        );
      },
    },
    {
      id: 'pointValueType',
      header: t('table.pointValueType'),
      cell: ({ row }) => {
        return (
          <div>
            {row.original.pointValueType === 1
              ? t('table.fixedPipValue')
              : t('table.floatingPipValue')}
          </div>
        );
      },
    },
    {
      id: 'pointValue',
      header: t('table.pointValue'),
      cell: ({ row }) => {
        const rowData = row.original;
        if (rowData.pointValueType === 1) {
          return <div>{rowData.pointValue}</div>;
        } else if (rowData.pointValueType === 2) {
          return (
            <div>
              <span>{rowData.pointValueLots}</span>
              <span>*</span>
              <span>
                {rowData.pointValueRules === 2
                  ? t('common.contractSize')
                  : t('common.contractNumber')}
              </span>
            </div>
          );
        }
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
      columns={Columns}
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
