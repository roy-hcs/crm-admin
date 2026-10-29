import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { RefreshCcw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { RrhForm } from '@/components/form/RrhForm';
import { FormInput } from '@/components/form/FormInput';
import { FormSwitchGroup } from '@/components/form/FormSwitchGroup';
import { FormCrmRoleMultiSelect } from '@/components/form/FormCrmRoleMultiSelect';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAssociationDataQS, useSaveAssociationQS } from '@/api/hooks/setting/quickCreate';
import { useSynchronizeServerGroupSetting } from '@/api/hooks/setting/setting';
import { useDictType } from '@/api/hooks/system/system';
import {
  applyInputNormalizer,
  normalizePositiveDecimalInput,
} from '@/pages/marketing/shared/formValueUtils';

const sirixServiceType = 3;
const maxLeverCount = 20;
const presetLevers = ['100', '200', '500', '1000'];

type FormValues = {
  typeId: string;
  defaultMtGroup: string;
  lever: string[];
  openCreditBalance: string;
  roleIds: string[];
  status: string;
};

export const AssociationStep = ({
  serverId,
  subStep,
  onSubStepChange,
  onSaved,
  onSkip,
  onCancel,
}: {
  serverId: string;
  subStep: number;
  onSubStepChange: (sub: number) => void;
  onSaved: () => void;
  onSkip: () => void;
  onCancel: () => void;
}) => {
  const { t } = useTranslation();
  const { data, isLoading, refetch } = useAssociationDataQS(serverId);
  const { mutateAsync: save, isPending } = useSaveAssociationQS();
  const { mutateAsync: synchGroup, isPending: isSynching } = useSynchronizeServerGroupSetting();
  const { data: languageDict } = useDictType('sys_language');

  const [typeMode, setTypeMode] = useState<'existing' | 'new'>('existing');
  const [typeNames, setTypeNames] = useState<Record<string, string>>({});
  const [customLevers, setCustomLevers] = useState<string[]>([]);
  const [leverInput, setLeverInput] = useState('');

  const detail = data?.data;
  const serverTypes = useMemo(() => detail?.serverTypes || [], [detail]);
  const serverGroup = useMemo(() => detail?.serverGroup || [], [detail]);
  const isSirix = Number(detail?.server?.serviceType) === sirixServiceType;

  const languages = useMemo(
    () => (languageDict || []).map(item => ({ code: item.dictValue, label: item.dictLabel })),
    [languageDict],
  );

  const form = useForm<FormValues>({
    defaultValues: {
      typeId: '',
      defaultMtGroup: '',
      lever: [],
      openCreditBalance: '',
      roleIds: [],
      status: '1',
    },
  });
  const defaultMtGroup = form.watch('defaultMtGroup');
  const selectedLevers = form.watch('lever');

  const leverPool = useMemo(() => {
    if (isSirix) {
      const groupLever = detail?.groupLever?.[defaultMtGroup];
      return groupLever ? groupLever.split(',').filter(Boolean) : [];
    }
    return detail?.allLever || [];
  }, [detail, defaultMtGroup, isSirix]);

  const leverOptions = useMemo(
    () => [...leverPool, ...customLevers].map(value => ({ value, label: `1:${value}` })),
    [leverPool, customLevers],
  );

  useEffect(() => {
    if (!detail) return;
    setTypeMode((detail.serverTypes || []).length > 0 ? 'existing' : 'new');
    const firstGroup = detail.serverGroup?.[0] || '';
    if (firstGroup) {
      form.setValue('defaultMtGroup', firstGroup);
    }
  }, [detail, form]);

  // Sirix 的可用杠杆随组别变化，切换组别后需重新选择
  const onGroupChange = (value: string) => {
    form.setValue('defaultMtGroup', value);
    if (isSirix) {
      form.setValue('lever', []);
    }
  };

  const addLeverValue = (rawValue: string) => {
    const value = rawValue.trim();
    if (!value) {
      toast.warning(t('quickCreatePage.association.leverRequired'));
      return;
    }
    if (!/^[1-9]\d*$/.test(value)) {
      toast.warning(t('quickCreatePage.server.positiveInteger'));
      return;
    }
    if (leverPool.includes(value) || customLevers.includes(value)) {
      toast.warning(t('quickCreatePage.association.leverDuplicate'));
      return;
    }
    if (leverPool.length + customLevers.length >= maxLeverCount) {
      toast.warning(t('quickCreatePage.association.leverMax', { num: maxLeverCount }));
      return;
    }
    setCustomLevers(prev => [...prev, value]);
    form.setValue('lever', [...form.getValues('lever'), value]);
    setLeverInput('');
  };

  const validateFirstSubStep = () => {
    if (typeMode === 'existing') {
      if (!form.getValues('typeId')) {
        toast.warning(t('rules.required', { field: t('common.accountType') }));
        return false;
      }
    } else {
      const requiredLanguages = ['zh-CN', 'en-US'].filter(code =>
        languages.some(item => item.code === code),
      );
      const missing = requiredLanguages.find(code => !typeNames[code]?.trim());
      if (missing) {
        toast.warning(
          t('rules.required', {
            field:
              languages.find(item => item.code === missing)?.label ||
              t('quickCreatePage.association.accountTypeName'),
          }),
        );
        return false;
      }
      if (!Object.values(typeNames).some(name => name.trim())) {
        toast.warning(t('rules.required', { field: t('common.accountType') }));
        return false;
      }
    }
    if (!form.getValues('defaultMtGroup')) {
      toast.warning(t('rules.required', { field: t('serversSettingPage.defaultMtGroup') }));
      return false;
    }
    if (form.getValues('lever').length === 0) {
      toast.warning(t('rules.required', { field: t('common.level') }));
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (!validateFirstSubStep()) return;
    onSubStepChange(subStep + 1);
  };

  const onSynchGroup = async () => {
    try {
      const res = await synchGroup({ serverId });
      if (res.code !== 0) {
        toast.error(res.msg);
        return;
      }
      form.setValue('defaultMtGroup', '');
      form.setValue('lever', []);
      await refetch();
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!validateFirstSubStep()) {
      onSubStepChange(0);
      return;
    }
    if (values.openCreditBalance && !/^\d+(\.\d{1,2})?$/.test(values.openCreditBalance)) {
      toast.warning(t('quickCreatePage.association.creditInvalid'));
      return;
    }
    try {
      const res = await save({
        serverId,
        typeId: typeMode === 'existing' ? values.typeId : '',
        typeNameList:
          typeMode === 'new'
            ? languages
                .map(item => ({
                  language: item.code,
                  accountTypeName: (typeNames[item.code] || '').trim(),
                }))
                .filter(item => item.accountTypeName)
            : [],
        defaultMtGroup: values.defaultMtGroup,
        leverList: values.lever,
        addLeverList: values.lever.filter(value => customLevers.includes(value)),
        openCreditBalance: values.openCreditBalance,
        roleIds: values.roleIds,
        status: Number(values.status),
      });
      if (res.code !== 0) {
        toast.error(res.msg || t('common.AnErrorOccurred'));
        return;
      }
      toast.success(t('common.success'));
      onSaved();
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    }
  };

  const handleSkip = () => {
    if (!window.confirm(t('quickCreatePage.association.skipConfirm'))) return;
    onSkip();
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <RrhCircleLoading />
      </div>
    );
  }

  return (
    <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col">
      <div className="flex-1">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="text-foreground text-lg font-medium">
              {t(`quickCreatePage.association.subSteps.${subStep}.title`)}
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              {t(`quickCreatePage.association.subSteps.${subStep}.desc`)}
            </p>
          </div>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground text-sm underline"
            onClick={handleSkip}
          >
            {t('quickCreatePage.association.skip')}
          </button>
        </div>

        {subStep === 0 && (
          <div className="space-y-6">
            {typeMode === 'existing' ? (
              <div className="space-y-3">
                <div className="text-foreground text-sm font-medium">
                  {t('quickCreatePage.association.selectAccountType')}
                </div>
                <FormSwitchGroup
                  name="typeId"
                  switchItems={serverTypes.map(item => ({
                    value: item.id,
                    label: item.accountType,
                  }))}
                />
                <button
                  type="button"
                  className="text-primary text-sm underline"
                  onClick={() => {
                    setTypeMode('new');
                    form.setValue('typeId', '');
                  }}
                >
                  {t('quickCreatePage.association.createNew')}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-foreground text-sm font-medium">
                  {t('quickCreatePage.association.createAccountType')}
                </div>
                <div className="grid max-h-[240px] grid-cols-1 gap-3 overflow-y-auto pr-1 md:grid-cols-2">
                  {languages.map(item => (
                    <div key={item.code} className="space-y-1">
                      <div className="text-foreground text-sm">{item.label}</div>
                      <Input
                        className="h-10"
                        maxLength={24}
                        value={typeNames[item.code] || ''}
                        placeholder={t('quickCreatePage.association.accountTypeNamePlaceholder')}
                        onChange={event =>
                          setTypeNames(prev => ({ ...prev, [item.code]: event.target.value }))
                        }
                      />
                    </div>
                  ))}
                </div>
                {serverTypes.length > 0 && (
                  <button
                    type="button"
                    className="text-primary text-sm underline"
                    onClick={() => {
                      setTypeMode('existing');
                      setTypeNames({});
                    }}
                  >
                    {t('quickCreatePage.association.useExisting')}
                  </button>
                )}
              </div>
            )}

            <div className="space-y-3">
              <div className="text-foreground text-sm font-medium">
                {t('quickCreatePage.association.selectGroup')}
              </div>
              {serverGroup.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {serverGroup.map(group => (
                    <Button
                      key={group}
                      type="button"
                      size="sm"
                      variant={defaultMtGroup === group ? 'default' : 'outline'}
                      onClick={() => onGroupChange(group)}
                    >
                      {group}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">
                  {t('quickCreatePage.association.noGroup')}
                </div>
              )}
              <button
                type="button"
                className="text-primary flex items-center gap-1 text-sm underline disabled:opacity-50"
                disabled={isSynching}
                onClick={onSynchGroup}
              >
                <RefreshCcw className="size-3.5" />
                {t('quickCreatePage.association.synchGroup')}
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-foreground text-sm font-medium">
                {t('quickCreatePage.association.selectLever')}
              </div>
              {leverOptions.length > 0 ? (
                <FormSwitchGroup name="lever" multiple switchItems={leverOptions} />
              ) : (
                <div className="text-muted-foreground text-sm">
                  {t('quickCreatePage.association.noLever')}
                </div>
              )}
              {!isSirix && (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground text-sm">1:</span>
                      <Input
                        className="h-9 w-28"
                        value={leverInput}
                        placeholder={t('quickCreatePage.association.leverPlaceholder')}
                        onChange={event =>
                          setLeverInput(event.target.value.replace(/\D/g, '').slice(0, 8))
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => addLeverValue(leverInput)}
                    >
                      {t('quickCreatePage.association.addLever')}
                    </Button>
                    <span className="text-muted-foreground text-xs">
                      {t('quickCreatePage.association.presetLever')}
                    </span>
                    {presetLevers.map(value => (
                      <Button
                        key={value}
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-primary h-8 px-2"
                        onClick={() => addLeverValue(value)}
                      >
                        1:{value}
                      </Button>
                    ))}
                  </div>
                  {customLevers.length > 0 && (
                    <div className="text-muted-foreground text-xs">
                      {t('quickCreatePage.association.customLevers', {
                        list: customLevers.join(', '),
                      })}
                    </div>
                  )}
                </>
              )}
              {selectedLevers.length === 0 && (
                <div className="text-muted-foreground text-xs">
                  {t('quickCreatePage.association.leverTip')}
                </div>
              )}
            </div>
          </div>
        )}

        {subStep === 1 && (
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
            <FormInput
              name="openCreditBalance"
              label={t('quickCreatePage.association.openCreditBalance')}
              placeholder={t('serversSettingPage.openCreditBalancePlaceholder')}
              onInput={event =>
                applyInputNormalizer(event.currentTarget, value =>
                  normalizePositiveDecimalInput(value, 2),
                )
              }
            />
            <FormCrmRoleMultiSelect<FormValues>
              name="roleIds"
              label={t('quickCreatePage.association.roleIds')}
              placeholder={t('common.pleaseSelect')}
            />
            <FormSwitchGroup
              name="status"
              label={t('table.status')}
              switchItems={[
                { value: '1', label: t('common.enable') },
                { value: '0', label: t('common.disable') },
              ]}
            />
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t pt-4">
        <div>
          {subStep > 0 && (
            <RrhButton type="button" variant="outline" onClick={() => onSubStepChange(subStep - 1)}>
              {t('common.previous')}
            </RrhButton>
          )}
        </div>
        <div className="flex items-center gap-3">
          <RrhButton type="button" variant="outline" onClick={onCancel}>
            {t('common.Cancel')}
          </RrhButton>
          {subStep === 0 ? (
            <RrhButton type="button" onClick={goNext}>
              {t('common.next')}
            </RrhButton>
          ) : (
            <RrhButton type="submit" loading={isPending}>
              {t('common.save')}
            </RrhButton>
          )}
        </div>
      </div>
    </RrhForm>
  );
};
