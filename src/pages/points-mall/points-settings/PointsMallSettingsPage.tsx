import { PageInfo } from '@/components/common/PageInfo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { PointConfig } from './components/PointConfig';
import { PointStore } from './components/PointStore';
import { useForm } from 'react-hook-form';
import { RrhForm } from '@/components/form/RrhForm';
import { EditPointsConfig, useEditPointsConfig, usePointsConfig } from '@/api/hooks/pointsMall';
import { useEffect, useMemo, useRef, useState } from 'react';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { StoreInfo } from './components/StoreInfo';
import { RrhButton } from '@/components/common/RrhButton';
import { PointsConfigRes, PointsConfigSettingItem } from '@/api/hooks/pointsMall';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { TFunction } from 'i18next';
import { useGlobalLoading } from '@/contexts/loading';
import { toast } from 'sonner';
import { SidebarMultiSelectCard } from './components/SidebarMultiSelectCard';
import { ToolTip } from '@/components/common/ToolTip';
import { CircleAlert } from 'lucide-react';
import {
  createEmptyCommissionReward,
  createEmptyTransaction,
  PointsMallSettingsFormValues,
} from './types';

type FormValues = PointsMallSettingsFormValues;

const toText = (value: string | number | null | undefined) =>
  value === null || value === undefined ? '' : String(value);

const toArray = (value: string | null | undefined) =>
  toText(value)
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);

const mySchema = (t: TFunction<'translation', undefined>) => {
  const required = (field: string) => {
    let fieldName = '';
    switch (field) {
      case 'bonusPoints':
        fieldName = t('pointsMallSettings.rewardCalculation');
        break;
      case 'cappedPoints':
        fieldName = t('pointsMallSettings.cappedPointsPerTime');
        break;
      case 'selected':
        fieldName = t('pointsMallSettings.selected');
        break;
    }
    return t('rules.required', { field: fieldName });
  };

  const requiredText = (field: string) => z.string().trim().min(1, required(field));

  const transactionItemSchema = z.object({
    bonusBasis: requiredText('bonusBasis'),
    bonusPoints: requiredText('bonusPoints'),
    businessType: requiredText('businessType'),
    cappedPoints: requiredText('cappedPoints'),
    cappedTimeUnit: requiredText('cappedTimeUnit'),
    dealBreed: z.string().optional(),
    dealServer: requiredText('dealServer'),
    id: requiredText('id'),
  });

  const commissionRewardItemSchema = z.object({
    businessType: requiredText('businessType'),
    id: requiredText('id'),
    subType: requiredText('subType'),
    bonusPoints: requiredText('bonusPoints'),
    bonusBasis: z.string(),
    cappedPoints: requiredText('cappedPoints'),
    cappedTimeUnit: requiredText('cappedTimeUnit'),
  });

  return {
    productExchangeEnable: requiredText('productExchangeEnable'),
    pointsDigits: requiredText('pointsDigits'),
    selected: z.array(requiredText('selected')).min(1, required('selected')),
    commissionRewardSelectedId: requiredText('commissionRewardSelectedId'),
    depositSuccess: z.object({
      businessType: requiredText('businessType'),
      id: requiredText('id'),
      bonusPoints: requiredText('bonusPoints'),
      bonusBasis: requiredText('bonusBasis'),
      cappedPoints: requiredText('cappedPoints'),
      cappedTimeUnit: requiredText('cappedTimeUnit'),
    }),
    transaction: z.array(transactionItemSchema).min(1, required('transaction')),
    agentCustomerTransaction: z
      .array(transactionItemSchema)
      .min(1, required('agentCustomerTransaction')),
    inviteRegister: z.object({
      businessType: requiredText('businessType'),
      id: requiredText('id'),
      bonusPoints: requiredText('bonusPoints'),
      cappedPoints: requiredText('cappedPoints'),
      cappedTimeUnit: requiredText('cappedTimeUnit'),
    }),
    inviteOpenAccount: z.object({
      businessType: requiredText('businessType'),
      id: requiredText('id'),
      bonusPoints: requiredText('bonusPoints'),
      cappedPoints: requiredText('cappedPoints'),
      cappedTimeUnit: requiredText('cappedTimeUnit'),
      multipleRewards: requiredText('multipleRewards'),
    }),
    inviteDeposit: z.object({
      businessType: requiredText('businessType'),
      id: requiredText('id'),
      bonusPoints: requiredText('bonusPoints'),
      cappedPoints: requiredText('cappedPoints'),
      cappedTimeUnit: requiredText('cappedTimeUnit'),
    }),
    agentCustomerDeposit: z.object({
      businessType: requiredText('businessType'),
      id: requiredText('id'),
      bonusPoints: requiredText('bonusPoints'),
      bonusBasis: requiredText('bonusBasis'),
      cappedPoints: requiredText('cappedPoints'),
      cappedTimeUnit: requiredText('cappedTimeUnit'),
    }),
    commissionReward: z.array(commissionRewardItemSchema).min(1, required('commissionReward')),
    deductionDays: z.string().optional(),
    deductionRatio: z.string().optional(),
    exemptRoleIds: z.array(requiredText('exemptRoleIds')).min(1, required('exemptRoleIds')),
    exemptTagIds: z.array(requiredText('exemptTagIds')).min(1, required('exemptTagIds')),
    roleIds: z.array(z.string()),
    mindUserIds: z.array(z.string()),
    content: z.record(z.string()).optional(),
  };
};

