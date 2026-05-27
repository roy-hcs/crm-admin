import { PerformanceFeeRecordPage } from '@/pages/copy-trading/performance-fee-record/PerformanceFeeRecordPage';
import { OrderManagementPage } from '@/pages/copy-trading/order-management/OrderManagementPage';
import { AgreementSettingsPage } from '@/pages/copy-trading/agreement-settings/AgreementSettingsPage';
import { SignalReviewPage } from '@/pages/copy-trading/signal-review/SignalReviewPage';
import { SignalsPage } from '@/pages/copy-trading/signals/SignalsPage';
import { VarietyManagementPage } from '@/pages/copy-trading/variety-management/VarietyManagementPage';
import { RouteObject, useSearchParams } from 'react-router-dom';
import { SettingsPage } from '@/pages/copy-trading/settings/SettingsPage';
import { PerformanceFeeRebatePage } from '@/pages/copy-trading/performance-fee-rebate/PerformanceFeeRebatePage';
import { PerformanceVerifyDetailPage } from '@/pages/copy-trading/performance-fee-rebate-verify-detail/PerformanceVerifyDetailPage';

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

const PerformanceVerifyDetailPageWrapper = () => {
  const [searchParams] = useSearchParams();
  return <PerformanceVerifyDetailPage key={searchParams.get('id')} />;
};

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
  {
    path: '/copy-trading/performance-fee-record',
    element: <PerformanceFeeRecordPage />,
  },
  {
    path: '/copy-trading/agreement-settings',
    element: <AgreementSettingsPage />,
  },
  {
    path: '/copy-trading/order-management',
    element: <OrderManagementPage />,
  },
  {
    path: '/copy-trading/settings',
    element: <SettingsPage />,
  },
  {
    path: '/copy-trading/performance-fee-rebate',
    element: <PerformanceFeeRebatePage />,
  },
  {
    path: '/copy-trading/performance-fee-rebate/verify-detail',
    element: <PerformanceVerifyDetailPageWrapper />,
  },
  // TODO: Add routes as pages are developed
  /*
  {
    path: '/copy-trading/dashboard',
    element: <CopyTradingDashboardPage />,
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
