import { apiFormPostCustom, apiGetCustom, apiPost } from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AddGoodsClassificationParams,
  CrmDealGoodsListParams,
  CrmDealGoodsListRes,
  GoodDetailInfo,
  GoodsClassificationDetail,
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
 * 商品兑换记录审核
 */
export function useExchangeVerify() {
  return useMutation({
    mutationFn: (params: { id: string; remark: string; verifyStatus: string }) =>
      apiPost('/system/points/exchange/verify', params),
  });
}

/**
 * 商品兑换记录审核详情
 */
export function useExchangeDetailInfo() {
  return useMutation({
    mutationFn: (params: { id: string }) =>
      apiGetCustom<{
        code: number;
        msg: string;
        data: GoodDetailInfo;
      }>(`/system/points/exchange/detailinfo/${params.id}`, {}),
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

/**
 * 校验商品名称
 */
export function useCheckClassificationName() {
  return useMutation({
    mutationFn: (params: { classificationName: string; language: string; id?: string }) =>
      apiPost('/system/points/goodsClassification/checkClassificationName', params),
  });
}

/**
 * 新增商品分类
 */
export function useAddGoodsClassification() {
  return useMutation({
    mutationFn: (params: AddGoodsClassificationParams) =>
      apiPost('/system/points/goodsClassification/add', params),
  });
}

/**
 * 编辑商品分类/
 */
export function useEditGoodsClassification() {
  return useMutation({
    mutationFn: (params: AddGoodsClassificationParams) =>
      apiPost('/system/points/goodsClassification/edit', params),
  });
}

/**
 * 获取商品分类详情
 */
export function useGoodsClassificationDetail() {
  return useMutation({
    mutationFn: (id: string) =>
      apiGetCustom<{
        code: number;
        msg: string;
        data: {
          goodsClassification: GoodsClassificationDetail;
        };
      }>(`/system/points/goodsClassification/detailInfo/${id}`),
  });
}

/**
 * 删除商品分类
 */
export function useRemoveGoodsClassification() {
  return useMutation({
    mutationFn: (params: { ids: string }) =>
      apiFormPostCustom<{
        code: number;
        msg: string;
        data: null;
      }>('/system/points/goodsClassification/remove', params),
  });
}
