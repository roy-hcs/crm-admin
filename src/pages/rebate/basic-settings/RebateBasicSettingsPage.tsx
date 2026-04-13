import { PageInfo } from '@/components/common/PageInfo';
import { RrhCard } from '@/components/common/RrhCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { BasicSetting } from './components/BasicSetting';
import { TradingRebate } from './components/TradingRebate';
import { HandFeeRebate } from './components/HandFeeRebate';
import { DepositRebate } from './components/DepositRebate';

export function RebateBasicSettingsPage() {
  const { t } = useTranslation();
  const tabs = [
    'RebateBasicSettingsPage.basicSettings',
    'RebateBasicSettingsPage.tradingRebate',
    'RebateBasicSettingsPage.feeRebate',
    'RebateBasicSettingsPage.depositRebate',
  ];

  return (
    <div>
      <PageInfo wrapperCls="py-3" title={t('RebateBasicSettingsPage.title')} />
      <div>
        <Tabs
          defaultValue="RebateBasicSettingsPage.basicSettings"
          className="flex-1 gap-3 overflow-auto"
        >
          <TabsList>
            {tabs.map(tab => (
              <TabsTrigger key={tab} value={tab}>
                {t(tab)}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="RebateBasicSettingsPage.basicSettings">
            <RrhCard>
              <BasicSetting />
            </RrhCard>
          </TabsContent>
          <TabsContent value="RebateBasicSettingsPage.tradingRebate">
            <RrhCard>
              <TradingRebate />
            </RrhCard>
          </TabsContent>
          <TabsContent value="RebateBasicSettingsPage.feeRebate">
            <RrhCard>
              <HandFeeRebate />
            </RrhCard>
          </TabsContent>
          <TabsContent value="RebateBasicSettingsPage.depositRebate">
            <RrhCard>
              <DepositRebate />
            </RrhCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
