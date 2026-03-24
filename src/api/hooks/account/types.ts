// Account module types
import { BasicParams, BasicRes, BaseEntity } from '../../types';

// CRM User related types
export type CrmUserParams = {
  params: {
    threeCons?: string;
    fiveCons?: string;
    regStartTime?: string;
    regEndTime?: string;
    fuzzyMobile?: string;
    fuzzyEmail?: string;
    inviter?: string;
    accounts?: string;
  };
  status?: string;
  role?: string;
  accounts?: string;
  certiricateNo?: string;
  accountType?: string;
  tags?: string;
} & BasicParams;

export type CrmUserItem = BaseEntity & {
  id: string;
  lastName: string;
  name: string;
  showId: string;
  sex: string | null;
  mzone: string;
  mobile: string;
  email: string;
  accountType: number;
  accountTypeStr: string;
  userRole: string | null;
  inviter: string;
  inviterName: string | null;
  inviterEmail: string;
  headImg: string;
  status: number;
  role: string;
  rebateLevelName: string | null;
  certiricateType: string | null;
  certiricateNo: string | null;
  source: string;
  country: string | null;
  province: string | null;
  city: string | null;
  address: string | null;
  postCode: string | null;
  birthday: string | null;
  verifyStatus: number;
  nameOne: string;
  nameTwo: string;
  inviterShowId: string;
  roleId: string | null;
  rebateLevelId: string | null;
  rebateAccountId: string;
  crmRebateLevel: {
    id: string;
    level: string;
    levelName: string;
  } | null;
  userInfo: string | null;
  applySource: string | null;
  account: string | null;
  permissionJson: string | null;
  inviterChain: string;
  preferenceLanguage: string;
  colorPreference: string;
  lastLoginTime: string | null;
  latestFollowupTime: string | null;
  spreadLinkCodeId: string;
  loginTwoFactorAuth: string | null;
  antiPhishingCode: string | null;
  tags: string;
  points: string | null;
  shortCode: string | null;
  userName: string;
  mtone: string;
  mttwo: string;
};

export type CrmUserResponse = BasicRes<CrmUserItem>;

export type TagUserItem = {
  userCount: string;
  id: string;
  tagName: string;
};

export type CustomRelationsItem = {
  childNames: string;
  crmRebateLevel: string;
  id: string;
  hasChildren: boolean;
  parentName: string;
};

// Trading Account related types
export type CrmDealAccountListParams = BasicParams & {
  server?: string;
  serverGroupList?: string;
  accounts?: string;
  accountGroupList?: string;
  params: {
    regStartTime?: string;
    regEndTime?: string;
    fuzzyAccount?: string;
    fuzzyName?: string;
    accounts?: string;
    threeCons?: string;
  };
};

export type CrmDealAccountListItem = BaseEntity & {
  id: string | null;
  userId: string | null;
  username: string | null;
  name: string | null;
  account: string | null;
  serviceType: number | null;
  serviceProperty: number | null;
  servicePropertyStr: string | null;
  servicePropertyValue: string | null;
  server: string | null;
  serverName: string | null;
  accountSupervisorName: string | null;
  directBrokerName: string | null;
  accountGroupId: string | null;
  accountGroupName: string | null;
  accountSupervisorShowId: string | null;
  serverGroup: string | null;
  accountType: string | null;
  accountTypeName: string | null;
  lever: number | null;
  balance: number | null;
  netWorth: number | null;
  creditAmount: number | null;
  registerTime: string | null;
  registerTimeStr: string | null;
  dealAuth: number | null;
  usedAdvance: number | null;
  usableAdvance: number | null;
  advanceScale: number | null;
  status: number | null;
  initialAmount: number | null;
  currency: string | null;
  authority: string | null;
  directBroker: string | null;
  permissionJson: string | null;
  digits: number | null;
  hasClearAccount: '0' | null;
  buildRebateAccount: boolean | null;
  accountGroupList: string[] | null;
  accounts: string[] | null;
  accountIds: string[] | null;
  crmAuthority: number | null;
  source: string | null;
  roleName: string | null;
};

