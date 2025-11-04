import { apiFormPost, apiFormPostCustom } from '@/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CrmDealGoodsListParams, CrmDealGoodsListRes } from './types';

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
