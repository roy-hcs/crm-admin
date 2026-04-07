import { RouterProvider } from 'react-router-dom';
import { router } from './routes/index';
import { AuthProvider } from './contexts/auth';
import { ErrorProvider } from '@/contexts/error';
import { ErrorAlert } from './components/common/ErrorAlert';
import { Suspense } from 'react';
import { NotFoundPage } from './pages/NotFoundPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AppError } from './components/common/AppError';
import { Toaster } from 'sonner';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/tanstack-query';
import { LoadingProvider } from './contexts/loading';

function App() {
  return (
    <ErrorBoundary fallback={<AppError />}>
      <ErrorProvider>
        <QueryClientProvider client={queryClient}>
          <LoadingProvider>
            <AuthProvider>
              <ErrorAlert />
              <Suspense fallback={<div className="loading">Loading...</div>}>
                <RouterProvider router={router} fallbackElement={<NotFoundPage />} />
                <Toaster richColors position="top-center" />
              </Suspense>
            </AuthProvider>
          </LoadingProvider>
        </QueryClientProvider>
      </ErrorProvider>
    </ErrorBoundary>
  );
}

export default App;
