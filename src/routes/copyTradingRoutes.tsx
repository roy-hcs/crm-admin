import { SignalReviewPage } from '@/pages/copy-trading/signal-review/SignalReviewPage';
import { SignalsPage } from '@/pages/copy-trading/signals/SignalsPage';
import { VarietyManagementPage } from '@/pages/copy-trading/variety-management/VarietyManagementPage';
import { RouteObject } from 'react-router-dom';

/**
 * Copy Trading routes - corresponds to "CopyTrading" menu item
 *
 * Routes:
 * - /copy-trading/dashboard           - Dashboard
 * - /copy-trading/settings            - 设置 (Settings)
 * - /copy-trading/signals             - 信号源 (Signals)
 * - /copy-trading/agreement-settings  - 协议设置 (Agreement Settings)
 * - /copy-trading/signal-review       - 信号源审核 (Signal Review)
 * - /copy-trading/order-management    - 订单管理 (Order Management)
 * - /copy-trading/copy-trade          - Copy Trade
 */
export const copyTradingRoutes: RouteObject[] = [
  {
    path: '/copy-trading/signals',
    element: <SignalsPage />,
  },
  {
    path: '/copy-trading/signal-review',
    element: <SignalReviewPage />,
  },
  {
    path: '/copy-trading/variety-management',
    element: <VarietyManagementPage />,
  },
  // TODO: Add routes as pages are developed
  /*
  {
    path: '/copy-trading/dashboard',
    element: <CopyTradingDashboardPage />,
  },
  {
    path: '/copy-trading/settings',
    element: <CopyTradingSettingsPage />,
  },
  {
    path: '/copy-trading/signals',
    element: <SignalsPage />,
  },
  {
    path: '/copy-trading/agreement-settings',
    element: <AgreementSettingsPage />,
  },
  {
    path: '/copy-trading/signal-review',
    element: <SignalReviewPage />,
  },
  {
    path: '/copy-trading/order-management',
    element: <OrderManagementPage />,
  },
  {
    path: '/copy-trading/copy-trade',
    element: <CopyTradePage />,
  },
  */
];
