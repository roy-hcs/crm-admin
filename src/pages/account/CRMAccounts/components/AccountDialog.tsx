import { useCrmUser } from '@/api/hooks/system/system';
import { CrmUserItem } from '@/api/hooks/system/types';
import { RrhDialog } from '@/components/common/RrhDialog';
import { RrhButton } from '@/components/common/RrhButton';
import { CRMTableSimple } from '@/components/table/CRMTableSimple';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const AccountDialog = ({
  title,
  trigger,
  onConfirm,
  selectedUser,
  setSelectedUser,
}: {
  title: string;
  trigger: React.ReactNode;
  selectedUser: CrmUserItem | null;
  setSelectedUser: (user: CrmUserItem | null) => void;
  onConfirm: (val: string) => void;
}) => {
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [params, setParams] = useState({
    threeCons: '',
    fiveCons: '',
    regEndTime: '',
    regStartTime: '',
    fuzzyMobile: '',
    fuzzyEmail: '',
    inviter: '',
    accounts: '',
  });
  const { t } = useTranslation();
  const { data: crmUsers, isLoading: crmUsersLoading } = useCrmUser(
    {
      pageSize,
      pageNum: pageNum + 1,
      orderByColumn: '',
      params,
      isAsc: 'asc',
      status: '',
      role: '',
      certiricateNo: '',
      accountType: '',
      tags: '',
    },
    'origin=1',
  );
  const handleRowSelect = (user: CrmUserItem) => {
    setSelectedUser(user);
  };
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setParams({
      ...params,
      fiveCons: search,
    });
  };

  return (
    <RrhDialog
      title={title}
      className="min-w-1/2"
      trigger={trigger}
      cancelText={t('common.Cancel')}
      confirmText={t('common.Confirm')}
      onConfirm={() => onConfirm(selectedUser?.id || '')}
    >
      <form className="flex items-center gap-4 text-sm" onSubmit={onSubmit}>
        <label>{t('CRMAccountPage.keyWordOfSearchSuperior')}:</label>
        <Input
          type="text"
          value={search}
          className="h-9 border px-2"
          onChange={e => setSearch(e.target.value)}
        />
        <RrhButton type="submit">
          <Search className="h-4 w-4" />
          <span>{t('common.Search')}</span>
        </RrhButton>
      </form>
      <CRMTableSimple
        pageCount={Math.ceil(+(crmUsers?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        data={crmUsers?.rows || []}
        onPageSizeChange={setPageSize}
        onPageChange={setPageNum}
        loading={crmUsersLoading}
        onRowSelect={handleRowSelect}
      />
    </RrhDialog>
  );
};
