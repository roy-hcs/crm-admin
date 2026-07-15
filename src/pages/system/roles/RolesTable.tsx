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
  const rolesColumns = useMemo<CRMColumnDef<RoleItem, unknown>[]>(
    () => [
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
          // TODO: need to add view detail page later
          if (row.original.roleId === '1') {
            return (
              <RrhDropdown
                Trigger={<Ellipsis className="size-4" />}
                dropdownList={[{ label: t('common.View'), value: 'view' }]}
                callToAction={() => {}}
              />
            );
          } else {
            return (
              <RrhDropdown
                Trigger={<Ellipsis className="size-4" />}
                dropdownList={[
                  { label: t('common.View'), value: 'view' },
                  { label: t('common.delete'), value: 'delete' },
                ]}
                callToAction={() => {}}
              />
            );
          }
        },
        fixed: 'right',
        size: 50,
      },
    ],
    [t],
  );
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
