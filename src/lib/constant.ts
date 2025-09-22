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
