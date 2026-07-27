import { RouteObject, useSearchParams } from 'react-router-dom';
import { SettingPage } from '@/pages/SettingPage';
import { ServersSettingPage } from '@/pages/setting/trading-platform/servers/ServersSettingPage';
import { QuickCreatePage } from '@/pages/setting/trading-platform/quick-create/QuickCreatePage';
import { MtServerGroupPage } from '@/pages/setting/trading-platform/mt-server-group/MtServerGroupPage';
import { MtServerAccountTypePage } from '@/pages/setting/trading-platform/account-type/MtServerAccountTypePage';

const MtServerGroupWrapperPage = () => {
  const [searchParams] = useSearchParams();
  return <MtServerGroupPage key={searchParams.get('id')} />;
};

const MtServerAccountTypeWrapperPage = () => {
  const [searchParams] = useSearchParams();
  return <MtServerAccountTypePage key={searchParams.get('id')} />;
};

/**
 * Settings routes - corresponds to "设置" menu item
 *
 * Routes grouped by category:
 *
 * 1. Trading Platform Settings (交易平台设置)
 * - /settings/trading-platform/account       - 账号设置 (Account Settings)
 * - /settings/trading-platform/account-types - 账号类型 (Account Types)
 * - /settings/trading-platform/servers       - 服务器设置 (Server Settings)
 * - /settings/trading-platform/downloads     - 下载管理 (Download Management)
 *
 * 2. CRM Settings (CRM设置)
 * - /settings/crm/platform                   - 平台设置 (Platform Settings)
 * - /settings/crm/nps                        - NPS配置 (NPS Configuration)
 * - /settings/crm/login-register             - 登录注册设置 (Login/Register Settings)
 * - /settings/crm/agent                      - 代理设置 (Agent Settings)
 * - /settings/crm/kyc                        - KYC设置 (KYC Settings)
 *
 * 3. Payment Settings (出入金设置)
 * - /settings/payment/basic                  - 基础设置 (Basic Settings)
 * - /settings/payment/currency               - 货币设置 (Currency Settings)
 * - /settings/payment/exchange-rate          - 汇率设置 (Exchange Rate Settings)
 * - /settings/payment/third-party            - 第三方支付设置 (Third-party Payment Settings)
 *
 * 4. Message Settings (消息设置)
 * - /settings/message/outbox                 - 发件箱设置 (Outbox Settings)
 * - /settings/message/email-alerts           - 邮件提醒 (Email Alerts)
 * - /settings/message/email-styles           - 邮件样式设置 (Email Style Settings)
 * - /settings/message/email-templates        - 邮件模板 (Email Templates)
 * - /settings/message/internal-templates     - 站内信模板 (Internal Message Templates)
 * - /settings/message/sms                    - 短信设置 (SMS Settings)
 * - /settings/message/telegram-bot           - Telegram机器人设置 (Telegram Bot Settings)
 * - /settings/message/telegram-templates     - Telegram模板 (Telegram Templates)
 *
 * 5. Promotion Settings (推广设置)
 * - /settings/promotion/links                - 推广链接 (Promotion Links)
 *
 * 6. Third-party Integration (三方集成配置)
 * - /settings/integration/third-party        - 三方集成配置 (Third-party Integration Config)
 */
export const settingsRoutes: RouteObject[] = [
  // Legacy settings page - for backward compatibility
  {
    path: '/settings',
    element: <SettingPage />,
  },
  {
    path: '/settings/trading-platform/servers',
    element: <ServersSettingPage />,
  },
  {
    path: '/settings/trading-platform/quickCreate',
    element: <QuickCreatePage />,
  },
  {
    path: '/settings/trading-platform/mt-server-group',
    element: <MtServerGroupWrapperPage />,
  },
  {
    path: '/settings/trading-platform/mt-server-account-type',
    element: <MtServerAccountTypeWrapperPage />,
  },

  // TODO: Add more routes as pages are developed
  /*
  // 1. Trading Platform Settings
  {
    path: '/settings/trading-platform/account',
    element: <TradingPlatformAccountPage />,
  },
  // ... add more routes here
  */
];
