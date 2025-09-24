import { apiFormPostCustom } from '@/api/client';
import { useQuery } from '@tanstack/react-query';
import { AgentApplyListParams, AgentApplyListRes } from './types';

export function useAgentApplyList(params: AgentApplyListParams, options: { enabled: boolean }) {
  return useQuery({
    queryKey: ['agentApplyList', params],
    queryFn: () => apiFormPostCustom<AgentApplyListRes>('/system/agentApply/list', params),
    enabled: options.enabled,
  });
}
