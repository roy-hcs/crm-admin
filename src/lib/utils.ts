import { API_BASE_URL } from '@/api/client';
import { CrmDealAccountFundFlowItem } from '@/api/hooks/account';
import { ColumnMeta } from '@/api/hooks/common';
import { TotalItem } from '@/api/hooks/pamm/type';
import { CRMColumnDef } from '@/components/table';
import { clsx, type ClassValue } from 'clsx';
import dayjs from 'dayjs';
import JSEncrypt from 'jsencrypt';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateColorfulColor = (index: number) => {
  const colorPalette = [
    '#FF6384', // pink/red
    '#36A2EB', // blue
    '#FFCE56', // yellow
    '#4BC0C0', // teal
    '#9966FF', // purple
    '#FF9F40', // orange
    '#32CD32', // lime green
    '#BA55D3', // medium orchid
    '#20B2AA', // light sea green
    '#FF6347', // tomato
  ];

  if (index < colorPalette.length) {
    return colorPalette[index];
  }

  // Generate a random vibrant color if we're out of palette colors
  const h = Math.floor(Math.random() * 360); // hue (0-360)
  const s = Math.floor(70 + Math.random() * 30); // saturation (70-100%)
  const l = Math.floor(45 + Math.random() * 10); // lightness (45-55%)
  return `hsl(${h}, ${s}%, ${l}%)`;
};

type TransformedItem = {
  amount: string;
  currency: string;
};

type TransformedData = Array<{
  commissionToatl?: TransformedItem[];
  businessAmountToatl?: TransformedItem[];
  rewardAmountToatl?: TransformedItem[];
}>;

/**
 * 数据格式处理
 */
export const transformTotalList = (
  data: TotalItem[] | undefined,
  fileds: Array<'commissionToatl' | 'businessAmountToatl' | 'rewardAmountToatl'>,
): TransformedData => {
  if (!data || !Array.isArray(data)) {
    return [];
  }

  const result: TransformedData = [];

  fileds.forEach(field => {
    const fieldData: TransformedItem[] = [];

    data.forEach(item => {
      const value = item[field];
      if (value !== null) {
        fieldData.push({
          amount: String(value),
          currency: item.currency,
        });
      }
    });

    if (fieldData.length > 0) {
      result.push({
        [field]: fieldData,
      });
    }
  });

  return result;
};

export const formatDate = (date?: Date | string, format = 'YYYY-MM-DD') => {
  if (!date) {
    return '';
  }
  return dayjs(date).format(format);
};

export const percentageFormat = (value: number) => {
  return (value >= 0 ? '+' : '') + (value * 100).toFixed(0) + '%';
};

export const getCssVar = (name: string, fallback: string) => {
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name);
    return v && v.trim() ? v.trim() : fallback;
  } catch {
    return fallback;
  }
};

export const getColumnMeta: <T>(
  columns: CRMColumnDef<T, unknown>[],
  filterIds?: string[],
) => ColumnMeta[] = (columns, filterIds = []) => {
  return columns
    .filter(col => {
      const id = col.id || col.accessorKey;
      return id && !filterIds.includes(id);
    })
    .map(col => ({
      id: col.id || '',
      label: typeof col.header === 'string' ? col.header : col.label || col.id || '',
      defaultVisible: true,
    }));
};

export const downloadFile = (
  fileName: string,
  deleteAfterDownload: boolean = true,
  baseUrl?: string,
) => {
  if (!fileName) {
    console.error('downloadFile: fileName is required');
    return;
  }

  // Import API_BASE_URL dynamically or use provided baseUrl
  const API_URL = baseUrl || API_BASE_URL;
  const downloadUrl = `${API_URL}/common/download?fileName=${encodeURIComponent(fileName)}&delete=${deleteAfterDownload}`;

  // Use window.location.href for simple download (works with backend session cookies)
  window.location.href = downloadUrl;
};

