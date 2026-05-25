import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomerCommissionPage } from './rebate-customer-commission/CustomerCommissionPage';
import { CustomerCommissionFaq } from './rebate-customer-commission/components/CustomerCommissionFaq';
import { CommissionSettingPage } from './commisssion-setting/CommissionSettingPage';

export function CommissionSettingsPage() {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState('commissionRebateSettings.tabs.2');

  const settingTabs = useMemo(
    () => [
      {
        value: 'commissionRebateSettings.tabs.1',
        component: <CommissionSettingPage />,
      },
      {
        value: 'commissionRebateSettings.tabs.2',
        component: <CustomerCommissionPage />,
      },
    ],
    [],
  );
  return (
    <>
      <div className="relative flex flex-col gap-3 md:flex-row md:gap-8">
        <div className="flex-1">
          <Tabs value={tabValue} onValueChange={setTabValue} className="flex-1 gap-3">
            <TabsList>
              {settingTabs.map(i => (
                <TabsTrigger key={i.value} value={i.value}>
                  {t(i.value)}
                </TabsTrigger>
              ))}
            </TabsList>
            {settingTabs.map(i => (
              <TabsContent key={i.value} value={i.value}>
                {i.component}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {tabValue === 'commissionRebateSettings.tabs.2' && (
          <div className="relative md:mt-12 md:w-93.5">
            <div className="sticky top-0 flex flex-col gap-3 md:gap-6">
              <CustomerCommissionFaq />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
