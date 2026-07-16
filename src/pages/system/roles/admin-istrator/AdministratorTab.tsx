import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RoleItem, useRoleList, useRolesList } from '@/api/hooks/system';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { RolesTable } from '../common/RolesTable';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { AddEditRoleDialog } from './AddEditRoleDialog';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { useDeleteRole } from '@/api/hooks/system/system';

export const AdministratorTab = () => {
  const [roleName, setRoleName] = useState('');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const { data: roleAllList } = useRoleList();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleItem, setRoleItem] = useState<RoleItem>();
  const [mode, setMode] = useState<'edit' | 'view'>('edit');
  const [open, setOpen] = useState(false);
  const {
    data: roleList,
    isLoading: roleListLoading,
    refetch,
  } = useRolesList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: '',
    roleName,
  });
  const { mutateAsync: deleteRole } = useDeleteRole();

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
          <AddEditRoleDialog
            onSuccess={refetch}
            mode="add"
            roleList={(roleAllList?.rows || []).map(i => ({ label: i.roleName, value: i.roleId }))}
          />
        </div>
      </div>
      <RolesTable
        data={roleList?.rows || []}
        pageCount={Math.ceil(+(roleList?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={roleListLoading}
        handleEdit={handleEdit}
        handleView={handleView}
        handleDelete={handleDelete}
      />

      <AddEditRoleDialog
        onSuccess={refetch}
        mode={mode}
        open={open}
        setOpen={setOpen}
        roleItem={roleItem}
        roleList={(roleAllList?.rows || []).map(i => ({ label: i.roleName, value: i.roleId }))}
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
