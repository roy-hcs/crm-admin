import { RouteObject, useSearchParams } from 'react-router-dom';
import { SettingPage } from '@/pages/SettingPage';
import { ServersSettingPage } from '@/pages/setting/trading-platform/servers/ServersSettingPage';
import { QuickCreatePage } from '@/pages/setting/trading-platform/quick-create/QuickCreatePage';
import { MtServerGroupPage } from '@/pages/setting/trading-platform/mt-server-group/MtServerGroupPage';
import { MtServerAccountTypePage } from '@/pages/setting/trading-platform/account-type/MtServerAccountTypePage';
import { DownLoadsPage } from '@/pages/setting/trading-platform/downloads/DownLoadsPage';
import { TradingAccountPage } from '@/pages/setting/trading-platform/trading-account/TradingAccountPage';
import { CurrencySettingsPage } from '@/pages/setting/payment/currency/CurrencySettingsPage';
import { ExchangeRateSettingsPage } from '@/pages/setting/payment/exchange-rate/ExchangeRateSettingsPage';
import { ReceiveAccountsPage } from '@/pages/setting/payment/receive-accounts/ReceiveAccountsPage';
import { WithdrawChannelPage } from '@/pages/setting/payment/withdraw-channel/WithdrawChannelPage';
import { WithdrawFeePage } from '@/pages/setting/payment/withdraw-fee/WithdrawFeePage';
import { PermPackagePage } from '@/pages/setting/promotion/perm-package/PermPackagePage';

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
  {
    path: '/settings/trading-platform/downloads',
    element: <DownLoadsPage />,
  },
  {
    path: '/settings/trading-platform/account-types',
    element: <TradingAccountPage />,
  },
  {
    path: '/settings/payment/currency',
    element: <CurrencySettingsPage />,
  },
  {
    path: '/settings/payment/exchange-rate',
    element: <ExchangeRateSettingsPage />,
  },
  {
    path: '/settings/payment/receive-accounts',
    element: <ReceiveAccountsPage />,
  },
  {
    path: '/settings/payment/withdraw-channel',
    element: <WithdrawChannelPage />,
  },
  {
    path: '/settings/payment/withdraw-fee',
    element: <WithdrawFeePage />,
  },
  // 【P-3 命名决策 / P3a 卡 §2 推荐值，11-14 17:4x 使用者裁定「使用你的方案」】
  // 路径 /settings/promotion/perm-package，菜单中文「权限包管理」、英文 Permission Package。
  // 与 Sidebar.tsx 的同名菜单项必须成对修改；旧 RuoYi 侧路径是 /system/spreadPermPackage，
  // 二者不是同一个东西（前者是 SPA 前端路由，后者是后端 Controller 前缀），排查时别混。
  // 【P-4 顺序 / A0 卡 §5】本轮只到「补页 + 推 origin/develop」；后续 weekly/export →
  // verify-a0 --after-p3a（V7）→ P2 快照重生 → P3b 组件用例，均留下一轮。
  {
    path: '/settings/promotion/perm-package',
    element: <PermPackagePage />,
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
