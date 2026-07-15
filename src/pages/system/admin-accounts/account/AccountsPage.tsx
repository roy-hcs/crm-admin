import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Ellipsis, Funnel, Plus, RefreshCcw, Search, Settings } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountsForm } from './AccountsForm';
import { useRoleList, useUserList, UserListParams, UserItem } from '@/api/hooks/system';
import { CRMColumnDef, DataTable } from '@/components/table';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/types';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { useTabActions } from '@/hooks/useTabActions';
import { RrhStatusAlert } from '@/components/common/RrhStatusAlert';
import {
  useChangeUserStatus,
  useDeleteUser,
  useForceLogoutUser,
  useUnbindGoogleUser,
} from '@/api/hooks/system/system';
import { AddUserDialog } from './AddUserDialog';
import { AddTemporaryAdminDialog } from './AddTemporaryAdminDialog';
import { ResetPwdDialog } from './ResetPwdDialog';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';

type ActionDialogKey = 'none' | 'editUser' | 'resetPwd' | 'delete' | 'unbindGoogle' | 'forceLogout';

export const AccountsPage = () => {
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
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('edit');
  const [actionDialog, setActionDialog] = useState<ActionDialogKey>('none');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [resetKey, setResetKey] = useState(0);
  const [selectedUser, setSelectedUser] = useState<UserItem | undefined>(undefined);
  const { t } = useTranslation();
  const selectedUserId = String(selectedUser?.userId || '');

  const { mutateAsync: modifyStatus } = useChangeUserStatus();
  const { mutateAsync: deleteUser } = useDeleteUser();
  const { mutateAsync: forceLogoutUser } = useForceLogoutUser();
  const { mutateAsync: unbindGoogleUser } = useUnbindGoogleUser();

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
    userType: '0',
    params: {
      ...params,
    },
  });

  const openActionDialog = useCallback(
    (dialog: ActionDialogKey, user: UserItem, dialogMode?: 'edit' | 'view') => {
      setSelectedUser(user);
      if (dialogMode) {
        setMode(dialogMode);
      }
      setActionDialog(dialog);
    },
    [],
  );

  const closeActionDialog = useCallback(() => {
    setActionDialog('none');
    setSelectedUser(undefined);
    setMode('edit');
  }, []);

  const handleActionDialogOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        closeActionDialog();
      }
    },
    [closeActionDialog],
  );

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
    setResetKey(k => k + 1);
    setPageNum(0);
  };
  const allColumns = useMemo<CRMColumnDef<UserItem, unknown>[]>(
    () => [
      {
        id: 'No',
        header: t('table.index'),
        cell: ({ row }) => <div>{row.index + 1}</div>,
      },
      {
        id: 'name',
        header: t('table.fullName'),
        cell: ({ row }) => row.original.wholeName || '-',
      },
      {
        id: 'roleName',
        header: t('adminAccounts.roleName'),
        cell: ({ row }) => row.original?.roles?.[0]?.roleName || '-',
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
        cell: ({ row }) => row.original.loginIp || '-',
      },
      {
        id: 'status',
        header: t('table.status'),
        cell: ({ row }) => {
          return (
            <RrhStatusAlert<{
              userId: string;
              status: number;
            }>
              params={{
                userId: String(row.original.userId),
                status: Number(row.original.status) === 1 ? 0 : 1,
              }}
              tipsText={
                Number(row.original.status) === 1
                  ? t('CRMAccountPage.ConfirmDisableAccount')
                  : t('CRMAccountPage.ConfirmEnableAccount')
              }
              checked={Number(row.original.status) === 1}
              confirmFunction={modifyStatus}
              onSuccess={refetch}
              disabled={Number(row.original?.userId) === 1}
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
        cell: ({ row }) => row.original?.email || '-',
      },
      {
        id: 'createTime',
        header: t('common.createTime'),
        cell: ({ row }) => row.original?.createTime || '-',
      },
      {
        id: 'boundGoogle',
        header: t('common.boundGoogle'),
        cell: ({ row }) =>
          row.original?.boundGoogle === 1 ? t('common.bind') : t('common.notBind'),
      },
      {
        id: 'operation',
        header: () => {
          return <div className="flex justify-center">{t('common.Operation')}</div>;
        },
        cell: ({ row }) => {
          if (Number(row.original?.userId) !== 1) {
            return (
              <RrhDropdown
                Trigger={<Ellipsis className="size-4" />}
                dropdownList={[
                  { label: t('common.Edit'), value: 'edit' },
                  { label: t('common.resetPassword'), value: 'resetPwd' },
                  { label: t('common.delete'), value: 'delete' },
                  {
                    label: t('adminAccounts.unBindGoogle'),
                    value: 'unbindGoogle',
                    disabled: row.original?.boundGoogle !== 1,
                  },
                  {
                    label: t('adminAccounts.forceLogout'),
                    value: 'forceLogout',
                    disabled: row.original?.onlineStatus !== 1,
                  },
                ]}
                callToAction={action => {
                  switch (action) {
                    case 'edit':
                      openActionDialog('editUser', row.original, 'edit');
                      break;
                    case 'resetPwd':
                      openActionDialog('resetPwd', row.original);
                      break;
                    case 'delete':
                      openActionDialog('delete', row.original);
                      break;
                    case 'unbindGoogle':
                      openActionDialog('unbindGoogle', row.original);
                      break;
                    case 'forceLogout':
                      openActionDialog('forceLogout', row.original);
                      break;
                    default:
                      break;
                  }
                }}
              />
            );
          } else {
            // 查看 解绑谷歌
            return (
              <RrhDropdown
                Trigger={<Ellipsis className="size-4" />}
                dropdownList={[
                  { label: t('common.View'), value: 'view' },
                  {
                    label: t('adminAccounts.unBindGoogle'),
                    value: 'unbindGoogle',
                    disabled: row.original?.boundGoogle !== 1,
                  },
                ]}
                callToAction={action => {
                  if (action === 'view') {
                    openActionDialog('editUser', row.original, 'view');
                  } else if (action === 'unbindGoogle') {
                    openActionDialog('unbindGoogle', row.original);
                  }
                }}
              />
            );
          }
        },
        fixed: 'right',
        size: 50,
      },
    ],
    [modifyStatus, openActionDialog, refetch, t],
  );

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('admin-accounts-table', allColumns);

  const { openTab } = useTabActions();

  const openIpWhiteList = useCallback(() => {
    const url = `/system/admin-accounts/ip-whitelist`;
    openTab({
      key: url,
      title: t('ipWhiteList.title'),
      path: url,
    });
  }, [openTab, t]);

  const roleListOptions = useMemo(
    () => (roleList?.rows || []).map(i => ({ label: i.roleName, value: i.roleId })),
    [roleList?.rows],
  );

  return (
    <TableContentWrapper>
      <div className="mb-3 flex items-center justify-between">
        <RrhInputWithIcon
          key={resetKey}
          placeholder={t('common.pleaseInput', { field: t('table.fullName') })}
          className="h-9"
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
            <AccountsForm
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
      <AddUserDialog
        open={actionDialog === 'editUser'}
        setOpen={handleActionDialogOpenChange}
        mode={mode}
        onSuccess={refetch}
        roleList={roleListOptions}
        userId={selectedUserId}
      />
      <ResetPwdDialog
        open={actionDialog === 'resetPwd'}
        setOpen={handleActionDialogOpenChange}
        userItem={selectedUser}
      />

      <RrhDeleteAlert<{ ids: string }>
        open={actionDialog === 'delete'}
        setOpen={handleActionDialogOpenChange}
        onSuccess={refetch}
        confirmFunction={deleteUser}
        params={{ ids: selectedUserId }}
        tipsText={t('adminAccounts.deleteUserTips')}
      />
      {/* 强制登出 */}
      <RrhDeleteAlert<{ ids: string }>
        open={actionDialog === 'forceLogout'}
        setOpen={handleActionDialogOpenChange}
        onSuccess={refetch}
        confirmFunction={forceLogoutUser}
        params={{ ids: selectedUserId }}
        tipsText={t('adminAccounts.forceLogoutTips')}
      />
      {/* 解绑google */}
      <RrhDeleteAlert<{ ids: string }>
        open={actionDialog === 'unbindGoogle'}
        setOpen={handleActionDialogOpenChange}
        onSuccess={refetch}
        confirmFunction={unbindGoogleUser}
        params={{ ids: selectedUserId }}
        tipsText={t('adminAccounts.unbindGoogleTips')}
      />
    </TableContentWrapper>
  );
};
