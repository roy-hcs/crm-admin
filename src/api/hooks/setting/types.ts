import { BasicRes, BaseEntity } from '@/api/types';
import { MtServerGroupRes } from '../agent/types';

export type MtServiceDcNodeItem = {
  id?: string;
  nodeName: string;
  serverAddress: string;
  region?: string | null;
  weight?: number | null;
  enabled?: number | null;
  sort?: number | null;
};

export type CrmMtServiceListItem = BaseEntity & {
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
  // 连接配置：1-单服务器，2-DC 池
  connectConfig?: number | null;
  primaryWeight?: number | null;
  switchStrategy?: number | null;
  connectionTimeout?: number | null;
  // 列表接口暂未返回，后端补齐后编辑弹窗可直接回显 DC 节点
  mtServiceDcNodes?: MtServiceDcNodeItem[] | null;
};
export type CrmMtServiceListRes = BasicRes<CrmMtServiceListItem>;

export type AddServerSetting = {
  serviceType: string;
  serviceProperty: string;
  aliasName: string;
  serviceHost: string;
  managerAccount: string;
  managerSecret: string;
  accountStart: number;
  accountEnd: number;
  reportingHost: string;
  reportingDbName: string;
  reportingAccount: string;
  reportingSecret: string;
  generateType: number;
  sort: number;
  connectConfig?: number;
  primaryWeight?: number | null;
  switchStrategy?: number | null;
  connectionTimeout?: number | null;
  mtServiceDcNodes?: MtServiceDcNodeItem[];
};

export type EditServerSetting = AddServerSetting & {
  id: string;
};

export type CrmMtServerGroupListRes = BasicRes<MtServerGroupRes>;

export type CrmMtServerTypeAssociationItem = BaseEntity & {
  id: string;
  serverId: string;
  typeId: string;
  defaultMtGroup: string;
  lever: string;
  openCreditBalance: number | null;
  status: number;
  typeName: string;
  defaultLever: string | null;
  roleIds: string[] | null;
  useableRange: number | null;
  accounts: string[] | null;
  accountNames: string[] | null;
  userIds: string[] | null;
  userNames: string[] | null;
};

export type CrmMtServerTypeAssociationRes = BasicRes<CrmMtServerTypeAssociationItem>;

export type CrmMtServerTypeAssociationAddInfoRes = {
  code: number;
  msg: string;
  data: {
    serverTypes: Array<{
      id: string;
      accountType: string;
    }>;
    serverGroup: string[];
    allLever: string[];
  };
};

export type SaveServerTypeAssociationParams = {
  id?: string;
  serverId: string;
  typeId: string;
  defaultMtGroup: string;
  lever: string[];
  openCreditBalance: string;
  useableRange: string;
  roleIds: string[];
  userIds: string[];
  accounts: string[];
  status: number;
};

export type AppDownloadItem = BaseEntity & {
  id: string;
  appName: string;
  downloadLink: string;
  qrCodeActive: number;
  qrCodeLink: string | null;
  status: number;
  icon: string;
  nameLanguageList: string | AppDownloadLanguageItem[] | null;
  applicableRoles: string;
};

export type AppDownloadDetailLanguageItem = {
  id: string;
  appId: string;
  appName: string;
  language: string;
  languageName: string;
};

export type AppDownloadDetailItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
  id: string;
  appName: string;
  downloadLink: string;
  qrCodeActive: number;
  qrCodeLink: string | null;
  status: number;
  icon: string;
  nameLanguageList: AppDownloadDetailLanguageItem[];
  applicableRoles: string;
};

export type AppDownloadDetailRes = {
  code: number;
  msg: string;
  data: AppDownloadDetailItem;
};

export type AppDownloadRes = BasicRes<AppDownloadItem>;

export type AppDownloadLanguageItem = {
  id?: string;
  language: string;
  appName: string;
};

export type SaveAppDownloadParams = {
  id?: string;
  downloadLink: string;
  icon: string;
  status: number;
  qrCodeActive: number;
  nameLanguageList: AppDownloadLanguageItem[];
  applicableRoles: string;
};

export type TradingAccountItem = BaseEntity & {
  id: string;
  serverType: number;
  accountType: string;
  associateServerCount: number;
  lever: string | null;
  nameLanguageList: string[] | null;
};

export type TradingAccountRes = BasicRes<TradingAccountItem>;

export type TradingAccountLanguageItem = {
  id?: string;
  language: string;
  accountTypeName: string;
};

export type SaveTradingAccountParams = {
  id?: string;
  serverType: string;
  nameLanguageList: TradingAccountLanguageItem[];
};

export type MtServerTypeDetailLanguageItem = {
  id: string;
  serverTypeId: string;
  accountTypeName: string | null;
  language: string;
  languageName: string;
};

export type MtServerTypeDetailItem = {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  remark: string | null;
  params: Record<string, unknown>;
  id: string;
  serverType: number;
  accountType: string;
  associateServerCount: number;
  lever: string | null;
  nameLanguageList: MtServerTypeDetailLanguageItem[];
};

