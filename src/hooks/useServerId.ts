import { useEffect, useState } from 'react';
import { useServerList } from '@/api/hooks/system/system';

/**
 * 获取服务器列表并自动初始化默认 serverId（首个服务器 id）。
 * 多个页面有相同逻辑时可复用此 hook。
 */
export function useServerId(initialId = '') {
  const [serverId, setServerId] = useState(initialId);
  const { data: server, isLoading: serverLoading } = useServerList();

  useEffect(() => {
    if (!serverId && server?.code === 0 && server?.rows?.length) {
      // 只在还没选中时设置，避免无限循环
      setServerId(server.rows[0].id);
    }
  }, [server, serverId]);

  return { serverId, setServerId, server, serverLoading } as const;
}
