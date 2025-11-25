import { BaseEntity, BasicParams, BasicRes } from '@/api/types';

export type PammCommissionListParams = BasicParams & {
  commissionType?: string;
  serverId?: string;
  projectName?: string;
  customerName?: string;
  orderNo?: string;
  verifyStatus?: string;
  profitType?: string;
  settlementType?: string;

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

export type PammAuditLogListParams = BasicParams & {
  projectName?: string;
  investor?: string;
  operType?: string;
  orderNo?: string;
  auditStatus?: string;
  createStartTime?: string;
  createEndTime?: string;
  auditStartTime?: string;
  auditEndTime?: string;
};

export type PammAuditLogItem = {
  id: string | null;
  orderNo: string | null;
  userInvestId: string | null;
  userId: string | null;
  projectId: string | null;
  projectName: string | null;
  share: string | null;
  amount: number | null;
  walletId: string | null;
  operType: number | null;
  auditStatus: number | null;
  auditTime: string | null;
  auditor: string | null;
  remark: string | null;
  createTime: string | null;
  investor: string | null;
  createStartTime: string | null;
  createEndTime: string | null;
  auditStartTime: string | null;
  auditEndTime: string | null;
  currency: string | null;
};

export type PammAuditLogTotalItem = {
  amountTotal: number | null;
  currency: string | null;
};

export type PammAuditLogListRes = BasicRes<PammAuditLogItem> & {
  totalList: PammAuditLogTotalItem[];
};

export type ProductReviewListParams = BasicParams & {
  investmentManager?: string;
  projectName?: string;
  submitStartTime?: string;
  submitEndTime?: string;
  verifyStartTime?: string;
  verifyEndTime?: string;
  login?: string;
  applyStatus?: string;
};

export type ProductReviewItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: object;
  id: string | null;
  status: number | null;
  projectName: string | null;
  serverId: string | null;
  serverName: string | null;
  serverType: number | null;
  primaryAccount: string | null;
  login: string | null;
  subAccount: string | null;
  isDeleted: boolean;
  currency: string | null;
  followCount: string | null;
  agentCommission: string | null;
  agentProfit: string | null;
  primaryShowUser: string | null;
  subShowUser: string | null;
  adjustTime: string | null;
  freezeTime: string | null;
  profitType: string | null;
  performanceReward: string | null;
  annualizedRate: string | null;
  minAmount: string | null;
  lockPeriod: string | null;
  billingCycle: string | null;
  billingUnit: string | null;
  model: number | null;
  maxAmount: string | null;
  maxTimes: string | null;
  projectLevels: string | null;
  netWorth: string | null;
  totalYield: string | null;
  account: string | null;
  archivesList: string | null;
  settlementType: string | null;
  openingDays: string | null;
  profitRate: string | null;
  profit: string | null;
  belongedUserName: string | null;
  allowSellAhead: string | null;
  applyStatus: number | null;
  verifyTime: string | null;
  verifyBy: string | null;
  source: string | null;
  totalAmountLimit: string | null;
  followCountLimit: null;
  closePosition: null;
  showProtocol: null;
  protocolIds: null;
  protocols: null;
};

export type ProductReviewListRes = BasicRes<ProductReviewItem>;

export type PammProductListParams = BasicParams & {
  profitType: string;
  projectName: string;
  model: string;
  serverType: string;
  status: string;
};
export type PammProductItem = BaseEntity & {
  id: string;
  status: number;
  projectName: string;
  serverId: string;
  serverName: string;
  serverType: number;
  primaryAccount: string;
  login: string;
  subAccount: string | null;
  isDeleted: string | null;
  currency: string;
  followCount: number;
  agentCommission: number | null;
  agentProfit: number | null;
  primaryShowUser: string | null;
  subShowUser: string | null;
  adjustTime: string | null;
  freezeTime: string | null;
  profitType: number;
  performanceReward: number;
  annualizedRate: number;
  minAmount: number;
  lockPeriod: number;
  billingCycle: number;
  billingUnit: number;
  model: number;
  maxAmount: number;
  maxTimes: number;
  projectLevels: string | null;
  netWorth: number;
  totalYield: number;
  account: string | null;
  archivesList: string | null;
  settlementType: number;
  openingDays: string | null;
  profitRate: number;
  profit: number;
  belongedUserName: string;
  allowSellAhead: number;
  applyStatus: number;
  verifyTime: string;
  verifyBy: string;
  source: number;
  totalAmountLimit: number | null;
  followCountLimit: number | null;
  closePosition: number;
  showProtocol: boolean;
  protocolIds: string | null;
  protocols: string | null;
};
export type PammProductListRes = BasicRes<PammProductItem>;
