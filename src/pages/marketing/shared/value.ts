export function toStringValue(value: unknown, fallback = ''): string {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

export function toStringArray(value: unknown, separator = ','): string[] {
  return toStringValue(value)
    .split(separator)
    .map(item => item.trim())
    .filter(Boolean);
}
