import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Ellipsis, Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminAccountsForm } from './AdminAccountsForm';
import { useRoleList, useUserList, UserListParams, UserItem } from '@/api/hooks/system';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { Switch } from '@/components/ui/switch';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/types';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

export const AdminAccountsPage = () => {
  const [params, setParams] = useState<UserListParams['params']>({
    beginTime: '',
    endTime: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<UserListParams, 'params' | keyof BasicParams>
  >({
    userName: '',
    roleId: '',
    status: '',
    phonenumber: '',
    email: '',
    onlineStatus: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const { t } = useTranslation();
  const { data: roleList } = useRoleList();
  const { data: walletBalanceList, isLoading: walletBalanceListLoading } = useUserList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
    params: {
      ...params,
    },
  });

  const reset = () => {
    setParams(pre => ({
      ...pre,
      beginTime: '',
      endTime: '',
    }));
    setOtherParams({
      userName: '',
      roleId: '',
      status: '',
      phonenumber: '',
      email: '',
      onlineStatus: '',
    });
    setKeyword('');
    setPageNum(0);
  };
  const allColumns: CRMColumnDef<UserItem, unknown>[] = [
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
      header: t('adminAccounts.roleName'),
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
      header: t('adminAccounts.roleName'),
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
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
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
      fixed: 'right',
      size: 50,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('admin-accounts-table', allColumns);

  return (
    <div>
      <PageInfo title={t('adminAccounts.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex items-center justify-between">
          <RrhInputWithIcon
            placeholder={t('common.pleaseInput', { field: t('table.fullName') })}
            className="h-9"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            leftIcon={<Search className="size-4 cursor-pointer" />}
            onLeftIconClick={e => {
              setParams(prev => ({ ...prev, userName: e }));
              setPageNum(0);
            }}
          />
          <div className="flex justify-end gap-2">
            <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
              <RefreshCcw className="size-3.5" />
            </RrhButton>
            <RrhDrawer
              headerShow={false}
              asChild
              responsiveDirection={{
                mobile: 'bottom',
                desktop: 'right',
              }}
              footerShow={false}
              Trigger={
                <RrhButton variant="ghost" className="size-8">
                  <Funnel />
                </RrhButton>
              }
            >
              <AdminAccountsForm
                params={params}
                otherParams={otherParams}
                setParams={setParams}
                setOtherParams={setOtherParams}
                loading={walletBalanceListLoading}
                roleList={roleList?.rows || []}
                reset={reset}
              />
            </RrhDrawer>
            <ColumnVisibilityButton
              columnMeta={columnMeta}
              visibleColumns={visibleColumns}
              onToggle={toggleColumn}
              onBatchReorder={batchUpdateColumns}
              columns={columns}
            />
          </div>
        </div>
        <DataTable
          columns={tableColumns}
          data={walletBalanceList?.rows || []}
          pageCount={Math.ceil(+(walletBalanceList?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={walletBalanceListLoading}
        />
      </TableContentWrapper>
    </div>
  );
};
