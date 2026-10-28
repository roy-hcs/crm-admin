import { RiskAccountRow, RiskChainNode, RiskResultFilter } from '@/api/hooks/review';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { forwardRef, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { RiskOrderDialogTarget, formatMoney, formatPercent } from './riskControlUtils';

type EyeConfig = {
  resultFilter: RiskResultFilter;
  countFn: (row: RiskAccountRow) => RiskAccountRow['totalClosedCount'];
};

type ComparisonTableProps = {
  rows: RiskAccountRow[];
  emptyText: string;
  filterKeyword?: string;
  selfThresholdSeconds: number;
  agentThresholdSeconds: number;
  onViewOrders: (target: RiskOrderDialogTarget) => void;
};

const sumBy = (rows: RiskAccountRow[], key: keyof RiskAccountRow) =>
  rows.reduce((acc, row) => acc + (Number(row[key]) || 0), 0);

const uniq = (values: Array<string | null | undefined>) =>
  Array.from(new Set(values.filter(Boolean) as string[]));

const chainNodeText = (chain: RiskChainNode[] | null, index: number) => {
  const node = chain?.[index];
  return node ? `${node.name}(${node.email})` : null;
};

export const RiskComparisonTable = forwardRef<HTMLTableElement, ComparisonTableProps>(
  (
    { rows, emptyText, filterKeyword, selfThresholdSeconds, agentThresholdSeconds, onViewOrders },
    ref,
  ) => {
    const { t } = useTranslation();

    const keyword = (filterKeyword || '').trim().toLowerCase().replace(/\s+/g, '');
    const filtered = keyword
      ? rows.filter(row =>
          [row.crmShowId, row.customerName, row.account, row.serverName, row.group].some(value =>
            String(value || '')
              .toLowerCase()
              .replace(/\s+/g, '')
              .includes(keyword),
          ),
        )
      : rows;

    const visibleRows = filtered
      .slice()
      .sort(
        (a, b) =>
          (a.relationLevel === null || a.relationLevel === undefined
            ? 0
            : Number(a.relationLevel)) -
          (b.relationLevel === null || b.relationLevel === undefined ? 0 : Number(b.relationLevel)),
      );

    if (!visibleRows.length) {
      return (
        <div className="text-muted-foreground rounded-lg p-8 text-center text-sm">{emptyText}</div>
      );
    }

    const crmIds = uniq(visibleRows.map(row => row.crmShowId));
    const currencies = uniq(visibleRows.map(row => row.currency));
    const singleCurrency = currencies.length === 1 ? currencies[0] : null;

    const totalBalance = sumBy(visibleRows, 'balance');
    const totalWalletDeposit = sumBy(visibleRows, 'walletDeposit');
    const totalWalletWithdraw = sumBy(visibleRows, 'walletWithdraw');
    const totalMtDeposit = sumBy(visibleRows, 'mtDeposit');
    const totalMtWithdraw = sumBy(visibleRows, 'mtWithdraw');
    const totalOverviewDeposit = sumBy(visibleRows, 'overviewDeposit');
    const totalOverviewWithdraw = sumBy(visibleRows, 'overviewWithdraw');
    const totalClosed = sumBy(visibleRows, 'totalClosedCount');
    const totalUnder1 = sumBy(visibleRows, 'under1MinCount');
    const totalUnder3 = sumBy(visibleRows, 'under3MinCount');
    const totalReverse = sumBy(visibleRows, 'reverseCount');
    const totalSelfLock = sumBy(visibleRows, 'selfLockVolume');
    const totalAgentLock = sumBy(visibleRows, 'agentLockVolume');
    const totalVolume = sumBy(visibleRows, 'totalVolume');
    const totalProfitCount = sumBy(visibleRows, 'profitOrderCount');
    const totalLossCount = sumBy(visibleRows, 'lossOrderCount');
    const totalBreakEvenCount = sumBy(visibleRows, 'breakEvenOrderCount');
    const totalTradeProfit = sumBy(visibleRows, 'totalTradeProfit');
    const totalTradeProfitUsd = sumBy(visibleRows, 'totalTradeProfitUsd');
    const totalRebateCommission = sumBy(visibleRows, 'totalRebateCommission');
    const totalMargin = sumBy(visibleRows, 'totalMargin');
    const totalSelfRebate = sumBy(visibleRows, 'selfRebateCommission');
    const totalBonusToReal = sumBy(visibleRows, 'bonusToReal');

    const totalProfitRate = totalMargin
      ? `${((totalTradeProfitUsd / totalMargin) * 100).toFixed(2)}%`
      : null;
    const totalProfitRateWithCommission = totalMargin
      ? `${(((totalTradeProfitUsd + totalRebateCommission) / totalMargin) * 100).toFixed(2)}%`
      : null;
    const totalSelfLockRate = totalVolume
      ? `${((totalSelfLock / totalVolume) * 100).toFixed(2)}%`
      : null;
    const totalAgentLockRate = totalVolume
      ? `${((totalAgentLock / totalVolume) * 100).toFixed(2)}%`
      : null;

    const ordersUnit = t('riskControlPage.unitOrders');
    const lotsUnit = t('riskControlPage.unitLots');

    const renderCell = (value: ReactNode) =>
      value === null || value === undefined || value === '' ? (
        <span className="text-muted-foreground/60">-</span>
      ) : (
        value
      );

    const rowHtml = (
      label: string,
      valueFn: (row: RiskAccountRow) => ReactNode,
      totalValue?: ReactNode,
      eyeConfig?: EyeConfig,
    ) => (
      <tr key={label} className="border-b">
        <th
          scope="row"
          className="bg-muted/40 sticky left-0 z-10 border-r px-3 py-2 text-left text-xs font-normal whitespace-nowrap"
        >
          {label}
        </th>
        {visibleRows.map((row, index) => {
          const count = eyeConfig ? eyeConfig.countFn(row) : null;
          const showEye = Number(count) > 0 && row.serverId && row.account;
          return (
            <td
              key={`${row.serverId}-${row.account}-${index}`}
              className="border-r px-3 py-2 align-top text-xs"
            >
              <div className="flex items-center gap-1">
                <span>{renderCell(valueFn(row))}</span>
                {eyeConfig && showEye && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-5 shrink-0"
                    data-export-ignore
                    title={t('riskControlPage.orderModalViewDetail')}
                    onClick={() =>
                      onViewOrders({
                        serverId: row.serverId as string,
                        account: row.account,
                        resultFilter: eyeConfig.resultFilter,
                        label,
                        crmShowId: row.crmShowId,
                        customerName: row.customerName,
                      })
                    }
                  >
                    <Eye className="size-3" />
                  </Button>
                )}
              </div>
            </td>
          );
        })}
        <td className="bg-primary/5 px-3 py-2 text-xs font-semibold whitespace-nowrap">
          {totalValue === undefined || totalValue === null || totalValue === '' ? '—' : totalValue}
        </td>
      </tr>
    );

    const groupHeaderRow = (label: string) => (
      <tr key={label} className="bg-primary/5">
        <th
          colSpan={visibleRows.length + 2}
          className="border-y px-3 py-1.5 text-left text-xs font-semibold text-[#1a5fa8]"
        >
          {label}
        </th>
      </tr>
    );

    const countRateCell = (
      count: RiskAccountRow['under1MinCount'],
      rate: RiskAccountRow['under1MinRate'],
    ) =>
      count !== null && count !== undefined
        ? `${count}${ordersUnit} · ${Number(rate || 0).toFixed(2)}%`
        : null;

    const totalCountRateCell = (count: number) =>
      totalClosed
        ? `${count}${ordersUnit} · ${((count / totalClosed) * 100).toFixed(2)}%`
        : `${count}${ordersUnit}`;

    return (
      <div className="w-full overflow-x-auto">
        <table ref={ref} className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="bg-muted/40 sticky left-0 z-10 border-r px-3 py-2 text-left text-xs font-semibold whitespace-nowrap">
                <span className="block">{t('riskControlPage.compareAccountInfo')}</span>
                <span className="text-muted-foreground block font-normal">
                  {t('riskControlPage.compareCustomer')}
                </span>
              </th>
              {visibleRows.map((row, index) => (
                <th
                  key={`${row.serverId}-${row.account}-${index}`}
                  className="border-r px-3 py-2 text-left align-top text-xs font-semibold"
                >
                  <strong className="block">{row.customerName}</strong>
                  <span className="block text-[11px] font-normal text-[#888]">{row.crmShowId}</span>
                </th>
              ))}
              <th className="bg-primary/5 px-3 py-2 text-left align-top text-xs font-semibold whitespace-nowrap">
                {t('riskControlPage.compareTotal')}
                <br />
                <span className="text-muted-foreground font-normal">
                  {t('riskControlPage.compareTotalSub', {
                    crmCount: crmIds.length,
                    accountCount: visibleRows.length,
                  })}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rowHtml(t('riskControlPage.compareRelationLevel'), row => row.relationLabel)}
            {rowHtml(t('riskControlPage.labelCrmSuperior'), row => chainNodeText(row.crmChain, 0))}
            {rowHtml(t('riskControlPage.labelLevelSuffix', { n: 2 }), row =>
              chainNodeText(row.crmChain, 1),
            )}
            {rowHtml(t('riskControlPage.labelLevelSuffix', { n: 3 }), row =>
              chainNodeText(row.crmChain, 2),
            )}
            {rowHtml(t('riskControlPage.labelDirectBroker'), row => row.directBroker)}
            {rowHtml(t('riskControlPage.labelLevelSuffix', { n: 2 }), row =>
              chainNodeText(row.directChain, 1),
            )}
            {rowHtml(t('riskControlPage.labelLevelSuffix', { n: 3 }), row =>
              chainNodeText(row.directChain, 2),
            )}
            {rowHtml(
              t('table.account'),
              row => row.account,
              `${visibleRows.length} ${t('riskControlPage.unitAccounts')}`,
            )}
            {rowHtml(t('common.server'), row => row.serverName)}
            {rowHtml(t('table.accountGroup'), row => row.group)}
            {rowHtml(t('riskControlPage.identityCurrency'), row => row.currency, singleCurrency)}

            {groupHeaderRow(t('riskControlPage.fundOverview'))}
            {rowHtml(
              t('riskControlPage.fundDeposit'),
              row => formatMoney(row.overviewDeposit, 'USD'),
              formatMoney(totalOverviewDeposit, 'USD'),
            )}
            {rowHtml(
              t('riskControlPage.fundWithdraw'),
              row => formatMoney(row.overviewWithdraw, 'USD'),
              formatMoney(totalOverviewWithdraw, 'USD'),
            )}
            {rowHtml(
              t('riskControlPage.fundNetDeposit'),
              row => formatMoney(row.overviewNetDeposit, 'USD'),
              formatMoney(totalOverviewDeposit - totalOverviewWithdraw, 'USD'),
            )}

            {groupHeaderRow(t('riskControlPage.fundWallet'))}
            {rowHtml(
              t('riskControlPage.fundWalletDeposit'),
              row => formatMoney(row.walletDeposit, 'USD'),
              formatMoney(totalWalletDeposit, 'USD'),
            )}
            {rowHtml(
              t('riskControlPage.fundWalletWithdraw'),
              row => formatMoney(row.walletWithdraw, 'USD'),
              formatMoney(totalWalletWithdraw, 'USD'),
            )}
            {rowHtml(
              t('riskControlPage.fundWalletNetDeposit'),
              row => formatMoney(row.walletNetDeposit, 'USD'),
              formatMoney(totalWalletDeposit - totalWalletWithdraw, 'USD'),
            )}

            {groupHeaderRow(t('riskControlPage.fundAccount'))}
            {rowHtml(
              t('riskControlPage.fundBalance'),
              row => formatMoney(row.balance, row.currency),
              formatMoney(totalBalance, singleCurrency || 'USD'),
            )}
            {rowHtml(
              t('riskControlPage.fundAccountDeposit'),
              row => formatMoney(row.mtDeposit, row.currency),
              formatMoney(totalMtDeposit, singleCurrency || 'USD'),
            )}
            {rowHtml(
              t('riskControlPage.fundAccountWithdraw'),
              row => formatMoney(row.mtWithdraw, row.currency),
              formatMoney(totalMtWithdraw, singleCurrency || 'USD'),
            )}
            {rowHtml(
              t('riskControlPage.fundAccountNetDeposit'),
              row => formatMoney(row.mtNetDeposit, row.currency),
              formatMoney(totalMtDeposit - totalMtWithdraw, singleCurrency || 'USD'),
            )}

            {groupHeaderRow(t('riskControlPage.compareOrderStatsGroup'))}
            {rowHtml(
              t('riskControlPage.totalOrders'),
              row =>
                `${row.totalClosedCount !== null && row.totalClosedCount !== undefined ? row.totalClosedCount : 0} ${ordersUnit}`,
              `${totalClosed} ${ordersUnit}`,
              { resultFilter: 'all', countFn: row => row.totalClosedCount },
            )}
            {rowHtml(
              t('riskControlPage.profitOrders'),
              row =>
                `${row.profitOrderCount !== null && row.profitOrderCount !== undefined ? row.profitOrderCount : 0} ${ordersUnit}`,
              `${totalProfitCount} ${ordersUnit}`,
              { resultFilter: 'profit', countFn: row => row.profitOrderCount },
            )}
            {rowHtml(
              t('riskControlPage.breakEvenOrders'),
              row =>
                `${row.breakEvenOrderCount !== null && row.breakEvenOrderCount !== undefined ? row.breakEvenOrderCount : 0} ${ordersUnit}`,
              `${totalBreakEvenCount} ${ordersUnit}`,
              { resultFilter: 'breakeven', countFn: row => row.breakEvenOrderCount },
            )}
            {rowHtml(
              t('riskControlPage.lossOrders'),
              row =>
                `${row.lossOrderCount !== null && row.lossOrderCount !== undefined ? row.lossOrderCount : 0} ${ordersUnit}`,
              `${totalLossCount} ${ordersUnit}`,
              { resultFilter: 'loss', countFn: row => row.lossOrderCount },
            )}
            {rowHtml(
              t('riskControlPage.totalVolume'),
              row =>
                `${row.totalVolume !== null && row.totalVolume !== undefined ? Number(row.totalVolume).toFixed(2) : '0.00'} ${lotsUnit}`,
              `${totalVolume.toFixed(2)} ${lotsUnit}`,
            )}

            {groupHeaderRow(t('riskControlPage.compareCommissionProfitGroup'))}
            {rowHtml(
              t('riskControlPage.totalProfit'),
              row => formatMoney(row.totalTradeProfit, row.currency),
              formatMoney(totalTradeProfit, singleCurrency || 'USD'),
            )}
            {rowHtml(
              t('riskControlPage.totalCommission'),
              row => formatMoney(row.totalRebateCommission, 'USD'),
              formatMoney(totalRebateCommission, 'USD'),
            )}
            {rowHtml(
              t('riskControlPage.compareSelfRebate'),
              row => formatMoney(row.selfRebateCommission, 'USD'),
              formatMoney(totalSelfRebate, 'USD'),
            )}
            {rowHtml(
              t('riskControlPage.rewardBonusToReal'),
              row => formatMoney(row.bonusToReal, row.currency),
              formatMoney(totalBonusToReal, singleCurrency || 'USD'),
            )}
            {rowHtml(
              t('riskControlPage.profitRate'),
              row => formatPercent(row.profitRate),
              totalProfitRate,
            )}
            {rowHtml(
              t('riskControlPage.profitRateWithCommission'),
              row => formatPercent(row.profitRateWithCommission),
              totalProfitRateWithCommission,
            )}

            {groupHeaderRow(t('riskControlPage.sectionTradingBehavior'))}
            {rowHtml(
              t('riskControlPage.compareUnder1Min'),
              row => countRateCell(row.under1MinCount, row.under1MinRate),
              totalCountRateCell(totalUnder1),
            )}
            {rowHtml(
              t('riskControlPage.compareUnder3Min'),
              row => countRateCell(row.under3MinCount, row.under3MinRate),
              totalCountRateCell(totalUnder3),
            )}
            {rowHtml(
              t('riskControlPage.compareReverse5Min'),
              row => countRateCell(row.reverseCount, row.reverseRate),
              totalCountRateCell(totalReverse),
            )}

            {groupHeaderRow(
              t('riskControlPage.compareLockGroupTitle', {
                self: selfThresholdSeconds,
                agent: agentThresholdSeconds,
              }),
            )}
            {rowHtml(
              t('riskControlPage.lockSelfVolume'),
              row =>
                row.selfLockVolume !== null && row.selfLockVolume !== undefined
                  ? `${Number(row.selfLockVolume).toFixed(2)} ${lotsUnit}`
                  : null,
              `${totalSelfLock.toFixed(2)} ${lotsUnit}`,
            )}
            {rowHtml(
              t('riskControlPage.lockSelfRate'),
              row => formatPercent(row.selfLockRate),
              totalSelfLockRate,
            )}
            {rowHtml(
              t('riskControlPage.lockAgentVolume'),
              row =>
                row.agentLockVolume !== null && row.agentLockVolume !== undefined
                  ? `${Number(row.agentLockVolume).toFixed(2)} ${lotsUnit}`
                  : null,
              `${totalAgentLock.toFixed(2)} ${lotsUnit}`,
            )}
            {rowHtml(
              t('riskControlPage.lockAgentRate'),
              row => formatPercent(row.agentLockRate),
              totalAgentLockRate,
            )}
          </tbody>
        </table>
      </div>
    );
  },
);

RiskComparisonTable.displayName = 'RiskComparisonTable';
