import { RiskAccountRow, RiskChainNode } from '@/api/hooks/review';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Eye, Network } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RiskChainTab,
  RiskOrderDialogTarget,
  formatCountRate,
  formatMoney,
  formatPercent,
} from './riskControlUtils';

type FieldRowProps = {
  label: string;
  value: ReactNode;
  hint?: string;
  action?: ReactNode;
};

const FieldRow = ({ label, value, hint, action }: FieldRowProps) => (
  <div className="flex flex-col gap-0.5 py-1">
    <div className="flex items-start gap-2 text-sm">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="break-all">
        {value === null || value === undefined || value === '' ? (
          <span className="text-muted-foreground/60">-</span>
        ) : (
          value
        )}
      </span>
      {action}
    </div>
    {hint && value !== null && value !== undefined && value !== '' && (
      <span className="text-destructive text-xs">{hint}</span>
    )}
  </div>
);

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="border-border/60 border-t py-3 first:border-t-0 first:pt-0 last:pb-0">
    <h4 className="mb-2 text-sm font-semibold">{title}</h4>
    {children}
  </section>
);

export const RiskAccountDetailCard = ({
  row,
  headerTag,
  periodLabel,
  selfThresholdSeconds,
  agentThresholdSeconds,
  onViewOrders,
  onViewFullChain,
}: {
  row: RiskAccountRow | null;
  headerTag: string;
  periodLabel: string;
  selfThresholdSeconds: number;
  agentThresholdSeconds: number;
  onViewOrders: (target: RiskOrderDialogTarget) => void;
  onViewFullChain: (row: RiskAccountRow) => void;
}) => {
  const { t } = useTranslation();
  const [chainTab, setChainTab] = useState<RiskChainTab>('direct');

  if (!row) {
    return (
      <div className="bg-card text-muted-foreground rounded-lg p-8 text-center text-sm">
        {t('riskControlPage.detailNoData')}
      </div>
    );
  }

  const ordersUnit = t('riskControlPage.unitOrders');
  const lotsUnit = t('riskControlPage.unitLots');

  const chainLevelLabel = (kind: RiskChainTab, index: number) => {
    if (index === 0) {
      return kind === 'direct'
        ? t('riskControlPage.labelDirectBroker')
        : t('riskControlPage.labelCrmSuperior');
    }
    return t('riskControlPage.labelLevelSuffix', { n: index + 1 });
  };

  const renderChainList = (kind: RiskChainTab, nodes: RiskChainNode[] | null) => {
    if (!nodes || !nodes.length) {
      return (
        <div className="text-muted-foreground py-2 text-xs">{t('riskControlPage.chainEmpty')}</div>
      );
    }
    return nodes.map((node, index) => (
      <FieldRow
        key={`${node.showId}-${index}`}
        label={chainLevelLabel(kind, index)}
        value={`${node.name}(${node.email})`}
      />
    ));
  };

  const orderEye = (
    label: string,
    count: number | string | null | undefined,
    resultFilter: RiskOrderDialogTarget['resultFilter'],
  ) => {
    if (!(Number(count) > 0) || !row.serverId || !row.account) {
      return null;
    }
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-6 shrink-0"
        title={t('riskControlPage.orderModalViewDetail')}
        onClick={() =>
          onViewOrders({
            serverId: row.serverId as string,
            account: row.account,
            resultFilter,
            label,
            crmShowId: row.crmShowId,
            customerName: row.customerName,
          })
        }
      >
        <Eye className="size-3.5" />
      </Button>
    );
  };

  const totalClosedCount = row.totalClosedCount ?? 0;
  const total = Number(row.totalClosedCount) || 0;
  const profitCount = Number(row.profitOrderCount) || 0;
  const breakEvenCount = Number(row.breakEvenOrderCount) || 0;
  const lossCount = Number(row.lossOrderCount) || 0;

  const dist = [
    {
      key: 'profit',
      label: t('riskControlPage.distProfit'),
      count: profitCount,
      barCls: 'bg-emerald-500',
      dotCls: 'bg-emerald-500',
    },
    {
      key: 'breakeven',
      label: t('riskControlPage.distBreakEven'),
      count: breakEvenCount,
      barCls: 'bg-slate-400',
      dotCls: 'bg-slate-400',
    },
    {
      key: 'loss',
      label: t('riskControlPage.distLoss'),
      count: lossCount,
      barCls: 'bg-red-500',
      dotCls: 'bg-red-500',
    },
  ].map(item => ({ ...item, pct: total > 0 ? ((item.count / total) * 100).toFixed(1) : '0.0' }));

  return (
    <div className="bg-card rounded-lg p-3 md:rounded-2xl md:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs">
            {headerTag}
          </span>
          <h3 className="text-base font-semibold">
            {row.customerName} · {row.account}
          </h3>
        </div>
        <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs">
          {periodLabel} {t('riskControlPage.detailDataSuffix')}
        </span>
      </div>

      <Section title={t('riskControlPage.sectionCustomerAccount')}>
        <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
          <div>
            <h5 className="text-muted-foreground py-1 text-xs font-semibold">
              {t('riskControlPage.identityCrmInfo')}
            </h5>
            <FieldRow label={t('riskControlPage.identityCrmId')} value={row.crmShowId} />
            <FieldRow label={t('riskControlPage.identityName')} value={row.customerName} />
            <h5 className="text-muted-foreground py-1 pt-3 text-xs font-semibold">
              {t('riskControlPage.identityAccountInfo')}
            </h5>
            <FieldRow label={t('table.account')} value={row.account} />
            <FieldRow label={t('common.server')} value={row.serverName} />
            <FieldRow label={t('table.accountGroup')} value={row.group} />
            <FieldRow label={t('riskControlPage.identityCurrency')} value={row.currency} />
          </div>
          <div>
            <div className="flex items-center justify-between gap-2 py-1">
              <h5 className="text-muted-foreground text-xs font-semibold">
                {t('riskControlPage.identityAgentInfo')}
              </h5>
              <div className="flex items-center gap-2">
                <div className="bg-muted flex rounded-md p-0.5">
                  {(['direct', 'crm'] as RiskChainTab[]).map(tab => (
                    <button
                      key={tab}
                      type="button"
                      className={cn(
                        'rounded px-2 py-0.5 text-xs',
                        chainTab === tab
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground',
                      )}
                      onClick={() => setChainTab(tab)}
                    >
                      {tab === 'direct'
                        ? t('riskControlPage.chainDirectTab')
                        : t('riskControlPage.chainCrmTab')}
                    </button>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  title={t('riskControlPage.chainViewFull')}
                  onClick={() => onViewFullChain(row)}
                >
                  <Network className="size-4" />
                </Button>
              </div>
            </div>
            {chainTab === 'direct'
              ? renderChainList('direct', row.directChain)
              : renderChainList('crm', row.crmChain)}
          </div>
        </div>
      </Section>

      <Section title={t('riskControlPage.sectionFunds')}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <h5 className="text-muted-foreground mb-1 text-xs font-semibold">
              {t('riskControlPage.fundOverview')}
            </h5>
            <FieldRow
              label={t('riskControlPage.fundDeposit')}
              value={formatMoney(row.overviewDeposit, 'USD')}
            />
            <FieldRow
              label={t('riskControlPage.fundWithdraw')}
              value={formatMoney(row.overviewWithdraw, 'USD')}
            />
            <FieldRow
              label={t('riskControlPage.fundNetDeposit')}
              value={formatMoney(row.overviewNetDeposit, 'USD')}
            />
          </div>
          <div>
            <h5 className="text-muted-foreground mb-1 text-xs font-semibold">
              {t('riskControlPage.fundWallet')}
            </h5>
            <FieldRow
              label={t('riskControlPage.fundDeposit')}
              value={formatMoney(row.walletDeposit, 'USD')}
            />
            <FieldRow
              label={t('riskControlPage.fundWithdraw')}
              value={formatMoney(row.walletWithdraw, 'USD')}
            />
            <FieldRow
              label={t('riskControlPage.fundNetDeposit')}
              value={formatMoney(row.walletNetDeposit, 'USD')}
            />
          </div>
          <div>
            <h5 className="text-muted-foreground mb-1 text-xs font-semibold">
              {t('riskControlPage.fundAccount')}
            </h5>
            <FieldRow
              label={t('riskControlPage.fundDeposit')}
              value={formatMoney(row.mtDeposit, row.currency)}
            />
            <FieldRow
              label={t('riskControlPage.fundWithdraw')}
              value={formatMoney(row.mtWithdraw, row.currency)}
            />
            <FieldRow
              label={t('riskControlPage.fundNetDeposit')}
              value={formatMoney(row.mtNetDeposit, row.currency)}
            />
            <FieldRow
              label={t('riskControlPage.fundBalance')}
              value={formatMoney(row.balance, row.currency)}
            />
          </div>
        </div>
      </Section>

      <Section title={t('riskControlPage.sectionTradingScale')}>
        <p className="text-muted-foreground mb-2 text-xs">{t('riskControlPage.marginNote')}</p>
        {total > 0 && (
          <div className="mb-3">
            <div className="mb-1 flex flex-wrap items-center gap-3 text-xs">
              <span className="font-medium">
                {t('riskControlPage.distTitle')}
                <span className="text-muted-foreground ml-2 font-normal">
                  {t('riskControlPage.distTotal', { total, unit: ordersUnit })}
                </span>
              </span>
              {dist.map(item => (
                <span key={item.key} className="text-muted-foreground flex items-center gap-1">
                  <i className={cn('inline-block size-2 rounded-full', item.dotCls)} />
                  {item.label} {item.count} {ordersUnit} · {item.pct}%
                </span>
              ))}
            </div>
            <div className="bg-muted flex h-2 w-full overflow-hidden rounded-full">
              {dist.map(item => (
                <span key={item.key} className={item.barCls} style={{ width: `${item.pct}%` }} />
              ))}
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
          <div>
            <FieldRow
              label={t('riskControlPage.totalOrders')}
              value={`${totalClosedCount} ${ordersUnit}`}
              action={orderEye(t('riskControlPage.totalOrders'), row.totalClosedCount, 'all')}
            />
            <FieldRow
              label={t('riskControlPage.profitOrders')}
              value={
                row.profitOrderCount !== null && row.profitOrderCount !== undefined
                  ? `${row.profitOrderCount} ${ordersUnit}`
                  : null
              }
              action={orderEye(t('riskControlPage.profitOrders'), row.profitOrderCount, 'profit')}
            />
            <FieldRow
              label={t('riskControlPage.breakEvenOrders')}
              value={
                row.breakEvenOrderCount !== null && row.breakEvenOrderCount !== undefined
                  ? `${row.breakEvenOrderCount} ${ordersUnit}`
                  : null
              }
              action={orderEye(
                t('riskControlPage.breakEvenOrders'),
                row.breakEvenOrderCount,
                'breakeven',
              )}
            />
            <FieldRow
              label={t('riskControlPage.lossOrders')}
              value={
                row.lossOrderCount !== null && row.lossOrderCount !== undefined
                  ? `${row.lossOrderCount} ${ordersUnit}`
                  : null
              }
              action={orderEye(t('riskControlPage.lossOrders'), row.lossOrderCount, 'loss')}
            />
            <FieldRow
              label={t('riskControlPage.totalVolume')}
              value={
                row.totalVolume !== null && row.totalVolume !== undefined
                  ? `${Number(row.totalVolume).toFixed(2)} ${lotsUnit}`
                  : null
              }
            />
          </div>
          <div>
            <FieldRow
              label={t('riskControlPage.totalProfit')}
              value={formatMoney(row.totalTradeProfit, row.currency)}
            />
            <FieldRow
              label={t('riskControlPage.totalCommission')}
              value={formatMoney(row.totalRebateCommission, 'USD')}
            />
            <FieldRow
              label={t('riskControlPage.totalMargin')}
              value={formatMoney(row.totalMargin, 'USD')}
            />
            <FieldRow
              label={t('riskControlPage.profitRate')}
              value={formatPercent(row.profitRate)}
            />
            <FieldRow
              label={t('riskControlPage.profitRateWithCommission')}
              value={formatPercent(row.profitRateWithCommission)}
            />
          </div>
        </div>
      </Section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="border-border/60 border-t py-3 md:border-t-0 md:py-0">
          <h4 className="mb-2 text-sm font-semibold">
            {t('riskControlPage.sectionTradingBehavior')}
          </h4>
          <FieldRow
            label={t('riskControlPage.behaviorUnder1Min')}
            value={formatCountRate(row.under1MinCount, row.totalClosedCount, row.under1MinRate)}
          />
          <FieldRow
            label={t('riskControlPage.behaviorUnder3Min')}
            value={formatCountRate(row.under3MinCount, row.totalClosedCount, row.under3MinRate)}
          />
          <FieldRow
            label={t('riskControlPage.behaviorReverse5Min')}
            value={formatCountRate(row.reverseCount, row.totalClosedCount, row.reverseRate)}
          />
        </div>
        <div className="border-border/60 border-t py-3 md:border-t-0 md:py-0">
          <h4 className="mb-2 text-sm font-semibold">{t('riskControlPage.sectionLockAgent')}</h4>
          <FieldRow
            label={t('riskControlPage.lockSelfVolume')}
            value={
              row.selfLockVolume !== null && row.selfLockVolume !== undefined
                ? `${Number(row.selfLockVolume).toFixed(2)} ${lotsUnit}`
                : null
            }
            hint={t('riskControlPage.lockReverseTimeHint', { sec: selfThresholdSeconds })}
          />
          <FieldRow
            label={t('riskControlPage.lockSelfRate')}
            value={formatPercent(row.selfLockRate)}
          />
          <FieldRow
            label={t('riskControlPage.lockAgentVolume')}
            value={
              row.agentLockVolume !== null && row.agentLockVolume !== undefined
                ? `${Number(row.agentLockVolume).toFixed(2)} ${lotsUnit}`
                : null
            }
            hint={t('riskControlPage.lockReverseTimeHint', { sec: agentThresholdSeconds })}
          />
          <FieldRow
            label={t('riskControlPage.lockAgentRate')}
            value={formatPercent(row.agentLockRate)}
          />
        </div>
        <div className="border-border/60 border-t py-3 md:border-t-0 md:py-0">
          <h4 className="mb-2 text-sm font-semibold">{t('riskControlPage.sectionRewardBonus')}</h4>
          <FieldRow
            label={t('riskControlPage.rewardSelfRebate')}
            value={formatMoney(row.selfRebateCommission, 'USD')}
          />
          <FieldRow
            label={t('riskControlPage.rewardBonusToReal')}
            value={formatMoney(row.bonusToReal, row.currency)}
            hint={t('riskControlPage.rewardBonusToRealHint')}
          />
        </div>
      </div>
    </div>
  );
};
