import { AdsPage } from '@/pages/marketing/ads/AdsPage';
import { NetBonusRewardReportsPage } from '@/pages/marketing/net-bonus/reward-reports/NetBonusRewardReportsPage';
import { RewardConfigPage } from '@/pages/marketing/reward-configs/RewardConfigsPage';
import { RewardRecordsPage } from '@/pages/marketing/reward-records/RewardRecordsPage';
import { RouteObject } from 'react-router-dom';

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
    path: '/marketing/ads',
    element: <AdsPage />,
  },
  // {
  //   path: '/marketing/net-bonus/reward-config',
  //   element: <RewardConfigPage />,
  // },
  // {
  //   path: '/marketing/net-bonus/reward-records',
  //   element: <RewardRecordsPage />,
  // },
  {
    path: '/marketing/net-bonus/reward-reports',
    element: <NetBonusRewardReportsPage />,
  },
  // {
  //   path: '/marketing/net-bonus/statistics',
  //   element: <RewardConfigPage />,
  // },
];
