import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountGroupsTable } from './AccountGroupsTable';
import { useCrmDealAccountGroupList } from '@/api/hooks/account';

export const AccountGroupsPage = () => {
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const { data: data, isLoading: loading } = useCrmDealAccountGroupList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
  });

  const reset = () => {
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('accountGroups.title')}</h1>
      <div className="my-3.5 flex items-center justify-end">
        <div className="flex justify-end gap-2">
          <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
            <RefreshCcw className="size-3.5" />
          </RrhButton>
        </div>
      </div>
      <AccountGroupsTable
        data={data?.rows || []}
        pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={loading}
      />
    </div>
  );
};
