import {
  useGetPreferences,
  useServerExceptionNotice,
  useServerList,
  ServerItem,
} from '@/api/hooks/workbench';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { NavList } from './components/NavList';
import { OverviewDepositWithdrawal } from './components/OverviewDepositWithdrawal';
import { DataOverview } from './components/DataOverview';
import { TradingInstrument } from './components/TradingInstrument';
import { AccountActivation } from './components/AccountActivation';
import { CustomerTransactions } from './components/CustomerTransactions';
import { FundsTransit } from './components/FundsTransit';
import { Step } from './components/Step';
import { Todo } from './components/Todo';
import { useMemo } from 'react';

export function HomePage() {
  const { t } = useTranslation();

  const { data: serverListRes } = useServerList();
  const { data: serverExceptionNotice } = useServerExceptionNotice();

  const { data: preferences } = useGetPreferences();

  const serverList: ServerItem[] = useMemo(() => serverListRes?.rows ?? [], [serverListRes?.rows]);
  const dataUpdateTime = useMemo(() => dayjs().format('YYYY-MM-DD HH:mm'), []);

  return (
    <div>
      <h1 className="text-card-foreground text-xl leading-7 font-semibold">
        {t('home.DataOverview')}
      </h1>
      <div className="text-muted-foreground text-sm leading-5 font-normal">
        {t('home.DataUpdateTime')}: {dataUpdateTime}
      </div>
      <div className="mt-3 grid gap-8 sm:grid-cols-1 lg:mt-12 lg:grid-cols-1 xl:grid-cols-[1fr_365px]">
        <div className="w-full">
          <DataOverview />

          <div className="mt-6 mb-6">
            <NavList />
          </div>

          <OverviewDepositWithdrawal />

          <div className="mt-6 mb-6">
            <TradingInstrument serverList={serverList} />
          </div>

          <AccountActivation />

          <div className="mt-6 mb-6">
            <CustomerTransactions serverList={serverList} />
          </div>

          <FundsTransit />
        </div>
        <div className="flex flex-col lg:gap-6 xl:gap-6">
          {serverExceptionNotice && serverExceptionNotice?.length > 0 && (
            <Step serverExceptionNotice={serverExceptionNotice} />
          )}
          {preferences && preferences?.length > 0 && <Todo preferences={preferences} />}
        </div>
      </div>
    </div>
  );
}
