import { apiFormPostCustom } from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  MamFollowListParams,
  MamFollowListRes,
  MamProtocolListParams,
  MamProtocolListRes,
  MamSignalSourceListParams,
  MamSignalSourceListRes,
  MamSignalSourceVerifyListParams,
  MamSignalSourceVerifyListRes,
  MamSymbolListParams,
  MamSymbolListRes,
  PerformanceFeeListParams,
  PerformanceFeeListRes,
} from './type';

export function useChangeMamSignalSource() {
  return useMutation({
    mutationFn: (params: { id: string; publicShow: number }) =>
      apiFormPostCustom<{
        code: number;
      }>('/system/mamSignalSource/edit', params),
  });
}
/**
 * 信号源列表
 */
export function useMamSignalSourceList(params: MamSignalSourceListParams) {
  return useQuery({
    queryKey: ['mamSignalSourceList', params],
    queryFn: () =>
      apiFormPostCustom<MamSignalSourceListRes>(`/system/mamSignalSource/list`, params),
  });
}

/**
 * 信号源审核列表
 */
export function useMamSignalSourceVerifyList(params: MamSignalSourceVerifyListParams) {
  return useQuery({
    queryKey: ['mamSignalSourceVerifyList', params],
    queryFn: () =>
      apiFormPostCustom<MamSignalSourceVerifyListRes>(
        `/system/mamSignalSourceVerify/verifyList`,
        params,
      ),
  });
}

/**
 * 品种管理
 */
export function useMamSymbolList(params: MamSymbolListParams) {
  return useQuery({
    queryKey: ['mamSymbolList', params],
    queryFn: () => apiFormPostCustom<MamSymbolListRes>(`/system/mamSymbol/list`, params),
  });
}

/**
 * 表现费记录
 */
export function usePerformanceFeeList(params: PerformanceFeeListParams) {
  return useQuery({
    queryKey: ['performanceFeeList', params],
    queryFn: () => apiFormPostCustom<PerformanceFeeListRes>(`/system/performanceFee/list`, params),
  });
}
/**
 * 协议设置
 */
export function useMamProtocolList(params: MamProtocolListParams) {
  return useQuery({
    queryKey: ['mamProtocolList', params],
    queryFn: () => apiFormPostCustom<MamProtocolListRes>('/system/mamProtocol/list', params),
  });
}

/**
 * 订单管理
 */
export function useMamFollowList(params: MamFollowListParams) {
  return useQuery({
    queryKey: ['mamFollowList', params],
    queryFn: () => apiFormPostCustom<MamFollowListRes>('/system/mamFollow/list', params),
  });
}
