import { RrhButton } from '@/components/common/RrhButton';
import { RrhCard } from '@/components/common/RrhCard';

import { RrhForm } from '@/components/form/RrhForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useGlobalLoading } from '@/contexts/loading';
import { useDictType, useServerList, useUploadFile } from '@/api/hooks/system/system';
import { toast } from 'sonner';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import {
  useAddAccountOpeningBonusSetting,
  useBonusSettingDetail,
  useEditAccountOpeningBonusSetting,
} from '@/api/hooks/marketing';
import { useTabBackNavigation } from '@/hooks/useTabBackNavigation';

import { StepTwo } from '../referral-bonus/components/StepTwo';
import { StepOne } from './components/StepOne';
import { FormValues } from './types';
import {
  buildFallbackTitleLanguageList,
  resolveTitleLanguageListForSubmit,
} from '../referral-bonus/submitMappers';
import { buildSubmitParams } from './submitMappers';
import { buildFormValuesFromDetail, createDefaultFormValues } from './formInitMappers';
import { shouldValidateLadderBonusRanges, validateLadderBonusRanges } from './ladderRangeValidator';
import { createDepositBonusSchema } from './schema';

export function DepositBonusPage() {
  const { t } = useTranslation();
  const schema = useMemo(() => createDepositBonusSchema(t), [t]);

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const mode = id ? 'edit' : 'add';
  const back = useTabBackNavigation('/marketing/reward-config');
  const { data: bonusSettingDetailRes, isLoading: bonusSettingDetailLoading } =
    useBonusSettingDetail(id || '');
  const { data: bonusRes, isLoading: bonusLoading } = useDictType('sys_bonus_business_type');
  const { data: languageRes, isLoading: languageLoading } = useDictType('sys_language');
  const { data: businessTimeTypeRes, isLoading: businessTimeTypeLoading } = useDictType(
    'sys_bonus_association_time_type',
  );

  const { data: serverRes, isLoading: serverLoading } = useServerList();
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

  const { mutateAsync: add } = useAddAccountOpeningBonusSetting();
  const { mutateAsync: edit } = useEditAccountOpeningBonusSetting();
  const { mutateAsync: upload } = useUploadFile();

  const toClientStatusValue = form.watch('toClientStatus');
  const isPageLoading =
    languageLoading ||
    bonusSettingDetailLoading ||
    bonusLoading ||
    serverLoading ||
    businessTimeTypeLoading;
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
    if (
      shouldValidateLadderBonusRanges(form) &&
      !validateLadderBonusRanges(form, { errorMessage: t('common.invalidAmountRange') })
    ) {
      return;
    }

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
    if (
      shouldValidateLadderBonusRanges(form) &&
      !validateLadderBonusRanges(form, { errorMessage: t('common.invalidAmountRange') })
    ) {
      return;
    }

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

  const serverOptions = useMemo(() => {
    // 只需要真实服务器的选项，过滤掉模拟服务器
    return (serverRes?.rows || [])
      .filter(i => i.serviceProperty === 1)
      .map(i => ({
        label: i.serverName,
        value: i.id,
        serviceProperty: i.serviceProperty,
        serviceType: i.serviceType,
      }));
  }, [serverRes]);

  const bonusOptions = useMemo(() => {
    return (bonusRes || []).map(i => ({ label: i.dictLabel, value: i.dictValue }));
  }, [bonusRes]);

  const businessTimeTypeOptions = useMemo(() => {
    return (businessTimeTypeRes || []).map(i => ({ label: i.dictLabel, value: i.dictValue }));
  }, [businessTimeTypeRes]);

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
            serverOptions={serverOptions}
            businessTimeTypeOptions={businessTimeTypeOptions}
            mode={mode}
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
