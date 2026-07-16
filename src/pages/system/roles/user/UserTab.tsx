import { RrhButton } from '@/components/common/RrhButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RoleItem, useUserRoleList } from '@/api/hooks/system';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { RolesTable } from '../common/RolesTable';
import { AddEditUserRoleDialog } from './AddEditUserRoleDialog';
import { useDeleteUserRole, useUserRoleListAll } from '@/api/hooks/system/system';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';

export const UserTab = () => {
  const [roleName, setRoleName] = useState('');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();

  const {
    data: userRoleList,
    isLoading: userRoleListLoading,
    refetch,
  } = useUserRoleList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: '',
    roleName,
  });
  const { data: userRoleListAll } = useUserRoleListAll();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleItem, setRoleItem] = useState<RoleItem>();
  const [mode, setMode] = useState<'edit' | 'view'>('edit');
  const [open, setOpen] = useState(false);

  const { mutateAsync: deleteRole } = useDeleteUserRole();

  const reset = () => {
    setRoleName('');
    setPageNum(0);
    setPageSize(10);
  };

  const handleEdit = (role: RoleItem) => {
    setRoleItem(role);
    setMode('edit');
    setOpen(true);
  };

  const handleView = (role: RoleItem) => {
    setRoleItem(role);
    setMode('view');
    setOpen(true);
  };

  const handleDelete = (role: RoleItem) => {
    setRoleItem(role);
    setDeleteDialogOpen(true);
  };

  return (
    <TableContentWrapper>
      <div className="mb-3 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('rolesManagement.roleName') })}
          className="h-9"
          leftIcon={<Search className="size-4 cursor-pointer" />}
          onLeftIconClick={e => {
            setRoleName(e);
            setPageNum(0);
          }}
        />
        <div className="flex gap-2">
          <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
            <RefreshCcw className="size-3.5" />
          </RrhButton>
          <AddEditUserRoleDialog
            onSuccess={refetch}
            mode="add"
            roleList={(userRoleListAll?.rows || []).map(i => ({
              label: i.roleName,
              value: i.roleId,
            }))}
          />
        </div>
      </div>
      <RolesTable
        data={userRoleList?.rows || []}
        pageCount={Math.ceil(+(userRoleList?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={userRoleListLoading}
        handleEdit={handleEdit}
        handleView={handleView}
        handleDelete={handleDelete}
      />

      <AddEditUserRoleDialog
        onSuccess={refetch}
        mode={mode}
        open={open}
        setOpen={setOpen}
        roleItem={roleItem}
        roleList={(userRoleListAll?.rows || []).map(i => ({ label: i.roleName, value: i.roleId }))}
      />

      <RrhDeleteAlert<{ ids: string }>
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onSuccess={refetch}
        confirmFunction={deleteRole}
        params={{ ids: roleItem?.roleId || '' }}
        tipsText={t('common.deleteFieldConfirm', {
          field: roleItem?.roleName || '',
        })}
      />
    </TableContentWrapper>
  );
};
