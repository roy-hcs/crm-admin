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
  useAddTransactionBonusSetting,
  useBonusSettingDetail,
  useEditTransactionBonusSetting,
} from '@/api/hooks/marketing';
import { useTabBackNavigation } from '@/hooks/useTabBackNavigation';

import { StepTwo as StepThree } from '../referral-bonus/components/StepTwo'; // 复用转介绍奖励的第二步组件 但是在当前页面是第三步
import { StepOne } from './components/StepOne';
import { FormValues } from './types';
import {
  buildFallbackTitleLanguageList,
  resolveTitleLanguageListForSubmit,
} from '../referral-bonus/submitMappers';
import { buildSubmitParams } from './submitMappers';
import { buildFormValuesFromDetail, createDefaultFormValues } from './formInitMappers';
import { shouldValidateLadderBonusRanges, validateLadderBonusRanges } from './ladderRangeValidator';
import { StepTwo } from './components/StepTwo';
import { createTransactionBonusSchema } from './schema';

export function TransactionBonusPage() {
  const { t } = useTranslation();
  const schema = useMemo(() => createTransactionBonusSchema(t), [t]);

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
  const [step, setStep] = useState<'one' | 'two' | 'three'>('one');
  const [initialFormValues, setInitialFormValues] = useState<FormValues>(createDefaultFormValues());
  const didInitFormRef = useRef(false);
  const initKeyRef = useRef('');
  const { withLoading } = useGlobalLoading();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: addDefaultValues,
  });

  const { mutateAsync: add } = useAddTransactionBonusSetting();
  const { mutateAsync: edit } = useEditTransactionBonusSetting();
  const { mutateAsync: upload } = useUploadFile();

  const toClientStatusValue = form.watch('toClientStatus');
  const isPageLoading =
    languageLoading ||
    bonusSettingDetailLoading ||
    bonusLoading ||
    serverLoading ||
    businessTimeTypeLoading;
  const isNextButtonVisible = toClientStatusValue === '1';

  const handleTwoStep = () => {
    setStep('two');
  };

  const beforeTwoStep = () => {
    if (
      shouldValidateLadderBonusRanges(form) &&
      !validateLadderBonusRanges(form, { errorMessage: t('common.invalidAmountRange') })
    ) {
      return;
    }
    // 第一步只要校验 活动名称 排序 和 触发业务类型，其他的校验放到最后一步一起校验
    if (form.getValues('timeRangeType') === '1') {
      form
        .trigger(['rewardTitle', 'sort', 'businessType', 'businessTimeType', 'expire'])
        .then(isValid => {
          if (isValid) {
            handleTwoStep();
          }
        });
    } else {
      form.trigger(['rewardTitle', 'sort', 'businessType', 'activityTime']).then(isValid => {
        if (isValid) {
          handleTwoStep();
        }
      });
    }
  };

  const handleThreeStep = () => {
    if (mode === 'add') {
      const currentTitleLanguageList = form.getValues('titleLanguageList') || [];
      if (currentTitleLanguageList.length === 0 && (languageRes || []).length > 0) {
        form.setValue(
          'titleLanguageList',
          createDefaultFormValues(languageRes || []).titleLanguageList,
        );
      }
    }
    setStep('three');
  };

  const beforeThreeStep = () => {
    if (
      shouldValidateLadderBonusRanges(form) &&
      !validateLadderBonusRanges(form, { errorMessage: t('common.invalidAmountRange') })
    ) {
      return;
    }
    form.handleSubmit(handleThreeStep)();
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

  const oneServerOptions = useMemo(() => {
    if (mode === 'edit') {
      return (bonusSettingDetailRes?.data?.mtServiceList || []).map(i => ({
        label: i.serverName,
        value: i.id,
        serviceProperty: i.serviceProperty,
        serviceType: i.serviceType,
      }));
    }
    // 只需要真实服务器的选项，过滤掉模拟服务器
    return (serverRes?.rows || [])
      .filter(i => i.serviceProperty === 1)
      .map(i => ({
        label: i.serverName,
        value: i.id,
        serviceProperty: i.serviceProperty,
        serviceType: i.serviceType,
      }));
  }, [bonusSettingDetailRes?.data?.mtServiceList, mode, serverRes?.rows]);

  const twoServerOptions = useMemo(() => {
    return (serverRes?.rows || []).map(i => ({
      label: i.serverName,
      value: i.id,
      serviceProperty: i.serviceProperty,
      serviceType: i.serviceType,
    }));
  }, [serverRes?.rows]);

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
            serverOptions={oneServerOptions}
            businessTimeTypeOptions={businessTimeTypeOptions}
            mode={mode}
          />
        </div>

        <div className={cn(step === 'two' ? 'block' : 'hidden')}>
          <StepTwo serverOptions={twoServerOptions} />
        </div>

        <div className={cn(step === 'three' ? 'block' : 'hidden')}>
          <StepThree languageOptions={languageOptions} />
        </div>

        {step === 'one' && (
          <div className="flex items-center justify-end gap-4">
            <RrhButton onClick={handleReset} variant="outline" type="button">
              {t('common.Reset')}
            </RrhButton>

            <RrhButton onClick={beforeTwoStep} variant="outline" type="button">
              {t('common.next')}
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
            {isNextButtonVisible && (
              <RrhButton onClick={beforeThreeStep} variant="outline" type="button">
                {t('common.next')}
              </RrhButton>
            )}
            <RrhButton type="button" onClick={handleConfirm}>
              {t('common.save')}
            </RrhButton>
          </div>
        )}
        {step === 'three' && (
          <div className="flex items-center justify-end gap-4">
            <RrhButton
              onClick={() => {
                setStep('two');
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
