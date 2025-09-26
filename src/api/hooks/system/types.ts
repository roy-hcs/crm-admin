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
