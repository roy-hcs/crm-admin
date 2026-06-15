import { YieldRate } from './components/YieldRate';
import { ClosingProfit } from './components/ClosingProfit';
import { NetWorthBalance } from './components/NetWorthBalance';
import { OverviewTradingVarieties } from './components/OverviewTradingVarieties.tsx';

export function RevenueTrend({ serverId, login }: { serverId: string; login: string }) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
        <YieldRate serverId={serverId} account={login} />
        <ClosingProfit serverId={serverId} account={login} />
      </div>
      <div>
        <NetWorthBalance serverId={serverId} account={login} />
      </div>
      <div>
        <OverviewTradingVarieties serverId={serverId} login={login} />
      </div>
    </div>
  );
}
