import { apiFormPostCustom } from '@/api/client';
import { UserOperationsLogsParams, UserOperationsLogsRes } from './type';
import { useQuery } from '@tanstack/react-query';

export function useUserOperationLogs(params: UserOperationsLogsParams) {
  return useQuery({
    queryKey: ['userOperationLogs', params],
    queryFn: () => apiFormPostCustom<UserOperationsLogsRes>('monitor/crmOperlog/list', params),
  });
}
