import { AdminOperLogItem, DictTypeItem } from '@/api/hooks/system/types';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { RrhTag } from '@/components/common/RrhTag';
import { DataTable } from '@/components/table/DataTable';
import { adminOperationsStatusOptions } from '@/lib/const';
import { ColumnDef } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AdminOperationsTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  operTypeList,
}: {
  data: AdminOperLogItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  operTypeList: DictTypeItem[];
}) => {
  const { t } = useTranslation();

  const columns: ColumnDef<AdminOperLogItem>[] = [
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row?.original?.operId}</div>,
    },
    {
      id: 'title',
      header: t('system.adminOperations.systemModule'),
      cell: ({ row }) => {
        return <div>{row?.original?.title || '-'}</div>;
      },
    },
    {
      id: 'operatorType',
      header: t('common.operType'),
      cell: ({ row }) => {
        const operType = operTypeList.find(
          i => i.dictValue === String(row?.original?.operatorType),
        );
        return <div>{operType ? operType.dictLabel : '-'}</div>;
      },
    },
    {
      id: 'operObject',
      header: t('common.operObject'),
      cell: ({ row }) => {
        return <div>{row?.original?.operObject || '-'}</div>;
      },
    },
    {
      id: 'operName',
      header: t('common.operName'),
      cell: ({ row }) => {
        return <div>{row?.original?.operName || '-'}</div>;
      },
    },
    {
      id: 'status',
      header: t('common.operStatus'),
      accessorFn: row => row.status,
      cell: ({ row }) => {
        const typeMap: Record<number, 'error' | 'success' | 'warning' | 'info'> = {
          1: 'error',
          0: 'success',
        };
        const status = Number(row.original.status);
        const text =
          adminOperationsStatusOptions.find(it => Number(it.value) === status)?.label || '';
        return <RrhTag type={typeMap[status]}>{t(text)}</RrhTag>;
      },
    },
    {
      id: 'operIp',
      header: t('common.operIp'),
      cell: ({ row }) => {
        return <div>{row?.original?.operIp || '-'}</div>;
      },
    },
    {
      id: 'operLocation',
      header: t('common.operLocation'),
      cell: ({ row }) => {
        return <div>{row?.original?.operLocation || '-'}</div>;
      },
    },
    {
      id: 'operTime',
      header: t('common.operTime'),
      cell: ({ row }) => {
        return <div>{row?.original?.operTime || '-'}</div>;
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
