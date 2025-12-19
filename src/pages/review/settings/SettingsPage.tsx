import { useState } from 'react';
import { SettingsTable } from './SettingsTable';
import { useTranslation } from 'react-i18next';
import { useCrmPreferenceList } from '@/api/hooks/review';
import { PageInfo } from '@/components/common/PageInfo';
export function SettingsPage() {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  // 获取钱包流水列表
  const { data: data, isLoading: loading } = useCrmPreferenceList({
    pageSize,
    pageNum: pageNum + 1,
    isAsc: 'asc',
    orderByColumn: '',
  });
  return (
    <div>
      <PageInfo
        title={t('review.settings.title')}
        desc={t('review.settings.desc')}
        wrapperCls="mb-4"
      />
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
