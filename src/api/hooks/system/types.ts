import { BasicParams, BasicRes, BaseEntity } from '../../types';

// Base types for reusability
export type BaseReportItem = {
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

export type WithDrawReportItem = BaseReportItem;

export type SymbolReportParams = {
  type: string;
  serverId: string;
  pageNum?: number;
  orderByColumn?: boolean;
  isAsc: string;
};

export type SymbolReportRowItem = BaseReportItem;

export type SymbolReportResponse = BasicRes<SymbolReportRowItem>;

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

export type ServerListResponse = BasicRes<ServerItem>;
export type RebateLevelItem = {
  id: string;
  level: string;
  levelName: string;
};
export type RebateLevelListResponse = BasicRes<RebateLevelItem>;

export type RegCountReportItem = Record<string, [number, number, number]>;

export type SumReport = {
  crmUser: string;
  dealAccount: string;
  deposit: number;
  withdraw: number;
};

// Note: CrmUser, TagUser, CustomRelations types moved to @/api/hooks/account

export type CrmRebateTradersItem = {
  ruleName: string;
  id: string;
};

// 钱包货币
export type CurrencyItem = {
  id: string;
  currencyAbbr: string;
};
export type CurrencyListResponse = BasicRes<CurrencyItem>;

// 操作类型 / 操作方式 - 单条字典项
export type DictTypeItem = BaseEntity & {
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
  params: string | null; // Note: different from BaseEntity (string instead of Record)
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

export type RoleItem = BaseEntity & {
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

export type RoleListRes = BasicRes<RoleItem>;

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
export type PreferencesItem = BaseEntity & {
  id: string;
  nameText: string;
  code: string;
  indexReviewCount: string;
  val: string;
  sort: string;
  groupCode: string;
};
export type PreferencesRes = PreferencesItem[];

export type MenuListItem = BaseEntity & {
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

export type EmailListItem = BaseEntity & {
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
export type EmailListRes = BasicRes<EmailListItem>;

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
export type UserOrderLogItem = BaseEntity & {
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
export type UserOrderLogListRes = BasicRes<UserOrderLogItem>;
// 角色基础类型（为 UserItem.roles / userRole.role 提供复用）
export type Role = BaseEntity & {
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

export type UserItem = BaseEntity & {
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
  dept: BaseEntity & {
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
export type UserListRes = BasicRes<UserItem>;

export type UserListParams = BasicParams & {
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

// Note: BonusSettingList types moved to @/api/hooks/marketing

export type AdminOperLogParams = BasicParams & {
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
export type AdminOperLogRes = BasicRes<AdminOperLogItem>;

export type AdminLoginParams = BasicParams & {
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

export type AdminLoginRes = BasicRes<AdminLoginItem>;

export type CrmLogininforParams = BasicParams & {
  ipaddr?: string;
  userName?: string;
  status?: string;
  loginLocation?: string;

  params: {
    beginTime?: string;
    endTime?: string;
  };
};
export type CrmLogininforItem = BaseEntity & {
  infoId: string | null;
  loginName: string | null;
  ipaddr: string | null;
  loginLocation: string | null;
  browser: string | null;
  os: string | null;
  status: string | null;
  loginTime: string | null;
};

export type CrmLogininforRes = BasicRes<CrmLogininforItem>;

// Note: AdsList, RewardRecordsList types moved to @/api/hooks/marketing

// Note: WalletAccounts, CrmDealAccount types moved to @/api/hooks/account

export type UserInfoRes = {
  allowCheckEmail: boolean;
  registVerificationMode: string | null;
  checkOne: string | null;
  allowCheckPhone: boolean;
  user: {
    createBy: string | null;
    createTime: string | null;
    updateBy: string | null;
    updateTime: string | null;
    remark: string | null;
    params: object;
    userId: string | null;
    deptId: string | null;
    parentId: string | null;
    roleId: string | null;
    loginName: string | null;
    userName: string;
    userLastName: string;
    email: string | null;
    mzone: string;
    phonenumber: string;
    sex: string | null;
    avatar: string;
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
      params: object;
      deptId: null;
      parentId: null;
      ancestors: null;
      deptName: null;
      orderNum: null;
      leader: null;
      phone: null;
      email: null;
      status: null;
      delFlag: null;
      parentName: null;
    };
    userRole: {
      userId: string | null;
      roleId: string | null;
      role: {
        createBy: string | null;
        createTime: string | null;
        updateBy: string | null;
        updateTime: string | null;
        remark: string | null;
        params: object;
        roleId: string | null;
        roleName: string | null;
        roleKey: string | null;
        roleSort: string | null;
        roleDescribe: string | null;
        userCount: string | null;
        dataScope: string | null;
        status: string | null;
        roleSource: string | null;
        userScope: string | null;
        userAccount: string | null;
        delFlag: string | null;
        flag: boolean;
        menuIds: string | null;
        deptIds: string | null;
      };
    };
    roles: [
      {
        createBy: string | null;
        createTime: string | null;
        updateBy: string | null;
        updateTime: string | null;
        remark: string | null;
        params: object;
        roleId: string | null;
        roleName: string | null;
        roleKey: string | null;
        roleSort: string | null;
        roleDescribe: string | null;
        userCount: string | null;
        dataScope: string | null;
        status: string | null;
        roleSource: string | null;
        userScope: string | null;
        userAccount: string | null;
        delFlag: string | null;
        flag: boolean;
        menuIds: string | null;
        deptIds: string | null;
      },
    ];
    roleIds: string | null;
    postIds: string | null;
    googleKey: string | null;
    boundGoogle: string | null;
    onlineStatus: string | null;
    admin: boolean;
    wholeName: string | null;
  };
  emailTail: string | null;
};

// Note: GetMsgList types moved to @/api/hooks/message

// Note: CustomerRelations types moved to @/api/hooks/account

export type RebateBasePointParams = BasicParams & {
  pointValueName?: string;
  serverType?: string;
  serverId?: string;
  pointValueType?: string;
};

export type RebateBasePointRes = BasicRes<RebateBasePointItem>;
export type RebateBasePointItem = BaseEntity & {
  id: string;
  userId: string | null;
  accountId: string | null;
  serialNumber: number;
  pointValue: string;
  pointValueName: string;
  rebateType: string;
  serverType: number;
  serverName: string;
  serverId: string;
  pointValueType: number;
  pointValueLots: string;
  pointValueCurrency: string;
  sourceCurrency: string | null;
  pointValueRules: number;
};

export type SelectServerListParams = {
  serverProperty: string | number;
  serverType: string | number;
};

export type SelectServerListRes = SelectServerListItem[];
export type SelectServerListItem = {
  id: string;
  serviceType: number;
  serviceProperty: number;
  servicePropertyValue: string | null;
  aliasName: string;
  serverName: string;
  serviceHost: string;
  managerAccount: string;
  managerSecret: string;
  salt: string | null;
  accountStart: number;
  accountEnd: number;
  status: number;
  processStatus: number;
  syncTime: string;
  lastTicket: number;
  checkTime: string;
  port: string;
  isBindAllowed: number;
  pid: string | null;
  flag: boolean;
  sort: number;
  generateType: number;
  interType: string;
  reportingHost: string | null;
  reportingDbName: string | null;
  reportingAccount: string | null;
  reportingSecret: string | null;
};
