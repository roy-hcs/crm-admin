import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from './contexts/auth';
import { ErrorProvider } from '@/contexts/error';
import { ErrorAlert } from './components/common/ErrorAlert';
import { Suspense } from 'react';
import { NotFoundPage } from './pages/NotFoundPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AppError } from './components/common/AppError';
import { Toaster } from 'sonner';

function App() {
  return (
    <ErrorBoundary fallback={<AppError />}>
      <ErrorProvider>
        <AuthProvider>
          <ErrorAlert />
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <RouterProvider router={router} fallbackElement={<NotFoundPage />} />
            <Toaster richColors position="top-center" />
          </Suspense>
        </AuthProvider>
      </ErrorProvider>
    </ErrorBoundary>
  );
}

export default App;
