import { RoleItem } from '@/api/hooks/system/types';
import { RrhButton } from '@/components/common/RrhButton';
import { DataTable } from '@/components/table/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

export const RolesTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: RoleItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const rolesColumns: ColumnDef<RoleItem>[] = [
    {
      id: 'No.',
      header: t('CRMAccountPage.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'accountRole',
      header: t('table.accountRole'),
      cell: ({ row }) => <div>{row.original.roleName}</div>,
    },
    {
      id: 'roleDescription',
      header: t('table.roleDescription'),
      accessorFn: row => row.roleDescribe,
    },
    {
      id: 'accountsNumber',
      header: t('table.accountsNumber'),
      accessorFn: row => row.userCount,
    },
    {
      id: 'source',
      header: t('table.source'),
      cell: ({ row }) => {
        return row.original.roleSource === 0 ? (
          <div>{t('table.systemDefault')}</div>
        ) : (
          <div>{t('table.custom')}</div>
        );
      },
    },
    {
      id: 'operate',
      header: t('common.Operation'),
      cell: ({ row }) => {
        // TODO: need to add view detail page later
        if (row.original.roleId === '1') {
          return (
            <RrhButton variant="ghost" disabled>
              {t('common.View')}
            </RrhButton>
          );
        } else {
          return (
            <div>
              <RrhButton variant="ghost">{t('common.Edit')}</RrhButton>
              <RrhButton variant="ghost">{t('common.delete')}</RrhButton>
            </div>
          );
        }
      },
    },
  ];
  return (
    <DataTable
      columns={rolesColumns}
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
