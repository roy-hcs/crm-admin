import { AccountOpeningBonusPage } from '@/pages/marketing/account-opening-bonus/AccountOpeningBonusPage';
import { AdsPage } from '@/pages/marketing/ads/AdsPage';
import { DepositBonusPage } from '@/pages/marketing/deposit-bonus/DepositBonusPage';
import { NetBonusRewardConfigPage } from '@/pages/marketing/net-bonus/reward-config/NetBonusRewardConfigPage';
import { NetBonusRewardRecordsDetailPage } from '@/pages/marketing/net-bonus/reward-records-detail/NetBonusRewardRecordsDetailPage';
import { NetBonusRewardRecordsPage } from '@/pages/marketing/net-bonus/reward-records/NetBonusRewardRecordsPage';
import { NetBonusRewardReportsPage } from '@/pages/marketing/net-bonus/reward-reports/NetBonusRewardReportsPage';
import { NetBonusStatisticsPage } from '@/pages/marketing/net-bonus/statistics/NetBonusStatisticsPage';
import { ReferralBonusPage } from '@/pages/marketing/referral-bonus/ReferralBonusPage';
import { RewardConfigPage } from '@/pages/marketing/reward-configs/RewardConfigsPage';
import { RewardRecordsDetailPage } from '@/pages/marketing/reward-records-detail/RewardRecordsDetailPage';
import { RewardRecordsPage } from '@/pages/marketing/reward-records/RewardRecordsPage';
import { TransactionBonusPage } from '@/pages/marketing/transaction-bonus/TransactionBonusPage';
import { RouteObject, useSearchParams } from 'react-router-dom';

const RewardRecordsDetailPageWrapper = () => {
  const [searchParams] = useSearchParams();
  return <RewardRecordsDetailPage key={searchParams.get('id')} />;
};
const NetBonusRewardRecordsDetailPageWrapper = () => {
  const [searchParams] = useSearchParams();
  return <NetBonusRewardRecordsDetailPage key={searchParams.get('id')} />;
};

const ReferralBonusPageWrapper = () => {
  const [searchParams] = useSearchParams();
  return <ReferralBonusPage key={searchParams.get('id')} />;
};

const AccountOpeningBonusPageWrapper = () => {
  const [searchParams] = useSearchParams();
  return <AccountOpeningBonusPage key={searchParams.get('id')} />;
};

const DepositBonusPageWrapper = () => {
  const [searchParams] = useSearchParams();
  return <DepositBonusPage key={searchParams.get('id')} />;
};

const TransactionBonusPageWrapper = () => {
  const [searchParams] = useSearchParams();
  return <TransactionBonusPage key={searchParams.get('id')} />;
};

/**
 * Marketing Management routes - corresponds to "营销管理" menu item
 *
 * Routes:
 * - /marketing/reward-config    - 奖励配置 (Reward Configuration)
 * - /marketing/reward-records   - 奖励记录 (Reward Records)
 * - /marketing/ads              - 广告管理 (Ads Management)
 * - /marketing/net-bonus/reward-config       - 净入金奖励配置 (Net Bonus Reward Configuration)
 * - /marketing/net-bonus/reward-records       - 净入金奖励记录 (Net Bonus Reward Records)
 * - /marketing/net-bonus/reward-reports        - 净入金奖励报表 (Net Bonus Reward Reports)
 * - /marketing/net-bonus/statistics      - 净入金统计报表 (Net Bonus Statistics Reports)
 */
export const marketingRoutes: RouteObject[] = [
  {
    path: '/marketing/reward-config',
    element: <RewardConfigPage />,
  },
  {
    path: '/marketing/reward-records',
    element: <RewardRecordsPage />,
  },
  {
    path: '/marketing/reward-records/detail',
    element: <RewardRecordsDetailPageWrapper />,
  },
  {
    path: '/marketing/ads',
    element: <AdsPage />,
  },
  {
    path: '/marketing/net-bonus/reward-config',
    element: <NetBonusRewardConfigPage />,
  },
  {
    path: '/marketing/net-bonus/reward-records',
    element: <NetBonusRewardRecordsPage />,
  },
  {
    path: '/marketing/net-bonus/reward-records/detail',
    element: <NetBonusRewardRecordsDetailPageWrapper />,
  },
  {
    path: '/marketing/net-bonus/reward-reports',
    element: <NetBonusRewardReportsPage />,
  },
  {
    path: '/marketing/net-bonus/statistics',
    element: <NetBonusStatisticsPage />,
  },
  {
    path: '/marketing/reward-config/referral-bonus',
    element: <ReferralBonusPageWrapper />,
  },
  {
    path: '/marketing/reward-config/account-opening-bonus',
    element: <AccountOpeningBonusPageWrapper />,
  },
  {
    path: '/marketing/reward-config/account-opening-bonus',
    element: <AccountOpeningBonusPageWrapper />,
  },
  {
    path: '/marketing/reward-config/deposit-bonus',
    element: <DepositBonusPageWrapper />,
  },
  {
    path: '/marketing/reward-config/transaction-bonus',
    element: <TransactionBonusPageWrapper />,
  },
];
