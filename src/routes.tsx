import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './components/layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SettingPage } from './pages/SettingPage';
import { ProfilePage } from './pages/ProfilePage';
import { SalesReportPage } from './pages/SalesReportPage';

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
