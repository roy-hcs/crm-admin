import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from './contexts/auth';
import { QueryProvider } from './contexts/query';
import { ErrorProvider } from '@/contexts/error';
import { ErrorAlert } from './components/common/ErrorAlert';
import { Suspense } from 'react';
import { NotFoundPage } from './pages/NotFoundPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AppError } from './components/common/AppError';

function App() {
  return (
    <ErrorBoundary fallback={<AppError />}>
      <ErrorProvider>
        <QueryProvider>
          <AuthProvider>
            <ErrorAlert />
            <Suspense fallback={<div className="loading">Loading...</div>}>
              <RouterProvider router={router} fallbackElement={<NotFoundPage />} />
            </Suspense>
          </AuthProvider>
        </QueryProvider>
      </ErrorProvider>
    </ErrorBoundary>
  );
}

export default App;
