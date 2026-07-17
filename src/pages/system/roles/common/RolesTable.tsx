import { RoleItem } from '@/api/hooks/system';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { CRMColumnDef, DataTable } from '@/components/table/DataTable';
import { Ellipsis } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const RolesTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  handleEdit,
  handleView,
  handleDelete,
}: {
  data: RoleItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  handleEdit: (role: RoleItem) => void;
  handleView: (role: RoleItem) => void;
  handleDelete: (role: RoleItem) => void;
}) => {
  const { t } = useTranslation();

  const rolesColumns: CRMColumnDef<RoleItem, unknown>[] = useMemo(() => {
    return [
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
        header: () => {
          return <div className="flex justify-center">{t('common.Operation')}</div>;
        },
        cell: ({ row }) => {
          if (row.original.roleSource === 0) {
            return <div onClick={() => handleView(row.original)}>{t('common.View')}</div>;
          } else {
            return (
              <RrhDropdown
                Trigger={<Ellipsis className="size-4" />}
                dropdownList={[
                  { label: t('common.Edit'), value: 'edit' },
                  { label: t('common.delete'), value: 'delete' },
                ]}
                callToAction={action => {
                  if (action === 'edit') {
                    handleEdit(row.original);
                  } else {
                    handleDelete(row.original);
                  }
                }}
              />
            );
          }
        },
        fixed: 'right',
        size: 50,
      },
    ];
  }, [handleDelete, handleEdit, handleView, t]);
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
    />
  );
};
