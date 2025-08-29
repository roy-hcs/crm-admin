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
