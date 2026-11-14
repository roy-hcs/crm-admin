import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { RrhDialog } from '@/components/common/RrhDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  useAddPermPackage,
  useCheckCodeUnique,
  useCheckNameUnique,
  useCountApplicableUsers,
  useEditPermPackage,
  useServerAccountTypes,
} from '@/api/hooks/setting/spreadPermPackage';
import {
  EMPTY_PERM_PACKAGE_FORM,
  type ApplicableUserSettingsForm,
  type PermPackageDialogMode,
  type PermPackageFormValues,
  type PermPackageItem,
} from '@/api/hooks/setting/permPackageTypes';

/** 旧页 7 个适用类型 checkbox 的 value 与 i18n 键 */
const APPLICABLE_TYPES = [
  { value: '1', label: 'type1' },
  { value: '2', label: 'type2' },
  { value: '3', label: 'type3' },
  { value: '4', label: 'type4' },
  { value: '5', label: 'type5' },
  { value: '6', label: 'type6' },
  { value: '7', label: 'type7' },
] as const;

const csv = (value?: string): string[] =>
  value
    ? value
        .split(',')
        .map(part => part.trim())
        .filter(Boolean)
    : [];

/** 列表行 → 表单值。旧页编辑页由服务端渲染带出适用用户配置，REST 列表无该结构，见 docs/testids.md 口径差异 */
function fromListItem(item: PermPackageItem): PermPackageFormValues {
  return {
    ...EMPTY_PERM_PACKAGE_FORM,
    id: String(item.id ?? ''),
    name: item.name ?? '',
    code: item.code ?? '',
    remark: item.remark ?? '',
    purpose: item.purpose ?? '',
    purposeDisabled: item.purposeDisabled ?? '',
    status: item.status ?? '1',
    serverIds: csv(item.serverIds),
    accountGroupIds: csv(item.accountGroupIds),
    lever: item.lever ?? '',
    defaultRoleIds: csv(item.defaultRoleIds),
    walletCurrency: item.walletCurrency ?? '',
  };
}