export type MtServerTypeDetailRes = {
  code: number;
  msg: string;
  data: MtServerTypeDetailItem;
};

// ==================== 出入金设置（Payment Settings） ====================

// ---------- 货币设置 ----------
export type CurrencyItem = {
  id: string;
  currencyNameChn: string;
  currencyNameEng: string;
  currencyAbbr: string;
  currencyRemark: string | null;
  status: number;
  isDefault: number;
  currencyType: number; // 1-法定货币 2-加密货币
  decimalPrecision: number;
  sort: number;
  network: string | null;
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
};
export type CurrencyListRes = BasicRes<CurrencyItem>;

export type SaveCurrencyParams = {
  id?: string;
  currencyType: number;
  currencyAbbr: string;
  currencyNameChn?: string;
  currencyNameEng?: string;
  network?: string;
  decimalPrecision?: number;
  sort?: number;
  status?: number;
  currencyRemark?: string;
  // 新增货币时一并保存默认汇率
  currencyPair?: string;
  updateType?: number;
  marketPrice?: number;
  buyRateFloat?: number;
  inRate?: number;
  sellRateRise?: number;
  outRate?: number;
};

// ---------- 汇率设置 ----------
export type ExchangeRateItem = {
  id: number;
  sCurrency: string;
  tCurrency: string;
  inRate: number | null;
  outRate: number | null;
  marketPrice: number | null;
  buyRateFloat: number | null;
  sellRateRise: number | null;
  updateType: number; // 1-手动更新 2-自动更新
  updateTime: string | null;
};
export type ExchangeRateListRes = BasicRes<ExchangeRateItem>;

export type SaveExchangeRateParams = {
  id?: number;
  sCurrency: string;
  tCurrency: string;
  updateType: number;
  marketPrice?: number;
  buyRateFloat?: number;
  inRate?: number;
  sellRateRise?: number;
  outRate?: number;
};

// ---------- 收款账户公共手续费字段 ----------
export type CommissionFields = {
  restrictCurrency?: number;
  minDeposit?: number | null;
  maxDeposit?: number | null;
  commissionMod?: number; // 1-比例 2-固定
  commissionRate?: number | null;
  minCommission?: number | null;
  maxCommission?: number | null;
  fixCommission?: number | null;
  amountDigits?: number | null;
};

// ---------- 银行收款账户 ----------
export type CrmBankItem = BaseEntity & {
  id: string;
  name: string;
  code: string | null;
  status: number;
  sort: number;
  roleNames: string | null;
  currency: string | null;
  country: string | null;
  countryName: string | null;
  swiftCode: string | null;
  bsbCode: string | null;
  ifscCode: string | null;
  abaCode: string | null;
  sortCode: string | null;
};
export type CrmBankListRes = BasicRes<CrmBankItem>;

export type SaveCrmBankParams = {
  id?: string;
  name: string;
  code?: string;
  currency?: string;
  country?: string;
  swiftCode?: string;
  bsbCode?: string;
  ifscCode?: string;
  abaCode?: string;
  sortCode?: string;
  sort?: number;
  status?: number;
};

// ---------- 加密货币收款账户 ----------
export type CryptoCurrencyItem = BaseEntity & {
  id: number;
  currencyName: string;
  network: string; // 1-TRC20 2-ERC20 3-OMNI 4-P2SH 5-P2PKH 6-BECH32 8-BEP20
  address: string;
  status: number;
  sort: number;
  minDeposit: number | null;
  maxDeposit: number | null;
  restrictCurrency: number | null;
  commissionMod: number | null;
  commissionRate: number | null;
  minCommission: number | null;
  maxCommission: number | null;
  fixCommission: number | null;
  amountDigits: number | null;
} & CommissionFields;
export type CryptoCurrencyListRes = BasicRes<CryptoCurrencyItem>;

export type SaveCryptoCurrencyParams = CommissionFields & {
  id?: number;
  currencyName: string;
  network: string;
  address: string;
  sort?: number;
  status?: number;
};

// ---------- 电子钱包收款账户 ----------
export type CrmEWalletItem = BaseEntity & {
  id: string;
  name: string;
  icon: string | null;
  status: number;
  sort: number;
  roleNames: string | null;
  country: string | null;
  currency: string | null;
};
export type CrmEWalletListRes = BasicRes<CrmEWalletItem>;

export type SaveCrmEWalletParams = {
  id?: string;
  name: string;
  icon?: string;
  currency?: string;
  country?: string;
  sort?: number;
  status?: number;
};

// ---------- PayID 收款账户 ----------
export type PayIdAccountItem = BaseEntity & {
  id: number;
  accountName: string;
  accountEmail: string | null;
  accountMobile: string | null;
  abnCode: string | null;
  currency: string | null;
  status: number;
  sort: number;
  minDeposit: number | null;
  maxDeposit: number | null;
  amountDigits: number | null;
  qrCode: string | null;
} & CommissionFields;
export type PayIdAccountListRes = BasicRes<PayIdAccountItem>;

