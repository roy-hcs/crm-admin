import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { toast } from 'sonner';
import { RrhForm } from '@/components/form/RrhForm';
import {
  useGetTradeAccounts,
  useMamSignalSourceAdd,
  useMamSignalSourceEdit,
  useMamSignalSourceEditDetail,
} from '@/api/hooks/copyTrading';
import { MamSignalSourceEditParams } from '@/api/hooks/copyTrading/type';
import { useUploadFile } from '@/api/hooks/system/system';
import { AddEditSignalsStepOne } from './AddEditSignalsStepOne';
import { AddEditSignalsStepTwo } from './AddEditSignalsStepTwo';

const performanceFeeRebateLevelFieldNames = [
  'performanceFeeRebateLevel1',
  'performanceFeeRebateLevel2',
  'performanceFeeRebateLevel3',
  'performanceFeeRebateLevel4',
  'performanceFeeRebateLevel5',
  'performanceFeeRebateLevel6',
  'performanceFeeRebateLevel7',
  'performanceFeeRebateLevel8',
] as const;

type PerformanceFeeRebateLevelFieldName = (typeof performanceFeeRebateLevelFieldNames)[number];

type BaseFormValues = {
  name: string;
  userId: string;
  userName: string;
  serverId: string;
  icon?: File | string;
  minBalanceForSubscription: string;
  maxBalanceForSubscription: string;
  upperLimit: string;
  publicShow: string;
  subscriptionReview: string;
  performanceFeeEnable: string;
  subscribeFee: string;
  charge: string;
  performanceFeeCycle: string;
  performanceFeeRatio: string;
  receiveAccount: string;
  countryId: string;
  description: string;
  performanceFeeRebateEnabled: string;
  performanceFeeRebateScheme: string;
  performanceFeeRebateLevel: string;
};

type FormValues = BaseFormValues & Record<PerformanceFeeRebateLevelFieldName, string>;

const defaultFormValues: FormValues = {
  name: '',
  userId: '',
  userName: '',
  serverId: '',
  icon: '',
  minBalanceForSubscription: '',
  maxBalanceForSubscription: '',
  upperLimit: '',
  publicShow: '1',
  subscriptionReview: '1',
  performanceFeeEnable: '0',
  subscribeFee: '',
  charge: '0',
  performanceFeeCycle: '0',
  performanceFeeRatio: '',
  receiveAccount: '',
  countryId: '',
  description: '',
  performanceFeeRebateEnabled: '0',
  performanceFeeRebateScheme: '1',
  performanceFeeRebateLevel: '1',
  performanceFeeRebateLevel1: '',
  performanceFeeRebateLevel2: '',
  performanceFeeRebateLevel3: '',
  performanceFeeRebateLevel4: '',
  performanceFeeRebateLevel5: '',
  performanceFeeRebateLevel6: '',
  performanceFeeRebateLevel7: '',
  performanceFeeRebateLevel8: '',
};

const maxRebateLevel = 8;
const minRebateLevel = 1;

function clampRebateLevel(value: number) {
  return Math.max(minRebateLevel, Math.min(maxRebateLevel, value));
}

type ReceiveParseResult = {
  receiveType: 1 | 2;
  receiveAccount: string;
  receiveServerId: string;
};

function buildRebateLevels(data: FormValues, normalizedRebateLevel: number) {
  return Array.from({ length: normalizedRebateLevel }, (_, index) => {
    const level = index + 1;
    const fieldName = `performanceFeeRebateLevel${level}` as PerformanceFeeRebateLevelFieldName;
    return {
      rebateLevel: level,
      rebateRatio: Number((data[fieldName] || '').trim() || '0'),
    };
  });
}

