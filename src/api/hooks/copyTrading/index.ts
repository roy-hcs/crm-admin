import { apiFormPostCustom } from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  MamSignalSourceListParams,
  MamSignalSourceListRes,
  MamSignalSourceVerifyListParams,
  MamSignalSourceVerifyListRes,
  MamSymbolListParams,
  MamSymbolListRes,
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
