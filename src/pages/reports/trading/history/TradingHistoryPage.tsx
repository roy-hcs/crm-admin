import { useTradingHistoryList } from '@/api/hooks/report/report';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { TradingHistoryForm } from './TradingHistoryForm';
import { useEffect, useState } from 'react';
import { useServerList } from '@/api/hooks/system/system';
import { TradingHistoryTable } from './TradingHistoryTable';
import { useTranslation } from 'react-i18next';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';

export const TradingHistoryPage = () => {
  const [params, setParams] = useState({
    selectOther: '',
    historyDealBJStartTime: '',
    historyDealBJEndTime: '',
    historyCloseStartTime: '',
    historyCloseEndTime: '',
    accounts: '',
  });
  const [otherParams, setOtherParams] = useState({
    serverType: '',
    serverId: '',
    serverGroupList: '',
    serverGroup: '',
    type: '',
    symbol: '',
    ticket: '',
    login: '',
    accountGroupList: '',
    accounts: '',
    positionID: '',
    entry: '',
  });

  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();

  const { data: serverList, isLoading: serverListLoading } = useServerList();
  useEffect(() => {
    if (serverList && serverList.rows && serverList.rows.length > 0) {
      setOtherParams(prev => ({
        ...prev,
        serverId: serverList.rows[0].id,
        serverType: serverList.rows[0].serviceType.toString(),
      }));
    }
  }, [serverList]);
  const { data, isLoading } = useTradingHistoryList(
    {
      breedGroup: '',
      orderByColumn: '',
      isAsc: 'asc',
      pageNum: pageNum + 1,
      pageSize,
      ...otherParams,
      params: {
        ...params,
      },
    },
    {
      enabled: otherParams.serverId !== '' && otherParams.serverType !== '',
    },
  );
  const reset = () => {
    setParams({
      selectOther: '',
      historyDealBJStartTime: '',
      historyDealBJEndTime: '',
      historyCloseStartTime: '',
      historyCloseEndTime: '',
      accounts: '',
    });
    setOtherParams({
      serverType: serverList?.rows[0].serviceType.toString() || '',
      serverId: serverList?.rows[0].id || '',
      serverGroupList: '',
      serverGroup: '',
      type: '',
      symbol: '',
      ticket: '',
      login: '',
      accountGroupList: '',
      accounts: '',
      positionID: '',
      entry: '',
    });
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('tradingHistoryPage.tradingHistory')}</h1>
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setOtherParams(prev => ({ ...prev, ticket: e }));
            setPageNum(1);
          }}
        />
        <div className="flex justify-end gap-2">
          <RrhButton variant="outline">{t('table.export')}</RrhButton>
          <RrhButton variant="outline">{t('table.batchDelete')}</RrhButton>
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
            <TradingHistoryForm
              serverListLoading={serverListLoading}
              serverList={serverList?.rows || []}
              setParams={setParams}
              setOtherParams={setOtherParams}
              loading={isLoading}
            />
          </RrhDrawer>
        </div>
      </div>

      <TradingHistoryTable
        data={data?.rows || []}
        pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={isLoading}
      />
    </div>
  );
};
