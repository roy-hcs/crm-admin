import { useGetSysConfig } from '@/api/hooks/system/system';

/**
 * 平台是否为指定操作开启 Google 验证码（旧版 check.googleAuth(code)）
 */
export function useGoogleAuthRequired(configCode: string) {
  const { data } = useGetSysConfig(`sys.google.authenticator.${configCode}`);
  return String(data ?? '') === '1';
}