function parseReceiveAccountValue(
  receiveAccountRaw: string,
  walletList: Array<{ id?: string | number }> = [],
): ReceiveParseResult {
  const walletIds = new Set(walletList.map(item => String(item.id)));
  const isWalletReceive = walletIds.has(receiveAccountRaw);

  if (isWalletReceive) {
    return {
      receiveType: 1,
      receiveAccount: receiveAccountRaw,
      receiveServerId: '',
    };
  }

  const separatorIndex = receiveAccountRaw.indexOf('-');
  if (separatorIndex >= 0) {
    return {
      receiveType: 2,
      receiveAccount: receiveAccountRaw.slice(0, separatorIndex),
      receiveServerId: receiveAccountRaw.slice(separatorIndex + 1),
    };
  }

  return {
    receiveType: 2,
    receiveAccount: receiveAccountRaw,
    receiveServerId: '',
  };
}

export const AddEditSignalsDialog = ({
  mode,
  open: openProp,
  onOpenChange,
  id,
  onSuccess,
  userId,
}: {
  mode: 'add' | 'edit' | 'view';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  id?: string;
  onSuccess: () => void;
  userId?: string;
}) => {
  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;
  const [step, setStep] = useState<'one' | 'two'>('one');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const isAddMode = mode === 'add';

  const form = useForm<FormValues>({
    defaultValues: defaultFormValues,
  });
  const selectedUserId = form.watch('userId') || userId || '';
  const selectedReceiveAccount = form.watch('receiveAccount');
  const { data: accountRes } = useGetTradeAccounts({ userId: selectedUserId });

  const receiveAccountOptions = useMemo(() => {
    const options = [
      ...(accountRes?.data?.walletList || [])
        .filter(i => i.currency === 'USD')
        .map(j => ({
          label: t('copyTradingSettings.Wallet'),
          value: j.id,
        })),
      ...(accountRes?.data?.receiveList || []).map(i => ({
        label: `${i.serverName} - ${i.account}`,
        value: `${i.account || ''}-${i.serverId || i.server || ''}`,
      })),
    ];

    // 编辑回填值如果暂时不在列表中，补一个兜底选项防止显示空白
    if (selectedReceiveAccount && !options.some(item => item.value === selectedReceiveAccount)) {
      options.unshift({
        label: selectedReceiveAccount,
        value: selectedReceiveAccount,
      });
    }

    return options;
  }, [accountRes?.data?.receiveList, accountRes?.data?.walletList, selectedReceiveAccount, t]);

  const [displayValue, setDisplayValue] = useState('');
  // 信号源账号数据
  const serverOptions = useMemo(() => {
    const options = (accountRes?.data?.accountList || []).map(i => ({
      label: `${i.serverName} - ${i.account} - ${i.id}`,
      value: String(i.serverId || i.server || i.id || ''),
    }));
    return options;
  }, [accountRes?.data?.accountList]);

  const performanceFeeEnableValue = form.watch('performanceFeeEnable');
  const chargeValue = form.watch('charge');
  const performanceFeeRebateLevel = clampRebateLevel(
    Number(form.watch('performanceFeeRebateLevel') || minRebateLevel),
  );
  const { mutateAsync: add } = useMamSignalSourceAdd();
  const { mutateAsync: edit } = useMamSignalSourceEdit();
  const { mutateAsync: getDetail } = useMamSignalSourceEditDetail();
  const { mutateAsync: uploadFile } = useUploadFile();

  useEffect(() => {
    // 切换用户后清空收款账户，避免沿用旧用户的账户值
    if (!isAddMode) return;
    form.setValue('receiveAccount', '');
  }, [form, isAddMode, selectedUserId]);

  const handleRebateLevelChange = (nextLevel: number) => {
    const normalizedNextLevel = clampRebateLevel(nextLevel);
    if (normalizedNextLevel === performanceFeeRebateLevel) return;

    form.setValue('performanceFeeRebateLevel', String(normalizedNextLevel), {
      shouldDirty: true,
      shouldTouch: true,
    });

    if (normalizedNextLevel < performanceFeeRebateLevel) {
      for (let index = normalizedNextLevel + 1; index <= maxRebateLevel; index += 1) {
        form.setValue(
          `performanceFeeRebateLevel${index}` as PerformanceFeeRebateLevelFieldName,
          '',
          {
            shouldDirty: true,
            shouldTouch: true,
          },
        );
      }
    }
  };

  const validateRequiredFields = () => {
    const requiredFields: Array<{ name: keyof FormValues; label: string }> = [
      { name: 'name', label: t('signals.name') },
      { name: 'userId', label: t('signals.signalSourceAuthor') },
      { name: 'serverId', label: t('table.signalSourceAccount') },
      { name: 'receiveAccount', label: t('table.paymentAccount') },
    ];

    form.clearErrors(requiredFields.map(item => item.name));
    let hasError = false;

    requiredFields.forEach(item => {
      const value = String(form.getValues(item.name) || '').trim();
      if (!value) {
        form.setError(item.name, {
          type: 'manual',
          message: t('rules.required', { field: item.label }),
        });
        hasError = true;
      }
    });

    return !hasError;
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);

      let iconUrl = '';
      if (typeof data.icon === 'string') {
        iconUrl = data.icon;
      } else if (data.icon instanceof File) {
        const uploadRes = await uploadFile(data.icon);
        if (uploadRes?.code !== 0 || !uploadRes?.url) {
          toast.error(uploadRes?.msg || t('common.fail'));
          return;
        }
        iconUrl = uploadRes.url;
      }
      // 防止重复上传同一文件导致的请求过多，先把 URL 回填到表单里，这样用户再次提交时就不会重复上传了
      form.setValue('icon', iconUrl);

      const normalizedRebateLevel = clampRebateLevel(
        Number(data.performanceFeeRebateLevel || minRebateLevel),
      );

      const levels = buildRebateLevels(data, normalizedRebateLevel);
      const receiveParsed = parseReceiveAccountValue(
        data.receiveAccount || '',
        accountRes?.data?.walletList || [],
      );

      const params: MamSignalSourceEditParams = {
        ...data,
        receiveType: receiveParsed.receiveType,
        receiveServerId: receiveParsed.receiveServerId,
        receiveAccount: receiveParsed.receiveAccount,
        serverId: data.serverId,
        icon: iconUrl,
        performanceFeeRebateLevel: String(normalizedRebateLevel),
        levels,
      };

      const res = mode === 'add' ? await add(params) : await edit({ ...params, id: id || '' });
      if (res.code === 0) {
        toast.success(t('common.success'));
        onSuccess();
        onClose(false);
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancel = () => {
    switch (step) {
      case 'one': {
        onClose(false);
        break;
      }
      case 'two':
        setStep('one');
        break;
    }
  };

  const onConfirm = async () => {
    switch (step) {
      case 'one': {
        if (validateRequiredFields()) {
          setStep('two');
        }
        break;
      }
      case 'two':
        void form.handleSubmit(onSubmit)();
        break;
    }
  };

  const onClose = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset(defaultFormValues);
      setDisplayValue('');
      setStep('one');
    }
  };

  useEffect(() => {
    // 编辑模式打开弹窗时需要初始化详情数据
    if (isAddMode || !id || !open) return;
    const protocolId = id;

    async function fetchDetail() {
      try {
        setIsDetailLoading(true);
        const res = await getDetail(protocolId);
        if (res.code === 0) {
          const detail = res.data.detail;
          const normalizedRebateLevel = clampRebateLevel(
            Number(detail.performanceFeeRebateLevel || minRebateLevel),
          );

          const rebateLevelValues = performanceFeeRebateLevelFieldNames.reduce(
            (acc, fieldName, index) => {
              const level = index + 1;
              const current = detail.levels?.find(
                (item: { rebateLevel: number; rebateRatio: number }) => item.rebateLevel === level,
              );
              acc[fieldName] =
                level <= normalizedRebateLevel ? String(current?.rebateRatio ?? '') : '';
              return acc;
            },
            {} as Record<PerformanceFeeRebateLevelFieldName, string>,
          );

          form.reset({
            ...defaultFormValues,
            ...rebateLevelValues,
            name: detail.name || '',
            userId: detail.userId || '',
            userName: [detail.userLastName, detail.userName].filter(Boolean).join(' ') || '',
            serverId: detail.serverId || '',
            icon: detail.icon || '',
            minBalanceForSubscription: String(detail.minBalanceForSubscription ?? ''),
            maxBalanceForSubscription: String(detail.maxBalanceForSubscription ?? ''),
            upperLimit: String(detail.upperLimit ?? ''),
            publicShow: String(detail.publicShow ?? '0'),
            subscriptionReview: String(detail.subscriptionReview ?? '0'),
            performanceFeeEnable: String(detail.performanceFeeEnable ?? '0'),
            subscribeFee: String(detail.subscribeFee ?? ''),
            charge: String(detail.charge ?? '0'),
            performanceFeeCycle: String(detail.performanceFeeCycle ?? '0'),
            performanceFeeRatio: String(detail.performanceFeeRatio ?? ''),
            countryId: detail.countryId || '',
            description: detail.description || '',
            performanceFeeRebateEnabled: String(detail.performanceFeeRebateEnabled ?? '0'),
            performanceFeeRebateScheme: String(detail.performanceFeeRebateScheme ?? '1'),
            performanceFeeRebateLevel: String(normalizedRebateLevel),
            ...(() => {
              const receiveType = detail.receiveType;
              // 1钱包 2 账户
              const detailReceiveAccount = detail.receiveAccount || '';
              const normalizedReceiveServerId = detail.receiveServerId;
              const normalizedReceiveAccountValue =
                receiveType === 2
                  ? `${detailReceiveAccount}-${normalizedReceiveServerId}`
                  : detailReceiveAccount;

              return {
                receiveAccount: normalizedReceiveAccountValue,
              };
            })(),
          });
          setDisplayValue(`${detail?.server} - ${detail?.account}`);
        } else {
          toast.error(res.msg);
        }
        setIsDetailLoading(false);
      } catch {
        toast.error(t('common.fail'));
        setIsDetailLoading(false);
      }
    }

    void fetchDetail();
  }, [form, getDetail, id, isAddMode, open, t]);

  useEffect(() => {
    // 账户列表晚到时，补齐 receiveAccount 的 serverId 片段，确保能和 options value 匹配
    if (isAddMode || !open) return;

    const currentReceiveAccount = form.getValues('receiveAccount') || '';
    if (!currentReceiveAccount || currentReceiveAccount.includes('-')) return;

    const matchedReceiveItem = (accountRes?.data?.receiveList || []).find(
      item => item.account === currentReceiveAccount,
    );
    const normalizedReceiveServerId =
      matchedReceiveItem?.serverId || matchedReceiveItem?.server || '';

    if (!normalizedReceiveServerId) return;

    form.setValue('receiveAccount', `${currentReceiveAccount}-${normalizedReceiveServerId}`, {
      shouldDirty: false,
      shouldTouch: false,
    });
  }, [accountRes?.data?.receiveList, form, isAddMode, open]);

  return (
    <RrhDialog
      trigger={
        isAddMode ? (
          <RrhButton type="button" Icon={<Plus className="size-3.5" />}>
            {t('common.add')}
          </RrhButton>
        ) : null
      }
      title={
        isAddMode
          ? t('common.addField', {
              field: t('signals.title'),
            })
          : t('common.modify', {
              field: t('signals.title'),
            })
      }
      isConfirmDisabled={isSubmitting || isDetailLoading}
      cancelText={step === 'one' ? t('common.Cancel') : t('common.previous')}
      confirmText={step === 'one' ? t('common.next') : t('common.Confirm')}
      open={open}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={onConfirm}
      variant="large"
      type="submit"
      cancelShow={true}
      formLoading={isSubmitting || isDetailLoading}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)}>
        {step === 'one' && (
          <AddEditSignalsStepOne
            isAddMode={isAddMode}
            serverOptions={serverOptions}
            displayValue={displayValue}
            performanceFeeEnableValue={performanceFeeEnableValue}
            chargeValue={chargeValue}
            receiveAccountOptions={receiveAccountOptions}
          />
        )}
        {step === 'two' && (
          <AddEditSignalsStepTwo
            performanceFeeRebateLevel={performanceFeeRebateLevel}
            minRebateLevel={minRebateLevel}
            maxRebateLevel={maxRebateLevel}
            onRebateLevelChange={handleRebateLevelChange}
          />
        )}
      </RrhForm>
    </RrhDialog>
  );
};
