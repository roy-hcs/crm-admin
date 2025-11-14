import { BasicParams, BasicRes } from '@/api/types';

export type PammCommissionListParams = BasicParams & {
  commissionType?: string;
  serverId?: string;
  projectName?: string;
  customerName?: string;
  orderNo?: string;
  verifyStatus?: string;
  profitType?: string;

  params: {
    beginTime?: string;
    endTime?: string;
    auditBeginTime?: string;
    auditEndTime?: string;
  };
};

export type PammCommissionItem = {
  id: string;
  commissionType: number;
  userInvestId: string;
  userId: string | null;
  userName: string | null;
  projectId: string;
  projectName: string;
  serverId: string;
  serverName: string;
  serverType: number;
  profitType: number;
  annualizedRate: number;
  performanceReward: number;
  rewardAmount: number;
  businessAmount: number;
  businessTime: string;
  submitTime: string;
  unitEquity: string | null;
  share: string | null;
  verifyId: string | null;
  verifyUser: string;
  verifyTime: string | null;
  verifyStatus: number;
  customerId: string;
  customerName: string;
  commission: number;
  remark: string | null;
  orderNo: string;
  settlementType: string | null;
  managerName: string | null;
  currency: string;
};

export type TotalItem = {
  rewardAmountToatl: number | null;
  commissionToatl: number | null;
  currency: string;
  businessAmountToatl: number | null;
};

export type PammCommissionListRes = BasicRes<PammCommissionItem> & {
  totalList: TotalItem[];
};
