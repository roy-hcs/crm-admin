import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { RrhDialog } from '@/components/common/RrhDialog';
import { RrhMultiSelect } from '@/components/common/RrhMultiSelect';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useDictType } from '@/api/hooks/system/system';
import {
  useInterTransAdvanceScaleSetting,
  useSaveInterTransAdvanceScale,
} from '@/api/hooks/setting/platform';
import { InterTransAdvanceScaleSetting } from '@/api/hooks/setting/types';

type ScaleGroupRow = { min: string; max: string; ratio: string };
type GeneralRow = ScaleGroupRow & { id: string };
type TimeRuleRow = {
  id: string;
  weekDays: string[];
  startTime: string;
  endTime: string;
  groups: ScaleGroupRow[];
};

const emptyGroup = (): ScaleGroupRow => ({ min: '', max: '', ratio: '' });
const emptyGeneral = (): GeneralRow => ({ id: '', ...emptyGroup() });
const emptyTimeRule = (): TimeRuleRow => ({
  id: '',
  weekDays: [],
  startTime: '',
  endTime: '',
  groups: [emptyGroup()],
});

const onlyInteger = (value: string) =>
  value
    .replace(/[^\d]/g, '')
    .replace(/^0+(?=\d)/, '')
    .slice(0, 9);

const onlyRatio = (value: string) => {
  const matched = value.match(/^\d*(\.\d{0,4})?/);
  return matched ? matched[0].slice(0, 9) : '';
};

const toMinutes = (time: string, isEnd: boolean) => {
  if (!time) return isEnd ? 1439 : 0;
  const [hour, minute] = time.split(':');
  return Number(hour) * 60 + Number(minute);
};

/**
 * 内转可转出预付金比例设置
 * 对应旧版 system/inOutMoneySetting/interTransAdvanceScaleSetting.html
 */
