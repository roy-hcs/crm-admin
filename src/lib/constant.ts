export const serverMap: Record<string, string> = {
  '1': 'MT5',
  '2': 'MT4',
  '3': 'Sirix',
  '4': 'Fortex',
  '5': 'XOH',
};

export type KycStatus = 'pending' | 'success' | 'fail';

export const transactionTypeMap: Record<number, string> = {
  0: 'Buy',
  1: 'Sell',
};

export const entryMap: Record<number, string> = {
  0: 'in',
  1: 'out',
  2: 'in/out',
  3: 'out by',
};

export const financeTypeMap: Record<number, string> = {
  1: 'Deposit',
  2: 'Withdrawal',
  3: 'SystemDeposit',
  4: 'SystemWithdrawal',
  5: 'SystemCreditDeposit',
  6: 'SystemCreditWithdrawal',
  7: 'RebateDeposit',
  8: 'InternalTransferIn',
  9: 'InternalTransferOut',
  10: 'DemoAccountDeposit',
  11: 'DemoAccountWithdrawal',
  12: 'Charge',
};

export const applySourceMap: Record<number, string> = {
  0: 'invitationRegistration',
  1: 'customerApplication',
  2: 'officialWebsiteRegistration',
};

export const reviewStatusMap: Record<number, string> = {
  0: 'refuse',
  1: 'pass',
  2: 'pending',
  3: 'reviewing',
};

export const depositRebateStatusMap: Record<number | string, string> = {
  2: 'refuse',
  1: 'pass',
  0: 'pending',
  '-1': 'reviewing',
};
export const transactionRebateStatusMap: Record<number | string, string> = {
  0: 'refuse',
  1: 'pass',
  2: 'pending',
  3: 'reviewing',
};

export const internalTransferReviewStatusMap: Record<number | string, string> = {
  2: 'pending',
  1: 'pass',
  0: 'refuse',
  '-1': 'reviewing',
};

export const withdrawalReviewStatusMap: Record<number | string, string> = {
  2: 'pending',
  1: 'pass',
  0: 'refuse',
  '-1': 'reviewing',
  '-2': 'cancel',
};

export const withdrawOrDepositMethodsMap: Record<number, string> = {
  1: 'internationalTransfer',
  2: 'bankTransfer',
  3: 'systemWithdrawal',
  4: 'quickPayment',
  13: 'payID',
};

export const depositMethodsMap: Record<number, string> = {
  1: 'internationalTransfer',
  2: 'bankTransfer',
  5: 'thirdPayment',
  6: 'cryptocurrency',
  7: 'quickPayment',
  13: 'payID',
};

export const infoTypesMap: Record<number, string> = {
  0: 'popupNotification',
  1: 'inSiteMsgNotification',
  2: 'emailNotification',
};

export const pammReportStatusMap: Record<string, string> = {
  '-1': 'cancel',
  '0': 'waitForConfirm',
  '1': 'confirmed',
  '2': 'rejected',
};

// 交易报表-交易历史 类型映射
export const tradingHistoryTypeMap: Record<number, string> = {
  0: 'buy',
  1: 'sell',
  7: 'table.commission',
  8: 'tradingHistoryPage.dailyHandlingFee',
  9: 'tradingHistoryPage.monthlyHandlingFee',
  10: 'tradingHistoryPage.dailyAgencyFee',
  11: 'tradingHistoryPage.monthlyAgencyFee',
};

export const REBATE_MODEL_SETTING = 'sys.rebate.base.setting';
export const REBATE_LEVEL_SETTING = 'sys.rebate.level.model2.flat.leapfrog.setting';

export const OperationTypeMap: Record<number, string> = {
  1: 'table.Deposit',
  2: 'table.Withdrawal',
  3: 'table.transfer',
  4: 'table.rebate',
};

export const OperationMethodMap: Record<number, string> = {
  1: 'table.internationalTransfer',
  2: 'table.bankTransfer',
  3: 'table.withdrawOnDrawdown',
  4: 'table.SystemDeposit',
  5: 'table.SystemWithdrawal',
  6: 'table.internalTransfer',
  7: 'table.internalTransferOut',
  8: 'table.RebateDeposit',
  13: 'table.payID',
  14: 'table.pointsProductReturn',
  15: 'table.pointsProductExchange',
  16: 'table.thirdPayment',
};
// -2 未提交，-1 2 审核中 0 拒绝，1 审核通过
export const kycVerifyStatusMap: Record<number, KycStatus> = {
  // ui状态只要 等待 成功 失败
  '-2': 'fail',
  '-1': 'pending',
  0: 'fail',
  1: 'success',
  2: 'pending',
};
// -2 未提交，-1 2 审核中 0 拒绝，1 审核通过
export const kycVerifyStatusTextMap: Record<number, string> = {
  '-2': 'accountOpening.kycVerifyStatus.-2',
  '-1': 'accountOpening.kycVerifyStatus.-1',
  0: 'accountOpening.kycVerifyStatus.0',
  1: 'accountOpening.kycVerifyStatus.1',
  2: 'accountOpening.kycVerifyStatus.2',
};
