import { RrhDeposit } from '@/components/icons/RrhDeposit';
import { RrhInternalTransfer } from '@/components/icons/RrhInternalTransfer';
import { RrhOpenPositions } from '@/components/icons/RrhOpenPositions';
import { RrhOrderHistory } from '@/components/icons/RrhOrderHistory';
// import { RrhPendingOrder } from '@/components/icons/RrhPendingOrder';
// import { RrhTaFlow } from '@/components/icons/RrhTaFlow';
import { RrhWalletFlow } from '@/components/icons/RrhWalletFlow';
import { RrhWithDrawal } from '@/components/icons/RrhWithDrawal';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
const navItems = [
  { label: 'home.nav.Deposit', icon: RrhDeposit, to: '/deposit' },
  { label: 'home.nav.Withdrawal', icon: RrhWithDrawal, to: '/withdrawal' },
  { label: 'home.nav.InternalTransfer', icon: RrhInternalTransfer, to: '/internal-transfer' },
  { label: 'home.nav.WalletFlow', icon: RrhWalletFlow, to: '/wallet-flow' },
  { label: 'home.nav.OrderHistory', icon: RrhOrderHistory, to: '/order-history' },
  { label: 'home.nav.OpenPositions', icon: RrhOpenPositions, to: '/open-positions' },
  // { label: 'home.nav.PendingOrder', icon: RrhPendingOrder, to: '/pending-order' },
  // { label: 'home.nav.TAFlow', icon: RrhTaFlow, to: '/ta-flow' },
];

export const NavList: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      {navItems.map(item => (
        <Link
          key={item.label}
          to={item.to}
          className="bg-card flex justify-center gap-2 rounded-md border px-3 py-2 shadow-xs"
        >
          <item.icon className="h-4 w-4" />
          <span className="text-card-foreground text-xs leading-4 font-medium">
            {t(item.label)}
          </span>
        </Link>
      ))}
    </div>
  );
};
