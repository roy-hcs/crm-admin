import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Users,
  Settings,
  Shield,
  Layout,
  FileBarChart,
  GiftIcon,
  ShoppingBag,
  MessageCircle,
  ClipboardCheck,
  Wallet,
  Percent,
  TicketIcon,
  BarChart3,
  Copy,
  ChevronRight,
} from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { useTabStore } from '@/store/tabStore';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { RrhLogo } from '../common/RrhLogo';

interface MenuItem {
  title: string;
  path?: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

interface SidebarProps {
  open?: boolean;
  cls?: string;
}

type MenuItemLevel = 0 | 1 | 2 | 3 | 4;

interface AccordionMenuItemProps {
  item: MenuItem;
  level: MenuItemLevel;
}

function checkHasActiveChild(item: MenuItem, currentPath: string): boolean {
  if (item.path === currentPath) return true;
  if (!item.children) return false;
  return item.children.some(child => checkHasActiveChild(child, currentPath));
}

function AccordionMenuItem({ item, level }: AccordionMenuItemProps) {
  const location = useLocation();
  const isActive = item.path === location.pathname;
  const hasActiveChild = checkHasActiveChild(item, location.pathname);
  const hasChildren = item.children && item.children.length > 0;
  const navigate = useNavigate();
  const { addTab } = useTabStore();
  const handleClick = (item: MenuItem) => {
    if (item.path) {
      addTab({ key: item.path, title: item.title, path: item.path, closable: true });
      navigate(item.path);
    }
  };

  if (!hasChildren) {
    return (
      <div className="my-1">
        <button
          onClick={() => handleClick(item)}
          className={cn(
            'flex w-full cursor-pointer items-center rounded-md py-1.5 pr-2 pl-10 text-sm',
            isActive ? 'text-sidebar-accent-foreground bg-accent' : 'hover:bg-accent',
          )}
        >
          {item.icon && <span className="mr-2">{item.icon}</span>}
          <span>{item.title}</span>
        </button>
      </div>
    );
  }

  return (
    <AccordionItem value={`item-${level}-${item.title}`} className="border-none">
      {level < 1 ? (
        <>
          <AccordionTrigger
            className={cn(
              'hover:bg-accent cursor-pointer rounded-md py-1.5 pr-2 pl-4 hover:no-underline',
              isActive ? 'bg-accent text-sidebar-accent-foreground' : '',
            )}
          >
            <div className="flex items-center">
              {item.icon && <span className="mr-2">{item.icon}</span>}
              <span>{item.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            {item.children?.map((child, index) => (
              <AccordionMenuItem key={index} item={child} level={(level + 1) as MenuItemLevel} />
            ))}
          </AccordionContent>
        </>
      ) : (
        <>
          <Popover>
            <PopoverTrigger className="w-full">
              <div
                className={cn(
                  'hover:bg-accent flex w-full cursor-pointer items-center justify-between rounded-md py-1.5 pr-2 pl-10',
                  hasActiveChild ? 'text-sidebar-accent-foreground bg-accent' : '',
                )}
              >
                <span>{item.title}</span>
                <ChevronRight className="text-muted-foreground size-4" />
              </div>
            </PopoverTrigger>
            <PopoverContent side="right" className="w-auto min-w-37.5 px-1 py-1.5">
              <ul className="">
                {item.children?.map((child, index) => {
                  const isChildActive = child.path === location.pathname;
                  return (
                    <li
                      key={index}
                      className={cn(
                        'mb-1 cursor-pointer rounded-md py-1.5 pr-2 pl-4 last:mb-0',
                        isChildActive ? 'bg-accent' : 'hover:bg-accent',
                      )}
                      onClick={() => handleClick(child)}
                    >
                      {child.icon && <span className="mr-2">{child.icon}</span>}
                      <span>{child.title}</span>
                    </li>
                  );
                })}
              </ul>
            </PopoverContent>
          </Popover>
        </>
      )}
    </AccordionItem>
  );
}

function CollapsedMenuItem({ item }: { item: MenuItem }) {
  const location = useLocation();
  const isActive = item.path === location.pathname;

  return (
    <div
      title={item.title}
      className={cn(
        'flex justify-center rounded-md py-1.5 pr-2 pl-4',
        isActive ? 'bg-card text-sidebar-accent-foreground' : 'hover:bg-accent',
      )}
    >
      {item.path ? (
        <Link to={item.path}>{<span>{item.title.charAt(0)}</span>}</Link>
      ) : (
        <div>{item.icon || <span>{item.title.charAt(0)}</span>}</div>
      )}
    </div>
  );
}

export function Sidebar({ open = true, cls }: SidebarProps) {
  // TODO: need to display different menu list according to different roles
  const menuItems: MenuItem[] = [
    {
      title: '工作台',
      icon: <Layout className="size-4" />,
      children: [
        {
          title: '平台概览',
          path: '/',
        },
        {
          title: '交易统计',
          path: '/workbench/trading-stats',
        },
      ],
    },
    {
      title: '系统管理',
      icon: <Shield className="size-4" />,
      children: [
        {
          title: '管理员账户',
          path: '/system/admin-accounts',
        },
        {
          title: '角色管理',
          path: '/system/roles',
        },
        {
          title: '菜单管理',
          path: '/system/menus',
        },
        {
          title: '日志管理',
          children: [
            {
              title: '管理员操作日志',
              path: '/system/logs/admin-operations',
            },
            {
              title: '管理员登录日志',
              path: '/system/logs/admin-login',
            },
            {
              title: 'CRM用户登录日志',
              path: '/system/logs/crm-user-login',
            },
            {
              title: 'CRM用户操作日志',
              path: '/system/logs/crm-user-operations',
            },
            {
              title: '邮件记录',
              path: '/system/logs/email',
            },
            {
              title: '支付日志',
              path: '/system/logs/payment',
            },
          ],
        },
      ],
    },
    {
      title: '设置',
      icon: <Settings className="size-4" />,
      children: [
        {
          title: '交易平台设置',
          children: [
            {
              title: '账号设置',
              path: '/settings/trading-platform/account',
            },
            {
              title: '账号类型',
              path: '/settings/trading-platform/account-types',
            },
            {
              title: '服务器设置',
              path: '/settings/trading-platform/servers',
            },
            {
              title: '下载管理',
              path: '/settings/trading-platform/downloads',
            },
          ],
        },
        {
          title: 'CRM设置',
          children: [
            {
              title: '平台设置',
              path: '/settings/crm/platform',
            },
            {
              title: 'NPS配置',
              path: '/settings/crm/nps',
            },
            {
              title: '登录注册设置',
              path: '/settings/crm/login-register',
            },
            {
              title: '代理设置',
              path: '/settings/crm/agent',
            },
            {
              title: 'KYC设置',
              path: '/settings/crm/kyc',
            },
          ],
        },
        {
          title: '出入金设置',
          children: [
            {
              title: '基础设置',
              path: '/settings/payment/basic',
            },
            {
              title: '货币设置',
              path: '/settings/payment/currency',
            },
            {
              title: '汇率设置',
              path: '/settings/payment/exchange-rate',
            },
            {
              title: '第三方支付设置',
              path: '/settings/payment/third-party',
            },
          ],
        },
        {
          title: '消息设置',
          children: [
            {
              title: '发件箱设置',
              path: '/settings/message/outbox',
            },
            {
              title: '邮件提醒',
              path: '/settings/message/email-alerts',
            },
            {
              title: '邮件样式设置',
              path: '/settings/message/email-styles',
            },
            {
              title: '邮件模板',
              path: '/settings/message/email-templates',
            },
            {
              title: '站内信模板',
              path: '/settings/message/internal-templates',
            },
            {
              title: '短信设置',
              path: '/settings/message/sms',
            },
            {
              title: 'Telegram机器人设置',
              path: '/settings/message/telegram-bot',
            },
            {
              title: 'Telegram模板',
              path: '/settings/message/telegram-templates',
            },
          ],
        },
        {
          title: '推广设置',
          children: [
            {
              title: '推广链接',
              path: '/settings/promotion/links',
            },
          ],
        },
        {
          title: '三方集成配置',
          children: [
            {
              title: '三方集成配置',
              path: '/settings/integration/third-party',
            },
          ],
        },
      ],
    },
    {
      title: '账户管理',
      icon: <Users className="size-4" />,
      children: [
        {
          title: '个人中心',
          path: '/account/profile',
        },
        {
          title: 'CRM账户',
          path: '/account/crm-accounts',
        },
        {
          title: '交易账户',
          path: '/account/trading-accounts',
        },
        {
          title: '客户关系',
          path: '/account/relationships',
        },
        {
          title: '账户组设置',
          path: '/account/account-groups',
        },
        {
          title: '钱包账户',
          path: '/account/wallet-accounts',
        },
      ],
    },
    {
      title: '报表',
      icon: <FileBarChart className="size-4" />,
      children: [
        {
          title: '资金报表',
          children: [
            {
              title: '钱包流水',
              path: '/reports/financial/wallet-transactions',
            },
            {
              title: '支付订单',
              path: '/reports/financial/payment-orders',
            },
            {
              title: '交易账号资金流水',
              path: '/reports/financial/trading-account-transactions',
            },
            {
              title: '资金回退失败日志',
              path: '/reports/financial/refund-failure-logs',
            },
            {
              title: '交易账号资金统计',
              path: '/reports/financial/trading-account-funds-stats',
            },
            {
              title: '交易账号数据统计',
              path: '/reports/financial/trading-account-data-stats',
            },
            {
              title: '钱包余额总览',
              path: '/reports/financial/wallet-balance-overview',
            },
            {
              title: '系统资金操作记录',
              path: '/reports/financial/system-fund-operations',
            },
          ],
        },
        {
          title: '交易报表',
          children: [
            {
              title: '交易历史',
              path: '/reports/trading/history',
            },
            {
              title: '持仓订单',
              path: '/reports/trading/open-positions',
            },
            {
              title: '限价订单',
              path: '/reports/trading/limit-orders',
            },
            {
              title: '交易账号交易历史统计',
              path: '/reports/trading/account-history-stats',
            },
          ],
        },
        {
          title: '佣金报表',
          children: [
            {
              title: '交易佣金报表',
              path: '/reports/commission/trading',
            },
            {
              title: '手续费用金报表',
              path: '/reports/commission/fees',
            },
            {
              title: '入金佣金报表',
              path: '/reports/commission/deposits',
            },
            {
              title: '日结返佣报表',
              path: '/reports/commission/daily-rebate',
            },
            {
              title: '周结返佣报表',
              path: '/reports/commission/weekly-rebate',
            },
          ],
        },
        {
          title: 'IB报表',
          children: [
            {
              title: 'IB客户追踪',
              path: '/reports/ib/client-tracking',
            },
            {
              title: 'IB数据总览',
              path: '/reports/ib/overview',
            },
          ],
        },
      ],
    },
    {
      title: '营销管理',
      icon: <GiftIcon className="size-4" />,
      children: [
        {
          title: '奖励配置',
          path: '/marketing/reward-config',
        },
        {
          title: '奖励记录',
          path: '/marketing/reward-records',
        },
        {
          title: '广告管理',
          path: '/marketing/ads',
        },
      ],
    },
    {
      title: '积分商城',
      icon: <ShoppingBag className="size-4" />,
      children: [
        {
          title: '积分商城设置',
          path: '/points-mall/settings',
        },
        {
          title: '商品列表',
          path: '/points-mall/products',
        },
        {
          title: '商品兑换记录',
          path: '/points-mall/redemption-records',
        },
        {
          title: '积分变动记录',
          path: '/points-mall/points-history',
        },
        {
          title: '积分余额总览',
          path: '/points-mall/points-balance',
        },
        {
          title: '商品分类列表',
          path: '/points-mall/product-categories',
        },
      ],
    },
    {
      title: '消息管理',
      icon: <MessageCircle className="size-4" />,
      children: [
        {
          title: '消息管理',
          path: '/message/management',
        },
      ],
    },
    {
      title: '审核',
      icon: <ClipboardCheck className="size-4" />,
      children: [
        {
          title: '审核设置',
          path: '/review/settings',
        },
        {
          title: '信息审核',
          path: '/review/information',
        },
        {
          title: '开户审核',
          path: '/review/account-opening',
        },
        {
          title: '绑定审核',
          path: '/review/binding',
        },
        {
          title: '杠杆审核',
          path: '/review/leverage',
        },
        {
          title: '入金审核',
          path: '/review/deposit',
        },
        {
          title: '出金审核',
          path: '/review/withdrawal',
        },
        {
          title: '内部转账审核',
          path: '/review/internal-transfer',
        },
        {
          title: '交易返佣审核',
          path: '/review/trading-rebate',
        },
        {
          title: '手续费返佣审核',
          path: '/review/fee-rebate',
        },
        {
          title: '入金返佣审核',
          path: '/review/deposit-rebate',
        },
        {
          title: '代理审核',
          path: '/review/agent',
        },
      ],
    },
    {
      title: '资金管理',
      icon: <Wallet className="size-4" />,
      children: [
        {
          title: '钱包余额调整',
          path: '/fund/wallet-adjustment',
        },
        {
          title: '账号余额调整',
          path: '/fund/account-adjustment',
        },
      ],
    },
    {
      title: '返佣管理',
      icon: <Percent className="size-4" />,
      children: [
        {
          title: '基础设置',
          path: '/rebate/basic-settings',
        },
        {
          title: '品种组设置',
          path: '/rebate/product-groups',
        },
        {
          title: '点值设置',
          path: '/rebate/pip-value',
        },
        {
          title: '返佣层级设置',
          path: '/rebate/level-settings',
        },
        {
          title: '交易返佣设置',
          path: '/rebate/trading-settings',
        },
        {
          title: '手续费返佣设置',
          path: '/rebate/fee-settings',
        },
        {
          title: '入金返佣设置',
          path: '/rebate/deposit-settings',
        },
      ],
    },
    {
      title: '工单管理',
      icon: <TicketIcon className="size-4" />,
      children: [
        {
          title: '工单列表',
          path: '/ticket/list',
        },
        {
          title: '我的工单',
          path: '/ticket/my-tickets',
        },
      ],
    },
    {
      title: 'PAMM管理',
      icon: <BarChart3 className="size-4" />,
      children: [
        {
          title: 'PAMM设置',
          path: '/pamm/settings',
        },
        {
          title: 'PAMM产品',
          path: '/pamm/products',
        },
        {
          title: '协议管理',
          path: '/pamm/agreements',
        },
        {
          title: '审核',
          children: [
            {
              title: '提成审核',
              path: '/pamm/review/commission',
            },
            {
              title: '分润审核',
              path: '/pamm/review/profit-sharing',
            },
            {
              title: '投资审核',
              path: '/pamm/review/investment',
            },
            {
              title: '产品审核',
              path: '/pamm/review/products',
            },
          ],
        },
        {
          title: '报表',
          children: [
            {
              title: '投资报表',
              path: '/pamm/reports/investment',
            },
            {
              title: '提成报表',
              path: '/pamm/reports/commission',
            },
            {
              title: '分润报表',
              path: '/pamm/reports/profit-sharing',
            },
            {
              title: '计提报表',
              path: '/pamm/reports/accrual',
            },
          ],
        },
      ],
    },
    {
      title: 'CopyTrading',
      icon: <Copy className="size-4" />,
      children: [
        {
          title: 'Dashboard',
          path: '/copy-trading/dashboard',
        },
        {
          title: '设置',
          path: '/copy-trading/settings',
        },
        {
          title: '信号源',
          path: '/copy-trading/signals',
        },
        {
          title: '协议设置',
          path: '/copy-trading/agreement-settings',
        },
        {
          title: '信号源审核',
          path: '/copy-trading/signal-review',
        },
        {
          title: '订单管理',
          path: '/copy-trading/order-management',
        },
        {
          title: 'Copy Trade',
          path: '/copy-trading/copy-trade',
        },
      ],
    },
  ];

  return (
    <div
      className={cn(
        'dark:bg-card text-sidebar-foreground border-sidebar-border h-full border-r bg-slate-50 transition-all duration-300',
        open ? 'w-64' : 'w-16',
        cls,
      )}
    >
      <div className="px-4 pt-6 pb-5">
        <Link to="/">
          <RrhLogo />
        </Link>
      </div>

      <nav className="text-third px-2">
        {open ? (
          <Accordion
            type="single"
            collapsible
            className="scrollbar-none h-[calc(100vh-84px)] space-y-1 overflow-auto"
          >
            <div className="text-muted px-2 pb-2 text-xs">Main</div>
            {menuItems.slice(0, 4).map((item, index) => (
              <AccordionMenuItem key={index} item={item} level={0} />
            ))}
            <div className="text-muted px-2 pt-3 pb-2 text-xs">Marketing</div>
            {menuItems.slice(4, 8).map((item, index) => (
              <AccordionMenuItem key={index} item={item} level={0} />
            ))}
            <div className="text-muted px-2 pt-3 pb-2 text-xs">Others</div>
            {menuItems.slice(8).map((item, index) => (
              <AccordionMenuItem key={index} item={item} level={0} />
            ))}
          </Accordion>
        ) : (
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <CollapsedMenuItem key={index} item={item} />
            ))}
          </div>
        )}
      </nav>
    </div>
  );
}
