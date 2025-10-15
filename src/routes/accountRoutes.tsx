import { RouteObject } from 'react-router-dom';
import { ProfilePage } from '@/pages/ProfilePage';
import { CRMAccounts } from '@/pages/account/CRMAccounts/CRMAccounts';
// Import other account pages as they are developed

/**
 * Account Management routes - corresponds to "账户管理" menu item
 *
 * Routes:
 * - /account/profile           - 个人中心 (Profile)
 * - /account/crm-accounts      - CRM账户 (CRM Accounts)
 * - /account/trading-accounts  - 交易账户 (Trading Accounts)
 * - /account/relationships     - 客户关系 (Customer Relationships)
 * - /account/account-groups    - 账户组设置 (Account Group Settings)
 * - /account/wallet-accounts   - 钱包账户 (Wallet Accounts)
 */
export const accountRoutes: RouteObject[] = [
  // Currently developed routes
  {
    path: '/account/profile',
    element: <ProfilePage />,
  },
  {
    path: '/account/crm-accounts',
    element: <CRMAccounts />,
  },

  // Routes to be developed - commented out until pages are created
  /*
  {
    path: '/account/trading-accounts',
    element: <TradingAccountsPage />,
  },
  {
    path: '/account/relationships',
    element: <RelationshipsPage />,
  },
  {
    path: '/account/account-groups',
    element: <AccountGroupsPage />,
  },
  {
    path: '/account/wallet-accounts',
    element: <WalletAccountsPage />,
  },
  */
];
