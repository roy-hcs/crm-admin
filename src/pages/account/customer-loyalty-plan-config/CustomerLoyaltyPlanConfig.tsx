import { RrhButton } from '@/components/common/RrhButton';
import { RrhCard } from '@/components/common/RrhCard';

import { RrhForm } from '@/components/form/RrhForm';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useGlobalLoading } from '@/contexts/loading';
import { useDictType } from '@/api/hooks/system/system';
import { toast } from 'sonner';
import { useEffect, useRef, useState } from 'react';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { useTabBackNavigation } from '@/hooks/useTabBackNavigation';
import { useCrmUserVipAdd, useCrmUserVipDetail, useCrmUserVipEdit } from '@/api/hooks/account';
import { RrhSwitchGroup } from '@/components/common/RrhSwitchGroup';
import { FormInput } from '@/components/form/FormInput';
import { cn } from '@/lib/utils';
import { FormTextarea } from '@/components/form/FormTextarea';
import type {
  CrmUserVipAddParams,
  CrmUserVipDetailRes,
  CrmUserVipRuleItem,
} from '@/api/hooks/account';
import type { DictTypeResponse } from '@/api/hooks/system/types';
import { FormSelect } from '@/components/form/FormSelect';

type FormValues = CrmUserVipAddParams;

const buildDefaultRule = (ruleType: '1' | '2'): CrmUserVipRuleItem => ({
  ruleType,
  ruleEvent: '',
  ruleSymbol: '>=',
  ruleValue: '',
  ruleLevel: '',
  ruleTag: '',
});

function buildDefaultLanguageList(
  languageRes?: DictTypeResponse,
): CrmUserVipAddParams['languageList'] {
  return (languageRes || []).map(item => ({
    language: item.dictValue || '',
    name: '',
    description: '',
  }));
}

function createDefaultFormValues(languageRes?: DictTypeResponse): FormValues {
  return {
    sort: 1,
    status: 1,
    languageList: buildDefaultLanguageList(languageRes),
    crmUserVipAndRuleList: [buildDefaultRule('1')],
    crmUserVipOrRuleList: [buildDefaultRule('2')],
  };
}

function buildFormValuesFromDetail(
  detailRes: CrmUserVipDetailRes,
  languageRes?: DictTypeResponse,
): FormValues {
  const detail = detailRes.data;
  const languageMap = new Map(
    (detail.languageList || []).map(item => [item.language, item] as const),
  );

  const languageList =
    languageRes && languageRes.length > 0
      ? languageRes.map(item => {
          const exist = languageMap.get(item.dictValue);
          return {
            language: item.dictValue || '',
            name: exist?.name || '',
            description: exist?.description || '',
          };
        })
      : (detail.languageList || []).map(item => ({
          language: item.language || '',
          name: item.name || '',
          description: item.description || '',
        }));

  const normalizeRule = (rule: CrmUserVipRuleItem, ruleType: '1' | '2'): CrmUserVipRuleItem => ({
    ruleType: rule.ruleType || ruleType,
    // Select 组件使用字符串值匹配，详情回填时统一转成 string 避免首屏不回显
    ruleEvent: rule.ruleEvent === null ? '' : String(rule.ruleEvent),
    ruleSymbol: rule.ruleSymbol === null ? '>=' : String(rule.ruleSymbol).trim() || '>=',
    ruleValue: rule.ruleValue === null ? '' : String(rule.ruleValue),
    ruleLevel: rule.ruleLevel ?? '',
    ruleTag: rule.ruleTag ?? '',
  });

  return {
    sort: detail.sort || 1,
    status: detail.status ?? 1,
    languageList,
    crmUserVipAndRuleList:
      detail.crmUserVipAndRuleList?.length > 0
        ? detail.crmUserVipAndRuleList.map(item => normalizeRule(item, '1'))
        : [buildDefaultRule('1')],
    crmUserVipOrRuleList:
      detail.crmUserVipOrRuleList?.length > 0
        ? detail.crmUserVipOrRuleList.map(item => normalizeRule(item, '2'))
        : [buildDefaultRule('2')],
  };
}

