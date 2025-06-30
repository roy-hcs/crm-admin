import { useCrmUser } from '@/api/hooks/system/system';
import { CrmUserItem } from '@/api/hooks/system/types';
import Dialog from '@/components/common/Dialog';
import { CRMTableSimple } from '@/components/table/CRMTableSimple';
import { Search } from 'lucide-react';
import { useState } from 'react';

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
  // const [selectedUser, setSelectedUser] = useState<CrmUserItem | null>(null);
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
    <Dialog
      title={title}
      className="min-w-1/2"
      trigger={trigger}
      cancelText="取消"
      confirmText="确认"
      onConfirm={() => onConfirm(selectedUser?.id || '')}
    >
      <form className="flex items-center gap-4 text-sm" onSubmit={onSubmit}>
        <label>姓/名/账号ID/手机/邮箱:</label>
        <input
          type="text"
          value={search}
          className="h-9 border px-2"
          onChange={e => setSearch(e.target.value)}
        />
        <button type="submit" className="flex h-9 items-center gap-1 bg-blue-500 px-2 text-white">
          <Search className="h-4 w-4" />
          <span>搜索</span>
        </button>
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
    </Dialog>
  );
};
