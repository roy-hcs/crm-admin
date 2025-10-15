import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { LoginPage } from '@/pages/LoginPage';
import { AppError } from '@/components/common/AppError';

// Import all route modules
import { workbenchRoutes } from './workbenchRoutes.tsx';
import { systemRoutes } from './systemRoutes';
import { settingsRoutes } from './settingsRoutes';
import { accountRoutes } from './accountRoutes';
import { reportRoutes } from './reportRoutes';
import { marketingRoutes } from './marketingRoutes';
import { pointsMallRoutes } from './pointsMallRoutes';
import { messageRoutes } from './messageRoutes';
import { reviewRoutes } from './reviewRoutes';
import { fundRoutes } from './fundRoutes';
import { rebateRoutes } from './rebateRoutes';
import { ticketRoutes } from './ticketRoutes';
import { pammRoutes } from './pammRoutes';
import { copyTradingRoutes } from './copyTradingRoutes';

// Create and export the router
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <AppError />,
    children: [
      ...workbenchRoutes,
      ...systemRoutes,
      ...settingsRoutes,
      ...accountRoutes,
      ...reportRoutes,
      ...marketingRoutes,
      ...pointsMallRoutes,
      ...messageRoutes,
      ...reviewRoutes,
      ...fundRoutes,
      ...rebateRoutes,
      ...ticketRoutes,
      ...pammRoutes,
      ...copyTradingRoutes,

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
    errorElement: <AppError />,
  },
  // Global catch-all route for 404
  {
    path: '*',
    element: <NotFoundPage />,
    errorElement: <AppError />,
  },
]);
