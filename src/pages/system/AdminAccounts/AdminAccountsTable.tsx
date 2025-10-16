import { UserItem } from '@/api/hooks/system/types';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { CRMColumnDef, DataTable } from '@/components/table/DataTable';
import { Switch } from '@/components/ui/switch';
import { ColumnDef } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AdminAccountsTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: UserItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();

  const baseColumns: ColumnDef<UserItem>[] = [
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'name',
      header: t('table.fullName'),
      cell: ({ row }) => {
        return !row.original.wholeName ? (
          <div className="text-center">-</div>
        ) : (
          <div>{row.original.wholeName}</div>
        );
      },
    },
    {
      id: 'roleName',
      header: t('system.adminAccounts.roleName'),
      cell: ({ row }) => {
        return !row.original?.roles?.[0]?.roleName ? (
          <div className="text-center">-</div>
        ) : (
          <div>{row.original?.roles?.[0]?.roleName}</div>
        );
      },
    },
    {
      id: 'onlineStatus',
      header: t('system.adminAccounts.roleName'),
      cell: ({ row }) => {
        if (row.original?.onlineStatus === 1) {
          return <div>{t('common.onlineStatus.online')}</div>;
        } else {
          return <div>{t('common.onlineStatus.offline')}</div>;
        }
      },
    },
    {
      id: 'loginIp',
      header: t('common.ip'),
      cell: ({ row }) => {
        if (row.original?.loginIp) {
          return <div>{row.original.loginIp}</div>;
        } else {
          return <div className="text-center">-</div>;
        }
      },
    },
    {
      id: 'status',
      header: t('common.status'),
      cell: ({ row }) => {
        return (
          <Switch
            className="cursor-pointer bg-white data-[state=checked]:bg-slate-700"
            checked={Number(row.original.status) === 1}
            onClick={() => {}}
          />
        );
      },
    },
    {
      id: 'phonenumber',
      header: t('table.mobile'),
      cell: ({ row }) => {
        if (row.original?.phonenumber) {
          return (
            <div>
              {row?.original?.mzone
                ? '+' + row?.original?.mzone + ' ' + row.original.phonenumber
                : row.original.phonenumber}
            </div>
          );
        } else {
          return <div>-</div>;
        }
      },
    },
    {
      id: 'email',
      header: t('table.email'),
      cell: ({ row }) => {
        if (row.original?.email) {
          return <div>{row?.original?.email}</div>;
        } else {
          return <div>-</div>;
        }
      },
    },
    {
      id: 'createTime',
      header: t('common.createTime'),
      cell: ({ row }) => {
        if (row.original?.createTime) {
          return <div>{row?.original?.createTime}</div>;
        } else {
          return <div>-</div>;
        }
      },
    },
    {
      id: 'boundGoogle',
      header: t('common.boundGoogle'),
      cell: ({ row }) => {
        if (row.original?.boundGoogle === 1) {
          return <div>{t('common.bind')}</div>;
        } else {
          return <div>{t('common.notBind')}</div>;
        }
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

  const columns = [...baseColumns];

  return (
    <DataTable
      columns={columns as CRMColumnDef<UserItem, unknown>[]}
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
