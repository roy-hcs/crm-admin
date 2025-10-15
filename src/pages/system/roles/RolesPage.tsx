import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdministratorTab } from './AdministratorTab';
import { UserTab } from './UserTab';
import { useTranslation } from 'react-i18next';

export const RolesPage = () => {
  const { t } = useTranslation();
  return (
    <Tabs defaultValue="administrator">
      <TabsList className="dark:bg-accent bg-slate-100">
        <TabsTrigger value="administrator">{t('rolesManagement.administrator')}</TabsTrigger>
        <TabsTrigger value="user">{t('rolesManagement.users')}</TabsTrigger>
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