export const AdvanceScaleSettingDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useInterTransAdvanceScaleSetting(open);
  const { data: weekDayDict } = useDictType('sys_week_day', { enabled: open });
  const { mutateAsync: save, isPending } = useSaveInterTransAdvanceScale();

  const [enabled, setEnabled] = useState(true);
  const [scheme, setScheme] = useState<'1' | '2'>('1');
  const [general, setGeneral] = useState<GeneralRow[]>([emptyGeneral(), emptyGeneral()]);
  const [timeRulesOpen, setTimeRulesOpen] = useState(false);
  const [timeRules, setTimeRules] = useState<TimeRuleRow[]>([]);
  const [initialized, setInitialized] = useState(false);

  const weekDayOptions = useMemo(
    () => (weekDayDict || []).map(item => ({ label: item.dictLabel, value: item.dictValue })),
    [weekDayDict],
  );

  useEffect(() => {
    if (!open) {
      setInitialized(false);
      return;
    }
    if (!data || initialized) return;
    // 兼容 AjaxResult 包装（{code,msg,data}）与直接返回 VO 两种形态
    const wrapped = data as { data?: InterTransAdvanceScaleSetting | null };
    const setting: Partial<InterTransAdvanceScaleSetting> =
      wrapped.data && typeof wrapped.data === 'object'
        ? wrapped.data
        : (data as unknown as Partial<InterTransAdvanceScaleSetting>);

    setEnabled(String(setting.interTransAdvanceScaleStatus ?? '1') !== '0');
    setScheme(String(setting.interTransAdvanceScaleScheme) === '2' ? '2' : '1');

    const generalList = (setting.generalSettingList || []).map(item => ({
      id: item.id || '',
      min: item.minValue ?? '',
      max: item.maxValue ?? '',
      ratio: item.withdralRatio ?? '',
    }));
    setGeneral(generalList.length > 0 ? generalList : [emptyGeneral(), emptyGeneral()]);

    const personalList = (setting.personalSettingList || []).map(item => {
      let groups: ScaleGroupRow[] = [];
      try {
        const parsed = JSON.parse(item.withdrawRatioJson || '[]') as {
          minValue?: string;
          maxValue?: string;
          withdralRatio?: string;
          sort?: number;
        }[];
        groups = parsed
          .slice()
          .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
          .map(group => ({
            min: group.minValue ?? '',
            max: group.maxValue ?? '',
            ratio: group.withdralRatio ?? '',
          }));
      } catch {
        groups = [];
      }
      return {
        id: item.id || '',
        weekDays: item.weekDay ? String(item.weekDay).split(',') : [],
        startTime: item.startTime || '',
        endTime: item.endTime || '',
        groups: groups.length > 0 ? groups : [emptyGroup()],
      };
    });
    setTimeRules(personalList);
    setTimeRulesOpen(personalList.length > 0);
    setInitialized(true);
  }, [open, data, initialized]);

  const schemeLabel =
    scheme === '1'
      ? t('internalTransferAdvanceScale.schemeAdvance')
      : t('internalTransferAdvanceScale.schemeWithdraw');
  const rangeTitle = t('internalTransferAdvanceScale.scaleRangeTitle', { scheme: schemeLabel });

  const updateGeneral = (index: number, patch: Partial<GeneralRow>) => {
    setGeneral(prev => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const removeGeneral = (index: number) => {
    if (general.length <= 2) {
      toast.error(t('internalTransferAdvanceScale.minRules', { num: 2 }));
      return;
    }
    setGeneral(prev => prev.filter((_, i) => i !== index));
  };

  const updateTimeRule = (index: number, patch: Partial<TimeRuleRow>) => {
    setTimeRules(prev => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const updateTimeGroup = (rowIndex: number, groupIndex: number, patch: Partial<ScaleGroupRow>) => {
    setTimeRules(prev =>
      prev.map((row, i) =>
        i === rowIndex
          ? {
              ...row,
              groups: row.groups.map((group, gi) =>
                gi === groupIndex ? { ...group, ...patch } : group,
              ),
            }
          : row,
      ),
    );
  };

  const addTimeRule = () => setTimeRules(prev => [...prev, emptyTimeRule()]);

  const addTimeGroup = (rowIndex: number) => {
    setTimeRules(prev =>
      prev.map((row, i) =>
        i === rowIndex ? { ...row, groups: [...row.groups, emptyGroup()] } : row,
      ),
    );
  };

  const removeTimeGroup = (rowIndex: number, groupIndex: number) => {
    const row = timeRules[rowIndex];
    if (!row) return;
    if (row.groups.length <= 1) {
      if (timeRules.length <= 1) {
        toast.error(t('internalTransferAdvanceScale.minRules', { num: 1 }));
        return;
      }
      setTimeRules(prev => prev.filter((_, i) => i !== rowIndex));
      return;
    }
    setTimeRules(prev =>
      prev.map((item, i) =>
        i === rowIndex
          ? { ...item, groups: item.groups.filter((_, gi) => gi !== groupIndex) }
          : item,
      ),
    );
  };

  const validate = (): string | null => {
    for (const row of general) {
      if (row.ratio === '') return t('internalTransferAdvanceScale.ratioRequired');
    }
    for (const row of general) {
      if (row.min !== '' && row.max !== '' && Number(row.min) > Number(row.max)) {
        return t('internalTransferAdvanceScale.rangeInvalid');
      }
    }
    for (let i = 0; i < general.length - 1; i++) {
      if (general[i].max !== general[i + 1].min) {
        return t('internalTransferAdvanceScale.rangeContinuous');
      }
    }

    if (!timeRulesOpen) return null;

    for (const row of timeRules) {
      if (row.weekDays.length === 0) return t('internalTransferAdvanceScale.weekdayRequired');
      if (
        row.startTime &&
        row.endTime &&
        toMinutes(row.endTime, true) < toMinutes(row.startTime, false)
      ) {
        return t('internalTransferAdvanceScale.timeOrder');
      }
      for (let gi = 0; gi < row.groups.length; gi++) {
        const group = row.groups[gi];
        if (gi < row.groups.length - 1 && (group.min === '' || group.max === '')) {
          return t('internalTransferAdvanceScale.rangeRequired');
        }
        if (group.min !== '' && group.max !== '' && Number(group.min) > Number(group.max)) {
          return t('internalTransferAdvanceScale.rangeInvalid');
        }
        if (group.ratio === '') return t('internalTransferAdvanceScale.ratioRequired');
      }
      for (let gi = 0; gi < row.groups.length - 1; gi++) {
        if (row.groups[gi].max !== row.groups[gi + 1].min) {
          return t('internalTransferAdvanceScale.rangeContinuous');
        }
      }
    }

    for (let i = 0; i < timeRules.length; i++) {
      for (let j = i + 1; j < timeRules.length; j++) {
        const a = timeRules[i];
        const b = timeRules[j];
        if (!a.weekDays.some(day => b.weekDays.includes(day))) continue;
        if (
          toMinutes(a.startTime, false) < toMinutes(b.endTime, true) &&
          toMinutes(b.startTime, false) < toMinutes(a.endTime, true)
        ) {
          return t('internalTransferAdvanceScale.timeConflict');
        }
      }
    }
    return null;
  };

  const handleSave = async () => {
    const message = validate();
    if (message) {
      toast.error(message);
      return;
    }
    const result = await save({
      interTransAdvanceScaleStatus: enabled ? 1 : 0,
      interTransAdvanceScaleScheme: scheme,
      generalSettingList: general.map((row, index) => ({
        id: row.id || null,
        minValue: row.min,
        maxValue: index === general.length - 1 ? '' : row.max,
        withdralRatio: row.ratio,
        type: 2,
      })),
      personalSettingList: timeRulesOpen
        ? timeRules.map(row => ({
            id: row.id || null,
            weekDay: row.weekDays.join(','),
            startTime: row.startTime,
            endTime: row.endTime,
            type: 2,
            withdrawRatioJson: JSON.stringify(
              row.groups.map((group, index) => ({
                minValue: group.min,
                maxValue: group.max,
                withdralRatio: group.ratio,
                sort: index + 1,
              })),
            ),
          }))
        : [],
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
      title={t('internalTransferAdvanceScale.title')}
      variant="adaptive"
      type="submit"
      confirmText={t('common.save')}
      isConfirmDisabled={readFailed}
      formLoading={isPending}
      onConfirm={handleSave}
    >
      <div className="w-[880px] max-w-full py-4 text-sm">
        {readFailed && (
          <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-amber-800">
            {t('internalTransferAdvanceScale.readApiMissing')}
          </div>
        )}
        {isLoading ? (
          <div className="flex h-60 items-center justify-center">
            <RrhCircleLoading />
          </div>
        ) : readFailed ? null : (
          <>
            <p className="text-muted-foreground mb-4">{t('internalTransferAdvanceScale.desc')}</p>

            <div className="mb-4 flex items-center gap-3">
              <span className="font-semibold">{t('common.enable')}</span>
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </div>

            <div className="mb-4 flex items-center gap-3">
              <span className="font-semibold">{t('internalTransferAdvanceScale.schemeLabel')}</span>
              <label className="flex cursor-pointer items-center gap-1">
                <input
                  type="radio"
                  name="interTransAdvanceScaleScheme"
                  className="accent-primary"
                  checked={scheme === '1'}
                  onChange={() => setScheme('1')}
                />
                {t('internalTransferAdvanceScale.schemeAdvance')}
              </label>
              <label className="flex cursor-pointer items-center gap-1">
                <input
                  type="radio"
                  name="interTransAdvanceScaleScheme"
                  className="accent-primary"
                  checked={scheme === '2'}
                  onChange={() => setScheme('2')}
                />
                {t('internalTransferAdvanceScale.schemeWithdraw')}
              </label>
              <span className="text-muted-foreground text-xs">
                {t('internalTransferAdvanceScale.schemeTip')}
              </span>
            </div>

            <div className="mb-2 font-semibold">{t('internalTransferAdvanceScale.limitTitle')}</div>
            <div className="bg-muted/50 mb-3 rounded-md px-3 py-2 text-xs whitespace-pre-line">
              {t('internalTransferAdvanceScale.limitTip')}
            </div>

            <div className="mb-1 font-semibold">
              {t('internalTransferAdvanceScale.generalRules')}
            </div>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="w-12 border px-2 py-2">{t('CRMAccountPage.Index')}</th>
                  <th className="border px-2 py-2 text-left">{rangeTitle}</th>
                  <th className="w-40 border px-2 py-2">
                    {t('internalTransferAdvanceScale.ratio')}
                  </th>
                  <th className="w-20 border px-2 py-2">{t('common.Operation')}</th>
                </tr>
              </thead>
              <tbody>
                {general.map((row, index) => {
                  const isLast = index === general.length - 1;
                  return (
                    <tr key={index}>
                      <td className="border px-2 py-2 text-center">{index + 1}</td>
                      <td className="border px-2 py-2">
                        <div className="flex items-center gap-1">
                          <Input
                            className="h-8 w-20"
                            value={row.min}
                            onChange={e =>
                              updateGeneral(index, { min: onlyInteger(e.target.value) })
                            }
                          />
                          <span>% &ndash;</span>
                          {isLast ? (
                            <span className="bg-muted text-muted-foreground inline-flex h-8 w-20 items-center justify-center rounded-md border">
                              {t('internalTransferAdvanceScale.highest')}
                            </span>
                          ) : (
                            <Input
                              className="h-8 w-20"
                              value={row.max}
                              onChange={e =>
                                updateGeneral(index, { max: onlyInteger(e.target.value) })
                              }
                            />
                          )}
                          <span>%</span>
                        </div>
                      </td>
                      <td className="border px-2 py-2">
                        <div className="flex items-center justify-center gap-1">
                          <Input
                            className="h-8 w-20"
                            value={row.ratio}
                            onChange={e =>
                              updateGeneral(index, { ratio: onlyRatio(e.target.value) })
                            }
                          />
                          <span>%</span>
                        </div>
                      </td>
                      <td className="border px-2 py-2 text-center">
                        <button
                          type="button"
                          className="text-primary cursor-pointer"
                          onClick={() => removeGeneral(index)}
                        >
                          {t('common.delete')}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <button
              type="button"
              className="border-primary text-primary mt-2 cursor-pointer rounded-md border px-3 py-1.5"
              onClick={() => setGeneral(prev => [...prev, emptyGeneral()])}
            >
              {t('internalTransferAdvanceScale.addRule')}
            </button>

            <div className="mt-4">
              <button
                type="button"
                className="text-primary cursor-pointer underline"
                onClick={() => setTimeRulesOpen(prev => !prev)}
              >
                {timeRulesOpen
                  ? t('internalTransferAdvanceScale.closeTimeRules')
                  : t('internalTransferAdvanceScale.configureTimeRules')}
              </button>
            </div>

            {timeRulesOpen && (
              <div className="mt-2">
                <div className="mb-1 font-semibold">
                  {t('internalTransferAdvanceScale.timeRules')}
                </div>
                <div className="text-muted-foreground mb-2 text-xs">
                  {t('internalTransferAdvanceScale.timeRulesTip')}
                </div>
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="w-12 border px-2 py-2">{t('CRMAccountPage.Index')}</th>
                      <th className="w-64 border px-2 py-2">
                        {t('internalTransferAdvanceScale.validity')}
                      </th>
                      <th className="border px-2 py-2 text-left">{rangeTitle}</th>
                      <th className="w-40 border px-2 py-2">
                        {t('internalTransferAdvanceScale.ratio')}
                      </th>
                      <th className="w-20 border px-2 py-2">{t('common.Operation')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeRules.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="border px-2 py-2 text-center">{rowIndex + 1}</td>
                        <td className="border px-2 py-2">
                          <div className="flex flex-col gap-1">
                            <RrhMultiSelect
                              options={weekDayOptions}
                              value={row.weekDays}
                              onValueChange={value => updateTimeRule(rowIndex, { weekDays: value })}
                              placeholder={t('internalTransferAdvanceScale.selectWeekday')}
                              className="h-8 w-full"
                            />
                            <div className="flex items-center gap-1">
                              <Input
                                type="time"
                                className="h-8 w-28"
                                value={row.startTime}
                                onChange={e =>
                                  updateTimeRule(rowIndex, { startTime: e.target.value })
                                }
                              />
                              <span>-</span>
                              <Input
                                type="time"
                                className="h-8 w-28"
                                value={row.endTime}
                                onChange={e =>
                                  updateTimeRule(rowIndex, { endTime: e.target.value })
                                }
                              />
                            </div>
                          </div>
                        </td>
                        <td className="border px-2 py-2">
                          <div className="flex flex-col gap-1">
                            {row.groups.map((group, groupIndex) => (
                              <div key={groupIndex} className="flex h-8 items-center gap-1">
                                <Input
                                  className="h-8 w-20"
                                  value={group.min}
                                  onChange={e =>
                                    updateTimeGroup(rowIndex, groupIndex, {
                                      min: onlyInteger(e.target.value),
                                    })
                                  }
                                />
                                <span>% &ndash;</span>
                                <Input
                                  className="h-8 w-20"
                                  value={group.max}
                                  placeholder={t('internalTransferAdvanceScale.highest')}
                                  onChange={e =>
                                    updateTimeGroup(rowIndex, groupIndex, {
                                      max: onlyInteger(e.target.value),
                                    })
                                  }
                                />
                                <span>%</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="border px-2 py-2">
                          <div className="flex flex-col gap-1">
                            {row.groups.map((group, groupIndex) => (
                              <div
                                key={groupIndex}
                                className="flex h-8 items-center justify-center gap-1"
                              >
                                <Input
                                  className="h-8 w-20"
                                  value={group.ratio}
                                  onChange={e =>
                                    updateTimeGroup(rowIndex, groupIndex, {
                                      ratio: onlyRatio(e.target.value),
                                    })
                                  }
                                />
                                <span>%</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="border px-2 py-2">
                          <div className="flex flex-col gap-1">
                            {row.groups.map((_, groupIndex) => (
                              <div
                                key={groupIndex}
                                className="flex h-8 items-center justify-center gap-3"
                              >
                                <button
                                  type="button"
                                  className="text-primary cursor-pointer text-lg leading-none"
                                  onClick={() => addTimeGroup(rowIndex)}
                                >
                                  +
                                </button>
                                <button
                                  type="button"
                                  className="text-primary cursor-pointer text-lg leading-none"
                                  onClick={() => removeTimeGroup(rowIndex, groupIndex)}
                                >
                                  &ndash;
                                </button>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  type="button"
                  className="border-primary text-primary mt-2 cursor-pointer rounded-md border px-3 py-1.5"
                  onClick={addTimeRule}
                >
                  {t('internalTransferAdvanceScale.addRule')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </RrhDialog>
  );
};
