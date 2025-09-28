export const serverMap: Record<number, string> = {
  1: 'MT5',
  2: 'MT4',
  3: 'Sirix',
  4: 'Fortex',
  5: 'XOH',
};

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
