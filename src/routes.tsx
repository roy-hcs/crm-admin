import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './components/layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Import other pages as needed

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // All pages that should use MainLayout
      {
        index: true, // Makes this the default route under parent
        element: <HomePage />,
      },
      // {
      //   path: 'customers',
      //   element: <CustomersPage />,
      // },
      // {
      //   path: 'settings',
      //   element: <SettingsPage />,
      // },
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
