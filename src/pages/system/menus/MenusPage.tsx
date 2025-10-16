import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { ManagementMenuTab } from './ManagementMenuTab';
import { UserMenuTab } from './UserMenuTab';

export const MenusPage = () => {
  const { t } = useTranslation();

  return (
    <Tabs defaultValue="management">
      <TabsList className="dark:bg-accent bg-slate-100">
        <TabsTrigger value="management">{t('menuManagement.managementBackend')}</TabsTrigger>
        <TabsTrigger value="user">{t('menuManagement.userFrontend')}</TabsTrigger>
      </TabsList>
      <TabsContent value="management">
        <ManagementMenuTab />
      </TabsContent>
      <TabsContent value="user">
        <UserMenuTab />
      </TabsContent>
    </Tabs>
  );
};
