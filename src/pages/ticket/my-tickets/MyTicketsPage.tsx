import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { MyTicketAllList } from './my-ticket-all/MyTicketAllList';
import { MyTicketUnassignedList } from './my-ticket-unassigned/MyTicketUnassignedList';
import { MyTicketProcessingList } from './my-ticket-processing/MyTicketProcessingList';
import { MyTicketConcernedList } from './my-ticket-concerned/MyTicketConcernedList';
import { MyTicketCcmeList } from './my-ticket-ccme/MyTicketCcmeList';
import { MyTicketCreatedList } from './my-ticket-created/MyTicketCreatedList';

export const MyTicketsPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="text-title">{t('myTicket.title')}</h1>
      <Tabs defaultValue="1" className="w-full">
        <TabsList className="dark:bg-accent bg-slate-100">
          <TabsTrigger value="1">{t('myTicket.tabs.1')}</TabsTrigger>
          <TabsTrigger value="2">{t('myTicket.tabs.2')}</TabsTrigger>
          <TabsTrigger value="3">{t('myTicket.tabs.3')}</TabsTrigger>
          <TabsTrigger value="4">{t('myTicket.tabs.4')}</TabsTrigger>
          <TabsTrigger value="5">{t('myTicket.tabs.5')}</TabsTrigger>
          <TabsTrigger value="6">{t('myTicket.tabs.6')}</TabsTrigger>
        </TabsList>
        <TabsContent value="1">
          <MyTicketAllList />
        </TabsContent>
        <TabsContent value="2">
          <MyTicketUnassignedList />
        </TabsContent>
        <TabsContent value="3">
          <MyTicketProcessingList />
        </TabsContent>
        <TabsContent value="4">
          <MyTicketConcernedList />
        </TabsContent>
        <TabsContent value="5">
          <MyTicketCcmeList />
        </TabsContent>
        <TabsContent value="6">
          <MyTicketCreatedList />
        </TabsContent>
      </Tabs>
    </div>
  );
};
