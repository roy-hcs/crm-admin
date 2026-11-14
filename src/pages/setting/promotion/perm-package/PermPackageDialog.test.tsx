import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils/render';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PermPackageDialog } from './components/PermPackageDialog';
import { server } from '@/test/msw/server';

/**
 * P3b 组件集成用例（B1–B4，docs/P3b-TASK-CARD.md §1 覆盖表）。
 *
 * 被测：PermPackageDialog.tsx（mode="add"，B1–B4 边界均为新增弹窗路径）。
 * oracle = 当前实现的可观测输出（清单 §3 拍板 B）：DOM 提示文案、input 截断值、
 * MSW 捕获的请求计数与参数——期望值逐条从实现行号推导，见各 // assert: 注释。
 *
 * MSW：handler 用 server.use 就地注册（任务卡 §0，不新增第三个文件）；
 * onUnhandledRequest:'error' 无条件启用（setup.ts:73）——add/edit/checkNameUnique/
 * checkCodeUnique/getServerAccountTypes 全部显式声明，意外请求即用例失败（R-5）。
 * 「不发出 add/edit 请求」以捕获计数断言，而不是靠未声明请求炸出来（负向行为也要可观测）。
 *
 * 渲染期间 Dialog 无自动请求：useServerAccountTypes 初始 enabled=false 且
 * serverIds 为空（spreadPermPackage.ts:182 enabled && serverIds.length>0），
 * 其余均为手动 mutation / blur 触发——首个断言可安全落在 render 之后。
 */

/* ── 捕获点：每条用例 beforeEach 清零 ── */
const captured = {
  add: [] as string[],
  edit: [] as string[],
  checkName: [] as string[],
  checkCode: [] as string[],
  serverTypes: [] as URL[],
};

function registerHandlers() {
  server.use(
    http.post('*/api/system/spreadPermPackage/add', async ({ request }) => {
      captured.add.push(await request.text());
      return HttpResponse.json({ code: 0, msg: 'ok', data: null });
    }),
    http.post('*/api/system/spreadPermPackage/edit', async ({ request }) => {
      captured.edit.push(await request.text());
      return HttpResponse.json({ code: 0, msg: 'ok', data: null });
    }),
    http.post('*/api/system/spreadPermPackage/checkNameUnique', async ({ request }) => {
      captured.checkName.push(await request.text());
      // 旧页 remote 约定：返回纯文本 "0"=唯一（spreadPermPackage.ts:133-142）
      return HttpResponse.json({ code: 0, msg: 'ok', data: '0' });
    }),
    http.post('*/api/system/spreadPermPackage/checkCodeUnique', async ({ request }) => {
      captured.checkCode.push(await request.text());
      return HttpResponse.json({ code: 0, msg: 'ok', data: '0' });
    }),
    http.get('*/api/system/spreadPermPackage/getServerAccountTypes', async ({ request }) => {
      captured.serverTypes.push(new URL(request.url));
      // AjaxResult 包装：组件读 accountTypesRes?.data（PermPackageDialog.tsx:132）
      return HttpResponse.json({ code: 0, msg: 'ok', data: { '7': ['MT5', 'MT4'] } });
    }),
  );
}

/** mode="add" 渲染弹窗；返回 setOpen 桩（本批断言不依赖它，仅供渲染挂载） */
function renderAddDialog() {
  // 防御性清理：前序用例被超时强杀时 afterEach 可能不完整，残留 Dialog 会串扰
  cleanup();
  const setOpen = vi.fn();
  renderWithProviders(<PermPackageDialog open setOpen={setOpen} mode="add" />);
  return setOpen;
}

/* RTL 16 在 vitest 非 globals 环境不自动 cleanup：卸载残留 Dialog，防 testid 重复命中 */
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
    // vaul:402 三个兜底属性都补空串
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
  captured.add.length = 0;
  captured.edit.length = 0;
  captured.checkName.length = 0;
  captured.checkCode.length = 0;
  captured.serverTypes.length = 0;
  registerHandlers();
});

describe('PermPackageDialog B1：name 空 → 提交被拦（dom project）', () => {
  it('name 留空点提交：必填提示可见、不发出 add/edit 请求', async () => {
    renderAddDialog();

    fireEvent.click(screen.getByTestId('spread-perm-submit-button'));

    // assert: 守护 name 必填校验与提示渲染（PermPackageDialog.tsx:172 validate
    // `!form.name.trim()` → nameRequired；:276 errors.name 渲染）——zh 文案见 src/locales/zh.json
    expect(screen.getByText('请输入权限包名称')).toBeInTheDocument();

    // assert: 守护校验不通过拦截提交（PermPackageDialog.tsx:190
    // `Object.keys(nextErrors).length > 0` → return；:192-193 才会调 add/edit）
    expect(captured.add).toHaveLength(0);
    expect(captured.edit).toHaveLength(0);
  });
});

