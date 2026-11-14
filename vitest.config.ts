import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

/**
 * Vitest 配置（P0 基建骨架，REACT-TEST-INFRA-CHECKLIST.md §5 / react-test-plan.md §7.2）：
 * 复用 vite.config.ts 的 react 插件与 `@` alias，只叠加 test 段，不改 vite.config.ts。
 * 双环境 projects（拍板 A：DOM 环境 = jsdom ^27.4.0，不采用 happy-dom）：
 *   unit: .test.ts 结尾 → node 环境（纯函数 / 契约用例）
 *   dom : .test.tsx 结尾 → jsdom 环境（RTL 组件集成用例）
 * 注意：块注释里不能写含星号斜杠序列的 glob（会提前终止注释），完整 include 见下方代码。
 */
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      setupFiles: ['./src/test/setup.ts'],
      /* 根级不设 include：根 include 会与各 project 的 include 取并集，
       * 导致每个用例文件在两个环境各跑一次。环境归属完全由下方 projects 决定。 */
      exclude: ['node_modules/**', 'dist/**'],
      projects: [
        {
          extends: true,
          test: {
            name: 'unit',
            environment: 'node',
            include: ['src/**/*.test.ts'],
          },
        },
        {
          extends: true,
          test: {
            name: 'dom',
            environment: 'jsdom',
            include: ['src/**/*.test.tsx'],
          },
        },
      ],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        /* v2 执行单 §11.4 建议 2：不排除 ui 目录（被测组件目录排除会让盲区失真），
         * 只排 locales 与 test 基建自身。 */
        exclude: ['src/locales/**', 'src/test/**'],
      },
    },
  }),
);
