import * as z from 'zod';
import type { TFunction } from 'i18next';

/**
 * 标准密码字段校验：必须包含大小写字母 + 数字，长度 min~max。
 * 统一使用 rules.passwordComplexity 文案，消除各处密码校验的重复与漂移。
 *
 * @param opts.field    传入字段名则追加「必填」校验（.min(1, required)）
 * @param opts.min      最小长度，默认 8
 * @param opts.max      最大长度，默认 20
 * @param opts.optional 为 true 时允许为空（追加 .or(z.literal(''))），用于「密码选填」场景
 *
 * 注意：交易账户(trading)密码强制特殊字符且长度由后端配置驱动，规则不同，不在此覆盖。
 */
export function passwordSchema(
  t: TFunction,
  opts?: {
    field?: string;
    min?: number;
    max?: number;
    optional?: boolean;
  },
) {
  const { field, min = 8, max = 20, optional = false } = opts ?? {};
  const msg = t('rules.passwordComplexity', { min, max });
  const pattern = new RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{${min},${max}}$`);

  // 传入 field 时追加必填校验，提示「XX不能为空」
  let schema = field ? z.string().min(1, t('rules.required', { field })) : z.string();

  schema = schema.min(min, msg).max(max, msg).regex(pattern, msg);

  // 选填场景：允许留空
  return optional ? schema.or(z.literal('')) : schema;
}