describe('PermPackageDialog B2：name maxLength=32 截断（dom project）', () => {
  it('输入 33 个字符：输入框保留前 32 个', async () => {
    renderAddDialog();

    const user = userEvent.setup();
    const field = screen.getByTestId('spread-perm-name-field');
    await user.type(field, 'a'.repeat(33));

    // assert: 守护 name 输入上限 32（PermPackageDialog.tsx:270 maxLength={32}，
    // 浏览器级截断 user 输入；>32 的第二道防线 = validate :173，B3 组同法守护）
    expect((field as HTMLInputElement).value).toBe('a'.repeat(32));
    expect((field as HTMLInputElement).value.length).toBe(32);
  });

  // 第二道防线：UI maxLength 只拦键盘输入，程序化设值（非键盘路径）必须由 validate 兜住。
  // fireEvent.change 不遵循 maxLength（直接设值），正好构造 >32 的 form.name。
  it('程序化设值 33 字符后提交：nameMax 提示可见（validate 第二道防线）', async () => {
    renderAddDialog();

    const field = screen.getByTestId('spread-perm-name-field');
    fireEvent.change(field, { target: { value: 'b'.repeat(33) } });

    fireEvent.click(screen.getByTestId('spread-perm-submit-button'));

    // assert: 守护 name >32 校验（PermPackageDialog.tsx:173 form.name.length > 32
    // → permPackagePage.nameMax；:276 errors.name 渲染）——zh.json:3386
    expect(screen.getByText('权限包名称最多 32 个字符')).toBeInTheDocument();

    // assert: 同一拦截路径守护「不发 add」（同 B1 的 :190/:192 链路，防变异后误提交）
    expect(captured.add).toHaveLength(0);
  });
});

describe('PermPackageDialog B3：remark maxLength=200 + 计数回显 + validate 上限（dom project）', () => {
  // coverage（v8 插桩）下 201 键 userEvent 输入显著变慢，默认 5s 不够 → 20s
  it('输入 201 个字符：截断为 200，计数回显 200/200', async () => {
    renderAddDialog();

    const user = userEvent.setup();
    const field = screen.getByTestId('spread-perm-remark-field');
    await user.type(field, 'x'.repeat(201));

    // assert: 守护 remark 输入上限 200（PermPackageDialog.tsx:294 maxLength={200}）
    expect((field as HTMLTextAreaElement).value.length).toBe(200);

    // assert: 守护字符计数回显（PermPackageDialog.tsx:299 `{form.remark.length}/200`）
    expect(screen.getByText('200/200')).toBeInTheDocument();
  }, 20000);

  it('程序化设值 201 字符后提交：remarkMax 提示可见（validate 第二道防线）', async () => {
    renderAddDialog();

    const field = screen.getByTestId('spread-perm-remark-field');
    // 绕过 UI maxLength 的程序化设值（模拟非键盘路径），validate 必须兜住
    fireEvent.change(field, { target: { value: 'y'.repeat(201) } });

    fireEvent.click(screen.getByTestId('spread-perm-submit-button'));

    // assert: 守护 remark >200 校验（PermPackageDialog.tsx:177
    // `form.remark.length > 200` → remarkMax；:300 errors.remark 渲染）
    expect(screen.getByText('描述最多 200 个字符')).toBeInTheDocument();

    // assert: 同一拦截路径守护「不发 add」（同 B1 的 :190/:192 链路，防变异后误提交）
    expect(captured.add).toHaveLength(0);
  });
});

describe('PermPackageDialog B4：serverIds → 查询账号类型联动（dom project）', () => {
  it('未点「查询账号类型」不发请求；点击后捕获 getServerAccountTypes 且按返回渲染', async () => {
    renderAddDialog();

    // assert: 守护联动查询默认不请求（PermPackageDialog.tsx:100-101
    // useServerAccountTypes { enabled: showAccountTypes }，初始 false；spreadPermPackage.ts:182）
    expect(captured.serverTypes).toHaveLength(0);

    const user = userEvent.setup();
    await user.type(screen.getByTestId('spread-perm-server-trigger'), '7');

    // assert: 输入 serverIds 本身仍不触发请求（enabled 仍 false，:101）
    expect(captured.serverTypes).toHaveLength(0);

    fireEvent.click(screen.getByTestId('spread-perm-account-type-option'));

    // assert: 守护点击触发查询（PermPackageDialog.tsx:332 setShowAccountTypes(true)）+
    // queryFn 请求参数（spreadPermPackage.ts:180 `?serverIds=${encodeURIComponent(serverIds)}`）
    await waitFor(() => expect(captured.serverTypes).toHaveLength(1));
    expect(captured.serverTypes[0].searchParams.get('serverIds')).toBe('7');

    // assert: 守护按返回渲染账号类型项（PermPackageDialog.tsx:131-138 Object.entries
    // → labels；:342-351 flatMap 渲染 `${entry.serverId}: ${label}`，testid :346）
    const items = await screen.findAllByTestId('spread-perm-account-type-item');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('7: MT5');
    expect(items[1]).toHaveTextContent('7: MT4');
  });
});
