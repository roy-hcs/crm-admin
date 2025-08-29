import { apiFormPostCustom } from '@/api/client';
import { useQuery } from '@tanstack/react-query';
import {
  clientTrackingParams,
  AgencyClientTrackingResponse,
  overviewParams,
  overviewResponse,
} from './types';

/**
 * 获取ib报表-ib客户追踪
 */
export function useAgencyClientTrackingList(params: clientTrackingParams) {
  return useQuery({
    queryKey: ['agencyClientTrackingList', params],
    queryFn: () =>
      apiFormPostCustom<AgencyClientTrackingResponse>(
        '/system/statistics/agencyClientTrackingList',
        params || {},
      ),
    // 重置为相同参数时，如果缓存仍新鲜（全局 staleTime=60s），不会自动请求。
    // 这里将该查询的 staleTime 设为 0，确保切换到任何参数都会重新请求。
    staleTime: 0,
  });
}

/**
 * 获取ib报表-ib数据总览
 */
export function useAgencyOverviewList(params: overviewParams) {
  return useQuery({
    queryKey: ['agencyOverviewList', params],
    queryFn: () =>
      apiFormPostCustom<overviewResponse>('/system/statistics/agencyOverviewList', params || {}),
    // 重置为相同参数时，如果缓存仍新鲜（全局 staleTime=60s），不会自动请求。
    // 这里将该查询的 staleTime 设为 0，确保切换到任何参数都会重新请求。
    staleTime: 0,
  });
}