export type CrmDealAccountListRes = BasicRes<CrmDealAccountListItem>;

// Account Group related types
export type CrmDealAccountGroupListParams = BasicParams;

export type CrmDealAccountItem = BaseEntity & {
  id: string | null;
  name: string | null;
  sort: number | null;
  num: number | null;
  flag: boolean;
  delFlag: boolean;
  relatedRebateRuleCount: string | null;
};

export type CrmDealAccountGroupListRes = BasicRes<CrmDealAccountItem>;

export type DealAccountGroup = BaseEntity & {
  id: string;
  name: string;
  sort: number;
  num: number | null;
  flag: boolean;
  delFlag: boolean;
  relatedRebateRuleCount: number | null;
};

export type DealAccountGroupListResponse = DealAccountGroup[];

export type GetGroupByServerResponse = string[];

// Wallet Account related types
export type WalletAccountsListParams = BasicParams & {
  currency?: string;
  params: {
    threeCons?: string;
    regStartTime?: string;
    regEndTime?: string;
  };
};

export type WalletAccountsItem = BaseEntity & {
  id: string | null;
  crmUserId: string | null;
  balance: string | null;
  currency: string | null;
  major: string | null;
  permissionJson: string | null;
  delFlag: string | null;
  crmUserName: string | null;
  crmUserShowId: string | null;
  allIn: string | null;
  allOut: string | null;
  accounts: string | null;
};

export type WalletAccountsListRes = BasicRes<WalletAccountsItem>;

export type SumWalletAccountsItem = {
  totalBalance: number;
  currency: string | null;
};

export type WalletAccountsListSumRes = {
  code: number;
  msg: string;
  data: SumWalletAccountsItem[];
};

export type WalletAccountsListSumParams = {
  currency?: string;
  params: {
    threeCons?: string;
    regStartTime?: string;
    regEndTime?: string;
  };
};

// Customer Relations types
export type CustomerRelationsPostParams = {
  userId?: string;
};

export type CustomerRelationsGetItem = {
  childNames: null | Array<string>;
  hasChildren: boolean;
  id: string | null;
  levelName: string | null;
  rebateLevel: string | null;
  userName: string | null;
};

export type CustomerRelationsPostRes = CustomerRelationsGetItem[];

export type AddCrmUserParams = {
  deptId: string;
  lastName: string;
  name: string;
  fullName: string;
  mzone: string;
  mobile: string;
  email: string;
  inviter: string;
  pwd: string;
  preferenceLanguage: string;
  accountType: string;
  roleId: string;
  colorPreference: string;
  source: string;
  status: string;
};

export type WalletBalanceChangeParams = {
  line: number;
  username: string;
  showId: number;
  email: string;
  phone: string;
  currency: string;
  operateName: string;
  operationType: number;
  opTypeName: string;
  opType: number | null;
  amount: number;
  remark: string;
};

export type WalletPerm = {
  insideTransfer: number;
  outMoney: number;
};

export type FundFlowParams = BasicParams & {
  walletId?: string;
  operationType?: string;
  serialNum?: string;
  params: {
    inMethod?: string;
    outMethod?: string;
    transMethod?: string;
    remaidMethod?: string;
    operationStart?: string;
    operationEnd?: string;
  };
};

export type FundFlowItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, string>;
  id: string | null;
  walletId: string | null;
  preAmount: string | null;
  amount: string | null;
  serialNum: string | null;
  operationType: number | null;
  operationMethod: number | null;
  operationTime: string | null;
  dealServerId: string | null;
  dealAccount: string | null;
  mtOrder: string | null;
  rebateId: string | null;
  crmUserId: string | null;
  currency: string | null;
  accounts: string | null;
  postAmount: string | null;
};

export type FundFlowListRes = BasicRes<FundFlowItem>;
