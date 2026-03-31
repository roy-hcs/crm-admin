import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { TicketAll } from './ticket-all/TicketAll';
import { TicketUnassigned } from './ticket-unassigned/TicketUnassigned';

export const TicketListPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <PageInfo title={t('ticketList.title')} />
      <Tabs defaultValue="2" className="w-full">
        <TabsList className="dark:bg-accent bg-slate-100">
          <TabsTrigger value="1">{t('common.all')}</TabsTrigger>
          <TabsTrigger value="2">{t('common.unassigned')}</TabsTrigger>
        </TabsList>
        <TabsContent value="1">
          <TicketAll />
        </TabsContent>
        <TabsContent value="2">
          <TicketUnassigned />
        </TabsContent>
      </Tabs>
    </div>
  );
};
