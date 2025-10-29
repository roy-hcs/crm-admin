import { CrmLogininforItem } from '@/api/hooks/system/types';
import { RrhTag } from '@/components/common/RrhTag';
import { DataTable } from '@/components/table/DataTable';
import { adminOperationsStatusOptions } from '@/lib/const';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

export const CrmUserLoginTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: CrmLogininforItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();

  const columns: ColumnDef<CrmLogininforItem>[] = [
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'loginName',
      header: t('system.adminLogin.name'),
      cell: ({ row }) => {
        if (row.original?.loginName) {
          return <div>{row.original.loginName}</div>;
        } else {
          return <div className="text-center">-</div>;
        }
      },
    },
    {
      id: 'operIp',
      header: t('common.operIp'),
      cell: ({ row }) => {
        return <div>{row?.original?.ipaddr || '-'}</div>;
      },
    },
    {
      id: 'operLocation',
      header: t('common.operLocation'),
      cell: ({ row }) => {
        return <div>{row?.original?.loginLocation || '-'}</div>;
      },
    },
    {
      id: 'operTime',
      header: t('common.operTime'),
      cell: ({ row }) => {
        return <div>{row?.original?.loginTime || '-'}</div>;
      },
    },
    {
      id: 'status',
      header: t('table.status'),
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
      id: 'browser',
      header: t('system.adminLogin.browser'),
      cell: ({ row }) => {
        return <div>{row?.original?.browser || '-'}</div>;
      },
    },
    {
      id: 'os',
      header: t('system.adminLogin.os'),
      cell: ({ row }) => {
        return <div>{row?.original?.os || '-'}</div>;
      },
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
