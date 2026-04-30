import { PageInfo } from '@/components/common/PageInfo';
import { RrhCard } from '@/components/common/RrhCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { useSearchParams } from 'react-router-dom';
import { AccountOperations } from './components/AccountOperations';
import { AccountPermission } from './components/AccountPermission';
import { TipTitle } from './components/TipTitle';
import { FundFlowPage } from './fundFlow/FundFlowPage';
import { HisStoryPage } from './hisStory/HisStoryPage';
import { PositionPage } from './position/PositionPage';
import { LimitPage } from './limit/LimitPage';
import { AccountDetail } from './components/AccountDetail';

export function TradingAccountsDetailPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const serviceType = searchParams.get('serviceType');
  if (!id) {
    return (
      <div className="h-100">
        <RrhCircleLoading />;
      </div>
    );
  }
  const tabs = [
    {
      value: 'table.accountDetail',
      content: <AccountDetail id={id} />,
      cardCls: 'grid gap-6',
    },
    {
      value: 'table.accountOperations',
      content: <AccountOperations id={id} />,
      cardCls: '',
    },
    {
      value: 'table.accountPermission',
      content: <AccountPermission id={id} />,
      cardCls: '',
    },
    {
      value: 'review.fundFlow',
      content: <FundFlowPage id={id} />,
      cardCls: '',
    },
    {
      value: 'tradingHistoryPage.tradingHistory',
      content: <HisStoryPage id={id} />,
      cardCls: '',
    },
    {
      value: 'positionOrderPage.positionOrder',
      content: <PositionPage id={id} />,
      cardCls: '',
    },
    {
      value: 'limitOrderPage.limitOrder',
      content: <LimitPage id={id} />,
      cardCls: '',
    },
  ].filter(i => {
    if (serviceType === '4') {
      // Fortex 没有账号权限
      if (i.value === 'table.accountPermission') return false;
    }
    return true;
  });

  return (
    <div>
      <PageInfo wrapperCls="py-3" title={t('trading.tradingAccountDetail')} />
      <div>
        <Tabs defaultValue="table.accountDetail" className="flex-1 gap-3 overflow-auto">
          <TabsList>
            {tabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {t(tab.value)}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map(tab => {
            return (
              <TabsContent value={tab.value} key={tab.value}>
                <RrhCard className={tab.cardCls}>
                  <TipTitle />
                  {tab.content}
                </RrhCard>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}
