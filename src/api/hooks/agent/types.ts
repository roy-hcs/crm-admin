import { DealAccountGroup } from '../account';
import { OperationsLogsItem } from '../monitor/type';
import { Country, CrmUser, InfoTypeItem, RoleItem, TagProgress } from '../system';

export type AgentAccountStatsRes = {
  crmUser: number;
  directUser: number;
  dealAccount: number;
  directAccount: number;
  newCrmUser: number;
  newDirectUser: number;
  newDealAccount: number;
  newDirectAccount: number;
  statisticDate: string;
};
export type AgentCommissionRes = {
  totalCommission: number;
  monthCommission: number;
  dayCommissions: Array<{
    day: number;
    dayCommission: number;
  }>;
};
export type AgentNewAccountItem = {
  day: number;
  newCrmUser: number;
  newRealAccount: number;
  newDemoAccount: number;
};
export type AgentNewAccountRes = AgentNewAccountItem[];
export type AgentFundsRes = Array<{
  day: number;
  deposit: number;
  withdraw: number;
}>;
export type AgentTradeRes = {
  datas: Array<{
    day: number;
    closeProfit: number;
    closeLoss: number;
    volume: number;
    dealProfit: number;
    dealLoss: number;
  }>;
  sumThisMonth: {
    quantity: number;
    volume: number;
  };
};
export type UserAccountOperationRes = {
  insideTransfer: number;
  outMoney: number;
};

interface InviterInfoItem {
  inviterId: string;
  inviterName: string;
  inviterShowId: string;
  inviterInfo: string;
}

interface AccountListItem {
  name: string;
  id: string;
  type: number;
}

export interface UserRebateAccountTabRes {
  languages: InfoTypeItem[];
  roles: RoleItem[];
  realAccountNum: number;
  lastLogininfor: OperationsLogsItem;
  source: string | null;
  userInviter: string;
  tagProgress: TagProgress;
  userId: string;
  countryList: Country[];
  countryId: string;
  userLanguage: string;
  inviterInfo: InviterInfoItem;
  crmUser: CrmUser;
  userInviterName: string;
  allLever: string[];
  allDealAccountGroup: DealAccountGroup[];
  accountIds: string[];
  accountList: AccountListItem[];
  mockAccountNum: number;
  totalRebate: number;
}
export interface CustomerFollowupInfoItem {
  id: string;
  userId: string;
  username: string | null;
  title: string;
  content: string;
  followTime: string;
  createType: number;
  clientType: number;
  remind: number;
  remindUsers: string;
  remindAdmins: string;
  reminderNames: string | null;
  remindWay: string;
  remindTime: string | null;
  createTime: string;
  createBy: string;
  creator: string;
  beginTime: string | null;
  endTime: string | null;
}
export type CustomerFollowupRes = {
  total: string;
  rows: CustomerFollowupInfoItem[];
  code: number;
  msg: string | null;
  totalVolume: number;
  totalCommission: number;
  totalProfit: number;
  totalSwaps: number;
  priceSum: number;
  serverType: string | null;
  totalList: string[] | null;
};
export type CreateCustomerFollowupParams = {
  userId: string;
  title: string;
  content: string;
  followTime: string;
  remind: string;
  remindAdmins: string;
  remindUsers: string;
  remindWay: string;
  remindTime: string;
};
