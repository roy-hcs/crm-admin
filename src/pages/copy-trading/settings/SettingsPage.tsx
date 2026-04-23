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
    'copyTradingSettings.title',
    'copyTradingSettings.feeConfig',
    'copyTradingSettings.subscriptionSettings',
    'copyTradingSettings.performanceFeeRebate',
    'copyTradingSettings.loyaltyReward',
  ];

  return (
    <div>
      <PageInfo wrapperCls="py-3" title={t('copyTradingSettings.title')} />
      <div>
        <Tabs defaultValue="copyTradingSettings.title" className="flex-1 gap-3 overflow-auto">
          <TabsList>
            {tabs.map(tab => (
              <TabsTrigger key={tab} value={tab}>
                {t(tab)}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="copyTradingSettings.title">
            <RrhCard>
              <BaseSetting />
            </RrhCard>
          </TabsContent>
          <TabsContent value="copyTradingSettings.feeConfig">
            <RrhCard>
              <FeeConfig />
            </RrhCard>
          </TabsContent>
          <TabsContent value="copyTradingSettings.subscriptionSettings">
            <RrhCard>
              <SubscriptionSetting />
            </RrhCard>
          </TabsContent>
          <TabsContent value="copyTradingSettings.performanceFeeRebate">
            <RrhCard>
              <PerformanceFeeRebate />
            </RrhCard>
          </TabsContent>
          <TabsContent value="copyTradingSettings.loyaltyReward">
            <RrhCard>
              <LoyaltyReward />
            </RrhCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
