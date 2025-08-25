import React from 'react';
import { HomePage } from '../pages/HomePage/index';
import { LoginPage } from '../pages/LoginPage';

export interface RouteConfig {
  path: string;
  component: React.ComponentType<Record<string, unknown>>;
  protected?: boolean;
  children?: RouteConfig[];
}

export const routes: RouteConfig[] = [
  {
    path: '/login',
    component: LoginPage,
    protected: false,
  },
  {
    path: '/',
    component: HomePage,
    protected: true,
  },
  // Add more routes here as your application grows
];
