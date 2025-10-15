import {
  useGetPreferences,
  useServerExceptionNotice,
  useServerList,
} from '@/api/hooks/system/system';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { NavList } from './NavList';
import { OverviewDepositWithdrawal } from './OverviewDepositWithdrawal';
import { DataOverview } from './DataOverview';
import { TradingInstrument } from './TradingInstrument';
import { AccountActivation } from './AccountActivation';
import { CustomerTransactions } from './CustomerTransactions';
import { FundsTransit } from './FundsTransit';
import { Step } from './step';
import { Todo } from './todo';
import { ServerItem } from '@/api/hooks/system/types';
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
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-title">{t('home.DataOverview')}</h1>
        <div className="text-xs font-normal">
          {t('home.DataUpdateTime')}: {dataUpdateTime}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-[1fr_18.5rem]">
        <div>
          <DataOverview />

          <NavList />

          <OverviewDepositWithdrawal />

          <TradingInstrument serverList={serverList} />

          <AccountActivation />

          {serverList && serverList?.length > 0 && <CustomerTransactions serverList={serverList} />}

          <FundsTransit />
        </div>
        <div className="lg:flex lg:gap-6 xl:block xl:gap-0">
          {serverExceptionNotice && serverExceptionNotice.length > 0 && (
            <div className="bg-card mb-6 w-74 rounded-lg border py-4">
              <Step serverExceptionNotice={serverExceptionNotice} />
            </div>
          )}
          {preferences && preferences.length > 0 && (
            <div className="bg-card w-74 rounded-lg border p-6">
              <Todo preferences={preferences} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
