import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AccountOverviewPage } from '@/pages/review/account-opening-detail/account-overview/AccountOverviewPage';
import { useTranslation } from 'react-i18next';
import { AgentDashboardPage } from './AgentDashboardPage';

export const AgentTabsPage = ({ userId }: { userId: string }) => {
  const { t } = useTranslation();
  const tabs = [
    {
      value: 'Dashboard',
      content: <AgentDashboardPage userId={userId} />,
    },
    {
      value: t('CRMAccountPage.customerFollowUp'),
      content: <div>CustomerFollowUp</div>,
    },
    {
      value: t('accountOpening.KYCInfo'),
      content: <div>KYCInfo</div>,
    },
    {
      value: t('table.tradingAccount'),
      content: <AccountOverviewPage id={userId} />,
    },
    {
      value: t('table.accountOperations'),
      content: <div>AccountOperations</div>,
    },
    {
      value: t('walletAccountsPage.title'),
      content: <div>WalletAccounts</div>,
    },
    {
      value: t('table.paymentAccount'),
      content: <div>PaymentAccount</div>,
    },
    {
      value: t('CRMAccountPage.rebateSetting'),
      content: <div>RebateSetting</div>,
    },
    {
      value: t('trading.rebateAccountName'),
      content: <div>RebateAccountName</div>,
    },
    {
      value: t('CRMAccountPage.accountActivity'),
      content: <div>AccountActivity</div>,
    },
  ];
  return (
    <div>
      <Tabs defaultValue={tabs[0].value}>
        <TabsList>
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.value}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map(tab => {
          return (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.content}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};
