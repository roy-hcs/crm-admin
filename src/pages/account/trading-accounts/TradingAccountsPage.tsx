import { useEffect, useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { useCrmDealAccountList } from '@/api/hooks/account';
import { useServerList } from '@/api/hooks/system/system';
import { TradingAccountsForm } from './TradingAccountsForm';
import { Funnel, Search, RefreshCcw } from 'lucide-react';
import { TradingAccountsTable } from './TradingAccountsTable';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { CrmDealAccountListParams } from '@/api/hooks/account';

export function TradingAccountsPage() {
  const { t } = useTranslation();
  const [serverId, setServerId] = useState('');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [params, setParams] = useState<CrmDealAccountListParams['params']>({
    regStartTime: '',
    regEndTime: '',
    fuzzyAccount: '',
    fuzzyName: '',
    accounts: '',
    threeCons: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<
      CrmDealAccountListParams,
      'params' | 'pageSize' | 'pageNum' | 'orderByColumn' | 'isAsc' | 'server'
    >
  >({
    serverGroupList: '',
    accounts: '',
    accountGroupList: '',
  });

  const { data: server, isLoading: serverLoading } = useServerList();
  useEffect(() => {
    // 自动选择第一台服务器
    if (!serverId && server?.code === 0 && server?.rows?.length) {
      // 只在还没选中时设置，避免无限循环
      setServerId(server.rows[0].id);
    }
  }, [server, serverId]);

  const { data: data, isLoading: dataLoading } = useCrmDealAccountList(
    {
      pageSize,
      pageNum: pageNum + 1,
      orderByColumn: '',
      isAsc: 'asc',
      server: serverId,
      ...otherParams,
      params,
    },
    { enabled: Boolean(serverId) },
  );

  const reset = () => {
    setParams({
      regStartTime: '',
      regEndTime: '',
      fuzzyAccount: '',
      fuzzyName: '',
      accounts: '',
      threeCons: '',
    });
    setOtherParams({
      serverGroupList: '',
      accounts: '',
      accountGroupList: '',
    });
    setPageNum(0);
    setPageSize(10);
  };
  return (
    <div>
      <h1 className="text-title">{t('tradingAccounts.title')}</h1>
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', {
            field: t('financial.tradingAccountTransactions.login'),
          })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setParams(prev => ({ ...prev, fuzzyAccount: e }));
            setPageNum(1);
          }}
        />
        <div className="flex justify-end gap-2">
          <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
            <RefreshCcw className="size-3.5" />
          </RrhButton>
          <RrhDrawer
            headerShow={false}
            asChild
            direction="right"
            footerShow={false}
            Trigger={
              <RrhButton variant="ghost" className="size-8">
                <Funnel />
              </RrhButton>
            }
          >
            <TradingAccountsForm
              setParams={setParams}
              setOtherParams={setOtherParams}
              setServerId={setServerId}
              serverOptions={server?.rows || []}
              initialServerId={serverId}
              loading={dataLoading || serverLoading}
            />
          </RrhDrawer>
        </div>
      </div>
      <TradingAccountsTable
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
