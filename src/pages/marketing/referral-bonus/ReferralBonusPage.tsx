import { RrhButton } from '@/components/common/RrhButton';
import { RrhCard } from '@/components/common/RrhCard';

import { RrhForm } from '@/components/form/RrhForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useGlobalLoading } from '@/contexts/loading';
import { useDictType, useUploadFile } from '@/api/hooks/system/system';
import { toast } from 'sonner';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import {
  useAddReferralBonusSetting,
  useBonusSettingDetail,
  useEditReferralBonusSetting,
} from '@/api/hooks/marketing';
import { StepOne } from './components/StepOne';
import { useTabBackNavigation } from '@/hooks/useTabBackNavigation';
import { StepTwo } from './components/StepTwo';
import type { FormValues } from './types';
import { buildFormValuesFromDetail, createDefaultFormValues } from './formInitMappers';
import {
  buildFallbackTitleLanguageList,
  buildSubmitParams,
  resolveTitleLanguageListForSubmit,
} from './submitMappers';
// import {
//   buildFallbackTitleLanguageList,
//   buildFormValuesFromDetail,
//   buildSubmitParams,
//   createDefaultFormValues,
//   resolveTitleLanguageListForSubmit,
// } from './dataMappers';

export function ReferralBonusPage() {
  const { t } = useTranslation();
  const schema = useMemo(() => {
    const required = (field: string) => t('rules.required', { field });
    const activityTimeRequired = required(t('rewardConfigPage.activityTime'));
    const rewardAmountRequired = required(t('table.rewardAmount'));
    const requiredDateLike = z.union([z.date(), z.string().trim().min(1, activityTimeRequired)]);

    return z.object({
      rewardTitle: z
        .string()
        .trim()
        .min(1, required(t('rewardConfigPage.rewardTitle'))),
      sort: z
        .string()
        .trim()
        .min(1, required(t('table.sort'))),
      status: z.string(),
      toClientStatus: z.string(),
      businessType: z.string(),
      accountLimitType: z.string(),
      activityTime: z.object({
        from: requiredDateLike,
        to: requiredDateLike,
      }),
      triggers: z.array(
        z.object({
          id: z.string(),
          rewardId: z.string(),
          event: z.string(),
          symbol: z.string(),
          value: z.string(),
        }),
      ),
      levelAmounts: z
        .array(
          z.object({
            id: z.string(),
            rewardId: z.string(),
            level: z.string(),
            amount: z.string().trim().min(1, rewardAmountRequired),
          }),
        )
        .min(1, rewardAmountRequired),
      amountCapped: z.string(),
      period: z.string(),
      userIds: z.array(z.string()).optional(),
      crmRoleIds: z.array(z.string()).optional(),
      accounts: z.array(z.string()).optional(),
      tagIds: z.array(z.string()).optional(),
      titleLanguageList: z.array(
        z.object({
          id: z.string(),
          language: z.string(),
          rewardTitle: z.string(),
          icon: z.union([z.string(), z.instanceof(File)]),
          activityContent: z.string(),
        }),
      ),
    });
  }, [t]);

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const mode = id ? 'edit' : 'add';
  const back = useTabBackNavigation('/marketing/reward-config');
  const { data: bonusSettingDetailRes, isLoading: bonusSettingDetailLoading } =
    useBonusSettingDetail(id || '');
  const { data: bonusRes, isLoading: bonusLoading } = useDictType('sys_bonus_business_type');
  const { data: languageRes, isLoading: languageLoading } = useDictType('sys_language');
  const addDefaultValues = useMemo(() => createDefaultFormValues(languageRes || []), [languageRes]);
  const [step, setStep] = useState<'one' | 'two'>('one');
  const [initialFormValues, setInitialFormValues] = useState<FormValues>(createDefaultFormValues());
  const didInitFormRef = useRef(false);
  const initKeyRef = useRef('');
  const { withLoading } = useGlobalLoading();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: addDefaultValues,
  });

  const { mutateAsync: add } = useAddReferralBonusSetting();
  const { mutateAsync: edit } = useEditReferralBonusSetting();
  const { mutateAsync: upload } = useUploadFile();

  const toClientStatusValue = form.watch('toClientStatus');
  const isPageLoading = languageLoading || bonusSettingDetailLoading || bonusLoading;
  const isNextButtonVisible = toClientStatusValue === '1';

  const handleNext = async () => {
    if (mode === 'add') {
      const currentTitleLanguageList = form.getValues('titleLanguageList') || [];
      if (currentTitleLanguageList.length === 0 && (languageRes || []).length > 0) {
        form.setValue(
          'titleLanguageList',
          createDefaultFormValues(languageRes || []).titleLanguageList,
        );
      }
    }
    setStep('two');
  };

  const beforeNext = () => {
    form.handleSubmit(handleNext)();
  };

  const onSubmit = async (data: FormValues) => {
    await withLoading(async () => {
      try {
        const fallbackTitleLanguageList = buildFallbackTitleLanguageList(
          mode,
          data.rewardTitle,
          languageRes || [],
          bonusSettingDetailRes?.data?.infoList || [],
        );

        const { titleLanguageList, activityPicture } = await resolveTitleLanguageListForSubmit(
          data.titleLanguageList || [],
          fallbackTitleLanguageList,
          file => upload(file),
          t('ads.uploader'),
          data.rewardTitle,
        );

        const params = buildSubmitParams(data, titleLanguageList, activityPicture);
        const res = mode === 'edit' ? await edit({ id: id || '', ...params }) : await add(params);
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
    const values = mode === 'edit' ? initialFormValues : addDefaultValues;
    form.reset(values);
    setStep('one');
  };
  const handleConfirm = () => {
    form.handleSubmit(onSubmit)();
  };

  useEffect(() => {
    const initKey = `${mode || 'add'}_${id || ''}`;
    if (initKeyRef.current !== initKey) {
      initKeyRef.current = initKey;
      didInitFormRef.current = false;
    }
  }, [id, mode]);

  const performInitialization = useCallback(() => {
    if (didInitFormRef.current) return;

    if (mode === 'edit') {
      if (!id || !bonusSettingDetailRes?.data?.bonusSetting) return;
      const editValues = buildFormValuesFromDetail(bonusSettingDetailRes.data);
      form.reset(editValues);
      setInitialFormValues(editValues);
      setStep('one');
      didInitFormRef.current = true;
      return;
    }

    form.reset(addDefaultValues);
    setInitialFormValues(addDefaultValues);
    setStep('one');
    didInitFormRef.current = true;
  }, [form, addDefaultValues, bonusSettingDetailRes, id, mode]);

  useEffect(() => {
    performInitialization();
  }, [performInitialization]);

  const languageLabelMap = useMemo(() => {
    return new Map((languageRes || []).map(item => [item.dictValue, item.dictLabel || '']));
  }, [languageRes]);

  const languageOptions = useMemo(() => {
    return mode === 'edit'
      ? (bonusSettingDetailRes?.data?.infoList || []).map(item => ({
          id: item.id || '',
          language: item.language || '',
          activityContent: item.activityContent || '',
          icon: item.icon || '',
          rewardTitle: item.rewardTitle || '',
          languageLabel: languageLabelMap.get(item.language) || '',
        }))
      : (languageRes || []).map(item => ({
          id: '',
          language: item.dictValue || '',
          activityContent: '',
          icon: '',
          rewardTitle: '',
          languageLabel: item.dictLabel || '',
        }));
  }, [mode, bonusSettingDetailRes, languageLabelMap, languageRes]);

  const selectedUserOptions = useMemo(() => {
    return (bonusSettingDetailRes?.data?.selectedUsers || []).map(user => ({
      value: String(user.id || ''),
      label: `${user.lastName ?? ''} ${user.name ?? ''} (${user.showId ?? '-'})`,
    }));
  }, [bonusSettingDetailRes]);

  const selectedRoleOptions = useMemo(() => {
    return (bonusSettingDetailRes?.data?.selectedRoles || []).map(role => ({
      value: String(role.roleId || ''),
      label: role.roleName || '',
    }));
  }, [bonusSettingDetailRes]);

  const selectedAccountOptions = useMemo(() => {
    return (bonusSettingDetailRes?.data?.selectedAccounts || []).map(user => ({
      value: String(user.id || ''),
      label: `${user.lastName ?? ''} ${user.name ?? ''} (${user.showId ?? '-'})`,
    }));
  }, [bonusSettingDetailRes]);

  const selectedTagOptions = useMemo(() => {
    return (bonusSettingDetailRes?.data?.selectedTags || []).map(tag => ({
      value: String(tag.id || ''),
      label: tag.tagName || '',
    }));
  }, [bonusSettingDetailRes]);

  const bonusOptions = useMemo(() => {
    return (bonusRes || []).map(i => ({ label: i.dictLabel, value: i.dictValue }));
  }, [bonusRes]);

  if (isPageLoading) {
    return (
      <div className="h-100">
        <RrhCircleLoading />
      </div>
    );
  }
  return (
    <RrhCard>
      <RrhForm form={form} className="grid gap-6">
        <div className={cn(step === 'one' ? 'block' : 'hidden')}>
          <StepOne
            bonusOptions={bonusOptions}
            selectedUserOptions={selectedUserOptions}
            selectedRoleOptions={selectedRoleOptions}
            selectedAccountOptions={selectedAccountOptions}
            selectedTagOptions={selectedTagOptions}
          />
        </div>

        <div className={cn(step === 'two' ? 'block' : 'hidden')}>
          <StepTwo languageOptions={languageOptions} />
        </div>

        {step === 'one' && (
          <div className="flex items-center justify-end gap-4">
            <RrhButton onClick={handleReset} variant="outline" type="button">
              {t('common.Reset')}
            </RrhButton>

            {isNextButtonVisible && (
              <RrhButton onClick={beforeNext} variant="outline" type="button">
                {t('common.next')}
              </RrhButton>
            )}

            <RrhButton type="button" onClick={handleConfirm}>
              {t('common.save')}
            </RrhButton>
          </div>
        )}
        {step === 'two' && (
          <div className="flex items-center justify-end gap-4">
            <RrhButton
              onClick={() => {
                setStep('one');
              }}
              variant="outline"
              type="button"
            >
              {t('common.previousStep')}
            </RrhButton>
            <RrhButton type="button" onClick={handleConfirm}>
              {t('common.save')}
            </RrhButton>
          </div>
        )}
      </RrhForm>
    </RrhCard>
  );
}
