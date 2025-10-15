import { RrhDeposit } from '@/components/icons/RrhDeposit';
import { RrhInternalTransfer } from '@/components/icons/RrhInternalTransfer';
import { RrhOpenPositions } from '@/components/icons/RrhOpenPositions';
import { RrhOrderHistory } from '@/components/icons/RrhOrderHistory';
import { RrhPendingOrder } from '@/components/icons/RrhPendingOrder';
import { RrhTaFlow } from '@/components/icons/RrhTaFlow';
import { RrhWalletFlow } from '@/components/icons/RrhWalletFlow';
import { RrhWithDrawal } from '@/components/icons/RrhWithDrawal';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const NavList: FC = () => {
  const { t } = useTranslation();
  // 列表内容配置（可根据实际路由修改 to）
  const navItems = [
    { label: 'home.nav.Deposit', icon: RrhDeposit, to: '/deposit' },
    { label: 'home.nav.Withdrawal', icon: RrhWithDrawal, to: '/withdrawal' },
    { label: 'home.nav.InternalTransfer', icon: RrhInternalTransfer, to: '/internal-transfer' },
    { label: 'home.nav.WalletFlow', icon: RrhWalletFlow, to: '/wallet-flow' },
    { label: 'home.nav.OrderHistory', icon: RrhOrderHistory, to: '/order-history' },
    { label: 'home.nav.OpenPositions', icon: RrhOpenPositions, to: '/open-positions' },
    { label: 'home.nav.PendingOrder', icon: RrhPendingOrder, to: '/pending-order' },
    { label: 'home.nav.TAFlow', icon: RrhTaFlow, to: '/ta-flow' },
  ];
  return (
    <div className="mb-6 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
      {navItems.map(item => (
        <Link
          key={item.label}
          to={item.to}
          className="bg-component hover:bg-component/80 text-color-nav-list flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition"
        >
          <item.icon className="mr-2 size-6" />
          <span className="text-sm font-normal">{t(item.label)}</span>
        </Link>
      ))}
    </div>
  );
};
