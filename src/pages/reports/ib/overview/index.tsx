import { useRef, useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { useAgencyOverviewList } from '@/api/hooks/report/report';
import { OverviewForm, OverviewFormRef } from './components/ClientTrackingForm';
import { Funnel, Search, RefreshCcw, Ellipsis } from 'lucide-react';
import { OverviewTable } from './components/OverviewTable';
import { Input } from '@/components/ui/input';

export function OverviewPage() {
  const formRef = useRef<OverviewFormRef>(null);
  const [isAsc, setIsAsc] = useState<'asc' | 'desc'>('asc');
  const [formShow, setFormShow] = useState(true);
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [params, setParams] = useState({
    userName: '',
    email: '',
    beginTime: '',
    endTime: '',
    level: '',
    serverId: 'c2966f08bdb24d1b9762aa372bce5090',
  });
  const { data: AgencyClientTracking, isLoading: AgencyClientTrackingLoading } =
    useAgencyOverviewList({
      pageSize,
      pageNum: pageNum + 1,
      ...params,
      isAsc,
    });

  const reset = () => {
    setParams({
      userName: '',
      email: '',
      beginTime: '',
      endTime: '',
      level: '',
      serverId: '',
    });
    setPageNum(0);
    setPageSize(10);
    setIsAsc('asc');
  };
  return (
    <div>
      {/* 页面名称 */}
      <div className="text-xl leading-5 font-semibold text-[#1e1e1e]">iB数据总览</div>
      {/* 页面简介 */}
      {/* <div className="mt-2 mb-6 text-sm leading-4.5 font-normal text-[#1e1e1e]">
        View all of your account's information
      </div> */}
      {/* 表格 */}
      <div className="mt-2">
        <div className="mb-3.5 flex justify-between">
          <div>
            <Input
              placeholder="Filter emails..."
              // value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
              // onChange={event => table.getColumn('email')?.setFilterValue(event.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="size-8 cursor-pointer"
              onClick={() => setFormShow(!formShow)}
            >
              <Search className="size-3.5" />
            </Button>
            <Button variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
              <RefreshCcw className="size-3.5" />
            </Button>

            <Button variant="ghost" className="size-8 cursor-pointer">
              <Ellipsis />
            </Button>
            <RrhDrawer
              Trigger={<Funnel className="size-4" />}
              title="Filter"
              direction="right"
              footerShow={false}
            >
              <OverviewForm ref={formRef} setParams={setParams} />
            </RrhDrawer>
          </div>
        </div>
        <OverviewTable
          data={AgencyClientTracking?.rows || []}
          pageCount={Math.ceil(+(AgencyClientTracking?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={AgencyClientTrackingLoading}
        />
      </div>
    </div>
  );
}