export const PermPackageDialog = ({
  open,
  setOpen,
  mode,
  item,
  onSuccess,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: PermPackageDialogMode;
  item?: PermPackageItem;
  onSuccess?: () => void;
}) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<PermPackageFormValues>(EMPTY_PERM_PACKAGE_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nameDuplicated, setNameDuplicated] = useState(false);
  const [codeDuplicated, setCodeDuplicated] = useState(false);
  const [showAccountTypes, setShowAccountTypes] = useState(false);
  const [userCount, setUserCount] = useState<number | null>(null);

  const { mutateAsync: add } = useAddPermPackage();
  const { mutateAsync: edit } = useEditPermPackage();
  const { mutateAsync: checkName } = useCheckNameUnique();
  const { mutateAsync: checkCode } = useCheckCodeUnique();
  const { mutateAsync: countUsers } = useCountApplicableUsers();
  const serverIdsCsv = form.serverIds.join(',');
  const { data: accountTypesRes } = useServerAccountTypes(serverIdsCsv, {
    enabled: showAccountTypes,
  });

  useEffect(() => {
    if (!open) return;
    setForm(mode === 'edit' && item ? fromListItem(item) : EMPTY_PERM_PACKAGE_FORM);
    setErrors({});
    setNameDuplicated(false);
    setCodeDuplicated(false);
    setShowAccountTypes(false);
    setUserCount(null);
  }, [open, mode, item]);

  const setField = useCallback(
    <K extends keyof PermPackageFormValues>(key: K, value: PermPackageFormValues[K]) => {
      setForm(prev => ({ ...prev, [key]: value }));
    },
    [],
  );

  const setSetting = useCallback(
    <K extends keyof ApplicableUserSettingsForm>(key: K, value: ApplicableUserSettingsForm[K]) => {
      setForm(prev => ({
        ...prev,
        applicableUserSettings: { ...prev.applicableUserSettings, [key]: value },
      }));
    },
    [],
  );

  const accountTypeEntries = useMemo(() => {
    const payload = accountTypesRes?.data;
    if (!payload || typeof payload !== 'object') return [];
    return Object.entries(payload).map(([serverId, value]) => ({
      serverId,
      labels: Array.isArray(value) ? value.map(String) : [String(value)],
    }));
  }, [accountTypesRes]);

  const onNameBlur = useCallback(async () => {
    if (!form.name) return;
    try {
      const result = await checkName({ name: form.name, id: form.id });
      setNameDuplicated(String(result) === '1');
    } catch {
      setNameDuplicated(false);
    }
  }, [checkName, form.name, form.id]);

  const onCodeBlur = useCallback(async () => {
    if (!form.code) return;
    try {
      const result = await checkCode({ code: form.code, id: form.id });
      setCodeDuplicated(String(result) === '1');
    } catch {
      setCodeDuplicated(false);
    }
  }, [checkCode, form.code, form.id]);

  const onCountUsers = useCallback(async () => {
    try {
      const result = await countUsers(form.applicableUserSettings);
      setUserCount(result?.data ?? null);
    } catch {
      setUserCount(null);
    }
  }, [countUsers, form.applicableUserSettings]);

  /** 旧页约束：name 必填/32、code 64、remark 200、lang-name 50、lang-remark 200 */
  const validate = useCallback((): Record<string, string> => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = t('permPackagePage.nameRequired');
    else if (form.name.length > 32) next.name = t('permPackagePage.nameMax');
    else if (nameDuplicated) next.name = t('permPackagePage.nameDuplicate');
    if (form.code.length > 64) next.code = t('permPackagePage.codeMax');
    else if (codeDuplicated) next.code = t('permPackagePage.codeDuplicate');
    if (form.remark.length > 200) next.remark = t('permPackagePage.remarkMax');
    if (form.nameLanguageList.some(lang => lang.name.length > 50)) {
      next.languages = t('permPackagePage.langNameMax');
    }
    if (form.nameLanguageList.some(lang => lang.remark.length > 200)) {
      next.languages = t('permPackagePage.langRemarkMax');
    }
    return next;
  }, [codeDuplicated, form, nameDuplicated, t]);

  const onConfirm = useCallback(async () => {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    try {
      if (mode === 'add') await add(form);
      else await edit(form);
      toast.success(t('common.success'));
      setOpen(false);
      onSuccess?.();
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    }
  }, [add, edit, form, mode, onSuccess, setOpen, t, validate]);

  const textField = (
    key: 'purpose' | 'purposeDisabled' | 'lever' | 'walletCurrency' | 'id',
    label: string,
  ) => (
    <label className="flex flex-col gap-1 text-sm" key={key}>
      <span>{label}</span>
      <Input
        id={`perm-${key}`}
        value={form[key]}
        onChange={event => setField(key, event.target.value)}
      />
    </label>
  );

  const csvField = (
    key: 'serverIds' | 'accountGroupIds' | 'defaultRoleIds',
    label: string,
    testId?: string,
  ) => (
    <label className="flex flex-col gap-1 text-sm" key={key}>
      <span>{label}</span>
      <Input
        data-testid={testId}
        value={form[key].join(',')}
        placeholder={t('permPackagePage.csvHint')}
        onChange={event => setField(key, csv(event.target.value))}
      />
    </label>
  );

  const settingsCsvField = (
    key: 'roles' | 'tags' | 'userIds' | 'userSubIds' | 'agentSubIds',
    label: string,
  ) => (
    <label className="flex flex-col gap-1 text-sm" key={key}>
      <span>{label}</span>
      <Input
        value={form.applicableUserSettings[key].join(',')}
        placeholder={t('permPackagePage.csvHint')}
        onChange={event => setSetting(key, csv(event.target.value))}
      />
    </label>
  );

  return (
    <RrhDialog
      title={
        mode === 'add'
          ? t('common.addField', { field: t('permPackagePage.title') })
          : t('common.modify', { field: t('permPackagePage.title') })
      }
      open={open}
      onOpenChange={setOpen}
      onCancel={() => setOpen(false)}
      variant="large"
      footerShow={false}
      type="submit"
    >
      <div
        data-testid="spread-perm-dialog"
        className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto px-1"
      >
        <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <h3 className="text-sm font-semibold md:col-span-2">{t('permPackagePage.basicInfo')}</h3>
          <label className="flex flex-col gap-1 text-sm">
            <span>{t('permPackagePage.name')} *</span>
            <Input
              data-testid="spread-perm-name-field"
              maxLength={32}
              value={form.name}
              placeholder={t('permPackagePage.namePlaceholder')}
              onChange={event => setField('name', event.target.value)}
              onBlur={() => void onNameBlur()}
            />
            {errors.name && <span className="text-destructive text-xs">{errors.name}</span>}
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span>{t('permPackagePage.code')}</span>
            <Input
              data-testid="spread-perm-code-field"
              maxLength={64}
              value={form.code}
              placeholder={t('permPackagePage.codePlaceholder')}
              onChange={event => setField('code', event.target.value)}
              onBlur={() => void onCodeBlur()}
            />
            {errors.code && <span className="text-destructive text-xs">{errors.code}</span>}
          </label>
          <label className="flex flex-col gap-1 text-sm md:col-span-2">
            <span>{t('permPackagePage.remark')}</span>
            <Textarea
              data-testid="spread-perm-remark-field"
              maxLength={200}
              value={form.remark}
              placeholder={t('permPackagePage.remarkPlaceholder')}
              onChange={event => setField('remark', event.target.value)}
            />
            <span className="text-muted-foreground text-xs">{form.remark.length}/200</span>
            {errors.remark && <span className="text-destructive text-xs">{errors.remark}</span>}
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span>{t('permPackagePage.status')}</span>
            <select
              data-testid="spread-perm-status-trigger"
              className="border-input bg-background h-9 rounded-md border px-3 text-sm"
              value={form.status}
              onChange={event => setField('status', event.target.value)}
            >
              <option value="1">{t('permPackagePage.enable')}</option>
              <option value="0">{t('permPackagePage.disable')}</option>
            </select>
          </label>
          {textField('purpose', t('permPackagePage.purpose'))}
          {textField('purposeDisabled', t('permPackagePage.purposeDisabled'))}
          {textField('id', 'ID')}
        </section>

        <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <h3 className="text-sm font-semibold md:col-span-2">{t('permPackagePage.configInfo')}</h3>
          {csvField('serverIds', t('permPackagePage.serverIds'), 'spread-perm-server-trigger')}
          {csvField('accountGroupIds', t('permPackagePage.accountGroupIds'))}
          {textField('lever', t('permPackagePage.lever'))}
          {csvField('defaultRoleIds', t('permPackagePage.defaultRoleIds'))}
          {textField('walletCurrency', t('permPackagePage.walletCurrency'))}
          <div className="flex flex-wrap items-center gap-2 md:col-span-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-testid="spread-perm-account-type-option"
              onClick={() => setShowAccountTypes(true)}
            >
              {t('permPackagePage.queryAccountTypes')}
            </Button>
            <div className="flex flex-wrap gap-2">
              {accountTypeEntries.length === 0 && (
                <span className="text-muted-foreground text-xs">
                  {t('permPackagePage.accountTypeEmpty')}
                </span>
              )}
              {accountTypeEntries.flatMap(entry =>
                entry.labels.map(label => (
                  <span
                    key={`${entry.serverId}-${label}`}
                    data-testid="spread-perm-account-type-item"
                    className="bg-muted rounded px-2 py-1 text-xs"
                  >
                    {entry.serverId}: {label}
                  </span>
                )),
              )}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <h3 className="text-sm font-semibold md:col-span-2">{t('permPackagePage.userScope')}</h3>
          <label className="flex flex-col gap-1 text-sm">
            <span>{t('permPackagePage.applicableMode')}</span>
            <Input
              type="number"
              min={0}
              value={form.applicableUserSettings.applicableMode}
              onChange={event => setSetting('applicableMode', Number(event.target.value))}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span>{t('permPackagePage.countryId')}</span>
            <Input
              value={form.applicableUserSettings.countryId}
              onChange={event => setSetting('countryId', event.target.value)}
            />
          </label>
          <fieldset className="flex flex-wrap gap-3 md:col-span-2">
            <legend className="text-sm">{t('permPackagePage.applicableTypes')}</legend>
            {APPLICABLE_TYPES.map(option => (
              <label key={option.value} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={form.applicableUserSettings.applicableTypes.includes(option.value)}
                  onChange={event => {
                    const current = form.applicableUserSettings.applicableTypes;
                    const next = event.target.checked
                      ? [...current, option.value]
                      : current.filter(value => value !== option.value);
                    setSetting('applicableTypes', next);
                  }}
                />
                {t(`permPackagePage.${option.label}`)}
              </label>
            ))}
          </fieldset>
          {settingsCsvField('roles', t('permPackagePage.roles'))}
          {settingsCsvField('tags', t('permPackagePage.tags'))}
          {settingsCsvField('userIds', t('permPackagePage.userIds'))}
          {settingsCsvField('userSubIds', t('permPackagePage.userSubIds'))}
          {settingsCsvField('agentSubIds', t('permPackagePage.agentSubIds'))}
          <div className="flex items-center gap-3 md:col-span-2">
            <Button type="button" variant="outline" size="sm" onClick={() => void onCountUsers()}>
              {t('permPackagePage.countUsers')}
            </Button>
            <span data-testid="spread-perm-count-item" className="text-sm">
              {t('permPackagePage.countResult', { value: userCount ?? '-' })}
            </span>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">{t('permPackagePage.languages')}</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setField('nameLanguageList', [
                  ...form.nameLanguageList,
                  { language: '', name: '', remark: '' },
                ])
              }
            >
              {t('permPackagePage.addLanguage')}
            </Button>
          </div>
          {form.nameLanguageList.map((lang, index) => (
            <div key={index} className="grid grid-cols-1 gap-2 rounded border p-2 md:grid-cols-3">
              <label className="flex flex-col gap-1 text-sm">
                <span>{t('permPackagePage.languageCode')}</span>
                <Input
                  value={lang.language}
                  onChange={event => {
                    const next = [...form.nameLanguageList];
                    next[index] = { ...lang, language: event.target.value };
                    setField('nameLanguageList', next);
                  }}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span>{t('permPackagePage.languageName')}</span>
                <Input
                  maxLength={50}
                  value={lang.name}
                  onChange={event => {
                    const next = [...form.nameLanguageList];
                    next[index] = { ...lang, name: event.target.value };
                    setField('nameLanguageList', next);
                  }}
                />
                <span className="text-muted-foreground text-xs">{lang.name.length}/50</span>
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span>{t('permPackagePage.languageRemark')}</span>
                <Textarea
                  maxLength={200}
                  value={lang.remark}
                  onChange={event => {
                    const next = [...form.nameLanguageList];
                    next[index] = { ...lang, remark: event.target.value };
                    setField('nameLanguageList', next);
                  }}
                />
                <span className="text-muted-foreground text-xs">{lang.remark.length}/200</span>
              </label>
              <Button
                type="button"
                variant="link"
                size="sm"
                className="md:col-span-3"
                onClick={() =>
                  setField(
                    'nameLanguageList',
                    form.nameLanguageList.filter((_, i) => i !== index),
                  )
                }
              >
                {t('permPackagePage.removeLanguage')}
              </Button>
            </div>
          ))}
          {errors.languages && <span className="text-destructive text-xs">{errors.languages}</span>}
        </section>

        <div className="flex justify-end gap-2 border-t pt-3">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            {t('common.Cancel')}
          </Button>
          <Button
            type="button"
            data-testid="spread-perm-submit-button"
            onClick={() => void onConfirm()}
          >
            {t('common.Confirm')}
          </Button>
        </div>
      </div>
    </RrhDialog>
  );
};
