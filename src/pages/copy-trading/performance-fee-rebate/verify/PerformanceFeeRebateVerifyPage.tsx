import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Funnel, RefreshCcw } from 'lucide-react';

import { RrhDrawer } from '@/components/common/RrhDrawer';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { usePerformanceFeeRebateVerifyList } from '@/api/hooks/copyTrading';
import { PerformanceFeeRebateVerifyForm } from './PerformanceFeeRebateVerifyForm';
import { PerformanceFeeRebateVerifyTable } from './PerformanceFeeRebateVerifyTable';
import { createVerifyParams } from './data';

export function PerformanceFeeRebateVerifyPage() {
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('');
  const [orderByColumn, setOrderByColumn] = useState<string>('status asc,createTime desc');
  const [queryParams, setQueryParams] = useState(createVerifyParams);
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = usePerformanceFeeRebateVerifyList({
    ...queryParams,
    pageNum: pageNum + 1,
    pageSize,
    isAsc,
    orderByColumn,
  });

  const reset = () => {
    setQueryParams(createVerifyParams());
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
          <PerformanceFeeRebateVerifyForm
            loading={isLoading}
            params={queryParams}
            onSearch={setQueryParams}
            onReset={reset}
          />
        </RrhDrawer>
      </div>

      <PerformanceFeeRebateVerifyTable
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
      />
    </TableContentWrapper>
  );
}
