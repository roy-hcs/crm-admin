import { KycStatus } from '@/components/common/RrhKycStatus';
import { DealAccountGroup } from '../account';
import { OperationsLogsItem } from '../monitor/type';
import { Country, CrmUser, InfoTypeItem, RoleItem, TagProgress, WalletItem } from '../system';
import { BaseEntity, BasicParams } from '../review';
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
export type MtServerGroupRes = BasicParams & {
  params: Record<string, string>;
  id: string;
  serverId: string;
  groupName: string;
  accountStart: string;
  accountEnd: string;
  maxAccount: string;
  sort: string;
};
export type ReceiveAccountInfoParams = BasicParams & {
  lastName: string;
  name: string;
  roleId: string;
  country: string;
  accountType: string;
  email: string;
  mzone: string;
  mobile: string;
  preferenceLanguage: string;
  colorPreference: string;
  googleCode: string;
};
export type ReceiveAccountInfoItem = BaseEntity & {
  id: string;
  userId: string;
  accountName: string;
  bank: string;
  bankAddress: string;
  cardNo: string;
  swift: string;
  currency: string;
  subBranchName: string;
  accountAddress: string;
  type: number;
  ifscCode: string;
  bsbCode: string;
  accountEmail: string;
  accountMobile: string;
  abnCode: string;
  customChannelJson: string;
  channelId: string;
};

export type ReceiveAccountInfoRes = {
  total: string;
  rows: ReceiveAccountInfoItem[];
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

// ─── 返佣设置页面 ────────────────────────────────────────────────────────────

/** 用户返佣模板记录 */
export type CrmUserRebateTemplate = {
  id: string | null;
  userId: string | null;
  rebateType: number;
  templateReferId: string | null;
  rebateLevel: string | null;
  rebateTraderCommissionRule: string | null; // "ruleId:commissionId|..." 格式
};

/**
 * 返佣设置页面初始数据
 * TODO: 后端接口路径/返回结构待确认（原为 Thymeleaf 服务端渲染，model/commissionType 等来自控制器）
 */
export type RebateSettingPageData = {
  model: number; // 1=模板模式, 2=直接配置模式
  commissionType: number; // 1=佣金组方案, 2=自定义方案
  paramFillType: number; // 返佣参数填写方式 (1=只读)
  rebateLevelSetting: string; // '0'=隐藏平越级 '1'=显示平级 '2'=显示平级+越级
  userId: string;
  rebateType: number; // 1=交易 2=手续费 3=入金（model=1 初始 tab）
  userInviter: string; // 上级姓名展示字符串
  crmUserRebateTemplate: CrmUserRebateTemplate;
  source: string;
};

/** getTraderList 接口返回的规则项 */
export type TraderListItem = {
  ruleId: string;
  ruleName: string;
  rebateType: number; // 1=交易 2=手续费 3=入金
  settleType: number; // 1=金额 2=点差
  settleUnit: string; // '0'=手 '1'=百万 '2'=lot
  settleValue: number;
  commissions: CommissionOptionItem[]; // model=1 时携带
};

/** model=1 佣金参数选项 */
export type CommissionOptionItem = {
  id: string;
  rebateGroupName: string;
};

/** getRuleGroups 接口返回的佣金组选项 */
export type RuleGroupItem = {
  id: string;
  groupId: string;
  price: string;
  commissionGroupName: string;
  selected: boolean;
  userTwoId: string | null;
};

/** getCustomRebate 接口返回（自定义方案） */
export type CustomRebateData = {
  rebateValue: number | null;
  maxRebate: number | null;
  minRebate: number;
  hasChildren: boolean;
};

/** getUpperInput / getUpperUserRebateTwo 接口返回的上级规则项 */
export type UpperInputRule = {
  id: string;
  rebateTraderId: string;
  rebateTraderName: string;
  rebateType: number;
  commissionValue: number | null;
  commissionAgencyId: string;
  commissionGroupId: string;
  traderChecked: number; // 1=已勾选
  upperValue: string; // 上级已配置的展示值
  settleValue: number;
  isShow: boolean;
  equal: boolean; // 是否启用平级返佣
  pass: boolean; // 是否启用越级返佣
  equalType: number; // 1=不返佣 2=固定返佣 3=获取下级佣金%
  passType: number;
  equalMoney: number | null;
  passMoney: number | null;
  equalLimit: number | null;
  passLimit: number | null;
  crmRebateTrader: {
    settleType: number;
    settleUnit: string;
    settleValue: number;
  };
};

/** 上级用户信息（getUserInviterLevel 接口返回） */
export type InviterLevelData = {
  lastName: string;
  name: string | null;
  showId: string;
  crmRebateLevel: { levelName: string; level: number } | null;
};

/** 推荐来源选项（spreadLink/link 接口返回） */
export type SpreadLinkItem = {
  id: string;
  label: string;
  value: string;
};

/** getInviterCustomRebate 接口返回的上级链返佣项 */
export type InviterCustomRebateItem = {
  lastName: string;
  name: string | null;
  rebateLevelName: string | null;
  rebateValue: number | null;
};

/** getTraderList 请求参数 */
export type GetTraderListParams = {
  levelId: string;
  userId?: string;
  model: number;
  rebateType?: number;
  commissionType?: number;
  upperId?: string;
};

/** getRuleGroups 请求参数 */
export type GetRuleGroupsParams = {
  levelId: string;
  model: number;
  rebateTraderId: string;
  userId?: string;
};

/** 保存返佣设置（model=1）请求参数 */
export type SaveRebateSettingModel1Params = {
  id?: string;
  userId: string;
  rebateType: number;
  templateReferId?: string;
  rebateLevel?: string;
  rebateTraderCommissionRule?: string;
  inviter?: string;
  source?: string;
};

/** upper[] 子项 */
export type UpperRuleParam = {
  id?: string;
  commissionAgencyId?: string;
  rebateType?: number;
  rebateTraderId?: string;
  commissionGroupId?: string;
  userId?: string;
  commissionValue?: number | null;
  traderIsChecked?: boolean;
  equalType?: number;
  equalMoney?: number | null;
  equalLimit?: number | null;
  passType?: number;
  passMoney?: number | null;
  passLimit?: number | null;
};

/** userTwo[] 子项 */
export type UserTwoRuleParam = {
  id?: string;
  agencyId?: string;
  rebateTraderId?: string;
  customRebateValue?: number | null;
};

/** 保存返佣设置（model=2）请求参数 */
export type SaveRebateSettingModel2Params = {
  id?: string;
  userId: string;
  rebateLevel?: string;
  inviter?: string;
  source?: string;
  upper?: UpperRuleParam[];
  userTwo?: UserTwoRuleParam[];
};
