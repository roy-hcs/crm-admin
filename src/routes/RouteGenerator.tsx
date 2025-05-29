import { Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { type RouteConfig } from './routeConfig';

export const generateRoutes = (routes: RouteConfig[]) => {
  const routeElements = routes.map(route => {
    const RouteComponent = route.component;

    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          route.protected ? (
            <ProtectedRoute>
              <RouteComponent />
            </ProtectedRoute>
          ) : (
            <RouteComponent />
          )
        }
      />
    );
  });

  // Add the catch-all route
  routeElements.push(<Route key="catch-all" path="*" element={<Navigate to="/" />} />);

  return routeElements;
};
