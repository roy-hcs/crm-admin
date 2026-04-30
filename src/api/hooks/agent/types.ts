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
