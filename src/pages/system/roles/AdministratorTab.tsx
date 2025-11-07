import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRolesList } from '@/api/hooks/system';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { RolesTable } from './RolesTable';

export const AdministratorTab = () => {
  const [roleName, setRoleName] = useState('');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();

  const { data: roleList, isLoading: roleListLoading } = useRolesList({
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
      <div className="my-3.5 flex justify-end gap-2">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('rolesManagement.roleName') })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setRoleName(e);
            setPageNum(1);
          }}
        />
        <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
          <RefreshCcw className="size-3.5" />
        </RrhButton>
      </div>
      <RolesTable
        data={roleList?.rows || []}
        pageCount={Math.ceil(+(roleList?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={roleListLoading}
      />
    </div>
  );
};
