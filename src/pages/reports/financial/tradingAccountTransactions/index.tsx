import { useRef, useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { useCrmUserDealList } from '@/api/hooks/report/report';
import { useServerList } from '@/api/hooks/system/system';
import {
  TradingAccountTransactionsForm,
  TradingAccountTransactionsFormRef,
} from './components/TradingAccountTransactionsForm';
import { Funnel, Search, RefreshCcw, Ellipsis } from 'lucide-react';
import { TradingAccountTransactionsTable } from './components/TradingAccountTransactionsTable';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';

export function TradingAccountTransactionsPage() {
  const { t } = useTranslation();
  const formRef = useRef<TradingAccountTransactionsFormRef>(null);
  const [serverId, setServerId] = useState('');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  // 特殊参数
  const [params, setParams] = useState({
    ticket: '',
    historyFuzzyName: '',
    login: '',
    comment: '',
    accounts: '',
    operationStart: '',
    operationEnd: '',
    fuzzyCrmAccount: '',
  });
  // 普通参数
  const [commonParams, setCommonParams] = useState({
    opeTypeList: '',
    opeType: '',
    serverGroupList: '',
    serverGroup: '',
    accountGroupList: '',
    accounts: '',
  });

  const { data: server, isLoading: serverLoading } = useServerList();
  // 自动选择第一台服务器
  if (!serverId && server?.code === 0 && server?.rows?.length) {
    // 只在还没选中时设置，避免无限循环
    setServerId(server.rows[0].id);
  }

  const { data: data, isLoading: dataLoading } = useCrmUserDealList(
    {
      params,
      pageSize,
      ...commonParams,
      serverId,
      pageNum: pageNum + 1,
      // 下面是固定参数
      isAsc: 'asc',
      orderByColumn: '',
    },
    { enabled: !!serverId },
  );

  const reset = () => {
    setParams({
      ticket: '',
      historyFuzzyName: '',
      login: '',
      comment: '',
      accounts: '',
      operationStart: '',
      operationEnd: '',
      fuzzyCrmAccount: '',
    });
    setCommonParams({
      opeTypeList: '',
      opeType: '',
      serverGroupList: '',
      serverGroup: '',
      accountGroupList: '',
      accounts: '',
    });
    setPageNum(0);
    setPageSize(10);
  };
  return (
    <div>
      {/* 页面名称 */}
      <div className="text-xl leading-8 font-semibold text-neutral-950">
        {t('financial.tradingAccountTransactions.title')}
      </div>
      {/* 页面简介 */}
      <div className="text-sm leading-6 font-normal text-neutral-900">{t('common.tips')}</div>
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
            <TradingAccountTransactionsForm
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
      <TradingAccountTransactionsTable
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
