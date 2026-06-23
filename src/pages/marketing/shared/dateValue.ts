import { format } from 'date-fns';
import { toStringValue } from './value';

export function normalizeDateValue(
  value: Date | string | undefined,
  pattern = 'yyyy-MM-dd HH:mm:ss',
): string {
  if (!value) return '';
  return value instanceof Date ? format(value, pattern) : toStringValue(value);
}
