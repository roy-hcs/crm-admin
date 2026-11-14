import type { TotalItem } from '@/api/hooks/pamm/type';
import { describe, expect, it } from 'vitest';
import {
  formatCurrencyAmount,
  formatDate,
  formatFileSize,
  formatMoneyNumber,
  normalizePercentageInput,
  normalizeTimeByPrecision,
  stripHtmlTags,
  transformTotalList,
} from '@/lib/utils';

/**
 * P0 示例用例（node 纯函数，REACT-TEST-INFRA-CHECKLIST.md §5）。
 * 覆盖点对应 react-test-plan.md §8 #4 的 normalizeTimeByPrecision 一角；
 * P1 再按 §8 1~6 补全其余纯函数断言。
 */
describe('normalizeTimeByPrecision（P0 node 纯函数示例）', () => {
  it('minute 精度：个位补零、丢弃秒', () => {
    // assert: 守护报表时间归一化（react-test-plan.md §8 #4 —— minute/second 精度与边界）
    expect(normalizeTimeByPrecision('9:5', 'minute')).toBe('09:05');
  });

  it('second 精度：秒缺省补 00、有效秒保留', () => {
    // assert: second 精度下秒缺省补 00，显式秒原样保留（补零）
    expect(normalizeTimeByPrecision('10:30', 'second')).toBe('10:30:00');
    expect(normalizeTimeByPrecision('10:30:7', 'second')).toBe('10:30:07');
  });

  it('越界（>23h / >59m / >59s）返回空串', () => {
    // assert: 非法时间不产出看似合法的值（空串直通，由上层回默认区间）
    expect(normalizeTimeByPrecision('24:00', 'minute')).toBe('');
    expect(normalizeTimeByPrecision('12:60', 'minute')).toBe('');
    expect(normalizeTimeByPrecision('12:59:60', 'second')).toBe('');
  });

  it('空值与非数字返回空串', () => {
    // assert: 空输入直通空串；非数字片段拒绝
    expect(normalizeTimeByPrecision(undefined, 'minute')).toBe('');
    expect(normalizeTimeByPrecision('abc', 'minute')).toBe('');
  });
});

/* ===== 以下为 P1 追加（P1-TASK-ORDER.md §3 #2~#5）；P0 既有断言保持原样。 ===== */

describe('transformTotalList（P1 #2，test-plan §8 #2）', () => {
  const rows: TotalItem[] = [
    { commissionToatl: 12.5, businessAmountToatl: null, rewardAmountToatl: null, currency: 'USD' },
    { commissionToatl: 3, businessAmountToatl: 8, rewardAmountToatl: null, currency: 'EUR' },
    { commissionToatl: null, businessAmountToatl: 5, rewardAmountToatl: 1, currency: 'USD' },
  ];

  it('按 fileds 顺序聚合，null 跳过、数值转 String、currency 原样（多币种多行）', () => {
    const result = transformTotalList(rows, ['commissionToatl', 'businessAmountToatl']);
    // assert: 守护 §8 #2 聚合顺序 —— commissionToatl 在前、businessAmountToatl 在后（utils.ts:64 forEach fileds）
    expect(result[0].commissionToatl).toBeDefined();
    expect(result[1].businessAmountToatl).toBeDefined();
    // assert: null 行跳过（utils.ts:69 判 value !== null），只收非空行（多币种 USD/EUR、多行）
    expect(result[0].commissionToatl).toEqual([
      { amount: '12.5', currency: 'USD' },
      { amount: '3', currency: 'EUR' },
    ]);
    // assert: 数值转 String（utils.ts:71 String(value)）、currency 原样透传
    expect(result[1].businessAmountToatl).toEqual([
      { amount: '8', currency: 'EUR' },
      { amount: '5', currency: 'USD' },
    ]);
  });

  it('undefined / 非数组入参返回空数组', () => {
    // assert: 守护入参守卫（utils.ts:58 !data || !Array.isArray(data)）
    expect(transformTotalList(undefined, ['commissionToatl'])).toEqual([]);
    expect(transformTotalList('x' as unknown as TotalItem[], ['commissionToatl'])).toEqual([]);
  });

  it('空 fileds 返回空数组', () => {
    // assert: 守护空 fileds（utils.ts:64 forEach 空数组 → result 空）
    expect(transformTotalList(rows, [])).toEqual([]);
  });

  it('某 field 全为 null 时该项不 push', () => {
    // 该 it 专用输入：所选 field 在每一行都为 null
    const allNull: TotalItem[] = [
      {
        commissionToatl: null,
        businessAmountToatl: null,
        rewardAmountToatl: null,
        currency: 'USD',
      },
      {
        commissionToatl: null,
        businessAmountToatl: null,
        rewardAmountToatl: null,
        currency: 'EUR',
      },
    ];
    // assert: 守护 fieldData.length 判断（utils.ts:77）—— 全 null 时该 field 键不出现
    expect(transformTotalList(allNull, ['commissionToatl'])).toEqual([]);
  });

  it('实现判 !== null：缺失字段（undefined）不会被跳过（现状锁定，见回执披露）', () => {
    // 该行故意缺失 businessAmountToatl 键（TotalItem 必填键，用 double cast 构造越界输入）
    const partial = { commissionToatl: 1, currency: 'USD' } as unknown as TotalItem;
    const result = transformTotalList([partial], ['businessAmountToatl']);
    // assert: 锁定 utils.ts:69 的 !== null 口径 —— undefined !== null 成立，String(undefined)='undefined' 入列
    expect(result[0].businessAmountToatl).toEqual([{ amount: 'undefined', currency: 'USD' }]);
  });
});