type IntervalSettingsInput = {
  intervalMode?: string;
  globalIntervalValue?: string;
  groupIntervalConfigs?: Array<{
    serverId: string;
    group: string;
    timeInterval: string;
  }>;
};

// 处理接口数据，构建提交数据结构
const buildEditPointsConfigPayload = (
  values: FormValues,
  intervalSettings?: IntervalSettingsInput,
): EditPointsConfig => {
  const selectedValues = values.selected.filter(Boolean);

  const configList: EditPointsConfig['configList'] = [
    {
      businessType: '1',
      id: values.depositSuccess.id,
      bonusPoints: values.depositSuccess.bonusPoints,
      bonusBasis: values.depositSuccess.bonusBasis,
      cappedPoints: values.depositSuccess.cappedPoints,
      cappedTimeUnit: values.depositSuccess.cappedTimeUnit,
    },
    ...values.transaction.map(item => ({
      businessType: '2' as const,
      id: item.id,
      dealServer: item.dealServer,
      dealBreed: item.dealBreed ?? '',
      bonusPoints: item.bonusPoints,
      bonusBasis: item.bonusBasis,
      cappedPoints: item.cappedPoints,
      cappedTimeUnit: item.cappedTimeUnit,
    })),
    {
      businessType: '3',
      id: values.inviteRegister.id,
      bonusPoints: values.inviteRegister.bonusPoints,
      cappedPoints: values.inviteRegister.cappedPoints,
      cappedTimeUnit: values.inviteRegister.cappedTimeUnit,
    },
    {
      businessType: '4',
      id: values.inviteOpenAccount.id,
      bonusPoints: values.inviteOpenAccount.bonusPoints,
      cappedPoints: values.inviteOpenAccount.cappedPoints,
      cappedTimeUnit: values.inviteOpenAccount.cappedTimeUnit,
      multipleRewards: values.inviteOpenAccount.multipleRewards,
    },
    {
      businessType: '5',
      id: values.inviteDeposit.id,
      bonusPoints: values.inviteDeposit.bonusPoints,
      cappedPoints: values.inviteDeposit.cappedPoints,
      cappedTimeUnit: values.inviteDeposit.cappedTimeUnit,
    },
    {
      businessType: '6',
      id: values.agentCustomerDeposit.id,
      bonusPoints: values.agentCustomerDeposit.bonusPoints,
      bonusBasis: values.agentCustomerDeposit.bonusBasis,
      cappedPoints: values.agentCustomerDeposit.cappedPoints,
      cappedTimeUnit: values.agentCustomerDeposit.cappedTimeUnit,
    },
    ...values.agentCustomerTransaction.map(item => ({
      businessType: '7' as const,
      id: item.id,
      dealServer: item.dealServer,
      dealBreed: item.dealBreed ?? '',
      bonusPoints: item.bonusPoints,
      bonusBasis: item.bonusBasis,
      cappedPoints: item.cappedPoints,
      cappedTimeUnit: item.cappedTimeUnit,
    })),
    ...values.commissionReward.map(item => ({
      businessType: '8' as const,
      id: item.id,
      subType: item.subType,
      bonusPoints: item.bonusPoints,
      bonusBasis: item.bonusBasis,
      cappedPoints: item.cappedPoints,
      cappedTimeUnit: item.cappedTimeUnit,
    })),
  ];

  return {
    selectedValues,
    configList,
    pointsDigits: values.pointsDigits,
    productExchangeEnable: values.productExchangeEnable,
    roleIds: values.roleIds,
    mindUserIds: values.mindUserIds,
    deductionDays: values.deductionDays ?? '',
    deductionRatio: values.deductionRatio ?? '',
    exemptRoles: values.exemptRoleIds,
    exemptTags: values.exemptTagIds,
    intervalMode: intervalSettings?.intervalMode ?? '',
    globalIntervalValue: intervalSettings?.globalIntervalValue ?? '',
    groupIntervalConfigs: intervalSettings?.groupIntervalConfigs ?? [],
  };
};
// 处理接口数据，构建表单初始值结构
const buildFormValuesFromConfigData = (payload: PointsConfigRes['data']): FormValues => {
  const depositSetting = payload.settingsData?.['1']?.[0];
  const transactionSettings = payload.settingsData?.['2'] ?? [];
  const agentCustomerTransactionSettings = payload.settingsData?.['7'] ?? [];
  const commissionRewardSettings = payload.settingsData?.['8'] ?? [];
  const inviteRegister = payload.settingsData?.['3']?.[0];
  const inviteOpenAccount = payload.settingsData?.['4']?.[0];
  const inviteDeposit = payload.settingsData?.['5']?.[0];
  const deductionDays = payload?.deductionDays || '';
  const deductionRatio = payload?.deductionRatio || '';

  const exemptRoleIds = payload?.exemptRoleIds || [];
  const exemptTagIds = payload?.exemptTagIds || [];
  const roleIds = payload?.roleIds || [];
  const mindUserIds = payload?.mindUserIds || [];

  const mapTransactionSettings = (
    settings: PointsConfigSettingItem[],
    defaultBusinessType: string,
  ) =>
    settings.map(item => ({
      id: toText(item.id),
      businessType: toText(item.businessType) || defaultBusinessType,
      bonusPoints: toText(item.bonusPoints),
      bonusBasis: toText(item.bonusBasis),
      cappedPoints: toText(item.cappedPoints),
      cappedTimeUnit: toText(item.cappedTimeUnit),
      dealServer: toText(item.dealServer),
      dealBreed: toText(item.dealBreed),
    }));

  const mappedTransactions = mapTransactionSettings(transactionSettings, '2');
  const mappedAgentCustomerTransactions = mapTransactionSettings(
    agentCustomerTransactionSettings,
    '7',
  );
  const mappedCommissionRewards = [...(commissionRewardSettings as PointsConfigSettingItem[])]
    .sort((a, b) => Number(a.id) - Number(b.id))
    .map(item => ({
      businessType: toText(item.businessType) || '8',
      id: toText(item.id),
      subType: toText(item.subType),
      bonusPoints: toText(item.bonusPoints),
      bonusBasis: toText(item.bonusBasis),
      cappedPoints: toText(item.cappedPoints),
      cappedTimeUnit: toText(item.cappedTimeUnit),
    }));

  const agentCustomerDeposit = payload.settingsData?.['6']?.[0];

  return {
    productExchangeEnable: payload.productExchangeEnable ?? '',
    pointsDigits: payload.pointsDigits ?? '',
    selected: toArray(payload.selected),
    commissionRewardSelectedId: mappedCommissionRewards[0]?.id || '',
    deductionDays,
    deductionRatio,
    depositSuccess: {
      businessType: toText(depositSetting?.businessType) || '1',
      id: toText(depositSetting?.id) || '1',
      bonusPoints: toText(depositSetting?.bonusPoints),
      bonusBasis: toText(depositSetting?.bonusBasis),
      cappedPoints: toText(depositSetting?.cappedPoints),
      cappedTimeUnit: toText(depositSetting?.cappedTimeUnit),
    },
    transaction: mappedTransactions.length ? mappedTransactions : [createEmptyTransaction()],
    agentCustomerTransaction: mappedAgentCustomerTransactions.length
      ? mappedAgentCustomerTransactions
      : [createEmptyTransaction('7')],
    inviteRegister: {
      businessType: toText(inviteRegister?.businessType) || '3',
      id: toText(inviteRegister?.id) || '1',
      bonusPoints: toText(inviteRegister?.bonusPoints),
      cappedPoints: toText(inviteRegister?.cappedPoints),
      cappedTimeUnit: toText(inviteRegister?.cappedTimeUnit),
    },
    inviteOpenAccount: {
      businessType: toText(inviteOpenAccount?.businessType) || '4',
      id: toText(inviteOpenAccount?.id) || '1',
      bonusPoints: toText(inviteOpenAccount?.bonusPoints),
      cappedPoints: toText(inviteOpenAccount?.cappedPoints),
      cappedTimeUnit: toText(inviteOpenAccount?.cappedTimeUnit),
      multipleRewards: toText(inviteOpenAccount?.multipleRewards),
    },
    inviteDeposit: {
      businessType: toText(inviteDeposit?.businessType) || '5',
      id: toText(inviteDeposit?.id) || '1',
      bonusPoints: toText(inviteDeposit?.bonusPoints),
      cappedPoints: toText(inviteDeposit?.cappedPoints),
      cappedTimeUnit: toText(inviteDeposit?.cappedTimeUnit),
    },
    agentCustomerDeposit: {
      businessType: toText(agentCustomerDeposit?.businessType) || '6',
      id: toText(agentCustomerDeposit?.id) || '1',
      bonusPoints: toText(agentCustomerDeposit?.bonusPoints),
      bonusBasis: toText(agentCustomerDeposit?.bonusBasis),
      cappedPoints: toText(agentCustomerDeposit?.cappedPoints),
      cappedTimeUnit: toText(agentCustomerDeposit?.cappedTimeUnit),
    },
    commissionReward: mappedCommissionRewards.length
      ? mappedCommissionRewards
      : [
          createEmptyCommissionReward('29', '1'),
          createEmptyCommissionReward('30', '2'),
          createEmptyCommissionReward('31', '3'),
        ],
    exemptRoleIds,
    exemptTagIds,
    roleIds,
    mindUserIds,
  };
};

