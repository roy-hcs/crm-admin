import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Ellipsis, Funnel, Plus, RefreshCcw, Search, Settings } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRoleList, useUserList, UserListParams, UserItem } from '@/api/hooks/system';
import { CRMColumnDef, DataTable } from '@/components/table';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/types';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { useTabActions } from '@/hooks/useTabActions';
import { AddUserDialog } from '../account/AddUserDialog';
import { AddTemporaryAdminDialog } from '../account/AddTemporaryAdminDialog';
import { TemporaryAccountForm } from './TemporaryAccountForm';

export const TemporaryAccountPage = () => {
  const [params, setParams] = useState<UserListParams['params']>({
    beginTime: '',
    endTime: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<UserListParams, 'params' | keyof BasicParams>
  >({
    roleId: '',
    email: '',
  });
  const [open, setOpen] = useState(false);
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [resetKey, setResetKey] = useState(0);
  const { t } = useTranslation();

  const { data: roleList } = useRoleList();
  const {
    data: accountList,
    isLoading: accountListLoading,
    refetch,
  } = useUserList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'desc',
    ...otherParams,
    userType: '1',
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
      email: '',
      roleId: '',
    });
    setResetKey(k => k + 1);
    setPageNum(0);
  };
  const allColumns: CRMColumnDef<UserItem, unknown>[] = [
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'email',
      header: t('table.email'),
      cell: ({ row }) => row?.original?.email || '-',
    },
    {
      id: 'roleName',
      header: t('adminAccounts.roleName'),
      cell: ({ row }) => row.original?.roles?.[0]?.roleName || '-',
    },
    {
      id: 'status',
      header: t('table.status'),
      cell: ({ row }) =>
        Number(row.original.status) === 0 ? t('adminAccounts.expired') : t('adminAccounts.valid'),
    },
    {
      id: 'onlineStatus',
      header: t('adminAccounts.onlineStatus'),
      cell: ({ row }) =>
        row.original?.onlineStatus === 1
          ? t('common.onlineStatus.online')
          : t('common.onlineStatus.offline'),
    },
    {
      id: 'loginIp',
      header: t('common.ip'),
      cell: ({ row }) => row.original?.loginIp || '-',
    },
    {
      id: 'createTime',
      header: t('common.createTime'),
      cell: ({ row }) => row?.original?.createTime || '-',
    },
    {
      id: 'expiryTime',
      header: t('table.expireTime'),
      cell: ({ row }) => row?.original?.createTime || '-',
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('admin-temporary-account-table', allColumns);

  const { openTab } = useTabActions();

  const openIpWhiteList = useCallback(() => {
    const url = `/system/admin-accounts/ip-whitelist`;
    openTab({
      key: url,
      title: t('ipWhiteList.title'),
      path: url,
    });
  }, [openTab, t]);

  const roleListOptions = (roleList?.rows || []).map(i => ({ label: i.roleName, value: i.roleId }));

  return (
    <TableContentWrapper>
      <div className="mb-3 flex items-center justify-between">
        <RrhInputWithIcon
          key={resetKey}
          placeholder={t('common.pleaseInput', { field: t('table.email') })}
          className="h-9"
          leftIcon={<Search className="size-4 cursor-pointer" />}
          onLeftIconClick={e => {
            setOtherParams(prev => ({ ...prev, email: e }));
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
            <TemporaryAccountForm
              params={params}
              otherParams={otherParams}
              setParams={setParams}
              setOtherParams={setOtherParams}
              loading={accountListLoading}
              roleList={roleListOptions}
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
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              {
                label: (
                  <RrhButton variant="ghost" className="flex w-full items-center justify-start">
                    <Plus className="size-4" />
                    <span>{t('adminAccounts.temporaryAdmin')}</span>
                  </RrhButton>
                ),
                value: 'temporaryAdmin',
              },
              {
                label: (
                  <RrhButton variant="ghost" className="flex w-full items-center justify-start">
                    <Settings className="size-4" />
                    <span>{t('ipWhiteList.title')}</span>
                  </RrhButton>
                ),
                value: 'ipWhiteList',
              },
            ]}
            callToAction={action => {
              console.log(action, 'action');
              if (action === 'temporaryAdmin') {
                setOpen(true);
              } else if (action === 'ipWhiteList') {
                openIpWhiteList();
              }
            }}
          />
          <AddUserDialog mode="add" onSuccess={refetch} roleList={roleListOptions} />
        </div>
      </div>
      <DataTable
        columns={tableColumns}
        data={accountList?.rows || []}
        pageCount={Math.ceil(+(accountList?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={accountListLoading}
      />
      <AddTemporaryAdminDialog
        onSuccess={refetch}
        roleList={roleListOptions}
        open={open}
        setOpen={setOpen}
      />
    </TableContentWrapper>
  );
};
