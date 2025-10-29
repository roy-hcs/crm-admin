import { BasicParams } from '../review/types';

export type WithDrawReportItem = {
  amount: number;
  currency: string | null;
  statisticDate: string;
  usdAmount: number | null;
  rate: number | null;
  symbol: string | null;
  count: number | null;
  type: string | null;
  serverId: number | null;
  intDate: number;
  profit: number | null;
  loss: number | null;
  netProfit: number | null;
  volume: number | null;
  quantity: number | null;
};

export type SymbolReportParams = {
  type: string;
  serverId: string;
  pageNum?: number;
  orderByColumn?: boolean;
  isAsc: string;
};

export type SymbolReportRowItem = {
  amount: number;
  currency: string | null;
  statisticDate: string | null;
  usdAmount: number | null;
  rate: number | null;
  symbol: string | null;
  count: number | null;
  type: string | null;
  serverId: number | null;
  intDate: number | null;
  profit: number | null;
  loss: number | null;
  netProfit: number | null;
  volume: number | null;
  quantity: number | null;
};

export type SymbolReportResponse = {
  total: string;
  rows: SymbolReportRowItem[];
  code: number;
};
export type ServerItem = {
  id: string;
  serviceType: number;
  serviceProperty: number;
  servicePropertyValue: string | null;
  serverName: string;
  serviceHost: string;
  managerAccount: string;
  managerSecret: string;
};

export type ServerListResponse = {
  code: number;
  msg: string;
  total: string;
  rows: ServerItem[];
};
export type RebateLevelItem = {
  id: string;
  level: string;
  levelName: string;
};
export type RebateLevelListResponse = {
  code: number;
  msg: string;
  total: string;
  rows: RebateLevelItem[];
};

export type RegCountReportItem = Record<string, [number, number, number]>;

export type SumReport = {
  crmUser: string;
  dealAccount: string;
  deposit: number;
  withdraw: number;
};

export type CrmUserParams = {
  pageSize: number;
  pageNum: number;
  orderByColumn?: string;
  isAsc?: string;
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
};

export type CrmUserItem = {
  createBy: string | null;
  createTime: string;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
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

export type CrmUserResponse = {
  code: number;
  msg: string;
  total: string;
  rows: CrmUserItem[];
};

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

export type CrmRebateTradersItem = {
  ruleName: string;
  id: string;
};

export type GetGroupByServerResponse = string[];

export type DealAccountGroup = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
  id: string;
  name: string;
  sort: number;
  num: number | null;
  flag: boolean;
  delFlag: boolean;
  relatedRebateRuleCount: number | null;
};

export type DealAccountGroupListResponse = DealAccountGroup[];

// 钱包货币
export type CurrencyItem = {
  id: string;
  currencyAbbr: string;
};
export type CurrencyListResponse = {
  code: number;
  msg: string;
  total: string;
  rows: CurrencyItem[];
};

// 操作类型 / 操作方式 - 单条字典项
export type DictTypeItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
  dictCode: string; // 接口返回为字符串
  dictSort: string; // 同上，如需数字可改成 number | string
  dictLabel: string;
  dictValue: string;
  dictType: string;
  cssClass: string | null;
  listClass: string | null;
  isDefault: 'Y' | 'N' | string;
  status: string;
  flag: boolean;
  globalizationKey: string;
};

// 如果接口当前直接返回数组：
export type DictTypeResponse = DictTypeItem[];

// 支付通道
export type PaymentChannelItem = {
  id: string;
  channelName: string;
};
export type ChannelListResponse = PaymentChannelItem[];

// 信息类型
export type InfoTypeItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: string | null;
  dictCode: string | null;
  dictSort: string | null;
  dictLabel: string | null;
  dictValue: string | null;
  dictType: string | null;
  cssClass: string | null;
  listClass: string | null;
  isDefault: string | null;
  status: string | null;
  flag: string | null;
  globalizationKey: string | null;
};

export type RoleItem = {
  createBy: string | null;
  createTime: string;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
  roleId: string;
  roleName: string;
  roleKey: string;
  roleSort: string;
  roleDescribe: string;
  userCount: number;
  dataScope: string;
  status: string;
  roleSource: number;
  userScope: string;
  userAccount: string | null;
  delFlag: string;
  flag: boolean;
  menuIds: string[] | null;
  deptIds: string[] | null;
};

export type RoleListRes = {
  code: number;
  msg: string;
  total: string;
  rows: RoleItem[];
};

export type RoleListParams = BasicParams & {
  roleName?: string;
};
// 数据概览
export type MtServiceUpdateRes = {
  allAccount: number;
  todayAccount: number;
  count: number[];
};
export interface TclosureReportItem {
  amount: number | null;
  currency: string | null;
  statisticDate: string; // "2025-10-06"
  usdAmount: number | null;
  rate: number | null;
  symbol: string | null;
  count: number | null;
  type: string | null;
  serverId: string | null;
  intDate: number | null; // 20251006
  profit: number;
  loss: number;
  netProfit: number;
  volume: number;
  quantity: number;
}

