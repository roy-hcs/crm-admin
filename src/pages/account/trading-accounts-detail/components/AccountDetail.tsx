import { DetailInfoEditParams, useGetDetailInfo, useSetDetailInfoEdit } from '@/api/hooks/account';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider } from '@/contexts/form';
import { Form, FormField } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { useEditableFields } from '@/hooks/useEditableFields';
import { LabelItem } from '@/components/common/LabelItem';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { InfoItem } from '@/components/common/InfoItem';
import { RrhSelect } from '@/components/common/RrhSelect';
import { Input } from '@/components/ui/input';
import { serverMap } from '@/lib/constant';
import { SelectDirectAgent } from './SelectDirectAgent';
import { toast } from 'sonner';
import { useGlobalLoading } from '@/contexts/loading';
import { EditableField } from '@/components/common/EditableField';
import { SelectOption } from '@/api/types';

type FormValues = DetailInfoEditParams;

type GeneralInfoField =
  | 'name'
  | 'accountType'
  | 'serverGroup'
  | 'userId'
  | 'directBroker'
  | 'accountGroupId'
  | 'lever';
type EditType = 'input' | 'select' | 'modal';

type ModalFieldKey = 'userId' | 'directBroker';
type ModalLabelsState = Record<ModalFieldKey, Record<string, string>>;
type SelectFieldKey = 'accountType' | 'serverGroup' | 'accountGroupId' | 'lever';