describe('formatMoneyNumber / formatCurrencyAmount（P1 #3，test-plan §8 #3）', () => {
  it('默认 2 位精度 + 千分位；0 补足两位', () => {
    // assert: 守护默认精度（utils.ts:313 significantDigits = 2）与 en-US 千分位（utils.ts:317）
    expect(formatMoneyNumber(1234.5)).toBe('1,234.50');
    expect(formatMoneyNumber(0)).toBe('0.00');
  });

  it('负数带千分位', () => {
    // assert: 守护负数格式化路径（utils.ts:317 Intl en-US）
    expect(formatMoneyNumber(-1234.56)).toBe('-1,234.56');
  });

  it('超长小数：Intl 默认最大 3 位（≤3 位原样、>3 位四舍五入，实测推导 utils.ts:317）', () => {
    // assert: 期望值由 node 同款 Intl 实测推导（1.005→'1.005'、1.23456→'1.235'）
    expect(formatMoneyNumber(12.345)).toBe('12.345');
    expect(formatMoneyNumber(1.23456)).toBe('1.235');
  });

  it('非数字字符串原样返回（isNaN 守卫，utils.ts:314）', () => {
    // assert: 守护 isNaN 早退分支 —— 'abc' 原样返回（不产出 'NaN'）
    expect(formatMoneyNumber('abc')).toBe('abc');
  });

  it('数值字符串按数字格式化', () => {
    // assert: 守护 Number(value) 转换路径（utils.ts:314/317）
    expect(formatMoneyNumber('12.345')).toBe('12.345');
  });

  it('自定义 significantDigits', () => {
    // assert: 守护第二参（utils.ts:313）—— 0 位最小精度
    expect(formatMoneyNumber(1.5, 0)).toBe('1.5');
  });

  it('formatCurrencyAmount：千分位 + 货币后缀，默认 USD、可自定义', () => {
    // assert: 守护模板拼接（utils.ts:330 `${...} ${currency}`）
    expect(formatCurrencyAmount(1234.5)).toBe('1,234.50 USD');
    expect(formatCurrencyAmount(2, 'EUR', 0)).toBe('2 EUR');
  });
});

describe('formatDate（P1 #4，test-plan §8 #4）', () => {
  it('空值返回空串', () => {
    // assert: 守护空值守卫（utils.ts:88-90）
    expect(formatDate(undefined)).toBe('');
    expect(formatDate('')).toBe('');
  });

  it('Date 与字符串入参，默认 YYYY-MM-DD', () => {
    // assert: 守护 dayjs 默认格式（utils.ts:87/91）—— 本地时区构造避免时区漂移
    expect(formatDate(new Date(2026, 2, 5, 14, 23, 0))).toBe('2026-03-05');
    expect(formatDate('2026-03-05')).toBe('2026-03-05');
  });

  it('自定义 format', () => {
    // assert: 守护 format 参数透传 dayjs（utils.ts:91）
    expect(formatDate(new Date(2026, 2, 5, 14, 23, 0), 'YYYY/MM/DD HH:mm')).toBe(
      '2026/03/05 14:23',
    );
  });
});

