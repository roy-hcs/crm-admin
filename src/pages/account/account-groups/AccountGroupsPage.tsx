import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCrmDealAccountGroupList } from '@/api/hooks/account';
import { PageInfo } from '@/components/common/PageInfo';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { AccountGroupsTable } from './components/AccountGroupsTable';
import { AccountGroupDialog } from './components/AccountGroupDialog';

export const AccountGroupsPage = () => {
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const {
    data: data,
    isLoading: loading,
    refetch,
  } = useCrmDealAccountGroupList({
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
      <PageInfo title={t('accountGroups.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex items-center justify-end">
          <div className="flex justify-end gap-2">
            <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
              <RefreshCcw className="size-3.5" />
            </RrhButton>

            <AccountGroupDialog mode="add" onSuccess={refetch} />
          </div>
        </div>
        <AccountGroupsTable
          data={data?.rows || []}
          pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          onRefresh={refetch}
          loading={loading}
        />
      </TableContentWrapper>
    </div>
  );
};
