import { RouteObject } from 'react-router-dom';
import { WalletTransactionsPage } from '@/pages/reports/financial/walletTransactions';
import { PaymentOrdersPage } from '@/pages/reports/financial/paymentOrders';
import { TradingAccountTransactionsPage } from '@/pages/reports/financial/tradingAccountTransactions';
import { RefundFailureLogsPage } from '@/pages/reports/financial/refundFailureLogs';
import { TradingAccountFundsStatsPage } from '@/pages/reports/financial/tradingAccountFundsStats';
import { TradingAccountDataStatsPage } from '@/pages/reports/financial/tradingAccountDataStats';
import { SystemFundOperationsPage } from '@/pages/reports/financial/systemFundOperations/SystemFundOperationsPage';
import { WalletBalancePage } from '@/pages/reports/financial/walletBalance/WalletBalancePage';
import { TradingHistoryPage } from '@/pages/reports/trading/history/TradingHistoryPage';
import { PositionOrderPage } from '@/pages/reports/trading/positionOrder/PositionOrderPage';
import { LimitOrderPage } from '@/pages/reports/trading/limitOrder/LimitOrderPage';
import { StatisticPage } from '@/pages/reports/trading/statistic/StatisticPage';
import { TradingPage } from '@/pages/reports/commission/trading';
import { FeesPage } from '@/pages/reports/commission/fees';
import { DepositsPage } from '@/pages/reports/commission/deposits';
import { DailyRebatePage } from '@/pages/reports/commission/daily-rebate';
import { WeeklyRebatePage } from '@/pages/reports/commission/weekly-rebate';
import { ClientTrackingPage } from '@/pages/reports/ib/client-tracking';
import { OverviewPage } from '@/pages/reports/ib/overview';

/**
 * Report routes - corresponds to "报表" menu item
 *
 * Routes grouped by category:
 *
 * 1. Financial Reports (资金报表)
 * - /reports/financial/wallet-transactions       - 钱包流水 (Wallet Transactions)
 * - /reports/financial/payment-orders            - 支付订单 (Payment Orders)
 * - /reports/financial/trading-account-transactions - 交易账号资金流水 (Trading Account Transactions)
 * - /reports/financial/refund-failure-logs       - 资金回退失败日志 (Refund Failure Logs)
 * - /reports/financial/trading-account-funds-stats - 交易账号资金统计 (Trading Account Funds Stats)
 * - /reports/financial/trading-account-data-stats  - 交易账号数据统计 (Trading Account Data Stats)
 * - /reports/financial/wallet-balance-overview   - 钱包余额总览 (Wallet Balance Overview)
 * - /reports/financial/system-fund-operations    - 系统资金操作记录 (System Fund Operations)
 *
 * 2. Trading Reports (交易报表)
 * - /reports/trading/history                    - 交易历史 (Trading History)
 * - /reports/trading/open-positions             - 持仓订单 (Open Positions)
 * - /reports/trading/limit-orders               - 限价订单 (Limit Orders)
 * - /reports/trading/account-history-stats      - 交易账号交易历史统计 (Trading Account History Stats)
 *
 * 3. Commission Reports (佣金报表)
 * - /reports/commission/trading                 - 交易佣金报表 (Trading Commission Report)
 * - /reports/commission/fees                    - 手续费用金报表 (Fees Commission Report)
 * - /reports/commission/deposits                - 入金佣金报表 (Deposit Commission Report)
 * - /reports/commission/daily-rebate            - 日结返佣报表 (Daily Rebate Report)
 * - /reports/commission/weekly-rebate           - 周结返佣报表 (Weekly Rebate Report)
 *
 * 4. IB Reports (IB报表)
 * - /reports/ib/client-tracking                - IB客户追踪 (IB Client Tracking)
 * - /reports/ib/overview                       - IB数据总览 (IB Overview)
 */
export const reportRoutes: RouteObject[] = [
  // 1. Financial Reports (资金报表)
  {
    path: '/reports/financial/wallet-transactions',
    element: <WalletTransactionsPage />,
  },
  {
    path: '/reports/financial/payment-orders',
    element: <PaymentOrdersPage />,
  },
  {
    path: '/reports/financial/trading-account-transactions',
    element: <TradingAccountTransactionsPage />,
  },
  {
    path: '/reports/financial/refund-failure-logs',
    element: <RefundFailureLogsPage />,
  },
  {
    path: '/reports/financial/trading-account-funds-stats',
    element: <TradingAccountFundsStatsPage />,
  },
  {
    path: '/reports/financial/trading-account-data-stats',
    element: <TradingAccountDataStatsPage />,
  },
  {
    path: '/reports/financial/wallet-balance-overview',
    element: <WalletBalancePage />,
  },
  {
    path: '/reports/financial/system-fund-operations',
    element: <SystemFundOperationsPage />,
  },

  // 2. Trading Reports (交易报表)
  {
    path: '/reports/trading/history',
    element: <TradingHistoryPage />,
  },
  {
    path: '/reports/trading/open-positions',
    element: <PositionOrderPage />,
  },
  {
    path: '/reports/trading/limit-orders',
    element: <LimitOrderPage />,
  },
  {
    path: '/reports/trading/account-history-stats',
    element: <StatisticPage />,
  },

  // 3. Commission Reports (佣金报表)
  {
    path: '/reports/commission/trading',
    element: <TradingPage />,
  },
  {
    path: '/reports/commission/fees',
    element: <FeesPage />,
  },
  {
    path: '/reports/commission/deposits',
    element: <DepositsPage />,
  },
  {
    path: '/reports/commission/daily-rebate',
    element: <DailyRebatePage />,
  },
  {
    path: '/reports/commission/weekly-rebate',
    element: <WeeklyRebatePage />,
  },

  // 4. IB Reports (IB报表)
  {
    path: '/reports/ib/client-tracking',
    element: <ClientTrackingPage />,
  },
  {
    path: '/reports/ib/overview',
    element: <OverviewPage />,
  },

  // Legacy route - keep for backward compatibility
  {
    path: '/reports/sales',
    element: <TradingPage />, // Redirecting to trading reports, update as needed
  },
];
