import { PageInfo } from '@/components/common/PageInfo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { PerformanceFeeRebateReportPage } from './report/PerformanceFeeRebateReportPage';
import { PerformanceFeeRebateVerifyPage } from './verify/PerformanceFeeRebateVerifyPage';

export function PerformanceFeeRebatePage() {
  const { t } = useTranslation();
  const tabs = [
    {
      value: 'performanceFeeRebatePage.verifyTab',
      component: <PerformanceFeeRebateVerifyPage />,
    },
    {
      value: 'performanceFeeRebatePage.reportTab',
      component: <PerformanceFeeRebateReportPage />,
    },
  ];

  return (
    <div>
      <PageInfo wrapperCls="py-3" title={t('copyTradingSettings.performanceFeeRebate')} />
      <Tabs defaultValue={tabs[0].value} className="flex-1 gap-3 overflow-auto">
        <TabsList>
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {t(tab.value)}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map(tab => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
