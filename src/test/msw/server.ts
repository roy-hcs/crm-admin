import { setupServer } from 'msw/node';

/**
 * MSW 请求拦截（P0 基建骨架，react-test-plan.md §7.3 / §9；M1 必修后口径见
 * P0-REWORK-ORDER-v2.md §2.1 #3）：
 * P0 暂无 handlers；P3 起按领域拆分到 src/test/msw/handlers/。
 * MSW 拦 fetch（而非直接 vi.mock('fetch')），保留 client.ts 的 flatten / 401 / redirect 真实逻辑。
 * `onUnhandledRequest: 'error'` 在 setup.ts 生命周期里**无条件启用，node / dom 双 project 均生效**
 * （M1 必修：曾只在 DOM 分支启用，node 用例的未声明请求会真的发出去，R-5 破防）。
 */
export const server = setupServer();