export function AccountDetail({ id }: { id: string }) {
  const { t } = useTranslation();
  const { data: detailInfo, isLoading: detailLoading } = useGetDetailInfo(id);
  const { mutateAsync: setDetailInfoEdit } = useSetDetailInfoEdit();
  const { withLoading } = useGlobalLoading();
  const [modalLabels, setModalLabels] = useState<ModalLabelsState>({
    userId: {},
    directBroker: {},
  });

  const crmDealAccount = detailInfo?.data?.crmDealAccount;
  const detailId = crmDealAccount?.id || '';
  const name = crmDealAccount?.name || '';
  const accountType = crmDealAccount?.accountType || '';
  const serverGroup = crmDealAccount?.serverGroup || '';
  const userId = crmDealAccount?.userId || '';
  const directBroker = crmDealAccount?.directBroker || '';
  const accountGroupId = crmDealAccount?.accountGroupId || '';
  const lever = crmDealAccount?.lever || '';
  const userIdLabel = detailInfo?.data?.aspName;
  const directBrokerLabel = detailInfo?.data?.dbName;

  const allAccountTypeOptions = useMemo<SelectOption[]>(
    () => detailInfo?.data?.allAccountType || [],
    [detailInfo],
  );

  const serverGroupOptions = useMemo<SelectOption[]>(
    () =>
      (detailInfo?.data?.allGroup || []).map(i => ({
        label: i,
        value: `${i}`,
      })),
    [detailInfo],
  );

  const accountGroupOptions = useMemo<SelectOption[]>(() => {
    return (detailInfo?.data?.allDealAccountGroup || []).map(i => ({
      label: i.name,
      value: `${i.id}`,
    }));
  }, [detailInfo]);

  const leverOptions = useMemo<SelectOption[]>(() => {
    return (detailInfo?.data?.allLever || []).map(i => ({
      label: `1:${i}`,
      value: `${i}`,
    }));
  }, [detailInfo]);

  const selectLabelMaps = useMemo<Record<SelectFieldKey, Record<string, string>>>(
    () => ({
      accountType: allAccountTypeOptions.reduce<Record<string, string>>((acc, option) => {
        acc[option.value] = option.label;
        return acc;
      }, {}),
      serverGroup: serverGroupOptions.reduce<Record<string, string>>((acc, option) => {
        acc[option.value] = option.label;
        return acc;
      }, {}),
      accountGroupId: accountGroupOptions.reduce<Record<string, string>>((acc, option) => {
        acc[option.value] = option.label;
        return acc;
      }, {}),
      lever: leverOptions.reduce<Record<string, string>>((acc, option) => {
        acc[option.value] = option.label;
        return acc;
      }, {}),
    }),
    [allAccountTypeOptions, serverGroupOptions, accountGroupOptions, leverOptions],
  );

  const form = useForm<FormValues>({
    defaultValues: {
      name: '',
      accountType: '',
      serverGroup: '',
      userId: '',
      directBroker: '',
      accountGroupId: '',
    },
  });

  const detailInfoList = useMemo(() => {
    if (!crmDealAccount) return [];
    const servicePropertyText =
      crmDealAccount.serviceProperty === 1 ? t('common.live') : t('common.demo');
    const serviceTypeText = serverMap[crmDealAccount.serviceType || 0] || '-';
    return [
      { label: t('trading.login'), value: crmDealAccount.account || '-' },

      { label: t('common.type'), value: servicePropertyText },

      {
        label: t('table.transactionPlatform'),
        value: serviceTypeText,
      },
      {
        label: t('common.server'),
        value: crmDealAccount.serverName || '-',
      },
      {
        label: t('table.role'),
        value: crmDealAccount.roleName || '-',
      },
      {
        label: t('CRMAccountPage.registerTime'),
        value: crmDealAccount.registerTimeStr || '-',
      },
      {
        label: t('table.balance'),
        value: (crmDealAccount.balance || 0).toFixed(2),
      },
      {
        label: t('table.creditAmount'),
        value: (crmDealAccount.creditAmount || 0).toFixed(2),
      },
      {
        label: t('table.netWorth'),
        value: (crmDealAccount.netWorth || 0).toFixed(2),
      },
      {
        label: t('table.usedAdvance'),
        value: (crmDealAccount.usedAdvance || 0).toFixed(2),
      },
      {
        label: t('tradingAccountDataStats.usableAdvance'),
        value: (crmDealAccount.usableAdvance || 0).toFixed(2),
      },
      {
        label: t('tradingAccountDataStats.advanceScale'),
        value: (crmDealAccount.advanceScale || 0).toFixed(2) + '%',
      },
      {
        label: t('accountOpening.source'),
        value: crmDealAccount.source || '-',
      },
    ];
  }, [crmDealAccount, t]);

  const editableKeys = useMemo<GeneralInfoField[]>(
    () => [
      'name',
      'accountType',
      'serverGroup',
      'userId',
      'directBroker',
      'accountGroupId',
      'lever',
    ],
    [],
  );

  const initialData = useMemo<Record<GeneralInfoField, string>>(
    () => ({
      name: name,
      accountType: accountType,
      serverGroup: serverGroup,
      userId: userId,
      directBroker: directBroker,
      accountGroupId: accountGroupId,
      lever: lever,
    }),
    [name, accountType, serverGroup, userId, directBroker, accountGroupId, lever],
  );

  const {
    startEdit,
    updateEditingValue,
    cancelEdit,
    confirmEdit,
    getDisplayValue,
    isEditing,
    getConfirmedData,
    resetFields,
  } = useEditableFields<GeneralInfoField>(initialData, editableKeys);

  const initIdRef = useRef('');

  const nextValues = useMemo<FormValues>(
    () => ({
      name,
      accountType,
      serverGroup,
      userId,
      directBroker,
      accountGroupId,
      lever,
    }),
    [name, accountType, serverGroup, userId, directBroker, accountGroupId, lever],
  );

  useEffect(() => {
    // 仅在首次加载时设置表单默认值和可编辑字段的初始值，后续编辑操作由 useEditableFields 管理
    if (!crmDealAccount) return;
    const initKey = detailId || id;
    if (initIdRef.current === initKey) return;
    form.reset(nextValues);
    resetFields(nextValues);
    setModalLabels(prev => ({
      userId: {
        ...prev.userId,
        ...(userId ? { [userId]: userIdLabel || userId } : {}),
      },
      directBroker: {
        ...prev.directBroker,
        ...(directBroker ? { [directBroker]: directBrokerLabel || directBroker } : {}),
      },
    }));
    initIdRef.current = initKey;
  }, [
    crmDealAccount,
    nextValues,
    userId,
    directBroker,
    userIdLabel,
    directBrokerLabel,
    form,
    resetFields,
    detailId,
    id,
  ]);

  const fieldConfigs = useMemo<
    Array<{
      key: GeneralInfoField;
      label: string;
      name: keyof FormValues;
      type: EditType;
      options?: SelectOption[];
      format?: (value: string) => string;
    }>
  >(
    () => [
      { key: 'name', label: t('table.fullName'), name: 'name', type: 'input' },
      {
        key: 'accountType',
        label: t('common.accountType'),
        name: 'accountType',
        type: 'select',
        options: allAccountTypeOptions,
      },
      {
        key: 'serverGroup',
        label: t('table.groups'),
        name: 'serverGroup',
        type: 'select',
        options: serverGroupOptions,
      },
      {
        key: 'userId',
        label: t('tradingAccountTransactions.directBroker'),
        name: 'userId',
        type: 'modal',
      },
      {
        key: 'directBroker',
        label: t('table.directAgent'),
        name: 'directBroker',
        type: 'modal',
      },
      {
        key: 'accountGroupId',
        label: t('table.accountGroup'),
        name: 'accountGroupId',
        type: 'select',
        options: accountGroupOptions,
      },
      {
        key: 'lever',
        label: t('common.level'),
        name: 'lever',
        type: 'select',
        options: leverOptions,
      },
    ],
    [t, allAccountTypeOptions, serverGroupOptions, accountGroupOptions, leverOptions],
  );

  const getDisplayText = useCallback(
    (config: {
      key: GeneralInfoField;
      type: EditType;
      options?: SelectOption[];
      format?: (value: string) => string;
    }) => {
      const rawValue = getDisplayValue(config.key) || '';
      if (config.type === 'select') {
        const selectKey = config.key as SelectFieldKey;
        return selectLabelMaps[selectKey]?.[rawValue] || rawValue || '-';
      }
      if (config.type === 'modal') {
        const modalKey = config.key as ModalFieldKey;
        return modalLabels[modalKey]?.[rawValue] || rawValue || '-';
      }
      return config.format?.(rawValue) || rawValue || '-';
    },
    [getDisplayValue, modalLabels, selectLabelMaps],
  );

  const onSubmit = async (data: FormValues) => {
    await withLoading(async () => {
      try {
        const params = {
          id: id,
          server: crmDealAccount?.server || '',
          ...data,
        };
        const res = await setDetailInfoEdit(params);
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

  if (detailLoading) {
    return (
      <div className="h-100">
        <RrhCircleLoading />
      </div>
    );
  }

  return (
    <div>
      <FormProvider form={form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
              {fieldConfigs.map(config => (
                <FormField
                  key={config.key}
                  name={config.name}
                  render={({ field }) => (
                    <LabelItem
                      label={config.label}
                      ContentDom={
                        <EditableField
                          isEditing={isEditing(config.key)}
                          displayValue={getDisplayText(config)}
                          onCancel={() => {
                            cancelEdit(config.key);
                            const confirmed = getConfirmedData()[config.key] || '';
                            field.onChange(confirmed);
                          }}
                          onConfirm={() => confirmEdit(config.key)}
                          onEdit={() => startEdit(config.key)}
                          editor={
                            config.type === 'input' ? (
                              <Input
                                className="h-10"
                                value={field.value || ''}
                                onChange={e => {
                                  field.onChange(e.target.value);
                                  updateEditingValue(config.key, e.target.value);
                                }}
                              />
                            ) : config.type === 'select' ? (
                              <RrhSelect
                                options={config.options || []}
                                value={field.value || ''}
                                onValueChange={val => {
                                  field.onChange(val);
                                  updateEditingValue(config.key, val);
                                }}
                                showRowValue={false}
                                placeholder={t('common.pleaseSelect')}
                                className="w-full"
                              />
                            ) : (
                              <SelectDirectAgent
                                valueLabel={
                                  modalLabels[config.key as ModalFieldKey]?.[
                                    (field.value as string) || ''
                                  ] || ''
                                }
                                onConfirm={({ value, label }) => {
                                  field.onChange(value);
                                  updateEditingValue(config.key, value);
                                  const modalKey = config.key as ModalFieldKey;
                                  setModalLabels(prev => ({
                                    ...prev,
                                    [modalKey]: {
                                      ...prev[modalKey],
                                      ...(value ? { [value]: label || value } : {}),
                                    },
                                  }));
                                }}
                              />
                            )
                          }
                        />
                      }
                    />
                  )}
                />
              ))}
              {detailInfoList.map(({ label, value }) => (
                <LabelItem key={label} label={label} ContentDom={<InfoItem info={value} />} />
              ))}
            </div>
            <div className="flex justify-end">
              <RrhButton type="submit" variant="default">
                {t('common.Confirm')}
              </RrhButton>
            </div>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
}
