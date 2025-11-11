import { RrhButton } from '@/components/common/RrhButton';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRebateLevelList } from '@/api/hooks/rebate';
import { RebateLevelSettingsTable } from './RebateLevelSettingsTable';

export const RebateLevelSettingsPage = () => {
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();

  const { data: rebateLevelList, isLoading: rebateLevelListLoading } = useRebateLevelList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
  });

  return (
    <div>
      <h1 className="text-title">{t('ProductGroup.title')}</h1>
      <div className="my-3.5 flex items-center justify-between">
        <div></div>
        <div className="flex justify-end gap-2">
          <RrhButton variant="outline">{t('common.add')}</RrhButton>
        </div>
      </div>
      <RebateLevelSettingsTable
        data={rebateLevelList?.rows || []}
        pageCount={Math.ceil(+(rebateLevelList?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={rebateLevelListLoading}
      />
    </div>
  );
};
