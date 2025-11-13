import { memo, useMemo, useState, Suspense, lazy } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
const MyTicketAllList = lazy(() =>
  import('./my-ticket-all/MyTicketAllList').then(m => ({ default: m.MyTicketAllList })),
);
const MyTicketUnassignedList = lazy(() =>
  import('./my-ticket-unassigned/MyTicketUnassignedList').then(m => ({
    default: m.MyTicketUnassignedList,
  })),
);
const MyTicketProcessingList = lazy(() =>
  import('./my-ticket-processing/MyTicketProcessingList').then(m => ({
    default: m.MyTicketProcessingList,
  })),
);
const MyTicketConcernedList = lazy(() =>
  import('./my-ticket-concerned/MyTicketConcernedList').then(m => ({
    default: m.MyTicketConcernedList,
  })),
);
const MyTicketCcmeList = lazy(() =>
  import('./my-ticket-ccme/MyTicketCcmeList').then(m => ({ default: m.MyTicketCcmeList })),
);
const MyTicketCreatedList = lazy(() =>
  import('./my-ticket-created/MyTicketCreatedList').then(m => ({ default: m.MyTicketCreatedList })),
);

type TabItem = { value: string; textKey: string };

const TABS: TabItem[] = [
  { value: '1', textKey: 'myTicket.tabs.1' },
  { value: '2', textKey: 'myTicket.tabs.2' },
  { value: '3', textKey: 'myTicket.tabs.3' },
  { value: '4', textKey: 'myTicket.tabs.4' },
  { value: '5', textKey: 'myTicket.tabs.5' },
  { value: '6', textKey: 'myTicket.tabs.6' },
];

export const MyTicketsPage = memo(function MyTicketsPage() {
  const { t } = useTranslation();
  const [active, setActive] = useState<string>('1');

  const tabTriggers = useMemo(
    () =>
      TABS.map(tab => (
        <TabsTrigger key={tab.value} value={tab.value}>
          {t(tab.textKey)}
        </TabsTrigger>
      )),
    [t],
  );

  return (
    <div>
      <h1 className="text-title">{t('myTicket.title')}</h1>
      <Tabs value={active} onValueChange={setActive} className="w-full">
        <TabsList className="dark:bg-accent bg-slate-100">{tabTriggers}</TabsList>
        <TabsContent value={active}>
          <Suspense
            fallback={
              <div className="text-muted p-4 text-center text-sm">{t('common.loading')}</div>
            }
          >
            {active === '1' && <MyTicketAllList />}
            {active === '2' && <MyTicketUnassignedList />}
            {active === '3' && <MyTicketProcessingList />}
            {active === '4' && <MyTicketConcernedList />}
            {active === '5' && <MyTicketCcmeList />}
            {active === '6' && <MyTicketCreatedList />}
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
});
