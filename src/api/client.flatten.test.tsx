import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { apiFormPost, apiFormPostCustom } from '@/api/client';
import { server } from '@/test/msw/server';

/**
 * #1 flattenParams 间接断言（P1 执行单 §3 #1；拍板 B：不导出 flattenParams、不 mock fetch）。
 *
 * 为何是 .tsx：需 jsdom 提供 base URL 才能解析相对 /api 路径——node project 下
 * fetch('/api/...') 报 ERR_INVALID_URL（MSW 拦截前就要解析 URL），人审 11-12 探针实证
 * （P1-TASK-ORDER.md §1.2）。
 *
 * 为何断 body：apiFormPostBase 把 flattenParams(params).toString() 放进 POST body
 * （client.ts:173-183），URL 原样传入、不含任何 query——只断 URL / 只断「请求发出去了」
 * 属恒真，必须断 await request.text() 解析后的 body 键值（执行单 §1.1）。
 *
 * 期望值 oracle = 当前实现（client.ts:132-166），输入 → 期望逐条读码推导（执行单 §1.3）；
 * 编码类期望由 URLSearchParams 序列化语义推导。
 *
 * path 用测试专用假路径 /p1-flatten（执行单 §2.3），不用真实业务端点。
 * handler 用 server.use 写在本文件内（setup 的 afterEach 会 resetHandlers，每个 it 自行注册），
 * 返回 2xx JSON，避免 fetchWithAuth 走 toast / throw 分支。
 */

/* 捕获点：raw = 未声明的请求体原文；contentType = 请求头（client.ts:179 写入） */
let raw = '';
let contentType = '';

function registerCaptureHandler() {
  raw = '';
  contentType = '';
  server.use(
    http.post('*/api/p1-flatten', async ({ request }) => {
      raw = await request.text();
      contentType = request.headers.get('content-type') ?? '';
      return HttpResponse.json({ code: 0, msg: 'ok', data: null });
    }),
  );
}

async function captureBody(run: () => Promise<unknown>): Promise<URLSearchParams> {
  registerCaptureHandler();
  await run();
  return new URLSearchParams(raw);
}

describe('flattenParams 间接断言（P1 #1，dom project）', () => {
  it('① 嵌套对象：顶层 key 无前缀、子键方括号 → nested[c]=2', async () => {
    const body = await captureBody(() => apiFormPost('/p1-flatten', { nested: { c: 2 } }));
    // assert: 守护嵌套对象分支（client.ts:156-158 递归 + 140 方括号拼接，顶层 key 原样）
    expect(body.get('nested')).toBeNull();
    expect(body.get('nested[c]')).toBe('2');
  });

  it('② 对象数组 → objects[0].language（dot 记法），多元素 [1] 正确', async () => {
    const body = await captureBody(() =>
      apiFormPost('/p1-flatten', { objects: [{ language: 'zh' }, { language: 'en' }] }),
    );
    // assert: 守护对象数组分支（client.ts:145-149 元素对象递归 + 140 isArray → dot）
    expect(body.get('objects')).toBeNull();
    expect(body.get('objects[0].language')).toBe('zh');
    expect(body.get('objects[1].language')).toBe('en');
  });

  it('③ 原始数组 → 同一 key 重复出现', async () => {
    const body = await captureBody(() => apiFormPost('/p1-flatten', { arr: [3, 4] }));
    // assert: 守护原始数组分支（client.ts:150-154 append 重复 key，无下标）
    expect(body.getAll('arr')).toEqual(['3', '4']);
  });

  it('④ undefined → key 整个消失', async () => {
    const body = await captureBody(() => apiFormPost('/p1-flatten', { gone: undefined, keep: 1 }));
    // assert: 守护 undefined 跳过（client.ts:141）
    expect(body.has('gone')).toBe(false);
    expect(body.get('keep')).toBe('1');
  });

  it('⑤ null → 空串（key 保留）', async () => {
    const body = await captureBody(() => apiFormPost('/p1-flatten', { empty: null }));
    // assert: 守护 null 兜底空串（client.ts:161 `${value ?? ''}`）
    expect(body.has('empty')).toBe(true);
    expect(body.get('empty')).toBe('');
  });

  it('⑥ 中文 / 空格 / & / = 按 URLSearchParams 序列化（空格→+、&→%26、=→%3D）', async () => {
    registerCaptureHandler();
    await apiFormPost('/p1-flatten', { name: '中文 & 空格', eq: 'a=b' });
    // assert: 守护编码行为（client.ts:161 append → toString 序列化，人审探针 body 同形）
    expect(raw).toContain('name=%E4%B8%AD%E6%96%87+%26+%E7%A9%BA%E6%A0%BC');
    expect(raw).toContain('eq=a%3Db');
    const body = new URLSearchParams(raw);
    expect(body.get('name')).toBe('中文 & 空格');
    expect(body.get('eq')).toBe('a=b');
  });

  it('⑦ 含方括号字面量 key：typeNameList[0][language] 原样透传', async () => {
    const body = await captureBody(() =>
      apiFormPost('/p1-flatten', { 'typeNameList[0]': { language: 'zh' } }),
    );
    /* 推导（执行单 §1.3）：client.ts:140 顶层 key 无前缀、原样使用「typeNameList[0]」；
     * value 是对象 → flattenParams(value, 'typeNameList[0]')，isArray 缺省 →
     * 子键按方括号拼接 = 'typeNameList[0]' + '[language]'（104-106 行语言键形态）。 */
    // assert: 守护现状 —— 括号字面量 key 不被转义改写、子键续接方括号
    expect(body.get('typeNameList')).toBeNull();
    expect(body.get('typeNameList[0][language]')).toBe('zh');
  });

  it('⑧ apiFormPostCustom 与 apiFormPost 走同一 flatten 路径', async () => {
    const body = await captureBody(() => apiFormPostCustom('/p1-flatten', { nested: { c: 2 } }));
    // assert: 守护两个入口共用 apiFormPostBase（client.ts:186-199），flatten 行为一致
    expect(body.get('nested[c]')).toBe('2');
  });

  it('⑨ Content-Type 为 x-www-form-urlencoded; charset=UTF-8（并断 body 键值）', async () => {
    registerCaptureHandler();
    await apiFormPost('/p1-flatten', { a: 1 });
    // assert: 守护 apiFormPostBase 写入的表单请求头（client.ts:179）
    expect(contentType).toBe('application/x-www-form-urlencoded; charset=UTF-8');
    const body = new URLSearchParams(raw);
    expect(body.get('a')).toBe('1');
  });
});
