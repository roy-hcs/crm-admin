import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserRoleList } from '@/api/hooks/system';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { RolesTable } from './RolesTable';

export const UserTab = () => {
  const [roleName, setRoleName] = useState('');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();

  const { data: userRoleList, isLoading: userRoleListLoading } = useUserRoleList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: '',
    roleName,
  });
  const reset = () => {
    setRoleName('');
    setPageNum(0);
    setPageSize(10);
  };

  return (
    <div>
      <h1 className="text-title">{t('rolesManagement.title')}</h1>
      <div className="my-3.5 flex justify-between gap-2">
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
          <RrhButton type="button">{t('common.add')}</RrhButton>
          <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
            <RefreshCcw className="size-3.5" />
          </RrhButton>
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
      />
    </div>
  );
};