describe('normalizeTimeByPrecision P1 补余（P1 #4；P0 已有 4 组不重复）', () => {
  it('23:59 / 23:59:59 上界保留', () => {
    // assert: 守护上界恰好合法（utils.ts:200/206）
    expect(normalizeTimeByPrecision('23:59', 'minute')).toBe('23:59');
    expect(normalizeTimeByPrecision('23:59:59', 'second')).toBe('23:59:59');
  });

  it('24:30 越界返回空串（上界之外，P1 自有越界样本）', () => {
    // assert: 守护 hh>23 拒绝（utils.ts:206）
    expect(normalizeTimeByPrecision('24:30', 'minute')).toBe('');
  });

  it('前后空格 trim', () => {
    // assert: 守护 trim（utils.ts:197）
    expect(normalizeTimeByPrecision(' 9:5 ', 'minute')).toBe('09:05');
  });

  it('前导零规范为两位', () => {
    // assert: 守护 padStart（utils.ts:203-204）
    expect(normalizeTimeByPrecision('09:05', 'minute')).toBe('09:05');
  });

  it('minute 精度容忍非法秒片段（second 检查仅在 second 精度生效）', () => {
    // assert: 守护 utils.ts:200 的 precision 条件 —— minute 下 s 不参与校验
    expect(normalizeTimeByPrecision('9:5:5a', 'minute')).toBe('09:05');
  });
});

describe('normalizePercentageInput（P1 #5，test-plan §8 #5）', () => {
  it('>100 收敛到 100（整数与小数入口）', () => {
    // assert: 守护上界收敛（utils.ts:355）
    expect(normalizePercentageInput('150')).toBe('100');
    expect(normalizePercentageInput('150.9')).toBe('100');
  });

  it('超 2 位小数截断到 2 位', () => {
    // assert: 守护截断分支（utils.ts:348 slice(indexOf+3)）
    expect(normalizePercentageInput('12.3456')).toBe('12.34');
  });

  it("输入中间态 '0.' / '.5' 保留", () => {
    // assert: 守护输入过程容错（utils.ts:336 注释声明的行为）
    expect(normalizePercentageInput('0.')).toBe('0.');
    expect(normalizePercentageInput('.5')).toBe('.5');
  });

  it('非法字符剥离', () => {
    // assert: 守护字符白名单（utils.ts:337 replace 非 [\\d.]）
    expect(normalizePercentageInput('abc12x')).toBe('12');
  });

  it("输入 '.' 的现状：返回 '.'（执行单 §3 写「'.'→''」与实现不符，按 §1.3 锁实现、差异记回执）", () => {
    // assert: 现状锁定 —— '.' 未过 regex（utils.ts:347）走 348 行截断分支返回 '.'，351 行不可达
    expect(normalizePercentageInput('.')).toBe('.');
  });

  it('空串返回空串', () => {
    // assert: 守护空输入（utils.ts:338 !raw → ''）
    expect(normalizePercentageInput('')).toBe('');
  });
});

describe('formatFileSize（P1 #5，test-plan §8 #5）', () => {
  it('0 返回空串（数字与字符串零）', () => {
    // assert: 守护零值早退（utils.ts:367）
    expect(formatFileSize(0)).toBe('');
    expect(formatFileSize('0')).toBe('');
  });

  it('1024 进位与末尾零移除（"1.0"→"1"）', () => {
    // assert: 守护进位循环（utils.ts:379-382）与 parseFloat 去尾零（utils.ts:386）
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(1048576)).toBe('1 MB');
  });

  it('字符串入参与 decimals 参数', () => {
    // assert: 守护 parseFloat 路径（utils.ts:368）与 decimals 透传（utils.ts:385）
    expect(formatFileSize('2048')).toBe('2 KB');
    expect(formatFileSize(1500, 3)).toBe('1.465 KB');
  });

  it('负数与非法输入返回空串', () => {
    // assert: 守护 isFinite/非负守卫（utils.ts:369-371）
    expect(formatFileSize(-1)).toBe('');
    expect(formatFileSize('abc')).toBe('');
  });

  it('TB 上限不再进位（无 PB 单位）', () => {
    // assert: 守护 unitIndex < units.length-1 封顶（utils.ts:379）
    expect(formatFileSize(1099511627776)).toBe('1 TB');
    expect(formatFileSize(1125899906842624)).toBe('1024 TB');
  });
});

describe('stripHtmlTags（P1 #5，test-plan §8 #5）', () => {
  it('去除标签', () => {
    // assert: 守护标签正则（utils.ts:394 /<[^>]*>/g）
    expect(stripHtmlTags('a<br/>b')).toBe('ab');
    expect(stripHtmlTags('<b>bold</b>')).toBe('bold');
  });

  it('null / undefined 返回空串；HTML 实体不被改写', () => {
    // assert: 守护空值兜底（utils.ts:394 value || ''）与实体保留（正则只剥标签）
    expect(stripHtmlTags(null)).toBe('');
    expect(stripHtmlTags(undefined)).toBe('');
    expect(stripHtmlTags('a &amp; b')).toBe('a &amp; b');
  });
});
