/**
 * P2 契约断言白名单（docs/P2-TASK-CARD.md §3 C5；P2b 到期机制见该卡 §9.6）
 *
 * 只用于「约定契约 / atlas 版本差缺口」类 mismatch；≤10 条；不许用它吞掉扫描失败
 * （扫描失败走 skip 计数口径，见 endpoints.test.ts）。新增调用点判红不许加条目换绿（P2 卡 §6）。
 * 每条必须含 reason（附代码级证据、可核验）与登记日期；快照日后覆盖到对应端点时
 * 该条自动失效（endpoints.test.ts 白名单卫生断言会红），届时删除本条目即收口。
 *
 * P2b（11-13 人放行）：原 stale 断言只判「条目自身 path 是否进快照」，对结构上进不了
 * 快照的条目（范围外 / 错 path）永不触发，会永久沉底；调用点修好后忘记删条目还会
 * 留下无人引用的幽灵豁免。故每条补 expires（UTC 复核到期日）+ owner（责任归属），
 * 由 endpoints.test.ts 的到期 / orphan 断言兜底。到期后只允许「收口删条目」或
 * 「人审复核后改 expires」，不许改断言换绿。bugId 关联 §9.5 缺陷台账。
 *
 * 11-14 23:4x 根因核查（人审，只读）：#2/#3 的「atlas 版本差缺口」分类均属误判，已按事实
 * 订正 reason，expires / path / 断言 / 调用点一字未动。#2 是结构性范围缺口（Thymeleaf
 * 视图端点被 exports 按设计跳过），周更永远补不出；#3 是 atlas 提取器缺陷（本地 commit
 * df9833e 已修），需下轮 weekly + export 才落入快照。
 *
 * 11-14 23:5x 人审裁定（使用者「按你推荐的做」放行）：两条 11-20 到期项均作
 * 「人审复核后延期」——不改断言、不改调用点、不提前周更、不删条目换绿。
 *   #3 延至 2026-11-27；#2 延至 2026-12-05（CRM 仓只读核查确认该 Controller 下没有返回
 *      RebateSettingPageData 的 JSON GET，需后端立项补接口，见 P2-TASK-CARD.md §9.10）。
 * 到期日仍是硬约束，到期未收口即判红；下次只允许收口删条目或再次人审延期。
 *
 * 2026-11-15 #3 收口（atlas 提取器 {} 回归后续批）：修 normalizeCallPath 剥离 query 位
 * 尾部 {}（atlas eceb037，npm test 76/76）→ weekly+export 快照
 * 2026-11-15T11-14-10-915Z → 重生 admin-paths.json（951→952，仅 +1 双参 route、
 * 零删除、零新 MISS）→ C5 stale 断言按设计判红（仅 #3 一条）→ 删本条目收口。
 * 断言、调用点、其余白名单一字未动；当前白名单 2 条（#1 11-27 / #2 12-05）。
 */
export interface AllowlistEntry {
  /** 调用点归一化 method（GET/POST/PUT/DELETE） */
  method: string;
  /** 调用点归一化 path（${...} 已转 {param}；保留原形态含空段） */
  path: string;
  /** 不在快照的原因：证据位置 + 分类（atlas 版本差缺口 / 非 Controller 层 / 疑似缺陷待人审裁定） */
  reason: string;
  /** 登记日期 */
  date: string;
  /** 复核到期日（YYYY-MM-DD，UTC）：到期后契约套件变红，强制复核或收口 */
  expires: string;
  /** 责任归属（团队 / 角色标识）：到期或收口时找谁 */
  owner: string;
  /** 已登记缺陷时关联 docs/P2-TASK-CARD.md §9.5 台账编号；非缺陷类豁免不填 */
  bugId?: string;
}

export const ALLOWLIST: AllowlistEntry[] = [
  {
    method: 'GET',
    path: '/logout',
    reason:
      '非 Controller 层（atlas 范围缺口）：登出不在 crm-admin 后端任何 Controller 映射里（全 java 目录仅业务侧 forceLogout 命中），属网关/认证层处理（KB url-map 已知同边界）；React 侧 GET /logout 语义为登出，端点存在但契约快照无此 path',
    date: '2026-11-13',
    expires: '2026-11-27',
    owner: 'atlas-owner',
  },
  {
    method: 'GET',
    path: '/system/crmUserRebateTemplate/oneUserTemplateInfo/{param}/{param}',
    reason:
      '结构性范围缺口（非 atlas 版本差）：双参端点 GET /system/crmUserRebateTemplate/oneUserTemplateInfo/{rebateType}/{id} 是 Thymeleaf 视图端点（CrmUserRebateTemplateController.java:91 返回 String + ModelMap），atlas src/exports.mjs:82 按设计跳过 response.kind=view，usage-driven 路线 A 下任何周更都不会收进 exports。React 侧 agent.ts:329 却用 apiGet 当 JSON 读取该视图端点，源码 :322 TODO 已注明需与后端确认对应的 JSON REST 接口——属调用点侧待确认疑点，未经人审不得改调用点（C5）。11-14 23:4x 根因核查订正；11-14 人审延期至 2026-12-05：CRM 只读核查（release 分支）确认该 Controller 下没有任何返回 RebateSettingPageData 的 JSON GET——只有 2 个视图 GET、3 个带 @ResponseBody 的 POST 写接口，以及 /getRebateAccount/{userId}（返回账户钱包列表 + 用户信息，语义不同，不能替代）。React 侧实际拿到的是 manage_template.html，需后端立项补 JSON REST 接口；C5 下不改调用点、不改断言。详见 P2-TASK-CARD.md §9.10。',
    date: '2026-11-13',
    expires: '2026-12-05',
    owner: 'kb-sync',
  },
  // 2026-11-15 收口：原 #3（GET /system/crmInfoVerify/viewDetailInfo/{param}/{param}）
  // ——atlas 提取器缺陷由 eceb037 修复，本轮 weekly+export 后双参 route 进快照，
  // 重生 admin-paths.json 使 C5 stale 断言按设计判红，再删条目收口；断言/调用点未动。
  // 2026-11-14 收口：原 #5 / BUG-P2-02（POST /system/crmUserVip/edit）已按 CRM 仓
  // 事实链确认是调用点 URL 写错，改为 /system/crmUserVip/editRule 后命中 947 条快照，
  // 条目由 orphan 断言判红后删除。详见 docs/P2-TASK-CARD.md §9.9 与
  // src/api/hooks/account/index.ts 中 useCrmUserVipEdit 的比对注释。
];