export type SavePayIdAccountParams = CommissionFields & {
  id?: number;
  accountName: string;
  accountEmail?: string;
  accountMobile?: string;
  abnCode?: string;
  currency?: string;
  sort?: number;
  status?: number;
};

// ---------- 电汇/汇款收款账户 ----------
export type RemittanceAccountItem = BaseEntity & {
  id: number;
  accountType: number; // 1-电汇账户 2-汇款账户
  account: string;
  accountName: string;
  accountAddress: string | null;
  bankName: string | null;
  bankAddress: string | null;
  branchName: string | null;
  swiftCode: string | null;
  bsbCode: string | null;
  currency: string | null;
  status: number;
  sort: number;
  minDeposit: number | null;
  maxDeposit: number | null;
  amountDigits: number | null;
  qrCode: string | null;
} & CommissionFields;
export type RemittanceAccountListRes = BasicRes<RemittanceAccountItem>;

export type SaveRemittanceAccountParams = CommissionFields & {
  id?: number;
  accountType: number;
  account: string;
  accountName: string;
  accountAddress?: string;
  bankName?: string;
  bankAddress?: string;
  branchName?: string;
  swiftCode?: string;
  bsbCode?: string;
  currency?: string;
  sort?: number;
  status?: number;
};

// ---------- 出金渠道 ----------
export type WithdrawChannelItem = {
  id: number;
  channelName: string;
  status: number;
  channelIcon: string | null;
  channelCurrency: string | null;
  sort: number;
  delFlag: number;
  language: string | null;
  outMoneyAccountCheck: number | null;
  outMoneyWithdrawCheck: number | null;
  outMoneyWithdrawCheckMethod: string | null;
  verificationRule: number | null;
  restrictCurrency: number | null;
  specificCurrencyLimits: string | null;
  exchangeRateFloat: number | null;
  specificCurrencyCommissions: string | null;
  timeEnabled: number | null;
  availableTimeConfig: string | null;
  frozen: number | null;
  minWithdraw: number | null;
  maxWithdraw: number | null;
  commissionMod: string | null; // "1"-比例 "2"-固定
  commissionRate: number | null;
  fixCommission: number | null;
  minCommission: number | null;
  maxCommission: number | null;
  amountDigits: number | null;
  commissionAmountDigits: number | null;
  commissionCurrency: number | null;
  remark: string | null;
  updateTime: string | null;
};
export type WithdrawChannelListRes = BasicRes<WithdrawChannelItem>;

export type SaveWithdrawChannelParams = {
  id?: number;
  channelName: string;
  channelIcon?: string;
  channelCurrency?: string;
  sort?: number;
  status?: number;
  restrictCurrency?: number;
  minWithdraw?: number;
  maxWithdraw?: number;
  exchangeRateFloat?: number;
  amountDigits?: number;
  commissionCurrency?: number;
  commissionMod?: string;
  commissionRate?: number;
  fixCommission?: number;
  minCommission?: number;
  maxCommission?: number;
  commissionAmountDigits?: number;
  outMoneyAccountCheck?: number;
  outMoneyWithdrawCheck?: number;
  timeEnabled?: number;
  frozen?: number;
  remark?: string;
  // 编辑时透传，避免后端清空
  fieldList?: unknown[];
  languageList?: unknown[];
  selectedLanguages?: string;
  applicableUserSettings?: unknown;
  availableTimeConfig?: string;
  specificCurrencyLimits?: string;
  specificCurrencyCommissions?: string;
  verificationRule?: number;
};

// ---------- 出金手续费设置 ----------
export type WithdrawFeeSegment = {
  id?: number;
  settingsId?: number;
  startAmount: number;
  endAmount: number;
  withdrawFeeScale?: number | null;
  withdrawFeeFixed?: number | null;
  minWithdrawFee?: number | null;
  maxWithdrawFee?: number | null;
};

export type WithdrawFeeItem = {
  id: number;
  name: string | null;
  method: number; // 出金方式：1-国际电汇 2-银行汇款 3-系统出金 4-快捷支付 5-第三方支付 13-payID
  currencys: string | null; // 币种，逗号分隔
  model: number; // 1-比例 2-固定
  scheme: number; // 1-正常模式 2-阶梯模式 3-免手续费
  status: number;
  defaultFlag: number;
  withdrawFeeFixed: number | null;
  withdrawFeeScale: number | null;
  minWithdrawFee: number | null;
  maxWithdrawFee: number | null;
  settingsItems: WithdrawFeeSegment[] | null;
  operator: string | null;
  operatorEmail: string | null;
  updateTime: string | null;
};
export type WithdrawFeeListRes = BasicRes<WithdrawFeeItem>;

export type SaveWithdrawFeeParams = {
  id?: number;
  name?: string;
  method: number;
  currencys?: string;
  model: number;
  scheme: number;
  withdrawFeeFixed?: number;
  withdrawFeeScale?: number;
  minWithdrawFee?: number;
  maxWithdrawFee?: number;
  settingsItemsJsonStr?: string;
};
