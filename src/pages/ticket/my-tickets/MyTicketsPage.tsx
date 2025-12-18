import { memo, useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { MyTicketList } from './common/MyTicketList';
import { TicketTabsParams } from '@/api/hooks/ticket/types';

type TabItem = { value: string; textKey: string; mode: TicketTabsParams };

const TABS: TabItem[] = [
  { value: '1', textKey: 'myTicket.tabs.1', mode: 'all' },
  { value: '2', textKey: 'myTicket.tabs.2', mode: 'unprocessed' },
  { value: '3', textKey: 'myTicket.tabs.3', mode: 'processing' },
  { value: '4', textKey: 'myTicket.tabs.4', mode: 'concerned' },
  { value: '5', textKey: 'myTicket.tabs.5', mode: 'ccme' },
  { value: '6', textKey: 'myTicket.tabs.6', mode: 'created' },
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
      <PageInfo title={t('myTicket.title')} />
      <Tabs value={active} onValueChange={setActive} className="w-full">
        <TabsList className="dark:bg-accent bg-slate-100">{tabTriggers}</TabsList>
        <TabsContent value={active}>
          <MyTicketList mode={TABS.find(tab => tab.value === active)?.mode as TicketTabsParams} />
        </TabsContent>
      </Tabs>
    </div>
  );
});
