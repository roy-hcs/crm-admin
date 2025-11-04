import { apiFormPost, apiFormPostCustom } from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  CrmDealGoodsListParams,
  CrmDealGoodsListRes,
  PointsChangeListParams,
  PointsChangeListRes,
  PointsHistoryListParams,
  PointsHistoryListRes,
} from './types';

/**
 * 获取商品列表
 */
export function useCrmDealGoodsList(params: CrmDealGoodsListParams) {
  return useQuery({
    queryKey: ['crmDealGoodsList', params],
    queryFn: () => apiFormPostCustom<CrmDealGoodsListRes>(`/system/points/goods/list`, params),
  });
}
/**
 *
 * 修改商品状态
 */
export function useChangeGoodsStatus() {
  return useMutation({
    mutationFn: (params: { id: string; status: number }) =>
      apiFormPost('/system/points/goods/switch', params),
  });
}

/**
 * 获取商品兑换记录
 */
export function usePointsHistoryList(params: PointsHistoryListParams) {
  return useQuery({
    queryKey: ['pointsHistoryList', params],
    queryFn: () => apiFormPostCustom<PointsHistoryListRes>(`/system/points/exchange/list`, params),
  });
}

/**
 * 获取积分变动记录
 */
export function usePointsChangeList(params: PointsChangeListParams) {
  return useQuery({
    queryKey: ['pointsChangeList', params],
    queryFn: () => apiFormPostCustom<PointsChangeListRes>(`/system/points/change/list`, params),
  });
}
