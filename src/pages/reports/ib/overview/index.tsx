import { useRef, useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { useAgencyOverviewList } from '@/api/hooks/report/report';
import { useServerList, useRebateLevelList } from '@/api/hooks/system/system';
import { OverviewForm, OverviewFormRef } from './components/OverviewForm';
import { Funnel, Search, RefreshCcw, Ellipsis } from 'lucide-react';
import { OverviewTable } from './components/OverviewTable';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';

export function OverviewPage() {
  const { t } = useTranslation();
  const formRef = useRef<OverviewFormRef>(null);
  const [isAsc, setIsAsc] = useState<'asc' | 'desc'>('asc');
  const [serverId, setServerId] = useState('');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [params, setParams] = useState({
    userName: '',
    email: '',
    beginTime: '',
    endTime: '',
    level: '',
  });

  const { data: server, isLoading: serverLoading } = useServerList();
  const { data: rebateLevel } = useRebateLevelList();
  // 自动选择第一台服务器
  if (!serverId && server?.code === 0 && server?.rows?.length) {
    // 只在还没选中时设置，避免无限循环
    setServerId(server.rows[0].id);
  }

  const { data: AgencyClientTracking, isLoading: AgencyClientTrackingLoading } =
    useAgencyOverviewList(
      {
        pageSize,
        pageNum: pageNum + 1,
        serverId,
        ...params,
        isAsc,
        serverType: '4',
      },
      { enabled: !!serverId },
    );

  const reset = () => {
    setParams({
      userName: '',
      email: '',
      beginTime: '',
      endTime: '',
      level: '',
    });
    setPageNum(0);
    setPageSize(10);
    setIsAsc('asc');
  };
  return (
    <div>
      {/* 页面名称 */}
      <div className="text-xl leading-8 font-semibold text-[#1e1e1e]">{t('ib.overview.title')}</div>
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
            asChild
            Trigger={
              <Button variant="ghost" className="size-8 cursor-pointer">
                <Funnel className="size-4" />
              </Button>
            }
            title="Filter"
            direction="right"
            footerShow={false}
          >
            <OverviewForm
              ref={formRef}
              setParams={setParams}
              serverOptions={server?.rows || []}
              rebateLevelOptions={rebateLevel?.rows || []}
              setServerId={setServerId}
              initialServerId={serverId}
            />
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
        loading={AgencyClientTrackingLoading || serverLoading}
      />
    </div>
  );
}
