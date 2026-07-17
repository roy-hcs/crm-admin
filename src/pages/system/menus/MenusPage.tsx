import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { ManagementMenuTab } from './management/ManagementMenuTab';
import { UserMenuTab } from './user/UserMenuTab';

export const MenusPage = () => {
  const { t } = useTranslation();
  const tabs = [
    {
      value: 'management',
      label: t('menuManagement.managementBackend'),
      content: <ManagementMenuTab />,
    },
    {
      value: 'user',
      label: t('menuManagement.userFrontend'),
      content: <UserMenuTab />,
    },
  ];

  return (
    <Tabs defaultValue="management" className="mt-3.5">
      <TabsList className="dark:bg-accent bg-slate-100">
        {tabs.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(tab => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};
