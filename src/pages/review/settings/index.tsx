import { useState } from 'react';
import { SettingsTable } from './WalletTransactionsTable';
import { useTranslation } from 'react-i18next';
import { useCrmPreferenceList } from '@/api/hooks/review/review';
export function SettingsPage() {
  const { t } = useTranslation();
  // 分页
  const [pageNum, setPageNum] = useState(0);
  // 每页条数
  const [pageSize, setPageSize] = useState(10);
  // 获取钱包流水列表
  const { data: data, isLoading: loading } = useCrmPreferenceList({
    pageSize,
    pageNum: pageNum + 1,
    // 下面是固定参数
    isAsc: 'asc',
    orderByColumn: '',
  });
  return (
    <div>
      <div className="text-xl leading-8 font-semibold text-neutral-950">
        {t('review.settings.title')}
      </div>
      <SettingsTable
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
}
