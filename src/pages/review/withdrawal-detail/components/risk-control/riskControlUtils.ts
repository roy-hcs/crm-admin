import { RiskNumber, RiskResultFilter } from '@/api/hooks/review';

export type RiskScope = 'current' | 'own' | 'umbrella';
export type RiskPeriod = '30d' | '60d' | '90d' | '120d' | 'month' | 'all';
export type RiskHierarchy = 'direct' | 'all' | 'custom';
export type RiskChainTab = 'direct' | 'crm';

export type RiskOrderDialogTarget = {
  serverId: string;
  account: string;
  resultFilter: RiskResultFilter;
  label: string;
  crmShowId: string;
  customerName: string;
};

export const RISK_PERIODS: RiskPeriod[] = ['30d', '60d', '90d', '120d', 'month', 'all'];

export const RISK_THRESHOLD_PRESETS = [1, 3, 5, 10, 30, 60];

export const RISK_DEFAULT_THRESHOLD_KEY = 'crm.lock.risk.overlap.threshold.seconds';

export function pad(value: number) {
  return value < 10 ? `0${value}` : `${value}`;
}

export function formatDate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function getPeriodRange(period: RiskPeriod) {
  const end = new Date();
  const start = new Date(end.getTime());
  switch (period) {
    case '30d':
      start.setDate(start.getDate() - 29);
      break;
    case '60d':
      start.setDate(start.getDate() - 59);
      break;
    case '90d':
      start.setDate(start.getDate() - 89);
      break;
    case '120d':
      start.setDate(start.getDate() - 119);
      break;
    case 'month':
      start.setDate(1);
      break;
    case 'all':
      start.setFullYear(start.getFullYear() - 2);
      start.setMonth(0, 1);
      break;
    default:
      start.setDate(start.getDate() - 29);
  }
  return { start: formatDate(start), end: formatDate(end) };
}

export function formatMoney(value: RiskNumber | undefined, currency?: string | null) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const num = Number(value);
  if (Number.isNaN(num)) {
    return null;
  }
  return `${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })} ${currency || 'USD'}`;
}

export function formatCountRate(
  count: RiskNumber | undefined,
  total: RiskNumber | undefined,
  rate: RiskNumber | undefined,
) {
  if (count === null || count === undefined) {
    return null;
  }
  const totalText = total === null || total === undefined ? '-' : total;
  return `${count}/${totalText} · ${Number(rate ?? 0).toFixed(2)}%`;
}

export function formatPercent(value: RiskNumber | undefined) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  return `${Number(value).toFixed(2)}%`;
}

export function formatDurationWithUnit(
  duration: { days: number; hm: string } | null,
  t: (key: string, options?: Record<string, unknown>) => string,
) {
  if (!duration) {
    return '-';
  }
  if (duration.days > 0) {
    return t('riskControlPage.durationDaysPrefix', { d: duration.days, hm: duration.hm });
  }
  return duration.hm;
}

/** 秒 -> { days, hm }，由调用方拼接"天"的文案 */
export function splitDuration(seconds: RiskNumber | undefined) {
  if (seconds === null || seconds === undefined) {
    return null;
  }
  const total = Number(seconds);
  if (Number.isNaN(total) || total < 0) {
    return null;
  }
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  return { days, hm: `${pad(hours)}:${pad(minutes)}` };
}

/**
 * 对比表导出：表格转 HTML-Excel，保留表头/分组行/合计列结构并显式指定列宽，
 * 否则 Excel 里会全部挤成默认窄列。眼睛图标是操作用节点，导出前摘掉。
 */
export function exportTableAsXls(table: HTMLTableElement, filename: string) {
  const clone = table.cloneNode(true) as HTMLTableElement;
  clone.querySelectorAll('[data-export-ignore]').forEach(el => el.remove());

  const colCount = clone.rows.length ? clone.rows[0].cells.length : 0;
  if (colCount > 0) {
    const colgroup = document.createElement('colgroup');
    for (let i = 0; i < colCount; i++) {
      const col = document.createElement('col');
      col.setAttribute('style', `width:${i === 0 ? 220 : 170}px`);
      colgroup.appendChild(col);
    }
    clone.insertBefore(colgroup, clone.firstChild);
  }

  const style =
    'table{border-collapse:collapse;} ' +
    'th,td{border:0.5px solid #c7cdd6;padding:6px 10px;font-size:12px;text-align:left;vertical-align:middle;mso-number-format:"\\@";} ' +
    'th{background:#f5f7fa;font-weight:bold;} ' +
    'tr.risk-row-group th{background:#eef5fc;color:#1a5fa8;} ' +
    'td.risk-total-col,th.risk-total-col{background:#f8fafd;font-weight:bold;color:#1a5fa8;} ' +
    '.risk-col-head strong{display:block;} ' +
    '.risk-col-head span{display:block;color:#888;font-size:11px;} ' +
    '.risk-dash{color:#bbb;}';

  const html =
    '<html xmlns:x="urn:schemas-microsoft-com:office:excel">' +
    `<head><meta charset="utf-8"><style>${style}</style></head>` +
    `<body>${clone.outerHTML}</body></html>`;

  const blob = new Blob([`\ufeff${html}`], {
    type: 'application/vnd.ms-excel;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${formatDate(new Date())}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