export const downloadFileWithBlob = async (
  fileName: string,
  deleteAfterDownload: boolean = true,
  baseUrl?: string,
): Promise<void> => {
  if (!fileName) {
    throw new Error('downloadFile: fileName is required');
  }

  const API_URL = baseUrl || API_BASE_URL;
  const downloadUrl = `${API_URL}/common/download?fileName=${encodeURIComponent(fileName)}&delete=${deleteAfterDownload}`;

  try {
    const response = await fetch(downloadUrl, {
      method: 'GET',
      credentials: 'include', // Include cookies for authentication
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    // Get the blob from response
    const blob = await response.blob();

    // Extract filename from Content-Disposition header if available
    const contentDisposition = response.headers.get('Content-Disposition');
    let downloadFileName = fileName;
    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      if (matches != null && matches[1]) {
        downloadFileName = matches[1].replace(/['"]/g, '');
      }
    }

    // Create blob URL and trigger download
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = downloadFileName;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};

export type TimePrecision = 'minute' | 'second';

export const normalizeTimeByPrecision = (value: string | undefined, precision: TimePrecision) => {
  if (!value) return '';
  const parts = value.trim().split(':');
  const [h = '', m = '', s = ''] = parts;
  const isNum = (v: string) => /^\d{1,2}$/.test(v);
  if (!isNum(h) || !isNum(m) || (precision === 'second' && s !== '' && !isNum(s))) {
    return '';
  }
  const hh = String(Number(h)).padStart(2, '0');
  const mm = String(Number(m)).padStart(2, '0');
  const ss = s === '' ? '00' : String(Number(s)).padStart(2, '0');
  if (Number(hh) > 23 || Number(mm) > 59 || Number(ss) > 59) return '';
  return precision === 'minute' ? `${hh}:${mm}` : `${hh}:${mm}:${ss}`;
};

/**
 * 这就是原后台使用的方法
 */
export function oprType(row: CrmDealAccountFundFlowItem) {
  const comment = row.comment === null ? '' : row.comment;
  const lower = comment.toLocaleLowerCase();

  if (comment.startsWith('DD$')) {
    return 'tradingAccountTransactions.type.10';
  }
  if (comment.startsWith('DW$')) {
    return 'tradingAccountTransactions.type.11';
  }
  if (row.type === 4) {
    return 'tradingAccountTransactions.type.12';
  }

  const isSys =
    lower.indexOf('{sys}') > -1 || comment.startsWith('SD$') || comment.startsWith('SW$');
  const isCom =
    lower.startsWith('commission') ||
    comment.startsWith('RT$') ||
    comment.startsWith('RS$') ||
    comment.startsWith('RD$');
  const isInter =
    lower.indexOf('inter transfer') > -1 ||
    comment.indexOf('{INT}') > -1 ||
    comment.startsWith('TD$') ||
    comment.startsWith('TW$');

  const profit = row.profit || 0;

  if (row.flowType === 1) {
    //出入金
    if (isSys) {
      //系统行为
      if (profit < 0) {
        return 'tradingAccountTransactions.type.4';
      } else {
        return 'tradingAccountTransactions.type.3';
      }
    }
    if (!isSys && !isInter) {
      //用户行为
      if (profit < 0) {
        return 'tradingAccountTransactions.type.2';
      } else if (profit >= 0 && !isCom) {
        return 'tradingAccountTransactions.type.1';
      }
    }
    if (isInter) {
      if (profit >= 0) {
        return 'tradingAccountTransactions.type.8';
      } else if (profit < 0) {
        return 'tradingAccountTransactions.type.9';
      }
    }
    if (isCom && profit >= 0) {
      return 'tradingAccountTransactions.type.7';
    }
  }

  if (row.flowType === 2) {
    //信用金出入金
    if (profit < 0) {
      return 'tradingAccountTransactions.type.6';
    }
    return 'tradingAccountTransactions.type.5';
  }

  if (row.flowType === 3) {
    //费用
    return 'tradingAccountTransactions.type.12';
  }

  if (row.flowType === 4) {
    //更正
    return 'tradingAccountTransactions.type.13';
  }
  if (row.flowType === 8) {
    return 'tradingAccountTransactions.type.14';
  }
}

/**
 * 统一加密方法
 */
export const encryptWithPublicKey = (data: string) => {
  const pubKey = localStorage.getItem('publicKey');
  if (!pubKey) {
    throw new Error('Public key not found in localStorage');
  }
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(`-----BEGIN PUBLIC KEY-----${pubKey}-----END PUBLIC KEY-----`);
  const encryptedData = encryptor.encrypt(data);
  if (!encryptedData) {
    throw new Error('Encryption failed');
  }
  return encryptedData;
};

/**
 * 规范化百分比输入，允许用户输入过程中出现的中间状态（如 "0."），最终结果限制在0-100之间，且最多两位小数。
 */
export function normalizePercentageInput(value: string) {
  const raw = value.replace(/[^\d.]/g, '');
  if (!raw) return '';

  const firstDotIndex = raw.indexOf('.');
  const normalized =
    firstDotIndex === -1
      ? raw
      : `${raw.slice(0, firstDotIndex + 1)}${raw.slice(firstDotIndex + 1).replace(/\./g, '')}`;

  // Allow typing intermediate states such as "0." before final decimals are entered.
  if (!/^\d+(\.\d{0,2})?$/.test(normalized)) {
    return normalized.includes('.') ? normalized.slice(0, normalized.indexOf('.') + 3) : normalized;
  }

  if (normalized === '.') return '';

  const numericValue = Number(normalized);
  if (Number.isNaN(numericValue)) return '';
  if (numericValue > 100) return '100';

  return normalized;
}
