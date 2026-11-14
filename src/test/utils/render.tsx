import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext, type AuthContextType } from '@/contexts/auth/auth-context';
import i18n from '@/i18n/i18n';

/**
 * renderWithProviders（P0 基建骨架，react-test-plan.md §10）：
 * - 每个用例新建 QueryClient（retry:false、gcTime:0，防 TanStack Query 缓存串味）；
 * - MemoryRouter：组件内链接 / 跳转不触真实路由；
 * - I18nextProvider：setup.ts 已将语言固定为 zh；
 * - Auth 桩：直接挂 AuthContext（不渲染真实 AuthProvider，不触发登录副作用）。
 */
const authStub: AuthContextType = {
  isAuthenticated: true,
  logout: () => {},
  user: null,
};

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, refetchOnWindowFocus: false },
      mutations: { retry: false },
    },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={['/']}>
            <AuthContext.Provider value={authStub}>{children}</AuthContext.Provider>
          </MemoryRouter>
        </I18nextProvider>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}
