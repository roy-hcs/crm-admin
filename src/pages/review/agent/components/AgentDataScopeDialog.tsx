import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { RrhDialog } from '@/components/common/RrhDialog';
import { RrhSelect } from '@/components/common/RrhSelect';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { Input } from '@/components/ui/input';
import {
  useAgentDataScopeSetting,
  useAgentScopeCoverCount,
  useAgentScopeSubordinateList,
  useSaveAgentDataScope,
} from '@/api/hooks/setting/platform';
import { AgentDataScopeSetting, AgentScopeRule } from '@/api/hooks/setting/types';
import { AgentScopeRuleDialog } from './AgentScopeRuleDialog';

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

const SubordinateList = ({ agentId }: { agentId: string }) => {
  const { t } = useTranslation();
  const { data, isLoading } = useAgentScopeSubordinateList(agentId, true);
  const rows = data?.rows || [];
  if (isLoading) {
    return <div className="text-muted-foreground pl-4 text-xs">{t('common.loading')}</div>;
  }
  if (rows.length === 0) {
    return (
      <div className="text-muted-foreground pl-4 text-xs">{t('agentDataScope.range.noSub')}</div>
    );
  }
  return (
    <div className="flex flex-col gap-0.5 pl-4">
      {rows.map(item => (
        <div key={item.id} className="text-muted-foreground text-xs">
          {item.userName}
          {item.showId ? ` (${item.showId})` : ''}
        </div>
      ))}
    </div>
  );
};

/**
 * 代理业务数据可见范围
 * 对应旧版 system/config/agency_register_setting.html tab2
 */
