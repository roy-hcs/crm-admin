import type { TFunction } from 'i18next';
import { describe, expect, it } from 'vitest';
import { passwordSchema } from '@/lib/validators';

/**
 * P1 #6：passwordSchema（react-test-plan.md §8 #6 / P1-TASK-ORDER.md §3 #6）。
 * t stub 只回 key；只断 safeParse().success / 错误条数，不断文案（执行单 §3 #6）。
 * 错误条数为实测推导（zod 3.x 字符串检查全部累积、不短路）：缺小写仅 regex 一条 → 1；
 * 带 field 的空串 → min(1) + min(8) + regex 三条 → 3（P1-TASK-ORDER.md §1.3 口径）。
 */
const t = ((key: string) => key) as unknown as TFunction;

describe('passwordSchema（P1 #6）', () => {
  it('合法密码（大小写+数字、长度达标）通过', () => {
    // assert: 守护合法路径（validators.ts:26 pattern 全部 lookahead 满足）
    expect(passwordSchema(t).safeParse('Abcdefg1').success).toBe(true);
  });

  it('缺小写 / 缺大写 / 缺数字各自失败', () => {
    // assert: 三类复杂度缺一即败（validators.ts:26 三个 lookahead）
    expect(passwordSchema(t).safeParse('ABCDEFG1').success).toBe(false);
    expect(passwordSchema(t).safeParse('abcdefg1').success).toBe(false);
    expect(passwordSchema(t).safeParse('Abcdefgh').success).toBe(false);
  });

  it('缺小写时错误条数 = 1（长度合法，仅 regex 一条失败）', () => {
    const r = passwordSchema(t).safeParse('ABCDEFG1');
    // assert: 锁定 zod 检查累积口径 —— 长度合法时只有 regex 失败（实测推导）
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.length).toBe(1);
    }
  });

  it('低于 min / 高于 max 失败（默认 8~20）', () => {
    // assert: min/max 边界（validators.ts:31；21 字符 > max20）
    expect(passwordSchema(t).safeParse('Ab1').success).toBe(false);
    expect(passwordSchema(t).safeParse('Abcdefg1Abcdefg1Abcde').success).toBe(false);
  });

  it('optional: true 允许空串；非 optional 空串失败', () => {
    // assert: optional 走 .or(z.literal(''))（validators.ts:34）
    expect(passwordSchema(t, { optional: true }).safeParse('').success).toBe(true);
    expect(passwordSchema(t).safeParse('').success).toBe(false);
  });

  it('传 field 时空串触发必填失败，错误条数 = 3（min1+min8+regex 累积）', () => {
    const r = passwordSchema(t, { field: '登录密码' }).safeParse('');
    // assert: 必填分支（validators.ts:29）；条数实测 = 3，只断条数不断文案（执行单 §3 #6）
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.length).toBe(3);
    }
  });

  it('自定义 min / max 生效', () => {
    // assert: opts.min/max 进入长度检查与 pattern（validators.ts:24-26/31）
    expect(passwordSchema(t, { min: 4, max: 6 }).safeParse('Ab12').success).toBe(true);
    expect(passwordSchema(t, { min: 4, max: 6 }).safeParse('Ab12345').success).toBe(false);
  });
});
