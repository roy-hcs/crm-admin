import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomerCommissionPage } from './rebate-customer-commission/CustomerCommissionPage';
import { CustomerCommissionFaq } from './rebate-customer-commission/components/CustomerCommissionFaq';
import { CommissionSettingPage } from './commission-setting/CommissionSettingPage';
import { useSearchParams } from 'react-router-dom';

type CommissionType = 'trading' | 'fee' | 'deposit';
type CommissionTabValue = 'groupSettings' | 'customerCommission';

function getDefaultTabValue(type: CommissionType): CommissionTabValue {
  return type === 'trading' ? 'customerCommission' : 'groupSettings';
}

export function CommissionSettingsPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const type = (searchParams.get('type') as CommissionType) || 'trading';
  const [tabValue, setTabValue] = useState<CommissionTabValue>(getDefaultTabValue(type));

  useEffect(() => {
    const allowedTabs: CommissionTabValue[] =
      type === 'trading' ? ['groupSettings', 'customerCommission'] : ['groupSettings'];

    setTabValue(prev => (allowedTabs.includes(prev) ? prev : getDefaultTabValue(type)));
  }, [type]);

  const handleTabValueChange = (value: string) => {
    if (value === 'groupSettings' || value === 'customerCommission') {
      setTabValue(value);
    }
  };

  const settingTabs = useMemo(
    () =>
      [
        {
          value: 'groupSettings' as const,
          labelKey: 'commissionRebateSettings.tabs.1',
          component: <CommissionSettingPage type={type} />,
          visible: true,
        },
        {
          value: 'customerCommission' as const,
          labelKey: 'commissionRebateSettings.tabs.2',
          component: <CustomerCommissionPage />,
          visible: type === 'trading',
        },
      ].filter(i => i.visible),
    [type],
  );
  return (
    <>
      <div className="relative flex flex-col gap-3 md:flex-row md:gap-8">
        <div className="flex-1">
          <Tabs value={tabValue} onValueChange={handleTabValueChange} className="flex-1 gap-3">
            <TabsList>
              {settingTabs.map(i => (
                <TabsTrigger key={i.value} value={i.value}>
                  {t(i.labelKey)}
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

        {tabValue === 'customerCommission' && (
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
