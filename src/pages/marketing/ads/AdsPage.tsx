import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdsTable } from './AdsTable';
import { useAdsList } from '@/api/hooks/marketing';

export const AdsPage = () => {
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const { data: data, isLoading: loading } = useAdsList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
  });

  return (
    <div>
      <h1 className="text-title">{t('marketing.ads.name')}</h1>
      <div className="my-3.5 flex items-center justify-end">
        <div className="flex gap-2">
          <RrhButton variant="ghost" className="size-8 cursor-pointer">
            <RefreshCcw className="size-3.5" />
          </RrhButton>
        </div>
      </div>
      <AdsTable
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
