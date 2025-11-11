import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { AllTab } from './all/AllPage';
import { UnassignedTab } from './unassigned/UnassignedPage';

export const TicketListPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="text-title">{t('ticketList.title')}</h1>
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="dark:bg-accent bg-slate-100">
          <TabsTrigger value="account">{t('common.all')}</TabsTrigger>
          <TabsTrigger value="volume">{t('common.unassigned')}</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <AllTab />
        </TabsContent>
        <TabsContent value="volume">
          <UnassignedTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
