// Message module API hooks
import { apiFormPostCustom } from '@/api/client';
import { useQuery } from '@tanstack/react-query';
import { GetMsgListParams, GetMsgListRes } from './types';

export * from './types';

/**
 * 获取消息列表
 */
export function useGetMsgList(params: GetMsgListParams) {
  return useQuery({
    queryKey: ['MsgList', params],
    queryFn: () => apiFormPostCustom<GetMsgListRes>('/system/msg/list', params),
  });
}
