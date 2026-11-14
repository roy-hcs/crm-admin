import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils/render';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PermPackagePage } from './PermPackagePage';
import { server } from '@/test/msw/server';

/**
 * P3b 组件集成用例（B5，docs/P3b-TASK-CARD.md §1 覆盖表）。
 *
 * 被测：PermPackagePage.tsx 的 resetForm() 链路。
 * oracle = 当前实现的可观测输出（清单 §3 拍板 B）：MSW 捕获的列表请求 body
 * （query state 是唯一出口，DOM 层只有输入框回显可对照）。
 *
 * 请求形状（从实现推导）：
 * - usePermPackageList 以 query state 为参数源（PermPackagePage.tsx:36-41），
 *   apiFormPostCustom('/system/spreadPermPackage/list', {...}) POST form
 *   （spreadPermPackage.ts:95-102）：pageNum=state.pageNum+1、name/status 取 query。
 * - reset() 五连清（PermPackagePage.tsx:51-57）：name/status 输入框、query、
 *   pageNum=0、pageSize=10 → 列表请求回到初始参数（pageNum=1）。
 * - 请求次数推演（renderWithProviders：retry:false、gcTime:0；TanStack v5 默认
 *   refetchOnMount=true + staleTime 0）：mount #1（初始参数）→ 搜索 #2（name=abc&
 *   status=1，queryKey 变化必发）→ 重置 #3（key 回初始版，缓存已 stale → refetch）。
 *   变异 B5（人审收口后判据 = verify-p3b.json：reset 内注入字面量
 *   setQuery({ name: 'MUT', status: '' })，不依赖陈旧闭包）→ 重置后 queryKey
 *   与 #1/#2 均不同 → 第 3 次请求照发、body name='MUT' → 下方 bodyOf(2)
 *   name==='' 断言变红（旧「不再发出第 3 次请求」预期已作废）。
 */

const captured: string[] = [];

function registerListHandler() {
  server.use(
    http.post('*/api/system/spreadPermPackage/list', async ({ request }) => {
      captured.push(await request.text());
      // TableDataInfo：apiFormPostCustom 直接返回顶层 rows/total（permPackageTypes.ts:99-104）
      return HttpResponse.json({
        rows: [{ id: 1, name: 'P1', code: 'C1', status: '1', remark: '', applicableUserCount: 0 }],
        total: 1,
      });
    }),
  );
}

/* RTL 16 在 vitest 非 globals 环境不自动 cleanup：卸载残留页面实例 */
afterEach(cleanup);

/* ── jsdom 环境缺口桩（仅本文件作用域，不动 setup.ts）────────────────────────
 * RrhDialog 底层是 vaul drawer（可拖拽 bottom-sheet）：任何 pointerdown（含
 * userEvent.type 聚焦时的隐式点击）都会进 vaul 事件链，而 jsdom
 * ① 缺 Pointer Capture API（vaul onPointerDown 必调 setPointerCapture）；
 * ② getComputedStyle().transform 为 undefined（vaul getTranslate 对其 .match）。
 * 两者均为环境缺口、与被测行为无关——桩为 no-op/空串，让事件链走完，
 * 避免用 unhandled error 掩盖真实断言结果。 */
HTMLElement.prototype.setPointerCapture = () => {};
HTMLElement.prototype.releasePointerCapture = () => {};
const __origGetComputedStyle = window.getComputedStyle.bind(window);
window.getComputedStyle = (el, ...args) => {
  const style = __origGetComputedStyle(el, ...args);
  if (style) {
    // vaul getTranslate 三个兜底属性都补空串
    for (const v of ['transform', 'webkitTransform', 'mozTransform'] as const) {
      const cur = (style as unknown as Record<string, unknown>)[v];
      if (typeof cur === 'undefined') {
        Object.defineProperty(style, v, { value: '', configurable: true });
      }
    }
  }
  return style;
};
beforeEach(() => {
  captured.length = 0;
  registerListHandler();
});

/** 解析某次捕获的 form body（apiFormPostBase = flattenParams → URLSearchParams 序列化） */
const bodyOf = (i: number) => new URLSearchParams(captured[i]);

describe('PermPackagePage B5：resetForm 清空搜索与分页（dom project）', () => {
  it('搜索 abc/启用 后点重置：输入框清空，列表请求回到初始参数', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PermPackagePage />);

    // assert: 守护 mount 即发初始列表请求（PermPackagePage.tsx:36-41
    // usePermPackageList 无 options.enabled → 默认 true）
    await waitFor(() => expect(captured.length).toBe(1));

    // name 输入框无 testid（docs/testids.md §1 未登记），用 placeholder 定位；
    // status 下拉用 aria-label 定位（PermPackagePage.tsx:178）
    const nameField = screen.getByPlaceholderText('请输入权限包名称') as HTMLInputElement;
    const statusSelect = screen.getByLabelText('状态') as HTMLSelectElement;
    await user.type(nameField, 'abc');
    await user.selectOptions(statusSelect, '1');
    fireEvent.click(screen.getByTestId('spread-perm-search-button'));

    // assert: 守护 search 把输入提交进 query state 触发重查（PermPackagePage.tsx:45-48
    // setPageNum(0) + setQuery({name, status})）
    await waitFor(() => expect(captured.length).toBe(2));

    // assert: 守护搜索把输入值带入列表请求（PermPackagePage.tsx:36-41
    // name/status 取 query；:47 setQuery({name, status})；pageNum 归 0 → 请求 pageNum=1）
    expect(bodyOf(1).get('name')).toBe('abc');
    expect(bodyOf(1).get('status')).toBe('1');
    expect(bodyOf(1).get('pageNum')).toBe('1');
    expect(bodyOf(1).get('pageSize')).toBe('10');

    fireEvent.click(screen.getByTestId('spread-perm-reset-button'));

    // assert: 守护 resetForm 触发新一轮列表请求（PermPackagePage.tsx:54
    // setQuery({name:'',status:''}) 改变 queryKey → refetch；重置前缓存已 stale → 必发）
    await waitFor(() => expect(captured.length).toBe(3));

    // assert: 守护 reset 五连清的请求面（PermPackagePage.tsx:51-57
    // setName('')/setStatus('')/setQuery 清空/setPageNum(0)/setPageSize(10)）——
    // 列表请求回到初始参数：name/status 空、pageNum 回 1、pageSize 回 10
    // （本条与下方 3 条 expect 同窗追溯本 assert）
    expect(bodyOf(2).get('name')).toBe('');
    expect(bodyOf(2).get('status')).toBe('');
    expect(bodyOf(2).get('pageNum')).toBe('1');
    expect(bodyOf(2).get('pageSize')).toBe('10');

    // assert: 守护输入框回显清空（PermPackagePage.tsx:52 setName('')，受控 value）
    expect(nameField.value).toBe('');
    expect(statusSelect.value).toBe('');
  });
});
