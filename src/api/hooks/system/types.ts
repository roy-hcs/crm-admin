import { BasicParams, BasicRes, BaseEntity } from '../../types';
import { LastLogininfor } from '../review/types';

export type ServerItem = {
  id: string;
  serviceType: number;
  serviceProperty: number;
  servicePropertyValue: string | null;
  serverName: string;
  serviceHost: string;
  managerAccount: string;
  managerSecret: string;
  aliasName: string;
};

export type ServerListResponse = BasicRes<ServerItem>;

export type RebateLevelItem = {
  id: string;
  level: string;
  levelName: string;
};
export type RebateLevelListResponse = BasicRes<RebateLevelItem>;

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
// Note: MtServiceUpdateRes, TclosureReport*, ServerExceptionNotice*, Preferences* moved to @/api/hooks/workbench

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
  orderStatus?: string;
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
  userId: string;
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
  wholeName: string;
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

export type CrmLoginInfoParams = BasicParams & {
  ipaddr?: string;
  userName?: string;
  status?: string;
  loginLocation?: string;

  params: {
    beginTime?: string;
    endTime?: string;
  };
};
export type CrmLoginInfoItem = BaseEntity & {
  infoId: string | null;
  loginName: string | null;
  ipaddr: string | null;
  loginLocation: string | null;
  browser: string | null;
  os: string | null;
  status: string | null;
  loginTime: string | null;
};

export type CrmLogininforRes = BasicRes<CrmLoginInfoItem>;

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

// Note: RebateBasePoint, SelectServerList types moved to @/api/hooks/rebate

export type WalletItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: object;
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
export type AccountItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: object;
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
  lever: string | null;
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
  hasClearAccount: string | null;
  buildRebateAccount: boolean;
  accountGroupList: string | null;
  accounts: string | null;
  accountIds: string | null;
  crmAuthority: number | null;
  source: string | null;
  roleName: string | null;
  triggeringEvent: string | null;
};

export type MtServerItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: object;
  id: string | null;
  serviceType: number | null;
  serviceProperty: number | null;
  servicePropertyValue: string | null;
  aliasName: string | null;
  serverName: string | null;
  serviceHost: string | null;
  managerAccount: string | null;
  managerSecret: string | null;
  salt: string | null;
  accountStart: string | null;
  accountEnd: string | null;
  status: number | null;
  processStatus: number | null;
  syncTime: string | null;
  lastTicket: string | null;
  checkTime: string | null;
  port: string | null;
  isBindAllowed: number | null;
  pid: string | null;
  flag: boolean | null;
  sort: number | null;
  generateType: number | null;
  interType: string | null;
  reportingHost: string | null;
  reportingDbName: string | null;
  reportingAccount: string | null;
  reportingSecret: string | null;
};

export type AccountInfo = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: object;
  id: string | null;
  serverId: string | null;
  groupName: string | null;
  accountStart: number | null;
  accountEnd: number | null;
  maxAccount: string | null;
  sort: string | null;
};

export type AddAccountParams = {
  userId: string | null;
  serviceProperty: string | null;
  serviceType: string | null;
  server: string | null;
  serverGroup: string | null;
  account: string | null;
  lever: string | null;
  accountGroupId: string | null;
  directBroker: string | null;
};

export type CrmUser = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: object;
  id: string | null;
  lastName: string | null;
  name: string | null;
  showId: string | null;
  sex: string | null;
  mzone: string | null;
  mobile: string | null;
  email: string | null;
  accountType: number | null;
  accountTypeStr: string | null;
  userRole: string | null;
  inviter: string | null;
  inviterName: string | null;
  inviterEmail: string | null;
  headImg: string | null;
  status: number | null;
  role: string | null;
  rebateLevelName: string | null;
  certiricateType: string | null;
  certiricateNo: string | null;
  source: string | null;
  sourceText: string | null;
  country: string | null;
  countryId: string | null;
  countryName: string | null;
  province: string | null;
  city: string | null;
  address: string | null;
  postCode: string | null;
  birthday: string | null;
  verifyStatus: number | null;
  nameOne: string | null;
  nameTwo: string | null;
  inviterShowId: string | null;
  roleId: string | null;
  rebateLevelId: string | null;
  rebateAccountId: string | null;
  crmRebateLevel: string | null;
  userInfo: string | null;
  applySource: string | null;
  account: string | null;
  permissionJson: string | null;
  inviterChain: string | null;
  preferenceLanguage: string | null;
  colorPreference: string | null;
  lastLoginTime: string | null;
  latestFollowupTime: string | null;
  spreadLinkCodeId: string | null;
  loginTwoFactorAuth: string | null;
  antiPhishingCode: string | null;
  tags: string | null;
  points: number | null;
  shortCode: string | null;
  adminRemark: string | null;
  applicantId: string | null;
  registerSource: string | null;
  registerSourceText: string | null;
  sourceUpdateTime: string | null;
  sourceUpdateCount: number | null;
  vipId: string | null;
  vipName: string | null;
  vipLevel: string | null;
  childId: string | null;
  language: string | null;
  pammUserId: string | null;
  userName: string | null;
  mtone: string | null;
  mttwo: string | null;
};

export type CrmUsersParams = {
  origin: string;
  pageNum: number;
  pageSize: number;
  params: {
    threeCons?: string;
  };
};

export type CrmUsers = BasicRes<CrmUser>;

export type CrmUsersTagsParams = {
  status: string;
  pageNum: number;
  pageSize: number;
  params: {
    threeCons?: string;
  };
};

export type CrmUserTagItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
  id: string | null;
  tagName: string | null;
  tagNames: string | null;
  sort: number | null;
  status: number | null;
  showStatus: number | null;
  clientShowStatus: number | null;
  delFlag: number | null;
  language: string | null;
  crmUserTagAndRules: string | null;
  crmUserTagOrRules: string | null;
  plServerId: string | null;
  plTypeName: string | null;
  tvServerId: string | null;
  tvTypeName: string | null;
};

export type CrmUsersTags = BasicRes<CrmUserTagItem>;

export type Roles = {
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
  flag: boolean | null;
  menuIds: string[] | null;
  deptIds: string[] | null;
};

export type MyInfoRes = {
  code: number;
  msg: string;
  data: {
    user: {
      createBy: string | null;
      createTime: string | null;
      updateBy: string | null;
      updateTime: string | null;
      remark: string | null;
      params: Record<string, unknown>;
      userId: string | null;
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
      userRole: {
        userId: string | null;
        roleId: string | null;
        role: Roles;
      };
      roles: Roles[];
      roleIds: string[] | null;
      postIds: string[] | null;
      googleKey: string | null;
      boundGoogle: string | null;
      onlineStatus: string | null;
      userType: number | null;
      expiryTime: string | null;
      duration: string | null;
      admin: boolean | null;
      wholeName: string | null;
    };
  };
};

export type EmailVerificationCodeRes = {
  resultCode: number;
  resultMsg: string;
};

export type CrmUserInfo = {
  code: number;
  data: {
    crmUser: CrmUser;
    lastLogininfor: LastLogininfor;
    userLanguage: string | null;
  };
};
