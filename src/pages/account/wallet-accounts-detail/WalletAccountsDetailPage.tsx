import { PageInfo } from '@/components/common/PageInfo';
import { RrhCard } from '@/components/common/RrhCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { FundFlowPage } from './components/FundFlowPage';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { AccountPer } from './components/AccountPer';

export function WalletAccountsDetailPage() {
  const { t } = useTranslation();

  const detail = JSON.parse(
    decodeURIComponent(new URLSearchParams(window.location.search).get('detail') || '{}'),
  );
  if (!detail.crmUserId) {
    return (
      <div className="h-100">
        <RrhCircleLoading />;
      </div>
    );
  }
  const tabs = ['table.accountDetail', 'table.accountPermission', 'review.fundFlow'];
  const accountInfo = [
    {
      label: 'table.fullName',
      value: detail.crmUserName || '-',
    },
    {
      label: 'table.wallet',
      value: detail.currency || '-',
    },
    {
      label: 'common.createTime',
      value: detail.createTime || '-',
    },
    {
      label: 'table.balance',
      value: detail.balance || '-',
    },
    {
      label: 'tradingAccountDataStats.positiveBalance',
      value: detail.allIn || '-',
    },
    {
      label: 'tradingAccountDataStats.negativeBalance',
      value: detail.allOut || '-',
    },
  ];

  return (
    <div>
      <PageInfo wrapperCls="py-3" title={t('walletAccountsPage.walletAccountsDetail')} />
      <div>
        <Tabs defaultValue="table.accountDetail" className="flex-1 gap-3 overflow-auto">
          <TabsList>
            {tabs.map(tab => (
              <TabsTrigger key={tab} value={tab}>
                {t(`${tab}`)}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="table.accountDetail">
            <RrhCard>
              {accountInfo.map(item => (
                <div key={item.label} className="flex flex-col gap-2 py-3">
                  <label className="text-sm font-medium">{t(item.label)}</label>
                  <div className="text-muted-foreground flex items-center gap-3">
                    <span>{item.value}</span>
                  </div>
                </div>
              ))}
            </RrhCard>
          </TabsContent>
          <TabsContent className="grow-0" value="table.accountPermission">
            <RrhCard>
              <AccountPer id={detail.id} crmUserId={detail.crmUserId} />
            </RrhCard>
          </TabsContent>
          <TabsContent value="review.fundFlow">
            <RrhCard>
              <FundFlowPage />
            </RrhCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
