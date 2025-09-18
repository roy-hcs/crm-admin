import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './components/layouts/MainLayout';
import { HomePage } from './pages/HomePage/index';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SettingPage } from './pages/SettingPage';
import { ProfilePage } from './pages/ProfilePage';
import { SalesReportPage } from './pages/SalesReportPage';
import { CRMAccounts } from './pages/account/CRMAccounts/CRMAccounts';
import { ClientTrackingPage } from '@/pages/reports/ib/client-tracking';
import { OverviewPage } from './pages/reports/ib/overview';
import { TradingPage } from './pages/reports/commission/trading';
import { FeesPage } from './pages/reports/commission/fees';
import { DepositsPage } from './pages/reports/commission/deposits';
import { DailyRebatePage } from './pages/reports/commission/daily-rebate';
import { WeeklyRebatePage } from './pages/reports/commission/weekly-rebate';
import { TradingHistoryPage } from './pages/reports/trading/history/TradingHistoryPage';
import { PositionOrderPage } from './pages/reports/trading/positionOrder/PositionOrderPage';
// Import other pages as needed

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // All pages that should use MainLayout
      // TODO: Need to organize routes better
      {
        index: true, // Makes this the default route under parent
        element: <HomePage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'settings',
        element: <SettingPage />,
      },
      {
        path: 'reports/sales',
        element: <SalesReportPage />,
      },
      {
        path: '/account/crm-accounts',
        element: <CRMAccounts />,
      },
      // 佣金报表
      {
        path: '/reports/commission/trading',
        element: <TradingPage />,
      },
      // 手续费佣金报表
      {
        path: '/reports/commission/fees',
        element: <FeesPage />,
      },
      // 入金佣金报表
      {
        path: '/reports/commission/deposits',
        element: <DepositsPage />,
      },
      // 日结返佣
      {
        path: '/reports/commission/daily-rebate',
        element: <DailyRebatePage />,
      },
      // 周结返佣
      {
        path: '/reports/commission/weekly-rebate',
        element: <WeeklyRebatePage />,
      },
      {
        path: '/reports/trading/history',
        element: <TradingHistoryPage />,
      },
      {
        path: '/reports/trading/open-positions',
        element: <PositionOrderPage />,
      },
      // ib客户追踪
      {
        path: '/reports/ib/client-tracking',
        element: <ClientTrackingPage />,
      },
      // ib数据总览
      {
        path: '/reports/ib/overview',
        element: <OverviewPage />,
      },
      // Add more routes that should use MainLayout here
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  // Routes that don't use MainLayout
  {
    path: '/login',
    element: <LoginPage />,
  },
  // Global catch-all route for 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
