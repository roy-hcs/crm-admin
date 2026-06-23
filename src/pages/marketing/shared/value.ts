/**
 * 任意值转字符串，null/undefined 时返回兜底值。
 */
export function toStringValue(value: unknown, fallback = ''): string {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

/**
 * 将逗号分隔字符串转为数组：split -> trim -> 去空。
 * 示例："1, 2, ,3" => ["1", "2", "3"]
 */
export function toStringArray(value: unknown, separator = ','): string[] {
  return toStringValue(value)
    .split(separator)
    .map(item => item.trim())
    .filter(Boolean);
}

/**
 * 规范化“正整数输入”：
 * 1. 仅保留数字
 * 2. 去除前导 0（保留单个 0 的输入体验）
 * 示例："a01b2" => "12"
 */
export function normalizePositiveIntegerInput(value: string): string {
  const digitsOnly = value.replace(/\D/g, '');
  if (!digitsOnly) return '';
  return digitsOnly.replace(/^0+(?=\d)/, '');
}

/**
 * 规范化“正数小数输入”：
 * 1. 仅保留数字和第一个小数点
 * 2. 小数位默认最多 2 位，可通过参数调整（例如 4 位）
 * 3. 整数部分复用 normalizePositiveIntegerInput
 * 示例：
 * - normalizePositiveDecimalInput("00a1.2.345") => "1.23"
 * - normalizePositiveDecimalInput("00a1.2.34567", 4) => "1.2345"
 */
export function normalizePositiveDecimalInput(value: string, maxDecimalPlaces = 2): string {
  const raw = value.replace(/[^\d.]/g, '');
  if (!raw) return '';

  const safeMaxDecimalPlaces = Math.max(0, Math.floor(maxDecimalPlaces));

  const firstDotIndex = raw.indexOf('.');
  if (firstDotIndex === -1) {
    return normalizePositiveIntegerInput(raw);
  }

  if (safeMaxDecimalPlaces === 0) {
    return normalizePositiveIntegerInput(raw.slice(0, firstDotIndex));
  }

  const intPart = normalizePositiveIntegerInput(raw.slice(0, firstDotIndex)) || '0';
  const decimalPart = raw
    .slice(firstDotIndex + 1)
    .replace(/\./g, '')
    .slice(0, safeMaxDecimalPlaces);
  return `${intPart}.${decimalPart}`;
}

/**
 * 兼容旧方法：默认保留 2 位小数。
 */
export function normalizePositiveDecimalTwoPlacesInput(value: string): string {
  return normalizePositiveDecimalInput(value, 2);
}

/**
 * 规范化 sort 输入：仅允许 0-9999 的整数。
 * 示例："10000" => "9999"
 */
export function normalizeSortInput(value: string): string {
  const normalized = normalizePositiveIntegerInput(value);
  if (!normalized) return '';

  const numberValue = Number(normalized);
  if (Number.isNaN(numberValue)) return '';
  return String(Math.min(9999, Math.max(0, numberValue)));
}

/**
 * 将输入规范化函数应用到 input 元素。
 * 推荐用法：
 * onInput={event => applyInputNormalizer(event.currentTarget, normalizeSortInput)}
 */
export function applyInputNormalizer(
  inputElement: HTMLInputElement,
  normalizer: (value: string) => string,
) {
  const nextValue = normalizer(inputElement.value);
  if (nextValue !== inputElement.value) {
    inputElement.value = nextValue;
  }
}
