import { useRef, useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { useDataStatistics } from '@/api/hooks/report/report';
import { useServerList } from '@/api/hooks/system/system';
import {
  TradingAccountDataStatsForm,
  TradingAccountDataStatsFormRef,
} from './components/TradingAccountDataStatsForm';
import { Funnel, Search, RefreshCcw, Ellipsis } from 'lucide-react';
import { TradingAccountDataStatsTable } from './components/TradingAccountDataStatsTable';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';

export function TradingAccountDataStatsPage() {
  const { t } = useTranslation();
  const formRef = useRef<TradingAccountDataStatsFormRef>(null);
  const [serverId, setServerId] = useState('');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  // 特殊参数
  const [params, setParams] = useState({
    onlyViewRebateAccount: '',
    serverGroupList: '',
    fuzzyAccount: '',
    fuzzyName: '',
    statisticStartTime: '',
    statisticEndTime: '',
    accounts: '',
  });
  // 普通参数
  const [commonParams, setCommonParams] = useState({
    accounts: '',
    accountGroupList: '',
    username: '',
    directBroker: '',
  });

  const { data: server, isLoading: serverLoading } = useServerList();
  // 自动选择第一台服务器
  if (!serverId && server?.code === 0 && server?.rows?.length) {
    // 只在还没选中时设置，避免无限循环
    setServerId(server.rows[0].id);
  }

  const { data: data, isLoading: dataLoading } = useDataStatistics(
    {
      server: serverId,
      params,
      ...commonParams,
      pageSize,
      pageNum: pageNum + 1,
      // 下面是固定参数
      isAsc: 'asc',
      orderByColumn: '',
    },
    { enabled: !!serverId },
  );

  const reset = () => {
    setParams({
      onlyViewRebateAccount: '',
      serverGroupList: '',
      fuzzyAccount: '',
      fuzzyName: '',
      statisticStartTime: '',
      statisticEndTime: '',
      accounts: '',
    });
    setCommonParams({
      accounts: '',
      accountGroupList: '',
      username: '',
      directBroker: '',
    });
    setPageNum(0);
    setPageSize(10);
    setServerId(server?.rows?.[0]?.id || '');
  };
  return (
    <div>
      <div className="text-xl leading-8 font-semibold text-neutral-950">
        {t('financial.tradingAccountDataStats.title')}
      </div>
      <div className="text-sm leading-6 font-normal text-neutral-900">{t('common.tips')}</div>
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
            <TradingAccountDataStatsForm
              ref={formRef}
              setParams={setParams}
              setCommonParams={setCommonParams}
              setServerId={setServerId}
              serverOptions={server?.rows || []}
              initialServerId={serverId}
            />
          </RrhDrawer>
        </div>
      </div>
      <TradingAccountDataStatsTable
        data={data?.rows || []}
        pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={dataLoading || serverLoading}
      />
    </div>
  );
}