export function PointsMallSettingsPage() {
  const { withLoading } = useGlobalLoading();
  const [isFormReady, setIsFormReady] = useState(false);
  const [tabValue, setTabValue] = useState('pointsMallSettings.pointConfig');
  const { t } = useTranslation();
  const [editable, setEditable] = useState(false);
  const initialFormValuesRef = useRef<FormValues | null>(null);
  const lastHydratedAtRef = useRef<number>(0);
  const { mutateAsync: editPointsConfig } = useEditPointsConfig();
  const { data: configData, isLoading, refetch, dataUpdatedAt } = usePointsConfig();
  const allRoles = useMemo(() => configData?.data?.allRoles || [], [configData?.data?.allRoles]);
  const allTags = useMemo(() => configData?.data?.allTags || [], [configData?.data?.allTags]);
  const allSysUser = useMemo(
    () => configData?.data?.allSysUser || [],
    [configData?.data?.allSysUser],
  );
  const status = Number(configData?.data?.status) || 0;
  const subscription = configData?.data?.subscription;
  const roleOptions = useMemo(
    () =>
      allRoles.map(i => ({
        label: i.roleName,
        value: i.roleId,
      })),
    [allRoles],
  );
  const tagOptions = useMemo(
    () =>
      allTags.map(i => ({
        label: i.tagName,
        value: i.id,
      })),
    [allTags],
  );
  const sysUserOptions = useMemo(
    () =>
      allSysUser.map(i => ({
        label: i.wholeName,
        value: i.userId,
      })),
    [allSysUser],
  );
  const serverOptions = useMemo(
    () =>
      (configData?.data?.mtServiceList || []).map(i => ({
        label: i.aliasName,
        value: i.id,
        serviceProperty: i.serviceProperty,
        serviceType: i.serviceType,
      })),
    [configData?.data?.mtServiceList],
  );
  const settingTabs = useMemo(
    () => [
      {
        value: 'pointsMallSettings.pointConfig',
        component: (
          <PointConfig
            editable={editable}
            allRoles={roleOptions}
            allTags={tagOptions}
            serverOptions={serverOptions}
          />
        ),
      },
      {
        value: 'pointsMallSettings.pointStore',
        component: <PointStore success={refetch} />,
      },
    ],
    [editable, refetch, roleOptions, serverOptions, tagOptions],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(z.object(mySchema(t))),
    defaultValues: {
      productExchangeEnable: '',
      pointsDigits: '',
      selected: [],
      commissionRewardSelectedId: '',
      depositSuccess: {
        businessType: '1',
        id: '1',
        bonusPoints: '',
        bonusBasis: '',
        cappedPoints: '',
        cappedTimeUnit: '',
      },
      transaction: [createEmptyTransaction()],
      agentCustomerTransaction: [createEmptyTransaction('7')],
      inviteRegister: {
        businessType: '3',
        id: '1',
        bonusPoints: '',
        cappedPoints: '',
        cappedTimeUnit: '',
      },
      inviteOpenAccount: {
        businessType: '4',
        id: '1',
        bonusPoints: '',
        cappedPoints: '',
        cappedTimeUnit: '',
        multipleRewards: '',
      },
      inviteDeposit: {
        businessType: '5',
        id: '1',
        bonusPoints: '',
        cappedPoints: '',
        cappedTimeUnit: '',
      },
      agentCustomerDeposit: {
        businessType: '6',
        id: '1',
        bonusPoints: '',
        bonusBasis: '',
        cappedPoints: '',
        cappedTimeUnit: '',
      },
      commissionReward: [
        createEmptyCommissionReward('29', '1'),
        createEmptyCommissionReward('30', '2'),
        createEmptyCommissionReward('31', '3'),
      ],
      deductionDays: '',
      deductionRatio: '',
      exemptRoleIds: [],
      exemptTagIds: [],
      roleIds: [],
      mindUserIds: [],
      content: {},
    },
  });

  useEffect(() => {
    const payload = configData?.data;
    if (!payload) return;
    const resetValues = buildFormValuesFromConfigData(payload);

    // Keep editing values stable; apply fresh server values only when not editing.
    if (editable) {
      if (!isFormReady) {
        initialFormValuesRef.current = resetValues;
        lastHydratedAtRef.current = dataUpdatedAt;
        setIsFormReady(true);
      }
      return;
    }

    const hasNewData = lastHydratedAtRef.current !== dataUpdatedAt;
    if (!hasNewData && isFormReady) {
      return;
    }

    form.reset(resetValues);
    initialFormValuesRef.current = resetValues;
    lastHydratedAtRef.current = dataUpdatedAt;
    setIsFormReady(true);
  }, [configData, dataUpdatedAt, editable, form, isFormReady]);

  const save = async () => {
    form.handleSubmit(submit)();
  };

  const submit = async (values: FormValues) => {
    await withLoading(async () => {
      try {
        const intervalSettings: IntervalSettingsInput = (configData?.data ??
          {}) as IntervalSettingsInput;
        const params = buildEditPointsConfigPayload(values, intervalSettings);
        const res = await editPointsConfig(params);
        if (res.code === 0) {
          toast.success(t('common.success'));
          refetch();
        } else {
          toast.error(res.msg);
        }
      } catch {
        toast.error(t('common.AnErrorOccurred'));
      }
    });
  };

  const onStartEdit = () => {
    initialFormValuesRef.current = form.getValues();
    setEditable(true);
  };

  const onCancelEdit = () => {
    if (initialFormValuesRef.current) {
      form.reset(initialFormValuesRef.current);
    }
    setEditable(false);
  };

  if (isLoading || !isFormReady) {
    return (
      <div className="h-100">
        <RrhCircleLoading />
      </div>
    );
  }
  return (
    <>
      <div className="flex items-center justify-between">
        <PageInfo wrapperCls="py-3" title={t('pointsMallSettings.title')} />
        {tabValue === 'pointsMallSettings.pointConfig' && (
          <div className="flex justify-end gap-1">
            {!editable && (
              <RrhButton type="button" onClick={onStartEdit}>
                {t('common.Edit')}
              </RrhButton>
            )}
            {editable && (
              <>
                <RrhButton type="button" onClick={onCancelEdit}>
                  {t('common.Cancel')}
                </RrhButton>
                <RrhButton type="button" onClick={save}>
                  {t('common.save')}
                </RrhButton>
              </>
            )}
          </div>
        )}
      </div>

      <RrhForm form={form}>
        <div className="relative flex flex-col gap-3 md:flex-row md:gap-8">
          <div className="flex-1">
            <Tabs
              value={tabValue}
              onValueChange={setTabValue}
              className="flex-1 gap-3 overflow-auto"
            >
              <TabsList>
                {settingTabs.map(i => (
                  <TabsTrigger key={i.value} value={i.value}>
                    {t(i.value)}
                  </TabsTrigger>
                ))}
              </TabsList>
              {settingTabs.map(i => (
                <TabsContent key={i.value} value={i.value}>
                  {i.component}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="relative md:mt-12 md:w-93.5">
            <div className="sticky top-0 flex flex-col gap-3 md:gap-6">
              <StoreInfo status={status} subscription={subscription || {}} success={refetch} />
              {tabValue === 'pointsMallSettings.pointConfig' && (
                <SidebarMultiSelectCard
                  title={t('pointsMallSettings.suitableUser')}
                  description={t('pointsMallSettings.pointsMalltips.4')}
                  name="roleIds"
                  label={t('pointsMallSettings.userRole')}
                  placeholder={t('common.pleaseSelect')}
                  options={roleOptions}
                  editable={editable}
                />
              )}
              {tabValue === 'pointsMallSettings.pointConfig' && (
                <SidebarMultiSelectCard
                  title={t('pointsMallSettings.exChangeReminder')}
                  name="mindUserIds"
                  label={t('pointsMallSettings.exChangeReminderTips.1')}
                  placeholder={t('common.pleaseSelect')}
                  options={sysUserOptions}
                  editable={editable}
                  labelTipsDom={
                    <ToolTip
                      content={
                        <span className="whitespace-pre-line">
                          {t('pointsMallSettings.exChangeReminderTips.2')}
                        </span>
                      }
                    >
                      <CircleAlert className="text-muted-foreground size-4" />
                    </ToolTip>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </RrhForm>
    </>
  );
}
