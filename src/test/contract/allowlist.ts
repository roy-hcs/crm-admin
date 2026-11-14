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
      'atlas 版本差缺口：快照只有旧 UI 单参变体 oneUserTemplateInfo/{id}；后端存在双参映射 @GetMapping("oneUserTemplateInfo/{rebateType}/{id}")（CrmUserRebateTemplateController.java:91），React 调用有效',
    date: '2026-11-13',
    expires: '2026-11-20',
    owner: 'kb-sync',
  },
  {
    method: 'GET',
    path: '/system/crmInfoVerify/viewDetailInfo/{param}/{param}',
    reason:
      'atlas 版本差缺口：快照只有单参变体 viewDetailInfo/{id}；后端存在双参映射 @GetMapping("/viewDetailInfo/{id}/{infoType}")（CrmInfoVerifyController.java:385），React 调用有效',
    date: '2026-11-13',
    expires: '2026-11-20',
    owner: 'kb-sync',
  },
  {
    method: 'POST',
    path: '/grobal/search/list',
    reason:
      '疑似调用点缺陷，待人审裁定：后端唯一映射 = /system/grobal/search/list（GrobalSearchController.java:21 @RequestMapping + :30 @PostMapping，全 CRM 仓仅此一处），React 调用缺 /system 前缀；Header.tsx 全局搜索在用。非 atlas 缺口，按 C5 争议入口登记 + 回执披露。11-13 运行时只读探测因会话层登录失败未完成，按人审兜底口径「读不到即视为接口有误」登记 BUG-P2-01；未证实 404',
    date: '2026-11-13',
    expires: '2026-11-27',
    owner: 'crm-admin-frontend',
    bugId: 'BUG-P2-01',
  },
  {
    method: 'POST',
    path: '/system/crmUserVip/edit',
    reason:
      '疑似调用点缺陷，待人审裁定：后端 CrmUserVipController 无 POST /edit 映射（保存端点为 /editRule:287；GET /edit/{id}:148 是视图页；父链 NoticeController→CalculateController→BaseController 均无映射），疑应调 /editRule。非 atlas 缺口，按 C5 争议入口登记 + 回执披露。11-13 人审：静态证据链闭合、属写操作禁运行时探测，登记 BUG-P2-02 待后端 / 产品确认语义',
    date: '2026-11-13',
    expires: '2026-11-27',
    owner: 'crm-admin-frontend',
    bugId: 'BUG-P2-02',
  },
  {
    method: 'GET',
    path: '/system/crmUserProtocolRelation//oneUserProtocol/{param}',
    reason:
      '调用点笔误，待人审裁定：调用路径含空段（//），后端映射 = /oneUserProtocol/{userId}（CrmUserProtocolRelationController.java:103）已在快照；仅调用方多一个空段，运行时是否被归一化匹配未验证。本批不修生产代码。11-13 运行时只读探测因会话层登录失败未完成，按兜底口径登记 BUG-P2-03；未证实 404',
    date: '2026-11-13',
    expires: '2026-11-27',
    owner: 'crm-admin-frontend',
    bugId: 'BUG-P2-03',
  },
];
