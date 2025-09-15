import { useRef, useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { useAgencyClientTrackingList } from '@/api/hooks/report/report';
import { ClientTrackingForm, ClientTrackingFormRef } from './components/ClientTrackingForm';
import { Funnel, Search, RefreshCcw, Ellipsis } from 'lucide-react';
import { ClientTrackingTable } from './components/ClientTrackingTable';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';

export function ClientTrackingPage() {
  const { t } = useTranslation();
  const formRef = useRef<ClientTrackingFormRef>(null);
  const [isAsc, setIsAsc] = useState<'asc' | 'desc'>('asc');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [params, setParams] = useState({
    userName: '',
    email: '',
    statisticMonth: '',
    level: '',
  });
  const { data: AgencyClientTracking, isLoading: AgencyClientTrackingLoading } =
    useAgencyClientTrackingList({
      pageSize,
      pageNum: pageNum + 1,
      ...params,
      isAsc,
    });

  const reset = () => {
    setParams({
      userName: '',
      email: '',
      statisticMonth: '',
      level: '',
    });
    setPageNum(0);
    setPageSize(10);
    setIsAsc('asc');
  };
  return (
    <div>
      {/* 页面名称 */}
      <div className="text-xl leading-8 font-semibold text-[#1e1e1e]">
        {t('ib.CustomerTracking.title')}
      </div>
      {/* 页面简介 */}
      <div className="text-sm leading-6 font-normal text-[#1e1e1e]">
        View all of your account's information
      </div>
      {/* 表格 */}
      <div className="mt-3.5 mb-3.5 flex justify-between">
        <div className="w-67 max-w-sm">
          <RrhInputWithIcon
            placeholder="Last Name/First Name/Email"
            className="h-9"
            rightIcon={<Search className="size-4" />}
            onLeftIconClick={() => {
              // 触发查询逻辑, 这里简单调用一次刷新
              setPageNum(0);
            }}
          />
        </div>
        <div className="flex items-center gap-2">
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
            <ClientTrackingForm ref={formRef} setParams={setParams} />
          </RrhDrawer>
        </div>
      </div>
      <ClientTrackingTable
        data={AgencyClientTracking?.rows || []}
        pageCount={Math.ceil(+(AgencyClientTracking?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={AgencyClientTrackingLoading}
      />
    </div>
  );
}
