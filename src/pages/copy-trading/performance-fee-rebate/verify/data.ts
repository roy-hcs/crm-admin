import { PerformanceFeeRebateVerifyListParams } from '@/api/hooks/copyTrading/type';

export type PerformanceFeeRebateVerifySearchFormData = {
  orderNo: string;
  performanceFeeOrderNo: string;
  signalSourceName: string;
  trader: string;
  client: string;
  userId: string;
  status: string;
  timeRange: { from: string; to: string };
  reviewTimeRange: { from: string; to: string };
};
// 0 待审 1 审核中 2 通过 3 拒绝
export const statusOptions = [
  { label: 'table.pending', value: 0 },
  { label: 'table.inReview', value: 1 },
  { label: 'table.approved', value: 2 },
  { label: 'table.rejected', value: 3 },
];

export const createVerifyParams = (): PerformanceFeeRebateVerifyListParams => ({
  orderNo: '',
  performanceFeeOrderNo: '',
  signalSourceName: '',
  trader: '',
  client: '',
  status: '',
  userId: '',
  params: {
    beginTime: '',
    endTime: '',
    beginReviewTime: '',
    endReviewTime: '',
  },
  pageSize: 10,
  pageNum: 1,
  orderByColumn: 'status asc,createTime desc',
  isAsc: '',
});
