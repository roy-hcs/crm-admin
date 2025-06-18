import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Users,
  BarChart2,
  Settings,
  Home,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Calendar,
  ShoppingCart,
  BarChart,
  PieChart,
  Database,
  Shield,
  HelpCircle,
  Bell,
} from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { useTabStore } from '@/store/tabStore';

interface MenuItem {
  title: string;
  path?: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

interface SidebarProps {
  open: boolean;
}

type MenuItemLevel = 0 | 1 | 2 | 3 | 4;

interface AccordionMenuItemProps {
  item: MenuItem;
  level: MenuItemLevel;
}

function AccordionMenuItem({ item, level }: AccordionMenuItemProps) {
  const location = useLocation();
  const isActive = item.path === location.pathname;
  const hasChildren = item.children && item.children.length > 0;
  const navigate = useNavigate();
  const { addTab } = useTabStore();
  const handleClick = (path?: string) => {
    if (path) {
      addTab({ key: path, title: item.title, path, closable: true });
      navigate(path);
    }
  };

  if (!hasChildren) {
    return (
      <div className="my-1">
        <button
          onClick={() => handleClick(item.path)}
          className={cn(
            'flex w-full cursor-pointer items-center rounded-md p-2 text-sm',
            isActive ? 'bg-card text-sidebar-accent-foreground' : 'hover:bg-accent',
          )}
        >
          {item.icon && <span className="mr-3">{item.icon}</span>}
          <span>{item.title}</span>
        </button>
      </div>
    );
  }

  return (
    <AccordionItem value={`item-${level}-${item.title}`} className="border-none">
      <AccordionTrigger
        className={cn(
          'hover:bg-accent cursor-pointer rounded-md p-2 hover:no-underline',
          isActive ? 'bg-card text-sidebar-accent-foreground' : '',
        )}
      >
        <div className="flex items-center">
          {item.icon && <span className="mr-3">{item.icon}</span>}
          <span>{item.title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-1 pb-0">
        <div className={cn('pl-2', level === 0 ? 'ml-4' : 'ml-2')}>
          {item.children?.map((child, index) => (
            <AccordionMenuItem key={index} item={child} level={(level + 1) as MenuItemLevel} />
          ))}
        </div>
      </AccordionContent>
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
        'flex justify-center rounded-md p-2',
        isActive ? 'bg-card text-sidebar-accent-foreground' : 'hover:bg-accent',
      )}
    >
      {item.path ? (
        <Link to={item.path}>{item.icon || <span>{item.title.charAt(0)}</span>}</Link>
      ) : (
        <div>{item.icon || <span>{item.title.charAt(0)}</span>}</div>
      )}
    </div>
  );
}

export function Sidebar({ open }: SidebarProps) {
  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      path: '/',
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: '账户管理',
      icon: <Users className="h-5 w-5" />,
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
      title: 'Communication',
      icon: <Mail className="h-5 w-5" />,
      children: [
        {
          title: 'Email',
          path: '/communication/email',
        },
        {
          title: 'Messages',
          icon: <MessageSquare className="h-5 w-5" />,
          children: [
            {
              title: 'Inbox',
              path: '/communication/messages/inbox',
            },
            {
              title: 'Sent',
              path: '/communication/messages/sent',
            },
          ],
        },
        {
          title: 'Calls',
          icon: <Phone className="h-5 w-5" />,
          path: '/communication/calls',
        },
        {
          title: 'Appointments',
          icon: <Calendar className="h-5 w-5" />,
          path: '/communication/appointments',
        },
      ],
    },
    {
      title: 'Reports',
      icon: <BarChart2 className="h-5 w-5" />,
      children: [
        {
          title: 'Sales Report',
          path: '/reports/sales',
        },
        {
          title: 'Performance',
          path: '/reports/performance',
        },
        {
          title: 'Analytics',
          children: [
            {
              title: 'Trends',
              path: '/reports/analytics/trends',
              icon: <BarChart className="h-5 w-5" />,
            },
            {
              title: 'Demographics',
              path: '/reports/analytics/demographics',
              icon: <PieChart className="h-5 w-5" />,
            },
            {
              title: 'Advanced',
              children: [
                {
                  title: 'Forecast',
                  path: '/reports/analytics/advanced/forecast',
                },
                {
                  title: 'Correlations',
                  path: '/reports/analytics/advanced/correlations',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Orders',
      icon: <ShoppingCart className="h-5 w-5" />,
      path: '/orders',
    },
    {
      title: 'Documents',
      path: '/documents',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      children: [
        {
          title: 'General',
          path: '/settings/general',
        },
        {
          title: 'Security',
          icon: <Shield className="h-5 w-5" />,
          path: '/settings/security',
        },
        {
          title: 'Database',
          icon: <Database className="h-5 w-5" />,
          path: '/settings/database',
        },
        {
          title: 'Notifications',
          icon: <Bell className="h-5 w-5" />,
          path: '/settings/notifications',
        },
      ],
    },
    {
      title: 'Help',
      path: '/help',
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ];

  return (
    <aside
      className={cn(
        'bg-card text-sidebar-foreground border-sidebar-border border-r transition-all duration-300',
        open ? 'w-64' : 'w-16',
      )}
    >
      <div className="border-sidebar-border flex h-16 items-center justify-center border-b">
        <h1 className={cn('text-xl font-bold', !open && 'sr-only')}>CRM Admin</h1>
        {!open && <span className="text-xl font-bold">CA</span>}
      </div>

      <nav className="mt-5 px-2">
        {open ? (
          <Accordion type="multiple" className="space-y-1">
            {menuItems.map((item, index) => (
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
    </aside>
  );
}
