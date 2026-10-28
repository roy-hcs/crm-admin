import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Maximize2, Minimize2, Search, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhSelect } from '@/components/common/RrhSelect';
import { cn } from '@/lib/utils';
import { useGetSysConfig } from '@/api/hooks/system/system';
import {
  RiskAccountRow,
  useRiskControlCurrentStat,
  useRiskControlOwnStat,
  useRiskControlUmbrellaStat,
} from '@/api/hooks/review';
import { RiskAccountDetailCard } from './RiskAccountDetailCard';
import { RiskComparisonTable } from './RiskComparisonTable';
import { RiskOrderDetailDialog } from './RiskOrderDetailDialog';
import { RiskFullChainDialog } from './RiskFullChainDialog';
import {
  RISK_DEFAULT_THRESHOLD_KEY,
  RISK_PERIODS,
  RISK_THRESHOLD_PRESETS,
  RiskHierarchy,
  RiskOrderDialogTarget,
  RiskPeriod,
  RiskScope,
  exportTableAsXls,
  formatDate,
  getPeriodRange,
  pad,
} from './riskControlUtils';

const PERIOD_LABEL_KEY: Record<RiskPeriod, string> = {
  '30d': 'period30d',
  '60d': 'period60d',
  '90d': 'period90d',
  '120d': 'period120d',
  month: 'periodMonth',
  all: 'periodAll',
};

const SCOPE_LABEL_KEY: Record<RiskScope, string> = {
  current: 'scopeCurrent',
  own: 'scopeOwn',
  umbrella: 'scopeUmbrella',
};

const HIERARCHY_LABEL_KEY: Record<RiskHierarchy, string> = {
  direct: 'hierarchyDirect',
  all: 'hierarchyAll',
  custom: 'hierarchyCustom',
};

