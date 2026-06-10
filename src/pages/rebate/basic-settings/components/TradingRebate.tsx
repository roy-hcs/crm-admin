import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { FormRadio } from '@/components/form/FormRadio';
import {
  EditRebateBaseAddOrUpdateParams,
  useEditRebateBaseAddOrUpdate,
  useGetRebateBaseAddOrUpdate,
} from '@/api/hooks/rebate';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGlobalLoading } from '@/contexts/loading/useGlobalLoading';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ServerItem } from '@/api/hooks/system';
import { useGetGroupByServer } from '@/api/hooks/account';
import { RrhSelect } from '@/components/common/RrhSelect';
import { Input } from '@/components/ui/input';
import FormDateInput from '@/components/form/FormDateInput';
import { FormTimeOfDayInput } from '@/components/form/FormTimeOfDayInput';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhAlert } from '@/components/common/RrhAlert';
import { weekOptions } from '@/lib/const';
import { RrhForm } from '@/components/form/RrhForm';

type FormValues = EditRebateBaseAddOrUpdateParams;
type GroupSettingItem = { server: string; serverGroup: string; interval: string };

const EMPTY_GROUP_SETTING_ITEM: GroupSettingItem = {
  server: '',
  serverGroup: '',
  interval: '',
};

const parseGroupSetting = (setting: string): GroupSettingItem[] => {
  if (!setting) return [EMPTY_GROUP_SETTING_ITEM];

  try {
    const parsed = JSON.parse(setting);
    if (!Array.isArray(parsed)) return [EMPTY_GROUP_SETTING_ITEM];

    const normalized = parsed
      .filter(item => item && typeof item === 'object')
      .map(item => ({
        server: `${item.server ?? ''}`,
        serverGroup: `${item.serverGroup ?? ''}`,
        interval: `${item.interval ?? ''}`,
      }));

    return normalized.length > 0 ? normalized : [EMPTY_GROUP_SETTING_ITEM];
  } catch {
    return [EMPTY_GROUP_SETTING_ITEM];
  }
};

const normalizePositiveIntegerInput = (raw: string) => {
  const digitsOnly = raw.replace(/\D/g, '');
  if (!digitsOnly) return '';

  // 正整数不允许 0，去掉前导 0；如果全是 0 则清空。
  const normalized = digitsOnly.replace(/^0+/, '');
  return normalized;
};

const PositiveIntegerInputWithUnit = ({
  value,
  onChange,
  unit,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  unit: string;
  placeholder: string;
}) => {
  return (
    <div className={cn('relative w-full')}>
      <Input
        className="disabled:text-muted-foreground h-10 pr-15 text-sm"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={e => onChange(normalizePositiveIntegerInput(e.target.value))}
        placeholder={placeholder}
        maxLength={64}
      />
      <span className={cn('text-sidebar-ring absolute right-3 bottom-1/2 translate-y-1/2 text-sm')}>
        {unit}
      </span>
    </div>
  );
};

const GroupSettingRow = ({
  row,
  index,
  canDelete,
  serverOptions,
  onChange,
  onAdd,
  onDelete,
}: {
  row: GroupSettingItem;
  index: number;
  canDelete: boolean;
  serverOptions: ServerItem[];
  onChange: (index: number, patch: Partial<GroupSettingItem>) => void;
  onAdd: () => void;
  onDelete: (index: number) => void;
}) => {
  const { t } = useTranslation();
  const { data: groupData } = useGetGroupByServer({ serverId: row.server });

  const serverSelectOptions = useMemo(
    () =>
      serverOptions
        .filter(item => item.id !== '')
        .map(item => ({
          label: item.serverName,
          value: item.id,
        })),
    [serverOptions],
  );

  const groupSelectOptions = useMemo(
    () =>
      (groupData || [])
        .filter(item => item !== '')
        .map(item => ({
          label: item,
          value: item,
        })),
    [groupData],
  );

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
      <div className="md:col-span-4">
        <RrhSelect
          options={serverSelectOptions}
          value={row.server}
          onValueChange={val => onChange(index, { server: val, serverGroup: '' })}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          className="w-full"
        />
      </div>
      <div className="md:col-span-4">
        <RrhSelect
          options={groupSelectOptions}
          value={row.serverGroup}
          onValueChange={val => onChange(index, { serverGroup: val })}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          className="w-full"
          disabled={!row.server}
        />
      </div>
      <div className="md:col-span-2">
        <PositiveIntegerInputWithUnit
          value={row.interval}
          onChange={val => onChange(index, { interval: val })}
          unit={t('common.s')}
          placeholder={t('RebateBasicSettingsPage.globalSettingPlaceholder')}
        />
      </div>
      <div className="flex items-center gap-2 md:col-span-2">
        <RrhButton type="button" variant="outline" onClick={onAdd} className="h-9 px-3">
          {t('common.add')}
        </RrhButton>
        <RrhButton
          type="button"
          variant="outline"
          onClick={() => onDelete(index)}
          className="h-9 px-3"
          disabled={!canDelete}
        >
          {t('common.delete')}
        </RrhButton>
      </div>
    </div>
  );
};

