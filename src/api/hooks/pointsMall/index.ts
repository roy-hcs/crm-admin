import { apiFormPostCustom, apiPost } from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  CrmDealGoodsListParams,
  CrmDealGoodsListRes,
  GoodsClassificationParams,
  GoodsClassificationRes,
  PointsBalanceParams,
  PointsBalanceRes,
  PointsChangeListParams,
  PointsChangeListRes,
  PointsHistoryListParams,
  PointsHistoryListRes,
} from './types';

export * from './types';

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
      apiPost('/system/points/goods/switch', params),
  });
}

/**
 * 删除商品
 */
export function useRemoveGoods() {
  return useMutation({
    mutationFn: (params: { ids: string }) =>
      apiFormPostCustom<{
        code: number;
        msg: string;
        data: null;
      }>('/system/points/goods/remove', params),
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

/**
 * 获取积分余额
 */
export function usePointsBalance(params: PointsBalanceParams) {
  return useQuery({
    queryKey: ['pointsBalance', params],
    queryFn: () =>
      apiFormPostCustom<PointsBalanceRes>(`/system/points/balanceOverview/list`, params),
  });
}

/**
 * 获取商品分类列表
 */
export function useGoodsClassification(params: GoodsClassificationParams) {
  return useQuery({
    queryKey: ['goodsClassification', params],
    queryFn: () =>
      apiFormPostCustom<GoodsClassificationRes>(`/system/points/goodsClassification/list`, params),
  });
}

/**
 * 修改商品分类状态
 */
export function useChangeGoodsClassificationStatus() {
  return useMutation({
    mutationFn: (params: { id: string; status: number }) =>
      apiPost('/system/points/goodsClassification/switch', params),
  });
}
