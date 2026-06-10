import { PerformanceFeeRebateReportListParams } from '@/api/hooks/copyTrading/type';
import { PerformanceFeePayStatusOptions } from '@/lib/const';

export type PerformanceFeeRebateReportSearchFormData = {
  orderNo: string;
  performanceFeeOrderNo: string;
  signalSourceName: string;
  trader: string;
  client: string;
  payStatus: string;
  userId: string;
  timeRange: { from: string; to: string };
  payTimeRange: { from: string; to: string };
};

export const performanceFeeRebateReportPayStatusOptions = PerformanceFeePayStatusOptions;

export const createReportParams = (): PerformanceFeeRebateReportListParams => ({
  orderNo: '',
  performanceFeeOrderNo: '',
  signalSourceName: '',
  trader: '',
  client: '',
  payStatus: '',
  userId: '',
  params: {
    beginTime: '',
    endTime: '',
    beginPayTime: '',
    endPayTime: '',
  },
  pageSize: 10,
  pageNum: 1,
  orderByColumn: 'createTime desc',
  isAsc: '',
});