const GlobalSetting = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const { t } = useTranslation();
  return (
    <PositiveIntegerInputWithUnit
      value={value}
      onChange={onChange}
      unit={t('common.s')}
      placeholder={t('RebateBasicSettingsPage.globalSettingPlaceholder')}
    />
  );
};

const GroupSetting = ({
  setting,
  serverOptions,
  onChange,
}: {
  setting: string;
  serverOptions: ServerItem[];
  onChange?: (value: string) => void;
}) => {
  const [rows, setRows] = useState<GroupSettingItem[]>(() => parseGroupSetting(setting));
  const serializedRows = useMemo(() => JSON.stringify(rows), [rows]);
  const lastEmittedRef = useRef<string>('');

  useEffect(() => {
    setRows(parseGroupSetting(setting));
  }, [setting]);

  useEffect(() => {
    if (!onChange) return;
    if (lastEmittedRef.current === serializedRows) return;

    onChange(serializedRows);
    lastEmittedRef.current = serializedRows;
  }, [serializedRows, onChange]);

  const handleRowChange = (index: number, patch: Partial<GroupSettingItem>) => {
    setRows(prev => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const handleAdd = () => {
    setRows(prev => [...prev, { ...EMPTY_GROUP_SETTING_ITEM }]);
  };

  const handleDelete = (index: number) => {
    setRows(prev => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="grid gap-2">
      {rows.map((row, index) => (
        <GroupSettingRow
          key={`${index}-${row.server}-${row.serverGroup}-${row.interval}`}
          row={row}
          index={index}
          canDelete={rows.length > 1}
          serverOptions={serverOptions}
          onChange={handleRowChange}
          onAdd={handleAdd}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export function TradingRebate() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [tipsText, setTipsText] = useState('');
  const { data: rebateRes, isLoading } = useGetRebateBaseAddOrUpdate('1');
  const { withLoading } = useGlobalLoading();
  const id = rebateRes?.data?.rebateBase?.id || '1';
  const hasOpen = rebateRes?.data?.rebateBase?.hasOpen || '1';
  const getMyselfRebate = rebateRes?.data?.rebateBase?.getMyselfRebate || '1';
  const timeIntervalSetting = `${rebateRes?.data?.rebateBase?.timeIntervalSetting ?? '1'}`;
  const closeTimeInterval =
    rebateRes?.data?.rebateBase?.closeTimeInterval === '0'
      ? ''
      : `${rebateRes?.data?.rebateBase?.closeTimeInterval ?? ''}`;
  const lastOrderRebateTime = rebateRes?.data?.rebateBase?.lastOrderRebateTime || '';
  const personRabateCheck = rebateRes?.data?.rebateBase?.personRabateCheck || '1';
  const settleStyle = rebateRes?.data?.rebateBase?.settleStyle || '0';
  const settleTime = rebateRes?.data?.rebateBase?.settleTime || '';
  const settleWeek = rebateRes?.data?.rebateBase?.settleWeek || '';
  const settleWeekTime = rebateRes?.data?.rebateBase?.settleWeekTime || '';
  const rebateType = rebateRes?.data?.rebateBase?.rebateType || '';
  const { mutateAsync: editBase } = useEditRebateBaseAddOrUpdate();
  const form = useForm<FormValues>({
    defaultValues: {
      id: '',
      hasOpen: '1',
      getMyselfRebate: '',
      closeTimeInterval: '',
      lastOrderRebateTime: '',
      personRabateCheck: '',
      settleStyle: '',
      settleTime: '', //日结
      settleWeek: '', // 周结
      settleWeekTime: '', // 周结
      rebateType: '',
      timeIntervalSetting: '1',
    },
  });

  const timeIntervalSettingValue = form.watch('timeIntervalSetting');
  const closeTimeIntervalValue = form.watch('closeTimeInterval') || '';
  const settleStyleValue = form.watch('settleStyle');
  const personRabateCheckValue = form.watch('personRabateCheck');
  const prevTimeIntervalSettingRef = useRef<string>('');
  const hasHydratedFromApiRef = useRef(false);
  const mode1BaseValueRef = useRef('');
  const mode2BaseValueRef = useRef(JSON.stringify([]));

  const setCloseTimeIntervalSafely = useCallback(
    (nextValue: string) => {
      const currentValue = form.getValues('closeTimeInterval') || '';
      if (currentValue === nextValue) return;
      form.setValue('closeTimeInterval', nextValue);
    },
    [form],
  );

  useEffect(() => {
    // 接口回填前不处理切换逻辑，避免误清空。
    if (!hasHydratedFromApiRef.current) return;

    // 首次进入时仅记录，不做处理。
    if (!prevTimeIntervalSettingRef.current) {
      prevTimeIntervalSettingRef.current = timeIntervalSettingValue;
      return;
    }

    if (prevTimeIntervalSettingRef.current === timeIntervalSettingValue) return;

    if (timeIntervalSettingValue === '1') {
      // 切回全局设置：恢复模式1的接口基础值。
      setCloseTimeIntervalSafely(mode1BaseValueRef.current || '');
    } else if (timeIntervalSettingValue === '2') {
      // 切回分组设置：恢复模式2的接口基础值。
      setCloseTimeIntervalSafely(mode2BaseValueRef.current || JSON.stringify([]));
    }

    prevTimeIntervalSettingRef.current = timeIntervalSettingValue;
  }, [setCloseTimeIntervalSafely, timeIntervalSettingValue]);

  const onSubmit = async (data: FormValues) => {
    await withLoading(async () => {
      try {
        const params = {
          id: data.id,
          hasOpen: data.hasOpen,
          getMyselfRebate: data.getMyselfRebate,
          closeTimeInterval: data.closeTimeInterval,
          lastOrderRebateTime: data.lastOrderRebateTime,
          personRabateCheck: data.personRabateCheck,
          settleStyle: data.settleStyle,
          settleTime: data.settleTime,
          settleWeek: data.settleWeek,
          settleWeekTime: data.settleWeekTime,
          rebateType: '1',
          timeIntervalSetting: data.timeIntervalSetting,
        };
        const res = await editBase(params);
        if (res.code === 0) {
          toast.success(t('common.success'));
        } else {
          toast.error(res.msg);
        }
      } catch (error) {
        console.error('Submit error', error);
      }
    });
  };

  useEffect(() => {
    form.reset({
      id: id,
      hasOpen: hasOpen,
      getMyselfRebate: getMyselfRebate,
      closeTimeInterval: closeTimeInterval,
      lastOrderRebateTime: lastOrderRebateTime,
      personRabateCheck: personRabateCheck,
      settleStyle: settleStyle,
      settleTime: settleTime,
      settleWeek: settleWeek,
      settleWeekTime: settleWeekTime,
      rebateType: rebateType,
      timeIntervalSetting: timeIntervalSetting,
    });

    // 记录接口基础值：仅使用接口数据更新缓存，不记录用户临时输入。
    if (timeIntervalSetting === '1') {
      mode1BaseValueRef.current = closeTimeInterval;
      mode2BaseValueRef.current = JSON.stringify([]);
    } else if (timeIntervalSetting === '2') {
      mode2BaseValueRef.current = closeTimeInterval || JSON.stringify([]);
      mode1BaseValueRef.current = '';
    }

    prevTimeIntervalSettingRef.current = timeIntervalSetting;
    hasHydratedFromApiRef.current = true;
  }, [
    form,
    id,
    hasOpen,
    getMyselfRebate,
    timeIntervalSetting,
    closeTimeInterval,
    personRabateCheck,
    lastOrderRebateTime,
    settleStyle,
    settleTime,
    settleWeek,
    settleWeekTime,
    rebateType,
  ]);

  const handleConfirm = () => {
    if (timeIntervalSettingValue === '2') {
      // 如果是按照组别设置 至少要有一条数据 没有的话要提示输入
      const currentGroupSetting = form.getValues('closeTimeInterval');
      const parsedGroupSetting = parseGroupSetting(currentGroupSetting || '');
      // server 和 serverGroup 两个值任何一项为空 都要提示 至少设置一条记录
      const hasInvalidEntry = parsedGroupSetting.some(item => !item.server || !item.serverGroup);
      if (hasInvalidEntry) {
        toast.error(t('RebateBasicSettingsPage.SetLeastOneRecord'));
        return;
      }
    }
    setTipsText(t('RebateBasicSettingsPage.confirmOperation'));
    setOpen(true);
  };

  const onConfirm = () => {
    form.handleSubmit(onSubmit)();
  };

  if (isLoading) {
    return (
      <div className="h-100">
        <RrhCircleLoading />;
      </div>
    );
  }
  return (
    <div className="grid gap-6">
      <RrhForm form={form} className="grid gap-y-6">
        <FormRadio
          name="hasOpen"
          orientation="horizontal"
          label={t('RebateBasicSettingsPage.hasOpen')}
          options={[
            { label: t('common.yes'), value: '1' },
            { label: t('common.no'), value: '0' },
          ]}
        />
        <FormRadio
          name="getMyselfRebate"
          orientation="horizontal"
          label={t('RebateBasicSettingsPage.getMyselfRebate')}
          options={[
            { label: t('common.yes'), value: '1' },
            { label: t('common.no'), value: '0' },
          ]}
          labeTipsDom={
            <div className="text-muted-foreground text-xs leading-4">
              *{t('RebateBasicSettingsPage.getMyselfRebateDesc')}
            </div>
          }
        />
        <FormRadio
          name="timeIntervalSetting"
          orientation="horizontal"
          label={t('RebateBasicSettingsPage.timeIntervalSetting')}
          options={[
            { label: t('RebateBasicSettingsPage.globalSetting'), value: '1' },
            { label: t('RebateBasicSettingsPage.groupSetting'), value: '2' },
          ]}
          labeTipsDom={
            <div className="text-muted-foreground text-xs leading-4">
              *{t('RebateBasicSettingsPage.timeIntervalSettingDesc')}
            </div>
          }
        />
        {timeIntervalSettingValue === '1' && (
          <GlobalSetting value={closeTimeIntervalValue} onChange={setCloseTimeIntervalSafely} />
        )}
        {timeIntervalSettingValue === '2' && (
          <GroupSetting
            setting={closeTimeIntervalValue || JSON.stringify([])}
            serverOptions={rebateRes?.data?.mtServiceList || []}
            onChange={setCloseTimeIntervalSafely}
          />
        )}

        <FormDateInput
          label={t('RebateBasicSettingsPage.lastOrderRebateTime')}
          labeTipsDom={
            <div className="text-muted-foreground text-xs leading-4">
              *{t('RebateBasicSettingsPage.lastOrderRebateTimeDesc')}
            </div>
          }
          name="lastOrderRebateTime"
          showTime
        />

        <FormRadio
          name="personRabateCheck"
          orientation="horizontal"
          label={t('RebateBasicSettingsPage.personRabateCheck')}
          labeTipsDom={
            <div className="text-muted-foreground text-xs leading-4">
              *{t('RebateBasicSettingsPage.personRabateCheckDesc')}
            </div>
          }
          options={[
            { label: t('common.yes'), value: '1' },
            { label: t('common.no'), value: '0' },
          ]}
        />

        {personRabateCheckValue === '1' && (
          <div className="grid gap-6">
            <FormRadio
              name="settleStyle"
              label={t('RebateBasicSettingsPage.settleStyle')}
              options={[
                { label: t('RebateBasicSettingsPage.settleTimeRadio.0'), value: '0' },
                { label: t('RebateBasicSettingsPage.settleTimeRadio.1'), value: '1' },
                { label: t('RebateBasicSettingsPage.settleTimeRadio.2'), value: '2' },
              ]}
            />
            {settleStyleValue === '1' && (
              <FormTimeOfDayInput<FormValues>
                name="settleTime"
                label={t('RebateBasicSettingsPage.daySummary')}
                precision="minute"
              />
            )}
            {settleStyleValue === '2' && (
              <FormSelect
                name="settleWeek"
                label={t('RebateBasicSettingsPage.weekSummary')}
                placeholder={t('common.pleaseSelect')}
                showRowValue={false}
                options={weekOptions.map(item => ({
                  label: t(item.label),
                  value: item.value,
                }))}
              />
            )}
            {settleStyleValue === '2' && (
              <FormTimeOfDayInput<FormValues>
                name="settleWeekTime"
                label={t('RebateBasicSettingsPage.weekSummary')}
                precision="minute"
              />
            )}
          </div>
        )}
      </RrhForm>
      <div className="flex justify-end">
        <RrhButton variant="default" onClick={handleConfirm}>
          {t('common.Confirm')}
        </RrhButton>
      </div>
      <RrhAlert
        trigger={null}
        open={open}
        onOpenChange={setOpen}
        cancelText={t('common.Cancel')}
        confirmText={t('common.Confirm')}
        title={t('common.SystemPrompt')}
        content={tipsText}
        onConfirm={onConfirm}
      />
    </div>
  );
}
