import { useGoogleAuthRequired } from '@/hooks/useGoogleAuthRequired';
import { FieldPath, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FormInput } from './FormInput';

/**
 * 平台开启对应操作的 Google 验证码时才渲染（与旧版 commonFields::googler 一致）
 */
export function FormGoogleCode<T extends FieldValues>({
  name,
  configCode,
}: {
  name: FieldPath<T>;
  configCode: string;
}) {
  const { t } = useTranslation();
  const required = useGoogleAuthRequired(configCode);

  if (!required) return null;

  return (
    <div>
      <FormInput<T>
        name={name}
        label={t('common.googleAuthCode')}
        placeholder={t('common.pleaseInput', { field: t('common.googleAuthCode') })}
        autoComplete="off"
      />
      <div className="mt-1 pl-px text-xs leading-5">
        <Link to="/account/profile" className="text-primary hover:underline">
          {t('common.googleAuthBindTip')}
        </Link>
      </div>
    </div>
  );
}
