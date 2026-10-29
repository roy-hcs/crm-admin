import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Search, X } from 'lucide-react';
import { RrhDialog } from '@/components/common/RrhDialog';
import { Input } from '@/components/ui/input';
import { useAgentScopeCandidateSearch } from '@/api/hooks/setting/platform';
import { AgentScopeRef, AgentScopeRule } from '@/api/hooks/setting/types';

const RANGE_MONTHS: Record<number, number> = { 1: 1, 2: 3, 3: 6, 4: 12 };

const addMonths = (date: Date, months: number) => {
  const next = new Date(date.getTime());
  const day = next.getDate();
  next.setMonth(next.getMonth() + months);
  if (next.getDate() < day) next.setDate(0);
  return next;
};

const formatDate = (date: Date) => {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

export const AgentScopeRuleDialog = ({
  open,
  setOpen,
  rule,
  onSubmit,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  rule?: AgentScopeRule | null;
  onSubmit: (rule: AgentScopeRule) => void;
}) => {
  const { t } = useTranslation();
  const [rangeType, setRangeType] = useState<number>(1);
  const [customDays, setCustomDays] = useState('30');
  const [applyMode, setApplyMode] = useState<'specified' | 'sub'>('specified');
  const [selected, setSelected] = useState<AgentScopeRef[]>([]);
  const [keyword, setKeyword] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState('');

  const { data: candidates, isFetching } = useAgentScopeCandidateSearch(appliedKeyword);

  useEffect(() => {
    if (!open) return;
    setRangeType(rule?.rangeType ?? 1);
    setCustomDays(rule?.customDays ? String(rule.customDays) : '30');
    setApplyMode(rule?.applySub === 1 ? 'sub' : 'specified');
    setSelected(rule?.agentList ? rule.agentList.map(item => ({ ...item })) : []);
    setKeyword('');
    setAppliedKeyword('');
  }, [open, rule]);

  const scopeOptions = useMemo(
    () => [
      { value: '1', label: t('agentDataScope.range.recentMonth') },
      { value: '2', label: t('agentDataScope.range.recent3Month') },
      { value: '3', label: t('agentDataScope.range.recent6Month') },
      { value: '4', label: t('agentDataScope.range.recent1Year') },
      { value: '0', label: t('agentDataScope.range.allTime') },
      { value: '99', label: t('agentDataScope.range.custom') },
    ],
    [t],
  );

  const periodText = useMemo(() => {
    if (rangeType === 0) return t('agentDataScope.range.unlimited');
    const end = new Date();
    let start = new Date();
    if (rangeType === 99) {
      const days = Number(customDays) || 1;
      start.setDate(end.getDate() - (days - 1));
    } else {
      const months = RANGE_MONTHS[rangeType] ?? 0;
      start = addMonths(end, -months);
      start.setDate(start.getDate() + 1);
    }
    return `${formatDate(start)} — ${formatDate(end)}`;
  }, [rangeType, customDays, t]);

  const isSelected = (id: string) => selected.some(item => item.id === id);

  const toggleCandidate = (item: AgentScopeRef) => {
    setSelected(prev =>
      prev.some(exist => exist.id === item.id)
        ? prev.filter(exist => exist.id !== item.id)
        : [...prev, item],
    );
  };

  const handleSubmit = () => {
    if (rangeType === 99 && !(Number(customDays) > 0)) {
      toast.error(t('agentDataScope.rule.inputDays'));
      return;
    }
    if (selected.length === 0) {
      toast.error(t('agentDataScope.rule.selectAgentRequired'));
      return;
    }
    onSubmit({
      id: rule?.id ?? null,
      rangeType,
      customDays: rangeType === 99 ? Number(customDays) : null,
      applySpecified: applyMode === 'specified' ? 1 : 0,
      applySub: applyMode === 'sub' ? 1 : 0,
      agentList: selected,
    });
    setOpen(false);
  };

  return (
    <RrhDialog
      open={open}
      onOpenChange={setOpen}
      title={
        rule?.id ? t('agentDataScope.rule.modalTitleEdit') : t('agentDataScope.rule.modalTitle')
      }
      variant="adaptive"
      type="submit"
      confirmText={t('agentDataScope.rule.applyDraft')}
      onConfirm={handleSubmit}
    >
      <div className="w-[720px] max-w-full py-4 text-sm">
        <div className="text-muted-foreground mb-3">{t('agentDataScope.rule.modalSub')}</div>

        <div className="mb-2 font-semibold">{t('agentDataScope.rule.chooseScope')}</div>
        <div className="grid grid-cols-3 gap-2">
          {scopeOptions.map(option => (
            <button
              key={option.value}
              type="button"
              className={`cursor-pointer rounded-md border px-3 py-2 text-left ${
                String(rangeType) === option.value ? 'border-primary text-primary' : ''
              }`}
              onClick={() => setRangeType(Number(option.value))}
            >
              {option.label}
            </button>
          ))}
        </div>

        {rangeType === 99 && (
          <div className="mt-3 flex items-center gap-2">
            <span>{t('agentDataScope.range.days')}</span>
            <Input
              className="h-8 w-32"
              value={customDays}
              placeholder={t('agentDataScope.rule.customDaysPlaceholder')}
              onChange={e => setCustomDays(e.target.value.replace(/[^\d]/g, ''))}
            />
            <span>{t('agentDataScope.rule.dayUnit')}</span>
          </div>
        )}

        <div className="text-muted-foreground mt-2 text-xs">
          {t('agentDataScope.rule.scopePeriod')}: {periodText}
        </div>

        <div className="mt-4 mb-2 font-semibold">{t('agentDataScope.rule.applyAccounts')}</div>
        <div className="flex gap-2">
          <button
            type="button"
            className={`flex-1 cursor-pointer rounded-md border px-3 py-2 text-left ${
              applyMode === 'specified' ? 'border-primary text-primary' : ''
            }`}
            onClick={() => setApplyMode('specified')}
          >
            <div className="font-semibold">{t('agentDataScope.rule.specified')}</div>
            <div className="text-muted-foreground text-xs">
              {t('agentDataScope.rule.specifiedDesc')}
            </div>
          </button>
          <button
            type="button"
            className={`flex-1 cursor-pointer rounded-md border px-3 py-2 text-left ${
              applyMode === 'sub' ? 'border-primary text-primary' : ''
            }`}
            onClick={() => setApplyMode('sub')}
          >
            <div className="font-semibold">{t('agentDataScope.rule.andSub')}</div>
            <div className="text-muted-foreground text-xs">
              {t('agentDataScope.rule.andSubDesc')}
            </div>
          </button>
        </div>

        <div className="mt-3 font-semibold">{t('agentDataScope.rule.chooseAgent')}</div>
        <div className="mt-1 flex items-center gap-2">
          <Input
            className="h-8"
            value={keyword}
            placeholder={t('agentDataScope.rule.searchPlaceholder')}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') setAppliedKeyword(keyword.trim());
            }}
          />
          <button
            type="button"
            className="border-primary text-primary flex h-8 cursor-pointer items-center gap-1 rounded-md border px-3"
            onClick={() => setAppliedKeyword(keyword.trim())}
          >
            <Search className="size-3.5" />
            {t('common.Search')}
          </button>
        </div>

        <div className="mt-2 max-h-44 overflow-y-auto rounded-md border">
          {!appliedKeyword ? (
            <div className="text-muted-foreground p-4 text-center text-xs">
              {t('agentDataScope.searchFirst')}
            </div>
          ) : isFetching ? (
            <div className="text-muted-foreground p-4 text-center text-xs">
              {t('common.loading')}
            </div>
          ) : (candidates?.rows || []).length === 0 ? (
            <div className="text-muted-foreground p-4 text-center text-xs">
              {t('agentDataScope.noResult')}
            </div>
          ) : (
            (candidates?.rows || []).map(item => (
              <label
                key={item.id}
                className="hover:bg-muted/50 flex cursor-pointer items-center gap-2 border-b px-3 py-2 last:border-b-0"
              >
                <input
                  type="checkbox"
                  className="accent-primary"
                  checked={isSelected(item.id)}
                  onChange={() =>
                    toggleCandidate({ id: item.id, name: item.userName, showId: item.showId })
                  }
                />
                <span className="text-muted-foreground text-xs">
                  {t(
                    `common.account.type.${item.accountType === 2 ? 'agent' : item.accountType === 3 ? 'business' : 'sale'}`,
                  )}
                </span>
                <span>{item.userName}</span>
                {item.showId && (
                  <span className="text-muted-foreground text-xs">{item.showId}</span>
                )}
              </label>
            ))
          )}
        </div>

        <div className="mt-3 font-semibold">{t('agentDataScope.rule.selectedAccounts')}</div>
        <div className="mt-1 flex flex-wrap gap-2">
          {selected.length === 0 ? (
            <span className="text-muted-foreground text-xs">-</span>
          ) : (
            selected.map(item => (
              <span
                key={item.id}
                className="bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs"
              >
                {item.name}
                {item.showId ? ` (${item.showId})` : ''}
                <button
                  type="button"
                  className="cursor-pointer"
                  onClick={() => toggleCandidate(item)}
                >
                  <X className="size-3" />
                </button>
              </span>
            ))
          )}
        </div>
      </div>
    </RrhDialog>
  );
};
