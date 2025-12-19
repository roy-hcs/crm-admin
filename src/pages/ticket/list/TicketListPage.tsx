import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { TicketAllList } from './TicketAllList';
import { TicketUnassignedList } from './TicketUnassignedList';

export const TicketListPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <PageInfo title={t('ticketList.title')} />
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="dark:bg-accent bg-slate-100">
          <TabsTrigger value="account">{t('common.all')}</TabsTrigger>
          <TabsTrigger value="volume">{t('common.unassigned')}</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <TicketAllList />
        </TabsContent>
        <TabsContent value="volume">
          <TicketUnassignedList />
        </TabsContent>
      </Tabs>
    </div>
  );
};
