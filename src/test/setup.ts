import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './msw/server';

/**
 * 全局 setup（P0 复议后结构，P0-REWORK-ORDER-v2.md §2.1 / 清单 §11.2）：
 * 1. jest-dom 匹配器；
 * 2. 浏览器 API 桩（缺失时才打桩）与 i18n 固定中文——仅 DOM 环境执行
 *    （i18n.ts 顶层引用 document，node 环境导入会报错，故用动态导入包在 DOM 分支内）；
 * 3. MSW 三段生命周期——**无条件执行，node / dom 双 project 均生效**
 *    （M1 必修：曾包在 DOM 分支里，node project 下 window 未定义导致 MSW 从未启动，
 *    未声明请求会真的发出去还可能显示绿，R-5 破防）。
 * MSW 拦 fetch（而非直接 vi.mock('fetch')），保留 client.ts 的 flatten / 401 / redirect 逻辑；
 * `onUnhandledRequest: 'error'` 是刻意的：任何未声明的请求都让用例失败，
 * 避免「打了真接口还以为绿了」。
 */
if (typeof window !== 'undefined') {
  /* 运行时判断而非 `in` 窄化：lib.dom 认为以下属性恒存在（`in` 的 false 分支
   * 会把 window 收窄成 never），但 jsdom 实际缺失它们。 */
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string): MediaQueryList =>
        ({
          matches: false,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }) as MediaQueryList,
    });
  }

  if (typeof window.ResizeObserver === 'undefined') {
    class ResizeObserverStub {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    }
    window.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
  }

  if (typeof window.IntersectionObserver === 'undefined') {
    class IntersectionObserverStub {
      root: Element | Document | null = null;
      rootMargin: string = '';
      thresholds: readonly number[] = [];
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
    }
    window.IntersectionObserver =
      IntersectionObserverStub as unknown as typeof IntersectionObserver;
  }

  if (!window.scrollTo) {
    window.scrollTo = () => {};
  }

  const { default: i18n } = await import('@/i18n/i18n');
  await i18n.changeLanguage('zh');
}

/* M1 必修（清单 §11.2 / v2 执行单 §2.1 #2）：MSW 三段生命周期无条件执行；
 * localStorage 仅存在于 DOM 环境，清理用 DOM 判断单独包住。 */
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});
afterEach(() => {
  server.resetHandlers();
  if (typeof window !== 'undefined') {
    localStorage.clear();
  }
});
afterAll(() => {
  server.close();
});
