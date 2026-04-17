import { RebateBasicSettingsPage } from '@/pages/rebate/basic-settings/RebateBasicSettingsPage';
import { DepositRebateSettingsHistoryPage } from '@/pages/rebate/deposit-settings-history/DepositRebateSettingsHistoryPage';
import { DepositRebateSettingsTemplate } from '@/pages/rebate/deposit-settings-template/DepositRebateSettingsTemplate';
import { DepositRebateSettingsPage } from '@/pages/rebate/deposit-settings/DepositRebateSettingsPage';
import { FeeRebateSettingsHistoryPage } from '@/pages/rebate/fee-settings-history/FeeRebateSettingsHistoryPage';
import { FeeRebateSettingsTemplate } from '@/pages/rebate/fee-settings-template/FeeRebateSettingsTemplate';
import { FeeRebateSettingsPage } from '@/pages/rebate/fee-settings/FeeRebateSettingsPage';
import { RebateLevelSettingsPage } from '@/pages/rebate/level-settings/RebateLevelSettingsPage';
import { PipValuePage } from '@/pages/rebate/pip-value/PipValuePage';
import { ProductGroupPage } from '@/pages/rebate/product-group/ProductGroupPage';
import { TradingRebateSettingsHistoryPage } from '@/pages/rebate/trading-settings-history/TradingRebateSettingsHistoryPage';
import { TradingRebateSettingsTemplate } from '@/pages/rebate/trading-settings-template/TradingRebateSettingsTemplate';
import { TradingRebateSettingsPage } from '@/pages/rebate/trading-settings/TradingRebateSettingsPage';
import { RouteObject } from 'react-router-dom';

/**
 * Rebate Management routes - corresponds to "返佣管理" menu item
 *
 * Routes:
 * - /rebate/basic-settings   - 基础设置 (Basic Settings)
 * - /rebate/product-groups   - 品种组设置 (Product Group Settings)
 * - /rebate/pip-value        - 点值设置 (Pip Value Settings)
 * - /rebate/level-settings   - 返佣层级设置 (Rebate Level Settings)
 * - /rebate/trading-settings - 交易返佣设置 (Trading Rebate Settings)
 * - /rebate/fee-settings     - 手续费返佣设置 (Fee Rebate Settings)
 * - /rebate/deposit-settings - 入金返佣设置 (Deposit Rebate Settings)
 */
export const rebateRoutes: RouteObject[] = [
  // TODO: Add routes as pages are developed
  {
    path: '/rebate/pip-value',
    element: <PipValuePage />,
  },
  {
    path: '/rebate/product-groups',
    element: <ProductGroupPage />,
  },
  {
    path: '/rebate/level-settings',
    element: <RebateLevelSettingsPage />,
  },
  {
    path: '/rebate/trading-settings',
    element: <TradingRebateSettingsPage />,
  },
  {
    path: '/rebate/fee-settings',
    element: <FeeRebateSettingsPage />,
  },
  {
    path: '/rebate/fee-settings-history',
    element: <FeeRebateSettingsHistoryPage />,
  },
  {
    path: '/rebate/trading-settings-history',
    element: <TradingRebateSettingsHistoryPage />,
  },
  {
    path: '/rebate/deposit-settings-history',
    element: <DepositRebateSettingsHistoryPage />,
  },
  {
    path: '/rebate/deposit-settings',
    element: <DepositRebateSettingsPage />,
  },
  {
    path: '/rebate/basic-settings',
    element: <RebateBasicSettingsPage />,
  },
  {
    path: '/rebate/trading-settings-template',
    element: <TradingRebateSettingsTemplate />,
  },
  {
    path: '/rebate/fee-settings-template',
    element: <FeeRebateSettingsTemplate />,
  },
  {
    path: '/rebate/deposit-settings-template',
    element: <DepositRebateSettingsTemplate />,
  },
];
