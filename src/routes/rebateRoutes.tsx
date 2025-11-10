import { PipValuePage } from '@/pages/rebate/pip-value/PipValuePage';
import { ProductGroupPage } from '@/pages/rebate/product-group/ProductGroupPage';
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
  /*
  {
    path: '/rebate/basic-settings',
    element: <RebateBasicSettingsPage />,
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
    path: '/rebate/deposit-settings',
    element: <DepositRebateSettingsPage />,
  },
  */
];
