import {
  useCheckNotInviteBoss,
  useCheckSubUserGroupSetting,
  useGetCustomRebate,
  useGetRebateSettingPageData,
  useGetRuleGroups,
  useGetSpreadLinks,
  useGetTraderListForLevel,
  useGetUpperInput,
  useGetUpperUserRebateTwo,
  useSaveRebateSettingModel1,
  useSaveRebateSettingModel2,
} from '@/api/hooks/agent/agent';
import type {
  CommissionOptionItem,
  CrmUserRebateTemplate,
  RuleGroupItem,
  SaveRebateSettingModel2Params,
  SpreadLinkItem,
  UpperInputRule,
} from '@/api/hooks/agent/types';
import { useGetRebateLevelList, useGetRebateSettingsTemplate } from '@/api/hooks/rebate';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCard } from '@/components/common/RrhCard';
import { RrhSelect } from '@/components/common/RrhSelect';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { PenLine, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function getUnit(
  settleType: number,
  settleUnit: string,
  settleValue: number,
  rebateType: number,
): string {
  if (rebateType !== 1) return '%';
  const pre = settleType === 1 ? 'USD' : 'pts';
  const sval = settleValue > 1 ? String(settleValue) : '';
  const unitMap: Record<string, string> = { '0': `${sval}手`, '1': '百万', '2': `${sval}lot` };
  return `${pre}/${unitMap[settleUnit] ?? '手'}`;
}

/** 从 "ruleId:commissionId|..." 字符串中查找指定 ruleId 的 commissionId */
function parseCommissionRule(ruleStr: string, ruleId: string): string {
  if (!ruleStr) return '';
  for (const seg of ruleStr.split('|')) {
    const [rid, cid] = seg.split(':');
    if (rid === ruleId) return cid ?? '';
  }
  return '';
}

// ---------------------------------------------------------------------------
// Local state shapes
// ---------------------------------------------------------------------------

type UserTwoRuleState = {
  ruleId: string;
  ruleName: string;
  rebateType: number;
  settleType: number;
  settleUnit: string;
  settleValue: number;
  // commissionType=1
  groupOptions: RuleGroupItem[];
  selectedAgencyId: string;
  selectedUserTwoId: string;
  // commissionType=2
  customValue: string;
  maxRebate: number | null;
  minRebate: number;
};

type Model1RuleState = {
  ruleId: string;
  ruleName: string;
  commissions: CommissionOptionItem[];
  selectedCommissionId: string;
};

// ---------------------------------------------------------------------------
// ReadonlyField
// ---------------------------------------------------------------------------

const ReadonlyField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center text-sm">
    <span className="text-muted-foreground shrink-0 basis-3/12">{label}</span>
    <span className="basis-9/12">{value || '—'}</span>
  </div>
);

// ---------------------------------------------------------------------------
// UpperRuleRow  (model=2 上级规则行)
// ---------------------------------------------------------------------------

