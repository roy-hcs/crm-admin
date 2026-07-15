import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ServerItem } from '@/api/hooks/system/types';

/**
 * 当 serverOptions 异步加载完成后，若表单中 serverId 尚未设置，则自动填入默认值（initialServerId 或第一个服务器）
 */
 
export function useServerIdAutoFill(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>,
  initialServerId: string | undefined,
  serverOptions: Pick<ServerItem, 'id'>[],
) {
  useEffect(() => {
    if (form.getValues('serverId')) return;
    const auto = initialServerId || serverOptions[0]?.id || '';
    if (auto) form.setValue('serverId', auto, { shouldDirty: false, shouldTouch: false });
  }, [form, initialServerId, serverOptions]);
}
