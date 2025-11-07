import { RouteObject } from 'react-router-dom';
import { HomePage } from '@/pages/home-page';
import { TradingStatsPage } from '@/pages/work-bench/trading-stats';

/**
 * Workbench routes - corresponds to "工作台" menu item
 *
 * Routes:
 * - /              - 平台概览 (Platform Overview)
 * - /workbench/trading-stats - 交易统计 (Trading Statistics)
 */
export const workbenchRoutes: RouteObject[] = [
  {
    index: true, // Makes this the default route under parent
    element: <HomePage />,
  },
  {
    path: '/workbench/trading-stats',
    element: <TradingStatsPage />, // Temporarily mapped to SalesReportPage - replace when proper page is created
  },
];
