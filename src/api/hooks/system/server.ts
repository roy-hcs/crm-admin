import { useQuery } from '@tanstack/react-query';
import { serverOptions as staticServerOptions } from '@/lib/const';

export interface ServerOption {
  label: string;
  value: string;
}

// 模拟后端获取服务器列表接口
function mockFetchServers(): Promise<ServerOption[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      // 这里可以动态拼接一些演示字段，当前直接复用静态常量
      resolve(staticServerOptions);
    }, 300); // 模拟网络延迟
  });
}

/**
 * 获取服务器列表（模拟）
 */
export function useServerList() {
  return useQuery<ServerOption[]>({
    queryKey: ['serverList'],
    queryFn: mockFetchServers,
    staleTime: 5 * 60 * 1000,
  });
}
