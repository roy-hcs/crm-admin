import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserTab } from './user/UserTab';
import { useTranslation } from 'react-i18next';
import { AdministratorTab } from './admin-istrator/AdministratorTab';

export const RolesPage = () => {
  const { t } = useTranslation();
  return (
    <Tabs defaultValue="administrator">
      <TabsList className="dark:bg-accent bg-slate-100">
        <TabsTrigger value="administrator">{t('rolesManagement.administrator')}</TabsTrigger>
        <TabsTrigger value="user">{t('common.users')}</TabsTrigger>
      </TabsList>
      <TabsContent value="administrator">
        <AdministratorTab />
      </TabsContent>
      <TabsContent value="user">
        <UserTab />
      </TabsContent>
    </Tabs>
  );
};
