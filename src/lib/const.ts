export const statusOptions = [
  { label: 'common.enable', value: '1' },
  { label: 'common.disable', value: '0' },
];

export const crmAccountTypeOptions = [
  { label: 'common.account.type.user', value: '1' },
  { label: 'common.account.type.agent', value: '2' },
  { label: 'common.account.type.business', value: '3' },
  { label: 'common.account.type.sale', value: '4' },
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
// 选择时间范围
export const timeRangeOptionsSecondary = [
  { label: 'common.within7Days', value: 7 },
  { label: 'common.within15Days', value: 15 },
  { label: 'common.within30Days', value: 30 },
  { label: 'common.within3Months', value: 90 },
  { label: 'common.within6Months', value: 180 },
  { label: 'common.within1Year', value: 365 },
];

export const DEFAULT_TIME_RANGE = '1';
export type TimeRangeType = '1' | '2' | '3' | '4' | '5' | '6';

// 登录状态
export const onlineStatusOptions = [
  { label: 'common.onlineStatus.online', value: '1' },
  { label: 'common.onlineStatus.offline', value: '0' },
];

// 操作状态
export const adminOperationsStatusOptions = [
  { label: 'table.all', value: '3' }, // value 后端需要传 空 但是组件不支持为空 所以就传3 代表全部 在接口处理的时候转换一下·
  { label: 'common.rebate.status.success', value: '0' },
  { label: 'common.rebate.status.fail', value: '1' },
];

// 商品兑换记录审核状态
export const pointsHistoryVerifyStatus = [
  { label: 'redemptionRecords.verifyStatus.Canceled', value: '-1' },
  { label: 'common.verifyStatus.rejected', value: '0' },
  { label: 'common.verifyStatus.approved', value: '1' },
  { label: 'common.verifyStatus.underReview', value: '2' },
];

// 商品兑换记录支付类型
export const pointsHistoryPayType = [
  { label: 'redemptionRecords.pointsPayment', value: '1' },
  { label: 'redemptionRecords.combinedPayment', value: '2' },
];

// 积分变动记录触发业务
export const PointsOperTypeList = [
  { dictLabel: 'PointsHistory.operTypeList.11', dictValue: '11' },
  { dictLabel: 'PointsHistory.operTypeList.12', dictValue: '12' },
  { dictLabel: 'PointsHistory.operTypeList.13', dictValue: '13' },
  { dictLabel: 'PointsHistory.operTypeList.14', dictValue: '14' },
];

// 工单列表优先级
export const priorityOptions = [
  { label: 'ticketList.priorityOptions.0', value: '0' },
  { label: 'ticketList.priorityOptions.1', value: '1' },
  { label: 'ticketList.priorityOptions.2', value: '2' },
];

// 工单列表状态
export const ticketStatusOptions = [
  { label: 'ticketList.statusOptions.0', value: '0' },
  { label: 'ticketList.statusOptions.1', value: '1' },
  { label: 'ticketList.statusOptions.2', value: '2' },
];

// 提成审核状态 产品审核状态
export const commissionReviewOptions = [
  { label: 'table.pending', value: '0' },
  { label: 'table.pass', value: '1' },
  { label: 'table.refuse', value: '2' },
];

// 分润审核结算类型
export const settlementTypeOptions = [
  { label: 'profitSharingReview.settlementTypeOptions.1', value: '1' },
  { label: 'profitSharingReview.settlementTypeOptions.2', value: '2' },
];

// 投资审核状态
export const InvestmentReviewStatusOptions = [
  { label: 'table.pending', value: '0' },
  { label: 'table.pass', value: '1' },
  { label: 'table.refuse', value: '2' },
  { label: 'table.cancel', value: '3' },
];
// 投资审核类型
export const InvestmentReviewOperTypeOptions = [
  { label: 'table.buy', value: '1' },
  { label: 'table.redemption', value: '2' },
];

// 信号源状态
export const SignalStatusOptions = [
  { label: 'signals.statusOptions.0', value: '0' },
  { label: 'signals.statusOptions.1', value: '1' },
];

// 信号源审核状态
export const SignalReviewVerifyStatusOptions = [
  { label: 'table.pending', value: '2' },
  { label: 'table.reviewing', value: '-1' },
  { label: 'table.pass', value: '1' },
  { label: 'table.refuse', value: '0' },
];

// 表现费记录支付状态
export const PerformanceFeePayStatusOptions = [
  { label: 'performanceFeeRecord.payStatusOptions.1', value: '1' },
  { label: 'performanceFeeRecord.payStatusOptions.0', value: '0' },
];

// copytrading 订单管理 到账状态
export const arrivalStatusOptions = [
  { label: 'orderManagementTable.arrivalStatusOptions.1', value: '1' },
  { label: 'orderManagementTable.arrivalStatusOptions.2', value: '2' },
  { label: 'orderManagementTable.arrivalStatusOptions.3', value: '3' },
];

// 交易密码 只读密码
export const passwordTypeOptions = [
  { label: 'common.readOnlyPassword', value: '1' },
  { label: 'common.tradingPassword', value: '2' },
];

export const infoTypeOptions = [
  {
    label: 'messageManagement.emailNotification',
    value: '2',
  },
  {
    label: 'messageManagement.internalMessageNotification',
    value: '1',
  },
  {
    label: 'messageManagement.popupNotification',
    value: '0',
  },
];

export const receiveTypeOptions = [
  {
    value: '1',
    label: 'messageManagement.receiveTypeOption.1',
  },
  {
    value: '2',
    label: 'messageManagement.receiveTypeOption.2',
  },
  {
    value: '0',
    label: 'messageManagement.receiveTypeOption.0',
  },
  {
    value: '3',
    label: 'messageManagement.receiveTypeOption.3',
  },
  {
    value: '4',
    label: 'messageManagement.receiveTypeOption.4',
  },
];

export const weekOptions = [
  { label: 'common.weeks.1', value: '1' },
  { label: 'common.weeks.2', value: '2' },
  { label: 'common.weeks.3', value: '3' },
  { label: 'common.weeks.4', value: '4' },
  { label: 'common.weeks.5', value: '5' },
  { label: 'common.weeks.6', value: '6' },
  { label: 'common.weeks.7', value: '7' },
];
