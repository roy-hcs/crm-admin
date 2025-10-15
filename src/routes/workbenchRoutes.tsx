import { RouteObject } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { SalesReportPage } from '@/pages/SalesReportPage';

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
    element: <SalesReportPage />, // Temporarily mapped to SalesReportPage - replace when proper page is created
  },
];
