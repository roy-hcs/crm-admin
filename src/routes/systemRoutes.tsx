import { RouteObject } from 'react-router-dom';
import { RolesPage } from '@/pages/system/roles/RolesPage';
import { MenusPage } from '@/pages/system/menus/MenusPage';
import { CRMUserOperationsLogsPage } from '@/pages/system/logsPage/userOperation/CRMUserOperationsLogsPage';
import { EmailLogsPage } from '@/pages/system/logsPage/email/EmailLogsPage';
import { PaymentLogsPage } from '@/pages/system/logsPage/payment/PaymentLogsPage';
// Import other system pages as they are developed

/**
 * System Management routes - corresponds to "系统管理" menu item
 *
 * Routes:
 * - /system/admin-accounts    - 管理员账户 (Admin Accounts)
 * - /system/roles            - 角色管理 (Role Management)
 * - /system/menus           - 菜单管理 (Menu Management)
 * - /system/logs/admin-operations - 管理员操作日志 (Admin Operation Logs)
 * - /system/logs/admin-login     - 管理员登录日志 (Admin Login Logs)
 * - /system/logs/crm-user-login  - CRM用户登录日志 (CRM User Login Logs)
 * - /system/logs/crm-user-operations - CRM用户操作日志 (CRM User Operation Logs)
 * - /system/logs/email          - 邮件记录 (Email Records)
 * - /system/logs/payment        - 支付日志 (Payment Logs)
 */
export const systemRoutes: RouteObject[] = [
  // Currently developed routes
  {
    path: '/system/roles',
    element: <RolesPage />,
  },
  {
    path: '/system/menus',
    element: <MenusPage />,
  },
  {
    path: '/system/logs/crm-user-operations',
    element: <CRMUserOperationsLogsPage />,
  },
  {
    path: '/system/logs/email',
    element: <EmailLogsPage />,
  },
  {
    path: '/system/logs/payment',
    element: <PaymentLogsPage />,
  },

  // Routes to be developed - commented out until pages are created
  /*
  {
    path: '/system/admin-accounts',
    element: <AdminAccountsPage />,
  },
  {
    path: '/system/logs/admin-operations',
    element: <AdminOperationsLogsPage />,
  },
  {
    path: '/system/logs/admin-login',
    element: <AdminLoginLogsPage />,
  },
  {
    path: '/system/logs/crm-user-login',
    element: <CRMUserLoginLogsPage />,
  },
  
  
  */
];
