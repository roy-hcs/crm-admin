import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { AccountsPage } from './account/AccountsPage';
import { TemporaryAccountPage } from './temporary-account/TemporaryAccountPage';

export const AdminAccountsPage = () => {
  const { t } = useTranslation();
  return (
    <Tabs defaultValue="1" className="w-full">
      <TabsList className="dark:bg-accent bg-slate-100">
        <TabsTrigger value="1">{t('adminAccounts.tabs.1')}</TabsTrigger>
        <TabsTrigger value="2">{t('adminAccounts.tabs.2')}</TabsTrigger>
      </TabsList>
      <TabsContent value="1">
        <AccountsPage />
      </TabsContent>
      <TabsContent value="2">
        <TemporaryAccountPage />
      </TabsContent>
    </Tabs>
  );
};
