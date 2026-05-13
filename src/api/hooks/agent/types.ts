import { KycStatus } from '@/components/common/RrhKycStatus';
import { DealAccountGroup } from '../account';
import { OperationsLogsItem } from '../monitor/type';
import { Country, CrmUser, InfoTypeItem, RoleItem, TagProgress, WalletItem } from '../system';
import { BasicParams } from '../review';
import { languageItem } from '../pointsMall';

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
export interface ColumnItem {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, string>;
  id: number;
  columnBelong: number;
  columnSource: number;
  columnType: number;
  columnLength: string | null;
  status: boolean;
  require: boolean;
  occupyNum: number;
  sort: number;
  columnName: string;
  language: string | null;
  columnValue: string | null;
  linkIds: string;
  columnNames: string | null;
  options: ColumnOption[];
}

export interface ColumnOption {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, string>;
  id: string;
  columnId: number;
  optionName: string;
  optionLink: string | null;
  sort: number;
  selected: string | null;
  optionItems: string | null;
}
export interface KYCInfoItem {
  id: string | null;
  userId: string | null;
  userName: string | null;
  userLastName: string | null;
  userShowId: string | null;
  infoType: string | null;
  status: KycStatus;
  subTime: string | null;
  verifyUser: string | null;
  vUserName: string | null;
  vUserLastName: string | null;
  verifyTime: string | null;
  remark: string | null;
  verifyStep: string | null;
  verifyUserName: string | null;
  sumsubId: string | null;
  sumsubName: string;
  params: string | null;
}
export type KycInfoRes = {
  bVerifyId: string;
  countryId: string;
  fVerifyId: string;
  iVerifyId: string;
  mockAccountNum: number;
  mode: string; // Sumsub | Basic
  realAccountNum: number;
  totalRebate: number;
  userId: string;
  userInviter: string;
  userInviterName: string;
  userLanguage: string;
  verifyStatus: number;
  tagProgress: TagProgress;
  roles: RoleItem[];
  lastLogininfor: OperationsLogsItem | null;
  languages: InfoTypeItem[];
  crmUser: CrmUser;
  countryList: Country[];
  columns: ColumnItem[];
  KYCInfo: KYCInfoItem[];
};
export interface KycInfoProtocolRes {
  iVerifyId: string | null;
  fVerifyId: string | null;
  from: number;
  bVerifyId: string | null;
  allProtocol: ProtocolItem[];
}

export interface ProtocolItem {
  createBy: string | null;
  createTime: string;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: {
    read: boolean;
    time: string;
  };
  id: string;
  protocolName: string;
  status: number;
  sort: string | null;
  content: string;
  type: number;
  filesCount: number | null;
  contentType: number;
  fileUrl: string;
  supportLanguage: number;
  languages: string | null;
  languagesStr: string | null;
  countryId: string | null;
  countryNameStr: string | null;
  signatureUrl: string | null;
  // 从源代码来看，这个url似乎是个json，内容应该是{url: string; name: string}[]，需要转换后才能使用
  enclosureUrl: string | null;
}
export interface UserWalletListRes {
  total: string;
  rows: Array<WalletItem>;
  code: number;
  msg: string;
  totalVolume: number;
  totalCommission: number;
  totalProfit: number;
  totalSwaps: number;
  priceSum: number;
  serverType: string;
  totalList: number;
}
export type DepositChannelItem = BasicParams & {
  params: Record<string, string>;
  id: string;
  channelName: string;
  defaultChannelName?: string | null;
  status: number;
  channelIcon?: string | null;
  channelCurrency: string;
  sort?: number | null;
  minDeposit?: number | null;
  maxDeposit?: number | null;
  commissionMod: number;
  commissionRate?: number | null;
  minCommission?: number | null;
  maxCommission?: number | null;
  fixCommission?: number | null;
  amountDigits?: number | null;
  roleIds?: string | null;
  applicableRoles?: string | null;
  delFlag: number;
  fieldList?: unknown | null;
  languageList?: languageItem[] | null;
  applicableUserSettings?: unknown | null;
};
export type WithdrawChannelItem = BasicParams & {
  params: Record<string, string>;
  id: string;
  channelName: string;
  status: number;
  channelIcon?: string | null;
  channelCurrency: string;
  sort: number;
  delFlag?: boolean | null;
  fieldList?: unknown | null;
  languageList?: unknown | null;
  language: string;
  outMoneyAccountCheck: number;
  outMoneyWithdrawCheck?: number | null;
  outMoneyWithdrawCheckMethod?: string | null;
  frozen?: number | null;
};
export type UserWalletDetail = {
  walletId: string;
  sysDepositChannelList: DepositChannelItem[];
  sysWithdrawChannelList: WithdrawChannelItem[];
  tab: number;
  insideTransfer: number;
  crmUserWallet: WalletItem;
  allOut: string;
  sysWithdrawChannelListAll: WithdrawChannelItem[];
  outMoney: number;
  allIn: string;
};

export type AccountOperationListParams = BasicParams & {
  ipAddr: string;
  ipTrust: string;
  device: string;
  deviceTrust: string;
};
export type AccountActivityItem = BasicParams & {
  params: Record<string, string>;
  operId: string;
  title: string;
  businessType: string;
  businessTypes: string;
  method: string;
  operatorType: string;
  operName: string;
  operUrl: string;
  operIp: string;
  operLocation: string;
  operParam: string;
  status: string;
  operTime: string;
  browser: string;
  riskScore: number;
  os: string;
  ipRiskyFlag: number;
  devRiskyFlag: number;
};
export type UserAccountActivityListRes = {
  total: string;
  rows: AccountActivityItem[];
  code: number;
  msg: string;
  totalVolume: number;
  totalCommission: number;
  totalProfit: number;
  totalSwaps: number;
  priceSum: number;
  serverType: string;
  totalList: string;
};