export function CustomerLoyaltyPlanConfig() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const isEditMode = Boolean(id);
  const back = useTabBackNavigation('/account/customer-loyalty-plan');
  const { data: productDetailRes, isLoading: productDetailLoading } = useCrmUserVipDetail(id || '');
  const [initialFormValues, setInitialFormValues] = useState<FormValues>(createDefaultFormValues());
  const didInitFormRef = useRef(false);
  const initKeyRef = useRef('');
  const { withLoading } = useGlobalLoading();
  const { mutateAsync: create } = useCrmUserVipAdd();
  const { mutateAsync: edit } = useCrmUserVipEdit();

  const { data: languageRes, isLoading: languageLoading } = useDictType('sys_language');
  const { data: vipStatusRes, isLoading: vipStatusLoading } = useDictType('user_vip_event');

  const [activeLang, setActiveLang] = useState('');

  const form = useForm<FormValues>({
    defaultValues: createDefaultFormValues(),
  });

  const {
    fields: andRuleFields,
    append: appendAndRule,
    remove: removeAndRule,
  } = useFieldArray({
    control: form.control,
    name: 'crmUserVipAndRuleList',
    keyName: 'fieldKey',
  });

  const {
    fields: orRuleFields,
    append: appendOrRule,
    remove: removeOrRule,
  } = useFieldArray({
    control: form.control,
    name: 'crmUserVipOrRuleList',
    keyName: 'fieldKey',
  });

  const handleAddAndRule = () => {
    appendAndRule(buildDefaultRule('1'));
  };

  const handleRemoveAndRule = (index: number) => {
    if (andRuleFields.length <= 1) return;
    removeAndRule(index);
  };

  const handleAddOrRule = () => {
    appendOrRule(buildDefaultRule('2'));
  };

  const handleRemoveOrRule = (index: number) => {
    if (orRuleFields.length <= 1) return;
    removeOrRule(index);
  };

  const vipEventOptions = (vipStatusRes || []).map(item => ({
    label: item.dictLabel || '',
    value: item.dictValue || '',
  }));

  const ruleSymbolOptions = [
    {
      label: '>=',
      value: '>=',
    },
    {
      label: '>',
      value: '>',
    },
  ];

  const renderRuleSection = ({
    fields,
    listName,
    eventLabel,
    showSymbolLabel,
    showValueLabel,
    onAdd,
    onRemove,
  }: {
    fields: Array<{ fieldKey: string }>;
    listName: 'crmUserVipAndRuleList' | 'crmUserVipOrRuleList';
    eventLabel: string;
    showSymbolLabel: boolean;
    showValueLabel: boolean;
    onAdd: () => void;
    onRemove: (index: number) => void;
  }) => (
    <div className="grid gap-3">
      {fields.map((field, index) => {
        const ruleEventName = `${listName}.${index}.ruleEvent` as const;
        const ruleSymbolName = `${listName}.${index}.ruleSymbol` as const;
        const ruleValueName = `${listName}.${index}.ruleValue` as const;

        return (
          <div key={field.fieldKey} className="bg-primary-foreground rounded-2xl p-3">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <FormSelect
                  verticalLabel
                  name={ruleEventName}
                  label={eventLabel}
                  placeholder={t('common.pleaseSelect')}
                  showRowValue={false}
                  options={vipEventOptions}
                />
              </div>
              <div className="flex-1">
                <FormSelect
                  verticalLabel
                  name={ruleSymbolName}
                  label={showSymbolLabel ? t('customerLoyaltyPlan.ruleSymbol') : undefined}
                  placeholder={t('common.pleaseSelect')}
                  showRowValue={false}
                  options={ruleSymbolOptions}
                />
              </div>
              <div className="flex-1">
                <FormInput
                  verticalLabel
                  name={ruleValueName}
                  label={showValueLabel ? t('customerLoyaltyPlan.ruleValue') : undefined}
                  placeholder={t('common.pleaseInput', {
                    field: '',
                  })}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <RrhButton type="button" variant="outline" size="sm" onClick={onAdd}>
                    +
                  </RrhButton>
                  <RrhButton
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onRemove(index)}
                  >
                    -
                  </RrhButton>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  useEffect(() => {
    if (languageLoading) return;
    const defaultLang =
      (languageRes || []).find(item => item.isDefault === 'Y')?.dictValue ||
      (languageRes || [])[0]?.dictValue ||
      'zh-CN';
    if (!activeLang) {
      setActiveLang(defaultLang);
    }
  }, [activeLang, languageLoading, languageRes]);

  const onSubmit = async (data: FormValues) => {
    const requiredMsg = (field: string) => t('rules.required', { field });

    form.clearErrors('languageList');
    form.clearErrors('crmUserVipAndRuleList');
    form.clearErrors('crmUserVipOrRuleList');

    // 中文名称必填
    const zhIndex = data.languageList.findIndex(item => item.language === 'zh-CN');
    if (zhIndex !== -1) {
      const zhName = data.languageList[zhIndex]?.name?.trim() || '';
      if (!zhName) {
        form.setError(`languageList.${zhIndex}.name`, {
          type: 'required',
          message: requiredMsg(t('customerLoyaltyPlan.name')),
        });
        return;
      }
    }

    const validateRuleList = (
      list: FormValues['crmUserVipAndRuleList'],
      listName: 'crmUserVipAndRuleList' | 'crmUserVipOrRuleList',
    ) => {
      for (let index = 0; index < list.length; index++) {
        const item = list[index];
        if (!String(item.ruleEvent ?? '').trim()) {
          form.setError(`${listName}.${index}.ruleEvent`, {
            type: 'required',
            message: requiredMsg(t('customerLoyaltyPlan.ruleEvent')),
          });
          return false;
        }
        if (!String(item.ruleSymbol ?? '').trim()) {
          form.setError(`${listName}.${index}.ruleSymbol`, {
            type: 'required',
            message: requiredMsg(t('customerLoyaltyPlan.ruleSymbol')),
          });
          return false;
        }
        if (!String(item.ruleValue ?? '').trim()) {
          form.setError(`${listName}.${index}.ruleValue`, {
            type: 'required',
            message: requiredMsg(t('customerLoyaltyPlan.ruleValue')),
          });
          return false;
        }
      }
      return true;
    };

    const andValid = validateRuleList(data.crmUserVipAndRuleList || [], 'crmUserVipAndRuleList');
    if (!andValid) return;

    const orValid = validateRuleList(data.crmUserVipOrRuleList || [], 'crmUserVipOrRuleList');
    if (!orValid) return;

    await withLoading(async () => {
      try {
        const payload: CrmUserVipAddParams = {
          sort: Number(data.sort) || 1,
          status: Number(data.status) || 1,
          languageList: (data.languageList || []).map(item => ({
            language: item.language,
            name: item.name?.trim() || '',
            description: item.description?.trim() || '',
          })),
          crmUserVipAndRuleList: data.crmUserVipAndRuleList || [buildDefaultRule('1')],
          crmUserVipOrRuleList: data.crmUserVipOrRuleList || [buildDefaultRule('2')],
        };

        const res = isEditMode && id ? await edit({ id, ...payload }) : await create(payload);
        if (res.code === 0) {
          toast.success(t('common.success'));
          back();
        } else {
          toast.error(res.msg);
        }
      } catch {
        toast.error(t('common.AnErrorOccurred'));
      }
    });
  };
  const handleReset = () => {
    // 新增模式重置到默认值，编辑模式重置到详情初始化值
    const values = isEditMode ? initialFormValues : createDefaultFormValues(languageRes);
    form.reset(values);
  };
  const handleConfirm = () => {
    form.handleSubmit(onSubmit)();
  };

  useEffect(() => {
    const initKey = `${isEditMode ? 'edit' : 'add'}_${id || ''}`;
    if (initKeyRef.current !== initKey) {
      initKeyRef.current = initKey;
      didInitFormRef.current = false;
    }
  }, [id, isEditMode]);

  useEffect(() => {
    if (didInitFormRef.current) return;
    if (languageLoading) return;

    if (isEditMode) {
      if (!id || !productDetailRes?.data.id) return;
      const editValues = buildFormValuesFromDetail(productDetailRes, languageRes);
      form.reset(editValues);
      setInitialFormValues(editValues);
      didInitFormRef.current = true;
      return;
    }

    const addValues = createDefaultFormValues(languageRes);
    form.reset(addValues);
    setInitialFormValues(addValues);
    didInitFormRef.current = true;
  }, [form, id, isEditMode, languageLoading, languageRes, productDetailRes]);

  if (languageLoading || vipStatusLoading || (isEditMode && productDetailLoading)) {
    return (
      <div className="h-100">
        <RrhCircleLoading />
      </div>
    );
  }
  return (
    <RrhCard>
      <RrhForm form={form} className="grid gap-6">
        <div>
          <RrhSwitchGroup
            value={activeLang}
            onValueChange={value => {
              setActiveLang(value);
            }}
            labelClassName="font-medium"
            switchItems={(languageRes || [])?.map(i => ({
              value: i?.dictValue || '',
              label: i?.dictLabel || '',
            }))}
          />
          <div>
            {(languageRes || [])?.map((i, index) => {
              return (
                <div
                  key={i.dictValue}
                  className={cn(activeLang === i.dictValue ? 'block' : 'hidden')}
                >
                  <div className="py-3">
                    <FormInput
                      verticalLabel
                      name={`languageList.${index}.name` as const}
                      label={t('customerLoyaltyPlan.name')}
                      placeholder={t('rules.limitLength', {
                        field: 50,
                      })}
                      maxLength={50}
                    />
                  </div>
                  <div className="py-3">
                    <FormTextarea
                      name={`languageList.${index}.description` as const}
                      label={t('customerLoyaltyPlan.description')}
                      placeholder={t('rules.limitLength', { field: 300 })}
                      maxLength={300}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 border-t pt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="grid gap-1">
              <div className="text-secondary-foreground text-lg leading-7 font-semibold">
                {t('customerLoyaltyPlan.ruleJudgment')}
              </div>
              <div className="text-muted-foreground text-sm leading-5">
                {t('customerLoyaltyPlan.ruleJudgmentDesc')}
              </div>
            </div>
          </div>
          {renderRuleSection({
            fields: andRuleFields,
            listName: 'crmUserVipAndRuleList',
            eventLabel: t('customerLoyaltyPlan.ruleEvent'),
            showSymbolLabel: true,
            showValueLabel: true,
            onAdd: handleAddAndRule,
            onRemove: handleRemoveAndRule,
          })}
          {renderRuleSection({
            fields: orRuleFields,
            listName: 'crmUserVipOrRuleList',
            eventLabel: t('customerLoyaltyPlan.or'),
            showSymbolLabel: false,
            showValueLabel: false,
            onAdd: handleAddOrRule,
            onRemove: handleRemoveOrRule,
          })}
        </div>

        <div className="flex items-center justify-end gap-4">
          <RrhButton onClick={handleReset} variant="outline" type="button">
            {t('common.Reset')}
          </RrhButton>
          <RrhButton type="button" onClick={handleConfirm}>
            {t('common.save')}
          </RrhButton>
        </div>
      </RrhForm>
    </RrhCard>
  );
}