const formatSnapshot = () => {
  const now = new Date();
  return `${formatDate(now)} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};

const Segmented = <T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) => (
  <div className="bg-muted flex w-fit flex-wrap rounded-md p-0.5">
    {options.map(option => (
      <button
        key={option.value}
        type="button"
        className={cn(
          'cursor-pointer rounded px-2.5 py-1 text-xs whitespace-nowrap transition-colors',
          value === option.value
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground',
        )}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
);

const ThresholdField = ({
  label,
  options,
  secondsUnit,
  selectValue,
  customValue,
  defaultThresholdSeconds,
  onSelectChange,
  onCustomChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  secondsUnit: string;
  selectValue: string;
  customValue: string;
  defaultThresholdSeconds: number;
  onSelectChange: (value: string) => void;
  onCustomChange: (value: string) => void;
}) => (
  <div className="flex flex-wrap items-center gap-2">
    <span className="text-muted-foreground w-20 shrink-0 text-xs">{label}</span>
    <RrhSelect
      options={options}
      value={selectValue}
      onValueChange={onSelectChange}
      displayValue={options.find(option => option.value === selectValue)?.label}
      className="h-8 w-44"
    />
    {selectValue === 'custom' && (
      <div className="flex items-center gap-1">
        <Input
          type="number"
          min={1}
          step={1}
          value={customValue}
          placeholder={String(defaultThresholdSeconds)}
          className="h-8 w-24"
          onChange={e => onCustomChange(e.target.value)}
        />
        <span className="text-muted-foreground text-xs">{secondsUnit}</span>
      </div>
    )}
  </div>
);

type RiskControlPanelProps = {
  userId: string;
  login: string;
  serverId: string;
  walletCurrency: string;
  defaultThresholdSeconds: number;
  onExpandedChange: (expanded: boolean) => void;
};

const RiskControlPanel = ({
  userId,
  login,
  serverId,
  walletCurrency,
  defaultThresholdSeconds,
  onExpandedChange,
}: RiskControlPanelProps) => {
  const { t } = useTranslation();
  const hasDefaultPreset = RISK_THRESHOLD_PRESETS.includes(defaultThresholdSeconds);

  const [scope, setScope] = useState<RiskScope>('current');
  const [period, setPeriod] = useState<RiskPeriod>('30d');
  const [selfSelect, setSelfSelect] = useState(
    hasDefaultPreset ? String(defaultThresholdSeconds) : 'custom',
  );
  const [selfCustom, setSelfCustom] = useState(String(defaultThresholdSeconds));
  const [agentSelect, setAgentSelect] = useState(
    hasDefaultPreset ? String(defaultThresholdSeconds) : 'custom',
  );
  const [agentCustom, setAgentCustom] = useState(String(defaultThresholdSeconds));
  const [appliedSelfSeconds, setAppliedSelfSeconds] = useState(defaultThresholdSeconds);
  const [appliedAgentSeconds, setAppliedAgentSeconds] = useState(defaultThresholdSeconds);
  const [snapshotAt, setSnapshotAt] = useState(formatSnapshot);
  const [hierarchy, setHierarchy] = useState<RiskHierarchy>('direct');
  const [customDepth, setCustomDepth] = useState(2);
  const [ownSelectedAccount, setOwnSelectedAccount] = useState('all');
  const [umbrellaSearch, setUmbrellaSearch] = useState('');
  const [includeCurrentCrm, setIncludeCurrentCrm] = useState(false);
  const [umbrellaExpanded, setUmbrellaExpanded] = useState(false);
  const [orderTarget, setOrderTarget] = useState<RiskOrderDialogTarget | null>(null);
  const [orderOpen, setOrderOpen] = useState(false);
  const [chainRow, setChainRow] = useState<RiskAccountRow | null>(null);
  const [chainOpen, setChainOpen] = useState(false);

  const ownTableRef = useRef<HTMLTableElement>(null);
  const umbrellaTableRef = useRef<HTMLTableElement>(null);

  const periodLabel = t(`riskControlPage.${PERIOD_LABEL_KEY[period]}`);
  const secondsUnit = t('riskControlPage.unitSeconds');

  const range = useMemo(() => getPeriodRange(period), [period]);
  const statParams = useMemo(
    () => ({
      startTime: range.start,
      endTime: range.end,
      selfThresholdSeconds: appliedSelfSeconds,
      agentThresholdSeconds: appliedAgentSeconds,
    }),
    [range, appliedSelfSeconds, appliedAgentSeconds],
  );

  const ownQuery = useRiskControlOwnStat(userId, statParams, {
    enabled: scope === 'own' || (scope === 'umbrella' && includeCurrentCrm),
  });
  const currentQuery = useRiskControlCurrentStat(
    userId,
    {
      ...statParams,
      login: login || '',
      serverId: serverId || '',
      walletCurrency: walletCurrency || '',
    },
    { enabled: scope === 'current' },
  );
  const umbrellaQuery = useRiskControlUmbrellaStat(
    userId,
    {
      ...statParams,
      hierarchy,
      depth: hierarchy === 'custom' ? customDepth : undefined,
    },
    { enabled: scope === 'umbrella' },
  );

  useEffect(() => {
    setSnapshotAt(formatSnapshot());
  }, [scope, period, appliedSelfSeconds, appliedAgentSeconds, hierarchy, customDepth]);

  // 切换出风控 tab 时组件卸载，需要把父页面的放大状态复位
  useEffect(() => () => onExpandedChange(false), [onExpandedChange]);

  const switchScope = (next: RiskScope) => {
    setScope(next);
    if (next === 'own') {
      setOwnSelectedAccount('all');
    }
    if (next !== 'umbrella' && umbrellaExpanded) {
      setUmbrellaExpanded(false);
      onExpandedChange(false);
    }
  };

  const readThreshold = (select: string, custom: string) => {
    if (select !== 'custom') {
      return Number(select);
    }
    const parsed = parseInt(custom, 10);
    return !parsed || parsed <= 0 ? defaultThresholdSeconds : parsed;
  };

  const applyQuery = () => {
    setAppliedSelfSeconds(readThreshold(selfSelect, selfCustom));
    setAppliedAgentSeconds(readThreshold(agentSelect, agentCustom));
    setSnapshotAt(formatSnapshot());
  };

  const toggleExpand = () => {
    const next = !umbrellaExpanded;
    setUmbrellaExpanded(next);
    onExpandedChange(next);
  };

  const openOrders = (target: RiskOrderDialogTarget) => {
    setOrderTarget(target);
    setOrderOpen(true);
  };

  const openFullChain = (row: RiskAccountRow) => {
    setChainRow(row);
    setChainOpen(true);
  };

  const thresholdOptions = [
    ...RISK_THRESHOLD_PRESETS.map(seconds => ({
      value: String(seconds),
      label:
        seconds === defaultThresholdSeconds
          ? `${seconds}${secondsUnit} ${t('riskControlPage.hedgeDefaultSuffix')}`
          : `${seconds}${secondsUnit}`,
    })),
    { value: 'custom', label: t('riskControlPage.hedgeCustomOption') },
  ];

  const depthOptions = [1, 2, 3, 4].map(depth => ({
    value: String(depth),
    label: t(`riskControlPage.depth${depth}`),
  }));

  const ownRows = ownQuery.data || [];
  const umbrellaRows = umbrellaQuery.data || [];
  const effectiveUmbrellaRows =
    includeCurrentCrm && ownQuery.data ? ownQuery.data.concat(umbrellaRows) : umbrellaRows;
  const ownSelectedRow =
    ownRows.find(row => `${row.serverId}|${row.account}` === ownSelectedAccount) || null;

  const loading = (
    <div className="text-muted-foreground py-8 text-center text-sm">
      {t('riskControlPage.commonLoading')}
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-card rounded-lg p-3 md:rounded-2xl md:p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-semibold">{t('riskControlPage.panelTitle')}</h3>
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <span>{t('riskControlPage.snapshotLabel')}</span>
            <strong className="text-foreground">{snapshotAt}</strong>
          </div>
        </div>

        <div className="mb-3 grid gap-3 md:grid-cols-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground text-xs">{t('riskControlPage.scopeLabel')}</span>
            <Segmented
              options={(['current', 'own', 'umbrella'] as RiskScope[]).map(value => ({
                value,
                label: t(`riskControlPage.${SCOPE_LABEL_KEY[value]}`),
              }))}
              value={scope}
              onChange={switchScope}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            <span className="text-muted-foreground text-xs">
              {t('riskControlPage.periodLabel')}
            </span>
            <Segmented
              options={RISK_PERIODS.map(value => ({
                value,
                label: t(`riskControlPage.${PERIOD_LABEL_KEY[value]}`),
              }))}
              value={period}
              onChange={setPeriod}
            />
          </div>
        </div>

        <div className="border-border/60 rounded-lg border p-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <strong className="text-sm">{t('riskControlPage.hedgeTitle')}</strong>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {t('riskControlPage.hedgeDesc')}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground text-xs">
                {t('riskControlPage.hedgeStatus', {
                  self: appliedSelfSeconds,
                  agent: appliedAgentSeconds,
                })}
              </span>
              <RrhButton
                type="button"
                className="h-8 px-3 py-1 text-xs"
                Icon={<Search className="size-3.5" />}
                onClick={applyQuery}
              >
                {t('riskControlPage.queryBtn')}
              </RrhButton>
            </div>
          </div>
          <div className="mt-2 grid gap-3 md:grid-cols-2">
            <ThresholdField
              label={t('riskControlPage.hedgeSelf')}
              options={thresholdOptions}
              secondsUnit={secondsUnit}
              selectValue={selfSelect}
              customValue={selfCustom}
              defaultThresholdSeconds={defaultThresholdSeconds}
              onSelectChange={setSelfSelect}
              onCustomChange={setSelfCustom}
            />
            <ThresholdField
              label={t('riskControlPage.hedgeAgent')}
              options={thresholdOptions}
              secondsUnit={secondsUnit}
              selectValue={agentSelect}
              customValue={agentCustom}
              defaultThresholdSeconds={defaultThresholdSeconds}
              onSelectChange={setAgentSelect}
              onCustomChange={setAgentCustom}
            />
          </div>
        </div>
      </div>

      {scope === 'current' &&
        (currentQuery.isLoading ? (
          loading
        ) : (
          <>
            {!currentQuery.data && login ? (
              <div className="text-muted-foreground text-xs">
                {t('riskControlPage.currentNotFound', { login })}
              </div>
            ) : null}
            <RiskAccountDetailCard
              row={currentQuery.data ?? null}
              headerTag={t('riskControlPage.headerTagWithdraw')}
              periodLabel={periodLabel}
              selfThresholdSeconds={appliedSelfSeconds}
              agentThresholdSeconds={appliedAgentSeconds}
              onViewOrders={openOrders}
              onViewFullChain={openFullChain}
            />
          </>
        ))}

      {scope === 'own' &&
        (ownQuery.isLoading ? (
          loading
        ) : (
          <section className="bg-card rounded-lg p-3 md:rounded-2xl md:p-6">
            <header className="mb-3 flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-semibold">{t('riskControlPage.ownSectionTitle')}</h3>
                <p className="text-muted-foreground text-xs">
                  {t('riskControlPage.ownSubtitle', {
                    crmShowId: ownRows[0]?.crmShowId || userId,
                    count: ownRows.length,
                  })}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs">
                  {ownRows.length} {t('riskControlPage.unitAccounts')}
                </span>
                {ownSelectedAccount === 'all' && (
                  <RrhButton
                    type="button"
                    variant="outline"
                    className="h-8 px-3 py-1 text-xs"
                    Icon={<Download className="size-3.5" />}
                    disabled={!ownRows.length}
                    onClick={() => {
                      if (ownTableRef.current) {
                        exportTableAsXls(ownTableRef.current, t('riskControlPage.scopeOwn'));
                      }
                    }}
                  >
                    {t('riskControlPage.exportBtn')}
                  </RrhButton>
                )}
              </div>
            </header>

            <div className="mb-3 flex flex-wrap gap-2">
              <button
                type="button"
                className={cn(
                  'cursor-pointer rounded-md border px-3 py-1 text-xs transition-colors',
                  ownSelectedAccount === 'all'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-muted',
                )}
                onClick={() => setOwnSelectedAccount('all')}
              >
                {t('riskControlPage.ownAllAccounts')}
              </button>
              {ownRows.map(row => {
                const key = `${row.serverId}|${row.account}`;
                return (
                  <button
                    key={key}
                    type="button"
                    className={cn(
                      'cursor-pointer rounded-md border px-3 py-1 text-left text-xs transition-colors',
                      ownSelectedAccount === key
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background hover:bg-muted',
                    )}
                    onClick={() => setOwnSelectedAccount(key)}
                  >
                    <strong className="block">{row.account}</strong>
                    <span className="block text-[10px] opacity-70">{row.serverName}</span>
                  </button>
                );
              })}
            </div>

            {ownSelectedAccount === 'all' ? (
              <RiskComparisonTable
                ref={ownTableRef}
                rows={ownRows}
                emptyText={t('riskControlPage.ownNoAccountData')}
                selfThresholdSeconds={appliedSelfSeconds}
                agentThresholdSeconds={appliedAgentSeconds}
                onViewOrders={openOrders}
              />
            ) : (
              <RiskAccountDetailCard
                row={ownSelectedRow}
                headerTag={t('riskControlPage.headerTagOwn')}
                periodLabel={periodLabel}
                selfThresholdSeconds={appliedSelfSeconds}
                agentThresholdSeconds={appliedAgentSeconds}
                onViewOrders={openOrders}
                onViewFullChain={openFullChain}
              />
            )}
          </section>
        ))}

      {scope === 'umbrella' &&
        (umbrellaQuery.isLoading ? (
          loading
        ) : (
          <section className="bg-card rounded-lg p-3 md:rounded-2xl md:p-6">
            <header className="mb-3 flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-semibold">
                  {t('riskControlPage.umbrellaSectionTitle')}
                </h3>
                <p className="text-muted-foreground text-xs">
                  {t('riskControlPage.umbrellaSubtitle')}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs">
                  {t('riskControlPage.umbrellaSummary', {
                    crmCount: new Set(effectiveUmbrellaRows.map(row => row.crmShowId)).size,
                    accountCount: effectiveUmbrellaRows.length,
                  })}
                </span>
                <RrhButton
                  type="button"
                  variant="outline"
                  className="h-8 px-3 py-1 text-xs"
                  Icon={<Download className="size-3.5" />}
                  disabled={!effectiveUmbrellaRows.length}
                  onClick={() => {
                    if (umbrellaTableRef.current) {
                      exportTableAsXls(
                        umbrellaTableRef.current,
                        t('riskControlPage.umbrellaSectionTitle'),
                      );
                    }
                  }}
                >
                  {t('riskControlPage.exportBtn')}
                </RrhButton>
                <RrhButton
                  type="button"
                  variant="outline"
                  className="h-8 px-3 py-1 text-xs"
                  Icon={
                    umbrellaExpanded ? (
                      <Minimize2 className="size-3.5" />
                    ) : (
                      <Maximize2 className="size-3.5" />
                    )
                  }
                  onClick={toggleExpand}
                >
                  {umbrellaExpanded
                    ? t('riskControlPage.umbrellaCollapse')
                    : t('riskControlPage.umbrellaExpand')}
                </RrhButton>
              </div>
            </header>

            <div className="mb-3 flex flex-wrap items-end gap-3">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">
                  {t('riskControlPage.umbrellaHierarchyLabel')}
                </span>
                <Segmented
                  options={(['direct', 'all', 'custom'] as RiskHierarchy[]).map(value => ({
                    value,
                    label: t(`riskControlPage.${HIERARCHY_LABEL_KEY[value]}`),
                  }))}
                  value={hierarchy}
                  onChange={setHierarchy}
                />
              </div>
              {hierarchy === 'custom' && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">
                    {t('riskControlPage.umbrellaDepthLabel')}
                  </span>
                  <RrhSelect
                    options={depthOptions}
                    value={String(customDepth)}
                    onValueChange={value => setCustomDepth(Number(value) || 2)}
                    displayValue={t(`riskControlPage.depth${customDepth}`)}
                    className="h-8 w-32"
                  />
                </div>
              )}
              <div className="flex min-w-56 flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-muted-foreground text-xs">
                    {t('riskControlPage.umbrellaSearchLabel')}
                  </span>
                  <label className="flex items-center gap-1 text-xs">
                    <Checkbox
                      checked={includeCurrentCrm}
                      onCheckedChange={checked => setIncludeCurrentCrm(checked === true)}
                    />
                    {t('riskControlPage.umbrellaIncludeCurrentCrm')}
                  </label>
                </div>
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-1/2 left-2 size-3.5 -translate-y-1/2" />
                  <Input
                    value={umbrellaSearch}
                    className="h-8 pl-7"
                    placeholder={t('riskControlPage.umbrellaSearchPlaceholder')}
                    onChange={e => setUmbrellaSearch(e.target.value)}
                  />
                  {umbrellaSearch && (
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
                      onClick={() => setUmbrellaSearch('')}
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <RiskComparisonTable
              ref={umbrellaTableRef}
              rows={effectiveUmbrellaRows}
              emptyText={t('riskControlPage.umbrellaNoDownlineData')}
              filterKeyword={umbrellaSearch}
              selfThresholdSeconds={appliedSelfSeconds}
              agentThresholdSeconds={appliedAgentSeconds}
              onViewOrders={openOrders}
            />
          </section>
        ))}

      <RiskOrderDetailDialog
        open={orderOpen}
        onOpenChange={setOrderOpen}
        target={orderTarget}
        periodLabel={periodLabel}
        startTime={range.start}
        endTime={range.end}
      />
      <RiskFullChainDialog open={chainOpen} onOpenChange={setChainOpen} row={chainRow} />
    </div>
  );
};

export const RiskControlTab = ({
  userId,
  login,
  serverId,
  walletCurrency,
  onExpandedChange,
}: {
  userId: string;
  login?: string | null;
  serverId?: string | null;
  walletCurrency?: string | null;
  onExpandedChange: (expanded: boolean) => void;
}) => {
  const { data: configRes } = useGetSysConfig(RISK_DEFAULT_THRESHOLD_KEY);
  const rawValue = (configRes as unknown as { data?: number | string } | undefined)?.data;
  const parsed = Number(rawValue);
  const defaultThresholdSeconds = Number.isFinite(parsed) && parsed > 0 ? parsed : 5;

  return (
    <RiskControlPanel
      key={defaultThresholdSeconds}
      userId={userId}
      login={login || ''}
      serverId={serverId || ''}
      walletCurrency={walletCurrency || ''}
      defaultThresholdSeconds={defaultThresholdSeconds}
      onExpandedChange={onExpandedChange}
    />
  );
};
