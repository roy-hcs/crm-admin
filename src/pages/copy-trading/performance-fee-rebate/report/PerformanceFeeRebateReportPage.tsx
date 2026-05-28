import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Funnel, RefreshCcw } from 'lucide-react';

import { RrhDrawer } from '@/components/common/RrhDrawer';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { usePerformanceFeeRebateReportList } from '@/api/hooks/copyTrading';
import { PerformanceFeeRebateReportForm } from './PerformanceFeeRebateReportForm';
import { PerformanceFeeRebateReportTable } from './PerformanceFeeRebateReportTable';
import { createReportParams } from './data';

export function PerformanceFeeRebateReportPage() {
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('');
  const [orderByColumn, setOrderByColumn] = useState<string>('createTime desc');
  const [queryParams, setQueryParams] = useState(createReportParams);
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, refetch } = usePerformanceFeeRebateReportList({
    ...queryParams,
    pageNum: pageNum + 1,
    pageSize,
    isAsc,
    orderByColumn,
  });

  const reset = () => {
    setQueryParams(createReportParams());
    setPageNum(0);
    setPageSize(10);
  };

  return (
    <TableContentWrapper>
      <div className="mb-3 flex justify-end gap-2">
        <Button variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
          <RefreshCcw className="size-3.5" />
        </Button>

        <RrhDrawer
          asChild
          Trigger={
            <Button variant="ghost" className="size-8 cursor-pointer">
              <Funnel className="size-4" />
            </Button>
          }
          title="Filter"
          responsiveDirection={{
            mobile: 'bottom',
            desktop: 'right',
          }}
          footerShow={false}
        >
          <PerformanceFeeRebateReportForm
            loading={isLoading}
            params={queryParams}
            onSearch={setQueryParams}
            onReset={reset}
          />
        </RrhDrawer>
      </div>

      <PerformanceFeeRebateReportTable
        data={data}
        loading={isLoading}
        pageNum={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        isAsc={isAsc}
        orderByColumn={orderByColumn}
        setIsAsc={setIsAsc}
        setOrderByColumn={setOrderByColumn}
        onSuccess={refetch}
      />
    </TableContentWrapper>
  );
}