export interface TclosureReportMonthSummary {
  volume: number;
  quantity: number;
}

export interface TclosureReportResponse {
  sumThisMonth: TclosureReportMonthSummary;
  data: TclosureReportItem[];
}

export type ServerExceptionNoticeItem = {
  id: number;
  code: number;
  server: string;
  vhost: string;
  time: string;
  createTime: string;
  reason: string;
  manager: string;
};
export type ServerExceptionNoticeRes = ServerExceptionNoticeItem[];
export type PreferencesItem = {
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  remark: string;
  params: Record<string, unknown>;
  id: string;
  nameText: string;
  code: string;
  indexReviewCount: string;
  val: string;
  sort: string;
  groupCode: string;
};
export type PreferencesRes = PreferencesItem[];

export type MenuListItem = {
  createBy: string;
  createTime: string;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
  menuId: string;
  menuName: string;
  parentName: string | null;
  parentId: string | null;
  orderNum: string;
  url: string;
  target: string;
  menuType: string;
  visible: string;
  perms: string;
  icon: string;
  children: MenuListItem[];
  globalizationKey: string | null;
};

export type EmailListParams = BasicParams & {
  acceptEmail?: string;
  title?: string;
  status?: string;
  params: {
    sendStartTime?: string;
    sendEndTime?: string;
  };
};

export type EmailListItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
  id: string;
  sendEmail: string | null;
  acceptEmail: string | null;
  title: string;
  type: number;
  status: number;
  sendTime: string;
  isAll: string | null;
  content: string | null;
  source: number;
  userType: number;
  sendEmailStr: string;
  acceptEmailStr: string;
  userMsgId: string;
};
export type EmailListRes = {
  code: number;
  msg: string;
  total: string;
  rows: EmailListItem[];
};

export type UserOrderLogListParams = BasicParams & {
  orderId?: string;
  channelName?: string;
  payResult?: string;
  params: {
    operationStart?: string;
    operationEnd?: string;
    userName?: string;
  };
};
export type UserOrderLogItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
  id: string;
  orderId: string;
  userId: string;
  logTime: string;
  userName: string;
  showId: string;
  channelName: string;
  orderStatus: number;
  orderStatusStr: string | null;
  payResult: number | null;
  payResultStr: string | null;
  code: string;
  msg: string;
  logType: number;
};
export type UserOrderLogListRes = {
  code: number;
  msg: string;
  total: string;
  rows: UserOrderLogItem[];
};
// 角色基础类型（为 UserItem.roles / userRole.role 提供复用）
export type Role = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
  roleId: string | null;
  roleName: string | null;
  roleKey: string | null;
  roleSort: string | null;
  roleDescribe: string | null;
  userCount: number | null;
  dataScope: string | null;
  status: string | null;
  roleSource: string | null;
  userScope: string | null;
  userAccount: string | null;
  delFlag: string | null;
  flag: string | null;
  menuIds: string | null;
  deptIds: string | null;
};

export type UserItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
  userId: string | null;
  deptId: string | null;
  parentId: string | null;
  roleId: string | null;
  loginName: string | null;
  userName: string | null;
  userLastName: string | null;
  email: string | null;
  mzone: string | null;
  phonenumber: string | null;
  sex: string | null;
  avatar: string | null;
  password: string | null;
  salt: string | null;
  status: string | null;
  delFlag: string | null;
  loginIp: string | null;
  loginDate: string | null;
  chatId: string | null;
  dept: {
    createBy: string | null;
    createTime: string | null;
    updateBy: string | null;
    updateTime: string | null;
    remark: string | null;
    params: Record<string, unknown>;
    deptId: string | null;
    parentId: string | null;
    ancestors: string | null;
    deptName: string | null;
    orderNum: string | null;
    leader: string | null;
    phone: string | null;
    email: string | null;
    status: string | null;
    delFlag: string | null;
    parentName: string | null;
  };
  userRole?: {
    userId: string | null;
    roleId: string | null;
    role: Role | null;
  } | null;
  /** 用户拥有的角色列表；空数组表示无角色 */
  roles: Role[];
  roleIds: string | null;
  postIds: string | null;
  googleKey: string | null;
  boundGoogle: number | null;
  onlineStatus: number | null;
  admin: boolean | null;
  wholeName: string | null;
};
export type UserListRes = {
  code: number;
  msg: string;
  total: string;
  rows: UserItem[];
};

export type UserListParams = {
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc';

  userName?: string;
  roleId?: string;
  status?: string;
  phonenumber?: string;
  email?: string;
  onlineStatus?: string;

  params: {
    beginTime?: string;
    endTime?: string;
  };
};

export type BonusSettingListParams = BasicParams & {
  businessType?: string;
  params: {
    rewardTitle?: string;
  };
};