export const AgentDataScopeDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useAgentDataScopeSetting(open);
  const { mutateAsync: save, isPending } = useSaveAgentDataScope();
  const { mutate: countCover } = useAgentScopeCoverCount();

  const [rangeType, setRangeType] = useState('0');
  const [customDays, setCustomDays] = useState('');
  const [rules, setRules] = useState<AgentScopeRule[]>([]);
  const [coverCount, setCoverCount] = useState<number | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [expandedIndex, setExpandedIndex] = useState(-1);

  useEffect(() => {
    if (!open) {
      setInitialized(false);
      return;
    }
    if (!data || initialized) return;
    // 兼容 AjaxResult 包装（{code,msg,data}）与直接返回 VO 两种形态
    const wrapped = data as { data?: AgentDataScopeSetting | null };
    const setting: Partial<AgentDataScopeSetting> =
      wrapped.data && typeof wrapped.data === 'object'
        ? wrapped.data
        : (data as unknown as Partial<AgentDataScopeSetting>);
    const type = String(setting.dataScopeRangeType ?? '0');
    setRangeType(type === '' ? '0' : type);
    setCustomDays(setting.dataScopeCustomDays ? String(setting.dataScopeCustomDays) : '');
    setRules(setting.agentScopeRules || []);
    setInitialized(true);
  }, [open, data, initialized]);

  useEffect(() => {
    if (!initialized) return;
    const selectedIds = new Set<string>();
    const subIds = new Set<string>();
    rules.forEach(rule => {
      (rule.agentList || []).forEach(agent => {
        if (!agent.id) return;
        selectedIds.add(agent.id);
        if (rule.applySub === 1) subIds.add(agent.id);
      });
    });
    if (selectedIds.size === 0 && subIds.size === 0) {
      setCoverCount(0);
      return;
    }
    countCover(
      { selectedIds: [...selectedIds], subIds: [...subIds] },
      {
        onSuccess: result => {
          if (result.code === 0) setCoverCount(result.data);
        },
      },
    );
  }, [rules, initialized, countCover]);

  const rangeOptions = useMemo(
    () => [
      { value: '0', label: t('agentDataScope.range.allTime') },
      { value: '1', label: t('agentDataScope.range.recentMonth') },
      { value: '2', label: t('agentDataScope.range.recent3Month') },
      { value: '3', label: t('agentDataScope.range.recent6Month') },
      { value: '4', label: t('agentDataScope.range.recent1Year') },
      { value: '99', label: t('agentDataScope.range.custom') },
    ],
    [t],
  );

  const periodText = useCallback(
    (type: number, days?: number | null) => {
      if (type === 0) return t('agentDataScope.range.unlimited');
      const end = new Date();
      let start = new Date();
      if (type === 99) {
        const value = Number(days) || 1;
        start.setDate(end.getDate() - (value - 1));
      } else {
        start = addMonths(end, -(RANGE_MONTHS[type] ?? 0));
        start.setDate(start.getDate() + 1);
      }
      return `${formatDate(start)} — ${formatDate(end)}`;
    },
    [t],
  );

  const scopeLabel = (rule: AgentScopeRule) =>
    Number(rule.rangeType) === 99
      ? `${t('agentDataScope.range.custom')} ${rule.customDays || 0} ${t('agentDataScope.rule.dayUnit')}`
      : rangeOptions.find(option => Number(option.value) === Number(rule.rangeType))?.label ||
        t('agentDataScope.range.allTime');

  const openAddRule = () => {
    setEditingIndex(-1);
    setRuleDialogOpen(true);
  };

  const openEditRule = (index: number) => {
    setEditingIndex(index);
    setRuleDialogOpen(true);
  };

  const submitRule = (rule: AgentScopeRule) => {
    setRules(prev => {
      if (editingIndex < 0) return [...prev, rule];
      return prev.map((item, index) => (index === editingIndex ? rule : item));
    });
  };

  const removeRule = (index: number) => {
    setRules(prev => prev.filter((_, i) => i !== index));
    setExpandedIndex(-1);
  };

  const handleSave = async () => {
    if (rangeType === '99' && !(Number(customDays) > 0)) {
      toast.error(t('agentDataScope.rule.inputDays'));
      return;
    }
    const result = await save({
      dataScopeRangeType: rangeType,
      dataScopeCustomDays: rangeType === '99' ? customDays : '',
      agentScopeRules: rules,
    });
    if (result.code === 0) {
      toast.success(t('common.success'));
      refetch();
      setOpen(false);
    } else {
      toast.error(result.msg);
    }
  };

  const readFailed = isError;

  return (
    <RrhDialog
      open={open}
      onOpenChange={setOpen}
      title={t('agentDataScope.title')}
      variant="adaptive"
      type="submit"
      confirmText={t('common.save')}
      isConfirmDisabled={readFailed}
      formLoading={isPending}
      onConfirm={handleSave}
    >
      <div className="w-[860px] max-w-full py-4 text-sm">
        {readFailed && (
          <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-amber-800">
            {t('agentDataScope.readApiMissing')}
          </div>
        )}
        {isLoading ? (
          <div className="flex h-60 items-center justify-center">
            <RrhCircleLoading />
          </div>
        ) : readFailed ? null : (
          <>
            <div className="rounded-lg border">
              <div className="border-b px-4 py-2 font-semibold">
                {t('agentDataScope.range.unified')}
              </div>
              <div className="flex flex-col gap-3 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span>{t('agentDataScope.range.colScope')}</span>
                  <RrhSelect
                    options={rangeOptions}
                    value={rangeType}
                    onValueChange={value => setRangeType(value || '0')}
                    className="w-48"
                  />
                </div>
                {rangeType === '99' && (
                  <div className="flex items-center gap-3">
                    <span>{t('agentDataScope.range.days')}</span>
                    <div className="flex items-center gap-1">
                      <Input
                        className="h-8 w-32"
                        value={customDays}
                        placeholder={t('agentDataScope.rule.customDaysPlaceholder')}
                        onChange={e => setCustomDays(e.target.value.replace(/[^\d]/g, ''))}
                      />
                      <span>{t('agentDataScope.rule.dayUnit')}</span>
                    </div>
                  </div>
                )}
                <div className="text-muted-foreground text-xs">
                  {t('agentDataScope.range.desc')}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-lg border">
              <div className="flex items-center justify-between border-b px-4 py-2">
                <div>
                  <div className="font-semibold">{t('agentDataScope.range.agentSpecific')}</div>
                  <div className="text-muted-foreground text-xs">
                    {t('agentDataScope.range.fallback')}
                  </div>
                </div>
                <button
                  type="button"
                  className="border-primary text-primary cursor-pointer rounded-md border px-3 py-1.5"
                  onClick={openAddRule}
                >
                  {t('agentDataScope.range.addRule')}
                </button>
              </div>

              <div className="text-muted-foreground flex items-center gap-4 px-4 py-2 text-xs">
                <span>
                  {rules.length} {t('agentDataScope.range.ruleCount')}
                </span>
                <span>
                  {t('agentDataScope.range.coverPrefix')} {coverCount ?? '-'}{' '}
                  {t('agentDataScope.range.coverSuffix')}
                </span>
                <span className="ml-auto">{t('agentDataScope.range.multipleTip')}</span>
              </div>

              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border px-2 py-2 text-left">
                      {t('agentDataScope.range.colAgent')}
                    </th>
                    <th className="w-40 border px-2 py-2">{t('agentDataScope.range.colScope')}</th>
                    <th className="w-52 border px-2 py-2">{t('agentDataScope.range.colPeriod')}</th>
                    <th className="w-28 border px-2 py-2">{t('agentDataScope.range.colOps')}</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-muted-foreground border px-2 py-6 text-center"
                      >
                        {t('agentDataScope.range.empty')}
                      </td>
                    </tr>
                  )}
                  {rules.map((rule, index) => {
                    const agents = rule.agentList || [];
                    const first = agents[0];
                    const expandable = rule.applySub === 1 || agents.length > 1;
                    const expanded = expandedIndex === index;
                    return (
                      <tr key={index}>
                        <td className="border px-2 py-2">
                          {first ? (
                            <div>
                              <div className="flex items-center gap-2">
                                <span>{first.name}</span>
                                {first.showId && (
                                  <span className="text-muted-foreground text-xs">
                                    {first.showId}
                                  </span>
                                )}
                                {agents.length > 1 && (
                                  <span className="text-muted-foreground text-xs">
                                    {t('agentDataScope.range.andOthers', { total: agents.length })}
                                  </span>
                                )}
                              </div>
                              {expandable && (
                                <button
                                  type="button"
                                  className="text-primary mt-1 flex cursor-pointer items-center gap-1 text-xs"
                                  onClick={() => setExpandedIndex(expanded ? -1 : index)}
                                >
                                  {expanded ? (
                                    <ChevronDown className="size-3" />
                                  ) : (
                                    <ChevronRight className="size-3" />
                                  )}
                                  {t('agentDataScope.range.viewAgents')}
                                </button>
                              )}
                              {expanded && (
                                <div className="mt-1 flex flex-col gap-1">
                                  {agents.map(agent => (
                                    <div key={agent.id}>
                                      <div className="text-xs">
                                        {agent.name}
                                        {agent.showId ? ` (${agent.showId})` : ''}
                                      </div>
                                      {rule.applySub === 1 && (
                                        <SubordinateList agentId={agent.id} />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="border px-2 py-2 text-center">
                          <span className="bg-muted inline-block rounded px-2 py-0.5">
                            {scopeLabel(rule)}
                          </span>
                        </td>
                        <td className="border px-2 py-2">
                          <div>{periodText(Number(rule.rangeType), rule.customDays)}</div>
                          {Number(rule.rangeType) !== 0 && (
                            <div className="text-muted-foreground text-xs">
                              {t('agentDataScope.range.beijingRolling')}
                            </div>
                          )}
                        </td>
                        <td className="border px-2 py-2 text-center">
                          <button
                            type="button"
                            className="text-primary mr-2 cursor-pointer"
                            onClick={() => openEditRule(index)}
                          >
                            {t('agentDataScope.range.edit')}
                          </button>
                          <button
                            type="button"
                            className="text-destructive cursor-pointer"
                            onClick={() => removeRule(index)}
                          >
                            {t('agentDataScope.range.remove')}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <AgentScopeRuleDialog
        open={ruleDialogOpen}
        setOpen={setRuleDialogOpen}
        rule={editingIndex >= 0 ? rules[editingIndex] : null}
        onSubmit={submitRule}
      />
    </RrhDialog>
  );
};
