export const statusOptions = [
  { label: 'common.enable', value: '1' },
  { label: 'common.disable', value: '0' },
];

export const crmAccountTypeOptions = [
  { label: 'common.account.type.user', value: '1' },
  { label: 'common.account.type.agent', value: '2' },
];

// TODO: get this data from API later
export const roleOptions = [
  { label: 'common.role.crmUser', value: '131' },
  { label: 'common.role.mam', value: '198' },
  { label: 'common.role.reward', value: '197' },
  { label: 'common.role.message', value: '196' },
  { label: 'common.role.walletTest', value: '195' },
];

export const colorPreferenceOptions = [
  { label: 'common.colorPreference.greenUp', value: '1' },
  { label: 'common.colorPreference.redUp', value: '2' },
];

// 返佣类型
export const RebateTypeOptions = [
  { label: 'common.rebate.type.trade', value: '1' },
  { label: 'common.rebate.type.fee', value: '2' },
  { label: 'common.rebate.type.deposit', value: '3' },
];

// 返佣状态
export const RebateStatusOptions = [
  { label: 'common.rebate.status.success', value: '1' },
  { label: 'common.rebate.status.fail', value: '0' },
];

// 订单状态
export const OrderStatusOptions = [
  { label: 'common.order.status.pendingPay', value: '0' },
  { label: 'common.order.status.completed', value: '1' },
  { label: 'common.order.status.canceled', value: '2' },
  { label: 'common.order.status.timeout', value: '3' },
];

// 状态
export const StatusOptions = [
  { label: 'common.processStatus.unhandled', value: '0' },
  { label: 'common.processStatus.handled', value: '1' },
];

// 审核状态
export const VerifyStatusOptions = [
  { label: 'common.verifyStatus.pending', value: '2' },
  { label: 'common.verifyStatus.underReview', value: '-1' },
  { label: 'common.verifyStatus.approved', value: '1' },
  { label: 'common.verifyStatus.rejected', value: '0' },
];

// 类型
export const typeOptions = [
  { label: 'common.live', value: '1' },
  { label: 'common.demo', value: '2' },
];

// 选择时间范围
export const timeRangeOptions = [
  { label: 'common.within7Days', value: '1' },
  { label: 'common.within15Days', value: '2' },
  { label: 'common.within30Days', value: '3' },
  { label: 'common.within3Months', value: '4' },
  { label: 'common.within6Months', value: '5' },
  { label: 'common.within1Year', value: '6' },
];

export const DEFAULT_TIME_RANGE = '1';
export type TimeRangeType = '1' | '2' | '3' | '4' | '5' | '6';

// 登录状态
export const onlineStatusOptions = [
  { label: 'common.onlineStatus.online', value: '1' },
  { label: 'common.onlineStatus.offline', value: '0' },
];