export type BonusSettingListItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
  id: string;
  rewardTitle: string;
  sort: string;
  businessType: number;
  rewardType: number;
  status: number;
  accountLimitType: number;
  crmRoleIds: string | null;
  accounts: string | null;
  userIds: string | null;
  tagIds: string | null;
  serverId: string;
  serverGroupIds: string;
  accountTypes: string | null;
  maxAccount: string | null;
  minimumAmount: string | null;
  limitType: number;
  bonusType: number;
  bonusPercentage: string | null;
  bonusMode: number;
  bonusAmount: string | null;
  amountCapped: number;
  timeRangeType: number;
  businessTimeType: number;
  expire: number;
  timeUnit: number;
  startTime: string;
  endTime: string;
  delFlag: boolean;
  dealServer: string | null;
  dealBreed: string | null;
  bonusScheme: number;
  dealNum: number;
  dealBasis: string | null;
  issueTimeUnit: string | null;
  bonusIssueTime: string | null;
  toClientStatus: number;
  activityPicture: string | null;
  activityContent: string | null;
  titleLanguageList: string | null;
  ladderBonusList: string | null;
  ladderBonusListJsonStr: string | null;
  bonusLock: string | null;
  unlockLimit: string | null;
  unlockDeposit: string | null;
  unlockNet: string | null;
  unlockVolume: string | null;
};
export type BonusSettingListRes = {
  code: number;
  msg: string;
  total: string;
  rows: BonusSettingListItem[];
};
export type AdminOperLogParams = {
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc';

  title?: string;
  operName?: string;
  status?: string;
  businessTypes?: string;

  params: {
    beginTime?: string;
    endTime?: string;
  };
};
export type AdminOperLogItem = {
  operId: string | null;
  title: string | null;
  businessType: string | null;
  businessTypes: string | null;
  method: string | null;
  operatorType: string | null;
  operName: string | null;
  deptName: string | null;
  operUrl: string | null;
  operIp: string | null;
  operLocation: string | null;
  operParam: string | null;
  status: string | null;
  errorMsg: string | null;
  operTime: string | null;
  operObject: string | null;
};
export type AdminOperLogRes = {
  code: number;
  msg: string;
  total: string;
  rows: AdminOperLogItem[];
};

export type AdminLoginParams = {
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc';

  ipaddr?: string;
  status?: string;
  loginLocation?: string;

  params: {
    userName?: string;
    beginTime?: string;
    endTime?: string;
  };
};

export type AdminLoginItem = {
  login_location: string | null;
  msg: string | null;
  login_name: string | null;
  os: string | null;
  user_last_name: string | null;
  login_time: string | null;
  user_name: string | null;
  browser: string | null;
  info_id: string | null;
  ipaddr: string | null;
  status: string | null;
};

export type AdminLoginRes = {
  code: number;
  msg: string;
  total: string;
  rows: AdminLoginItem[];
};

export type CrmLogininforParams = {
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc';

  ipaddr?: string;
  userName?: string;
  status?: string;
  loginLocation?: string;

  params: {
    beginTime?: string;
    endTime?: string;
  };
};
export type CrmLogininforItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
  infoId: string | null;
  loginName: string | null;
  ipaddr: string | null;
  loginLocation: string | null;
  browser: string | null;
  os: string | null;
  status: string | null;
  loginTime: string | null;
};

export type CrmLogininforRes = {
  code: number;
  msg: string;
  total: string;
  rows: CrmLogininforItem[];
};

export type AdsListParams = {
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc';
};

export type AdsListItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
  id: string | null;
  name: string | null;
  position: string | null;
  sort: string | null;
  status: number;
  clickCount: string | null;
  webPicture: string | null;
  appPicture: string | null;
  jumpType: number | null;
  customLink: string | null;
  msgId: string | null;
  crmRoleIds: string | null;
  delFlag: string | null;
};

export type AdsListRes = {
  code: number;
  msg: string;
  total: string;
  rows: AdsListItem[];
};

export type RewardRecordsListParams = {
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc';

  rewardId?: string;

  params: {
    rewardTitle?: string;
    crmAccount?: string;
    businessType?: string;
    bonusTimeStart?: string;
    bonusTimeEnd?: string;
  };
};

export type RewardRecordsListItem = {
  recordId: string | null;
  orderNo: string | null;
  userId: string | null;
  lastName: string | null;
  name: string | null;
  showId: string | null;
  businessType: string | null;
  rewardTitle: string | null;
  targetType: string | null;
  rewardType: string | null;
  rewardTarget: string | null;
  amount: string | null;
  status: string;
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  verifyFlag: boolean | null;
  lockStatus: string | null;
  unlockAmount: string | null;
  unlockTime: string | null;
  unlockLimit: string | null;
  unlockDeposit: string | null;
  unlockNet: string | null;
  unlockVolume: string | null;
};

export type RewardRecordsListRes = {
  code: number;
  msg: string;
  total: string;
  rows: RewardRecordsListItem[];
};
