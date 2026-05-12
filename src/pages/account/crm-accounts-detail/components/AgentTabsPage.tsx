import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AccountOverviewPage } from '@/pages/review/account-opening-detail/account-overview/AccountOverviewPage';
import { useTranslation } from 'react-i18next';
import { AgentDashboardPage } from './AgentDashboardPage';
import { CustomerFollowup } from './CustomerFollowup';
import { CrmUserKycInfoPage } from './CrmUserKycInfoPage';
import { CrmAccountOperationsPage } from './CrmAccountOperationsPage';
import { CrmUserWalletListPage } from './CrmUserWalletListPage';

export const AgentTabsPage = ({ userId }: { userId: string }) => {
  const { t } = useTranslation();
  const tabs = [
    {
      value: 'Dashboard',
      content: <AgentDashboardPage userId={userId} />,
    },
    {
      value: t('CRMAccountPage.customerFollowUp'),
      content: <CustomerFollowup userId={userId} />,
    },
    {
      value: t('accountOpening.KYCInfo'),
      content: <CrmUserKycInfoPage userId={userId} />,
    },
    {
      value: t('table.tradingAccount'),
      content: <AccountOverviewPage id={userId} />,
    },
    {
      value: t('table.accountOperations'),
      content: <CrmAccountOperationsPage userId={userId} />,
    },
    {
      value: t('walletAccountsPage.title'),
      content: <CrmUserWalletListPage userId={userId} />,
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
    <Tabs defaultValue={tabs[0].value} orientation="vertical">
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
  );
};