const UpperRuleRow = ({
  rule,
  editable,
  rebateLevelSetting,
  onChange,
}: {
  rule: UpperInputRule;
  editable: boolean;
  rebateLevelSetting: string;
  onChange: (updated: UpperInputRule) => void;
}) => {
  const { t } = useTranslation();
  const unit = getUnit(
    rule.crmRebateTrader.settleType,
    rule.crmRebateTrader.settleUnit,
    rule.settleValue,
    rule.rebateType,
  );
  const checked = rule.traderChecked === 1;

  return (
    <div className="flex flex-col gap-2 py-2 text-sm">
      {/* 规则名称 + 金额输入 */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={checked}
          disabled={!editable}
          onChange={e => onChange({ ...rule, traderChecked: e.target.checked ? 1 : 0 })}
        />
        <Label className="shrink-0 basis-3/12">{rule.rebateTraderName}</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            className="w-32"
            disabled={!editable || !checked}
            value={rule.commissionValue ?? ''}
            min={0}
            onChange={e =>
              onChange({ ...rule, commissionValue: e.target.value ? Number(e.target.value) : null })
            }
          />
          <span className="text-muted-foreground text-xs">{unit}</span>
        </div>
      </div>

      {/* 上级已配置的值（只读提示） */}
      <div className="text-muted-foreground pl-8 text-xs">
        {t('user.reabte.setting.template11')}：{rule.upperValue}
        {unit}
      </div>

      {/* 平级设置 */}
      {rebateLevelSetting !== '0' && checked && (
        <div className="flex flex-wrap items-center gap-2 pl-8">
          <span className="text-muted-foreground text-xs">
            {t('user.reabte.setting.template2')}
          </span>
          <select
            className="border-input h-8 w-36 rounded border bg-transparent px-2 text-sm disabled:opacity-50"
            disabled={!editable}
            value={rule.equalType}
            onChange={e => onChange({ ...rule, equalType: Number(e.target.value) })}
          >
            <option value={1}>{t('user.reabte.setting.template3')}</option>
            <option value={2}>{t('user.reabte.setting.template4')}</option>
            <option value={3}>{t('user.reabte.setting.template5')}</option>
          </select>
          {rule.equalType !== 1 && (
            <>
              <Input
                type="number"
                className="w-24"
                disabled={!editable}
                value={rule.equalMoney ?? ''}
                min={0}
                onChange={e =>
                  onChange({ ...rule, equalMoney: e.target.value ? Number(e.target.value) : null })
                }
              />
              <span className="text-muted-foreground text-xs">
                {rule.equalType === 3 ? '%' : unit}
              </span>
              <Input
                type="number"
                className="w-16"
                disabled={!editable}
                value={rule.equalLimit ?? ''}
                min={1}
                onChange={e =>
                  onChange({ ...rule, equalLimit: e.target.value ? Number(e.target.value) : null })
                }
              />
            </>
          )}
        </div>
      )}

      {/* 越级设置 */}
      {rebateLevelSetting === '2' && checked && (
        <div className="flex flex-wrap items-center gap-2 pl-8">
          <span className="text-muted-foreground text-xs">
            {t('user.reabte.setting.template22')}
          </span>
          <select
            className="border-input h-8 w-36 rounded border bg-transparent px-2 text-sm disabled:opacity-50"
            disabled={!editable}
            value={rule.passType}
            onChange={e => onChange({ ...rule, passType: Number(e.target.value) })}
          >
            <option value={1}>{t('user.reabte.setting.template3')}</option>
            <option value={2}>{t('user.reabte.setting.template4')}</option>
            <option value={3}>{t('user.reabte.setting.template5')}</option>
          </select>
          {rule.passType !== 1 && (
            <>
              <Input
                type="number"
                className="w-24"
                disabled={!editable}
                value={rule.passMoney ?? ''}
                min={0}
                onChange={e =>
                  onChange({ ...rule, passMoney: e.target.value ? Number(e.target.value) : null })
                }
              />
              <span className="text-muted-foreground text-xs">
                {rule.passType === 3 ? '%' : unit}
              </span>
              <Input
                type="number"
                className="w-16"
                disabled={!editable}
                value={rule.passLimit ?? ''}
                min={1}
                onChange={e =>
                  onChange({ ...rule, passLimit: e.target.value ? Number(e.target.value) : null })
                }
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// AttributionSection (归属与来源)
// ---------------------------------------------------------------------------

const AttributionSection = ({
  inviterId,
  inviterName,
  registerSourceText,
  sourceOptions,
  selectedSourceId,
  editable,
  onSourceChange,
  onClearInviter,
  onSelectInviter,
}: {
  inviterId: string;
  inviterName: string;
  registerSourceText: string;
  sourceOptions: SpreadLinkItem[];
  selectedSourceId: string;
  editable: boolean;
  onInviterChange?: (id: string, name: string) => void;
  onSourceChange: (id: string) => void;
  onClearInviter: () => void;
  onSelectInviter: () => void;
}) => {
  const { t } = useTranslation();

  const sourceSelectOptions = useMemo(
    () => sourceOptions.map(s => ({ label: s.label, value: s.id })),
    [sourceOptions],
  );

  return (
    <RrhCard className="mb-4">
      <h3 className="mb-4 text-base font-semibold">{t('user.attribution.and.origin')}</h3>
      <div className="flex flex-col gap-4">
        {/* 上级 */}
        <div className="flex items-center text-sm">
          <Label className="text-muted-foreground shrink-0 basis-3/12">
            {t('front.crm.user.b')}
          </Label>
          <div className="flex basis-9/12 flex-wrap items-center gap-2">
            <Input
              className="max-w-72"
              value={inviterName}
              disabled
              placeholder={t('user.reabte.setting.template19')}
              readOnly
            />
            {editable && (
              <>
                <RrhButton size="sm" onClick={onSelectInviter}>
                  {t('common.select')}
                </RrhButton>
                {inviterId && (
                  <RrhButton size="sm" variant="outline" onClick={onClearInviter}>
                    <X className="mr-1 h-3 w-3" />
                    {t('common.CLEAR')}
                  </RrhButton>
                )}
              </>
            )}
            {/* TODO: 查看完整上级链弹窗 (GET /system/crmUser/getUpperList?userId=...) */}
          </div>
        </div>

        {/* 推荐来源 */}
        <div className="flex items-center text-sm">
          <Label className="text-muted-foreground shrink-0 basis-3/12">
            {t('user.recommended.source')}
          </Label>
          <div className="basis-9/12">
            {editable ? (
              <RrhSelect
                className="max-w-72"
                options={sourceSelectOptions}
                value={selectedSourceId}
                onValueChange={onSourceChange}
                placeholder={t('common.pleaseSelect')}
                showRowValue={false}
              />
            ) : (
              <span>
                {sourceOptions.find(s => s.id === selectedSourceId)?.label ||
                  selectedSourceId ||
                  '—'}
              </span>
            )}
            <p className="text-muted-foreground mt-1 text-xs">{t('user.recommended.source.tip')}</p>
          </div>
        </div>

        {/* 注册来源（只读） */}
        <ReadonlyField label={t('user.register.source')} value={registerSourceText} />
      </div>
    </RrhCard>
  );
};

// ---------------------------------------------------------------------------
// Model1Config (model=1 模板模式配置)
// ---------------------------------------------------------------------------

const Model1Config = ({
  rebateType,
  editable,
  template,
  commissionType,
  onRebateTypeChange,
}: {
  rebateType: number;
  editable: boolean;
  template: CrmUserRebateTemplate;
  commissionType: number;
  onRebateTypeChange: (t: number) => void;
}) => {
  const { t } = useTranslation();
  const [selectedTemplateId, setSelectedTemplateId] = useState(template.templateReferId ?? '');
  const [selectedLevelId, setSelectedLevelId] = useState(template.rebateLevel ?? '');
  const [rules, setRules] = useState<Model1RuleState[]>([]);

  const { data: levelListData } = useGetRebateLevelList(1);
  const levelList = levelListData ?? [];

  const { data: templateListData } = useGetRebateSettingsTemplate(rebateType, {
    pageNum: 1,
    pageSize: 999,
  });
  const templateList = templateListData?.rows ?? [];

  const { mutate: getTraderList, isPending: loadingRules } = useGetTraderListForLevel();

  const loadRulesForLevel = useCallback(
    (levelId: string) => {
      if (!levelId) {
        setRules([]);
        return;
      }
      getTraderList(
        { levelId, rebateType, commissionType, model: 1 },
        {
          onSuccess: data => {
            setRules(
              (data ?? []).map(item => ({
                ruleId: item.ruleId,
                ruleName: item.ruleName,
                commissions: item.commissions ?? [],
                selectedCommissionId: parseCommissionRule(
                  template.rebateTraderCommissionRule ?? '',
                  item.ruleId,
                ),
              })),
            );
          },
        },
      );
    },
    [rebateType, commissionType, template.rebateTraderCommissionRule, getTraderList],
  );

  useEffect(() => {
    if (selectedLevelId) loadRulesForLevel(selectedLevelId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tpl = templateList.find(item => item.id === templateId);
    if (tpl) {
      setSelectedLevelId(tpl.rebateLevel ?? '');
      loadRulesForLevel(tpl.rebateLevel ?? '');
    }
  };

  const handleLevelChange = (levelId: string) => {
    setSelectedLevelId(levelId);
    loadRulesForLevel(levelId);
  };

  const updateRuleCommission = (ruleId: string, commissionId: string) => {
    setRules(prev =>
      prev.map(r => (r.ruleId === ruleId ? { ...r, selectedCommissionId: commissionId } : r)),
    );
  };

  const levelOptions = useMemo(
    () => levelList.map(l => ({ label: l.levelName, value: l.id })),
    [levelList],
  );
  const templateOptions = useMemo(
    () => templateList.map(tpl => ({ label: tpl.templateName, value: tpl.id })),
    [templateList],
  );

  return (
    <div className="flex flex-col gap-4">
      {/* 返佣类型 tab */}
      <div className="flex gap-2 border-b pb-2">
        {[
          { type: 1, label: t('front.promote.link.o') },
          { type: 2, label: t('front.promote.link.p') },
          { type: 3, label: t('front.promote.link.q') },
        ].map(tab => (
          <button
            key={tab.type}
            type="button"
            className={cn(
              'rounded px-4 py-1.5 text-sm',
              rebateType === tab.type
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted',
            )}
            onClick={() => onRebateTypeChange(tab.type)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 返佣模板 */}
      <div className="flex items-center text-sm">
        <Label className="text-muted-foreground shrink-0 basis-3/12">
          {t('front.promote.link.s')}
        </Label>
        <div className="basis-9/12">
          {editable ? (
            <RrhSelect
              className="max-w-72"
              options={templateOptions}
              value={selectedTemplateId}
              onValueChange={handleTemplateChange}
              placeholder={t('background.conditional.selection')}
              showRowValue={false}
            />
          ) : (
            <span>
              {templateList.find(tp => tp.id === selectedTemplateId)?.templateName || '—'}
            </span>
          )}
        </div>
      </div>

      {/* 返佣层级 */}
      <div className="flex items-center text-sm">
        <Label className="text-muted-foreground shrink-0 basis-3/12">
          {t('front.promote.link.r')}
        </Label>
        <div className="basis-9/12">
          {editable ? (
            <RrhSelect
              className="max-w-72"
              options={levelOptions}
              value={selectedLevelId}
              onValueChange={handleLevelChange}
              placeholder={t('user.reabte.setting.template14')}
              showRowValue={false}
            />
          ) : (
            <span>{levelList.find(l => l.id === selectedLevelId)?.levelName || '—'}</span>
          )}
        </div>
      </div>

      {/* 规则列表 */}
      {loadingRules ? (
        <div className="text-muted-foreground text-sm">{t('common.loading')}...</div>
      ) : (
        rules.map(rule => (
          <div key={rule.ruleId} className="flex items-center text-sm">
            <Label className="text-muted-foreground shrink-0 basis-3/12">{rule.ruleName}</Label>
            <div className="basis-9/12">
              {editable ? (
                <RrhSelect
                  className="max-w-72"
                  options={rule.commissions.map(c => ({ label: c.rebateGroupName, value: c.id }))}
                  value={rule.selectedCommissionId}
                  onValueChange={val => updateRuleCommission(rule.ruleId, val)}
                  placeholder={t('background.conditional.selection')}
                  showRowValue={false}
                />
              ) : (
                <span>
                  {rule.commissions.find(c => c.id === rule.selectedCommissionId)
                    ?.rebateGroupName || '—'}
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Model2RebateSection (model=2 单个返佣类型区块)
// ---------------------------------------------------------------------------

const Model2RebateSection = ({
  userId,
  inviterId,
  levelId,
  rebateType,
  commissionType,
  paramFillType,
  rebateLevelSetting,
  editable,
}: {
  userId: string;
  inviterId: string;
  levelId: string;
  rebateType: number;
  commissionType: number;
  paramFillType: number;
  rebateLevelSetting: string;
  editable: boolean;
}) => {
  const { t } = useTranslation();
  const [userTwoRules, setUserTwoRules] = useState<UserTwoRuleState[]>([]);
  const [upperRules, setUpperRules] = useState<UpperInputRule[]>([]);

  const { mutate: getTraderList, isPending: loadingTraders } = useGetTraderListForLevel();
  const { mutate: getRuleGroups } = useGetRuleGroups();
  const { mutate: getCustomRebate } = useGetCustomRebate();
  const { mutate: getUpperInput } = useGetUpperInput();

  useEffect(() => {
    if (!levelId) {
      setUserTwoRules([]);
      setUpperRules([]);
      return;
    }

    getTraderList(
      { levelId, userId, model: 2, commissionType, upperId: inviterId || undefined },
      {
        onSuccess: traders => {
          const filtered = (traders ?? []).filter(tr => tr.rebateType === rebateType);
          const baseRules = filtered.map(tr => ({
            ruleId: tr.ruleId,
            ruleName: tr.ruleName,
            rebateType: tr.rebateType,
            settleType: tr.settleType,
            settleUnit: tr.settleUnit,
            settleValue: tr.settleValue,
            groupOptions: [],
            selectedAgencyId: '',
            selectedUserTwoId: '',
            customValue: '',
            maxRebate: null,
            minRebate: 0,
          }));
          setUserTwoRules(baseRules);

          filtered.forEach(tr => {
            if (commissionType === 2) {
              // 自定义方案：加载自定义值和上下限
              getCustomRebate(
                { rebateTraderId: tr.ruleId, userId, inviter: inviterId || undefined },
                {
                  onSuccess: res => {
                    if (res?.code === 0 && res.data) {
                      setUserTwoRules(prev =>
                        prev.map(r =>
                          r.ruleId === tr.ruleId
                            ? {
                                ...r,
                                customValue: String(res.data.rebateValue ?? ''),
                                maxRebate: res.data.maxRebate,
                                minRebate: res.data.minRebate,
                              }
                            : r,
                        ),
                      );
                    }
                  },
                },
              );
            } else {
              // 佣金组方案：加载佣金组选项
              getRuleGroups(
                { levelId, model: 2, rebateTraderId: tr.ruleId, userId },
                {
                  onSuccess: res => {
                    if (res?.code === 0) {
                      setUserTwoRules(prev =>
                        prev.map(r => {
                          if (r.ruleId !== tr.ruleId) return r;
                          const sel = res.data.find(g => g.selected);
                          return {
                            ...r,
                            groupOptions: res.data,
                            selectedAgencyId: sel?.id ?? '',
                            selectedUserTwoId: sel?.userTwoId ?? '',
                          };
                        }),
                      );
                    }
                  },
                },
              );
            }
          });

          // 加载上级规则
          if (inviterId) {
            getUpperInput(
              { userId, levelId, upperId: inviterId },
              {
                onSuccess: res => {
                  if (res?.code === 0) {
                    setUpperRules((res.data ?? []).filter(r => r.rebateType === rebateType));
                  }
                },
              },
            );
          }
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId, inviterId, commissionType]);

  const updateUserTwo = (ruleId: string, patch: Partial<UserTwoRuleState>) => {
    setUserTwoRules(prev => prev.map(r => (r.ruleId === ruleId ? { ...r, ...patch } : r)));
  };

  const updateUpperRule = (index: number, updated: UpperInputRule) => {
    setUpperRules(prev => prev.map((r, i) => (i === index ? updated : r)));
  };

  if (loadingTraders) {
    return <div className="text-muted-foreground py-2 text-sm">{t('common.loading')}...</div>;
  }
  if (!levelId) {
    return (
      <div className="text-muted-foreground py-2 text-sm">
        {t('user.reabte.setting.template14')}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* 当前用户规则 */}
      {userTwoRules.map(rule => {
        const unit = getUnit(rule.settleType, rule.settleUnit, rule.settleValue, rule.rebateType);
        return (
          <div key={rule.ruleId} className="flex items-start gap-3 text-sm">
            <Label className="text-muted-foreground mt-2 shrink-0 basis-3/12">
              {rule.ruleName}
            </Label>
            <div className="flex basis-9/12 flex-col gap-1">
              {commissionType === 2 ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    className="w-32"
                    disabled={!editable || paramFillType === 1}
                    value={rule.customValue}
                    min={rule.minRebate || 0}
                    max={rule.maxRebate ?? undefined}
                    onChange={e => updateUserTwo(rule.ruleId, { customValue: e.target.value })}
                  />
                  <span className="text-muted-foreground text-xs">{unit}</span>
                  {rule.maxRebate !== null && (
                    <span className="text-muted-foreground text-xs">
                      {t('crm.rebate.commission.limit')}
                      {rule.maxRebate}
                    </span>
                  )}
                </div>
              ) : (
                <RrhSelect
                  className="max-w-72"
                  options={rule.groupOptions.map(g => ({
                    label: `${g.price} (${g.commissionGroupName})`,
                    value: g.id,
                  }))}
                  value={rule.selectedAgencyId}
                  onValueChange={val => {
                    const group = rule.groupOptions.find(g => g.id === val);
                    updateUserTwo(rule.ruleId, {
                      selectedAgencyId: val,
                      selectedUserTwoId: group?.userTwoId ?? '',
                    });
                  }}
                  placeholder={t('user.reabte.setting.template8')}
                  showRowValue={false}
                  disabled={!editable}
                />
              )}
            </div>
          </div>
        );
      })}

      {/* 上级规则 */}
      {upperRules.length > 0 && (
        <div className="border-t pt-3">
          {upperRules.map((rule: UpperInputRule, index: number) => (
            <UpperRuleRow
              key={rule.id}
              rule={rule}
              editable={editable}
              rebateLevelSetting={rebateLevelSetting}
              onChange={updated => updateUpperRule(index, updated)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// RebateSettingPage (main)
// ---------------------------------------------------------------------------

export const RebateSettingPage = ({ userId }: { userId: string }) => {
  const { t } = useTranslation();

  // 返佣类型状态（model=1 时作为 tab 切换，model=2 时固定展示三种）
  const [rebateType, setRebateType] = useState<number>(1);

  /**
   * TODO: 初始页面数据（model/commissionType/paramFillType/rebateLevelSetting）
   * 原为 Thymeleaf 服务端渲染控制器注入，需与后端确认对应 REST 接口返回结构
   */
  const { data: pageDataRes, refetch } = useGetRebateSettingPageData(userId, rebateType);
  const pageData = pageDataRes?.data;

  const model = pageData?.model ?? 1;
  const commissionType = pageData?.commissionType ?? 1;
  const paramFillType = pageData?.paramFillType ?? 0;
  const rebateLevelSetting = pageData?.rebateLevelSetting ?? '0';
  const template = pageData?.crmUserRebateTemplate;

  const [editable, setEditable] = useState(false);

  // 归属与来源
  const [inviterId, setInviterId] = useState('');
  const [inviterName, setInviterName] = useState('');
  const [selectedSourceId, setSelectedSourceId] = useState('');
  const [sourceOptions, setSourceOptions] = useState<SpreadLinkItem[]>([]);

  // model=2 层级
  const [selectedLevelId, setSelectedLevelId] = useState('');

  // 从 pageData 初始化状态
  useEffect(() => {
    if (!pageData) return;
    setInviterName(pageData.userInviter ?? '');
    setSelectedLevelId(pageData.crmUserRebateTemplate?.rebateLevel ?? '');
    setRebateType(pageData.rebateType ?? 1);
  }, [pageData]);

  const { data: levelListData } = useGetRebateLevelList(model);
  const levelList = levelListData ?? [];

  const { mutate: checkNotInviteBoss } = useCheckNotInviteBoss();
  const { mutate: checkSubUserGroupSetting } = useCheckSubUserGroupSetting();
  const { mutate: saveModel1, isPending: savingModel1 } = useSaveRebateSettingModel1();
  const { mutate: saveModel2, isPending: savingModel2 } = useSaveRebateSettingModel2();
  const { mutate: getSpreadLinks } = useGetSpreadLinks();

  // TODO: 上级选择弹窗 — 需要用户选择组件（原代码通过 jQuery modal 打开 /system/crmUser/dialog）
  const { mutate: getUpperUserRebateTwo } = useGetUpperUserRebateTwo();

  const isSaving = savingModel1 || savingModel2;

  // 加载推荐来源列表
  useEffect(() => {
    getSpreadLinks(
      { userId: inviterId || undefined },
      {
        onSuccess: res => {
          if (res?.code === 0) setSourceOptions(res.rows ?? []);
        },
      },
    );
  }, [inviterId, getSpreadLinks]);

  const handleCancel = () => {
    setEditable(false);
    refetch();
  };

  const doSave = () => {
    if (model === 1) {
      saveModel1(
        {
          id: template?.id ?? undefined,
          userId,
          rebateType,
          inviter: inviterId || undefined,
          source: selectedSourceId || undefined,
          rebateLevel: selectedLevelId || undefined,
          // TODO: rebateTraderCommissionRule — 需从 Model1Config 提升规则状态后构建
        },
        {
          onSuccess: res => {
            if (res.code === 0) {
              toast.success(t('common.modifySuccess'));
              setEditable(false);
              refetch();
            } else {
              toast.error(res.msg || t('common.modifyFailed'));
            }
          },
        },
      );
    } else {
      const payload: SaveRebateSettingModel2Params = {
        id: template?.id ?? undefined,
        userId,
        rebateLevel: selectedLevelId || undefined,
        inviter: inviterId || undefined,
        source: selectedSourceId || undefined,
        // TODO: upper[] 和 userTwo[] — 需从各 Model2RebateSection 提升状态后构建
      };
      checkSubUserGroupSetting(payload, {
        onSuccess: checkRes => {
          const needsConfirm = checkRes.code === 0;
          // TODO: needsConfirm=true 时弹出二次确认对话框（原代码使用 $.modal.confirm）
          void needsConfirm;
          saveModel2(payload, {
            onSuccess: saveRes => {
              if (saveRes.code === 0) {
                toast.success(t('common.modifySuccess'));
                setEditable(false);
                refetch();
              } else {
                toast.error(saveRes.msg || t('common.modifyFailed'));
              }
            },
          });
        },
      });
    }
  };

  const handleConfirm = () => {
    if (inviterId && inviterId === userId) {
      toast.error(t('role.source.i'));
      return;
    }
    if (inviterId) {
      checkNotInviteBoss(
        { userId, inviterId },
        {
          onSuccess: valid => {
            if (!valid) {
              toast.error(t('role.source.j'));
              return;
            }
            doSave();
          },
        },
      );
    } else {
      doSave();
    }
  };

  // 切换上级后刷新上级规则（model=2）
  const handleInviterChange = (id: string, name: string) => {
    setInviterId(id);
    setInviterName(name);
    if (model === 2 && selectedLevelId && id) {
      getUpperUserRebateTwo(
        { upperUserId: id, levelId: selectedLevelId },
        {
          onSuccess: () => {
            /* Model2RebateSection 内部通过 useEffect([inviterId]) 自动刷新 */
          },
        },
      );
    }
  };

  // TODO: 上级选择弹窗实现（原代码打开 /system/crmUser/dialog?route=1&userId=...）
  const handleSelectInviter = () => {
    toast.info('TODO: 打开上级选择弹窗');
  };

  const levelOptions = useMemo(
    () => levelList.map(l => ({ label: l.levelName, value: l.id })),
    [levelList],
  );

  return (
    <div className="flex flex-col gap-4">
      {/* 操作按钮栏 */}
      <div className="flex justify-end gap-2">
        {!editable ? (
          <RrhButton Icon={<PenLine />} onClick={() => setEditable(true)}>
            {t('common.Edit')}
          </RrhButton>
        ) : (
          <>
            <RrhButton variant="outline" onClick={handleCancel} disabled={isSaving}>
              {t('common.Cancel')}
            </RrhButton>
            <RrhButton onClick={handleConfirm} loading={isSaving}>
              {t('common.Confirm')}
            </RrhButton>
          </>
        )}
      </div>

      {/* 归属与来源 */}
      <AttributionSection
        inviterId={inviterId}
        inviterName={inviterName}
        registerSourceText={pageData?.source ?? ''}
        sourceOptions={sourceOptions}
        selectedSourceId={selectedSourceId}
        editable={editable}
        onInviterChange={handleInviterChange}
        onSourceChange={setSelectedSourceId}
        onClearInviter={() => {
          setInviterId('');
          setInviterName('');
          setSelectedSourceId('');
        }}
        onSelectInviter={handleSelectInviter}
      />

      {/* 返佣配置主区块 */}
      <RrhCard title={t('front.crm.user.info.i')}>
        {model === 1 ? (
          // model=1：模板模式
          <Model1Config
            rebateType={rebateType}
            editable={editable}
            template={
              template ?? {
                id: null,
                userId: null,
                rebateType: 1,
                templateReferId: null,
                rebateLevel: null,
                rebateTraderCommissionRule: null,
              }
            }
            commissionType={commissionType}
            onRebateTypeChange={setRebateType}
          />
        ) : (
          // model=2：直接配置模式
          <div className="flex flex-col gap-6">
            {/* 返佣层级选择 */}
            <div className="flex items-center text-sm">
              <Label className="text-muted-foreground shrink-0 basis-3/12">
                {t('front.promote.link.r')}
              </Label>
              <div className="basis-9/12">
                {editable ? (
                  <RrhSelect
                    className="max-w-72"
                    options={levelOptions}
                    value={selectedLevelId}
                    onValueChange={setSelectedLevelId}
                    placeholder={t('user.reabte.setting.template14')}
                    showRowValue={false}
                  />
                ) : (
                  <span>{levelList.find(l => l.id === selectedLevelId)?.levelName || '—'}</span>
                )}
              </div>
            </div>

            {/* 三种返佣类型区块 */}
            {[
              { rebateType: 1, title: t('front.promote.link.o') },
              { rebateType: 2, title: t('front.promote.link.p') },
              { rebateType: 3, title: t('front.promote.link.q') },
            ].map(section => (
              <RrhCard key={section.rebateType} title={section.title} className="border">
                <Model2RebateSection
                  userId={userId}
                  inviterId={inviterId}
                  levelId={selectedLevelId}
                  rebateType={section.rebateType}
                  commissionType={commissionType}
                  paramFillType={paramFillType}
                  rebateLevelSetting={rebateLevelSetting}
                  editable={editable}
                />
              </RrhCard>
            ))}
          </div>
        )}
      </RrhCard>
    </div>
  );
};
