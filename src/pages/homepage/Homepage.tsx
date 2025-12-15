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
import { HomeExceptionPrompt } from './components/HomeExceptionPrompt';
import { HomeTodo } from './components/HomeTodo';
import { useMemo } from 'react';
import { PageInfo } from '@/components/common/PageInfo';

export function HomePage() {
  const { t } = useTranslation();

  const { data: serverListRes } = useServerList();
  const { data: serverExceptionNotice } = useServerExceptionNotice();

  const { data: preferences } = useGetPreferences();

  const serverList: ServerItem[] = useMemo(() => serverListRes?.rows ?? [], [serverListRes?.rows]);
  const dataUpdateTime = useMemo(() => dayjs().format('YYYY-MM-DD HH:mm'), []);

  return (
    <div>
      <PageInfo
        title={t('home.DataOverview')}
        desc={
          <>
            {t('home.DataUpdateTime')}: {dataUpdateTime}
          </>
        }
      />
      <div className="mt-3 grid gap-8 sm:grid-cols-1 lg:mt-9 lg:grid-cols-1 xl:grid-cols-[1fr_365px]">
        <div className="w-full">
          <DataOverview />

          <div className="my-6">
            <NavList />
          </div>

          <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
            <OverviewDepositWithdrawal />
            <AccountActivation />
          </div>

          <div className="my-6">
            <TradingInstrument serverList={serverList} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 2xl:grid-cols-2">
            <CustomerTransactions serverList={serverList} />
            <FundsTransit />
          </div>
        </div>
        <div className="flex flex-col lg:gap-6 xl:gap-6">
          {serverExceptionNotice && serverExceptionNotice?.length > 0 && (
            <HomeExceptionPrompt serverExceptionNotice={serverExceptionNotice} />
          )}
          {preferences && preferences?.length > 0 && <HomeTodo preferences={preferences} />}
        </div>
      </div>
    </div>
  );
}
