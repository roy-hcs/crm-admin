import { PageInfo } from '@/components/common/PageInfo';
import { RrhCard } from '@/components/common/RrhCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { FeeConfig } from './components/FeeConfig';
import { SubscriptionSetting } from './components/SubscriptionSetting';
import { PerformanceFeeRebate } from './components/PerformanceFeeRebate';
import { LoyaltyReward } from './components/LoyaltyReward';
import { BaseSetting } from './components/BaseSetting';

export function SettingsPage() {
  const { t } = useTranslation();
  const tabs = [
    {
      value: 'copyTradingSettings.title',
      component: <BaseSetting />,
    },
    {
      value: 'copyTradingSettings.feeConfig',
      component: <FeeConfig />,
    },
    {
      value: 'copyTradingSettings.subscriptionSettings',
      component: <SubscriptionSetting />,
    },
    {
      value: 'copyTradingSettings.performanceFeeRebate',
      component: <PerformanceFeeRebate />,
    },
    {
      value: 'copyTradingSettings.loyaltyReward',
      component: <LoyaltyReward />,
    },
  ];

  return (
    <div>
      <PageInfo wrapperCls="py-3" title={t('copyTradingSettings.title')} />
      <div>
        <Tabs defaultValue="copyTradingSettings.title" className="flex-1 gap-3 overflow-auto">
          <TabsList>
            {tabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {t(tab.value)}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
              <RrhCard>{tab.component}</RrhCard>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
