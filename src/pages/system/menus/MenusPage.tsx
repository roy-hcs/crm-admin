import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { ManagementMenuTab } from './ManagementMenuTab';
import { UserMenuTab } from './UserMenuTab';

export const MenusPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <PageInfo title={t('menuManagement.title')} />
      <Tabs defaultValue="management" className="mt-3.5">
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
    </div>
  );
};
