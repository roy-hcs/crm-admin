import { apiFormPostCustom } from '@/api/client';
import { useQuery } from '@tanstack/react-query';
import {
  ClientTrackingParams,
  AgencyClientTrackingResponse,
  OverviewParams,
  OverviewResponse,
} from './types';

/**
 * 获取ib报表-ib客户追踪
 */
export function useAgencyClientTrackingList(params: ClientTrackingParams) {
  return useQuery({
    queryKey: ['agencyClientTrackingList', params],
    queryFn: () =>
      apiFormPostCustom<AgencyClientTrackingResponse>(
        '/system/statistics/agencyClientTrackingList',
        params || {},
      ),
  });
}

/**
 * 获取ib报表-ib数据总览
 */
export function useAgencyOverviewList(params: OverviewParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['agencyOverviewList', params],
    queryFn: () =>
      apiFormPostCustom<OverviewResponse>('/system/statistics/agencyOverviewList', params || {}),
    enabled: options?.enabled ?? true,
  });
}
