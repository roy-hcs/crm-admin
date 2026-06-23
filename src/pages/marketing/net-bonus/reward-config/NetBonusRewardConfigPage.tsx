import { PageInfo } from '@/components/common/PageInfo';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { RrhForm } from '@/components/form/RrhForm';
import { useEffect, useMemo, useRef, useState } from 'react';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { RrhButton } from '@/components/common/RrhButton';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { TFunction } from 'i18next';
import { useGlobalLoading } from '@/contexts/loading';
import { toast } from 'sonner';
import {
  EditNetBonusRewardConfigFixedParams,
  EditNetBonusRewardConfigParams,
  EditNetBonusIntervalsParams,
  NetBonusRewardConfigData,
  useEditNetBonusRewardConfigFixed,
  useEditNetBonusRewardConfig,
  useNetBonusRewardConfig,
  useGetNetBonusIntervals,
  useEditNetBonusIntervals,
} from '@/api/hooks/marketing';
import { BaseConfig } from './components/BaseConfig';
import { useDictType } from '@/api/hooks/system';
import { RewardActivationStatus } from './components/RewardActivationStatus';
import { Faq } from './components/Faq';
import { toStringArray } from '../../shared/formValueUtils';

export type GroupItem = {
  startAmount: string;
  endAmount: string;
  rewardParam: string;
  type: string;
};

type FormValues = {
  rewardTarget: string[];
  status: string;
  selected: string[];
  depositSubType: string[];
  withdrawSelected: string[];
  withdrawSubType: string[];
  dataStatisticsTimeRange: number;
  autoReview: number;
  fixedParams: Array<{
    userId: string;
    userLabel?: string;
    rewardParam: string;
    type: string;
  }>;
  agentRewardIntervals: GroupItem[];
  salesRewardIntervals: GroupItem[];
  businessRewardIntervals: GroupItem[];
};

const createEmptyFixedParam = () => ({
  userId: '',
  userLabel: '',
  rewardParam: '',
  type: '1',
});

const createEmptyRewardInterval = (type: 'agent' | 'sales' | 'business') => ({
  startAmount: '',
  endAmount: '',
  rewardParam: '',
  type,
});

const cloneFormValues = (values: FormValues): FormValues => {
  if (typeof structuredClone === 'function') {
    return structuredClone(values);
  }
  return JSON.parse(JSON.stringify(values)) as FormValues;
};

const toArray = (value: string | null | undefined) => toStringArray(value);

const mySchema = (t: TFunction<'translation', undefined>) => {
  const required = (field: string) => {
    let fieldName = '';
    switch (field) {
      case 'rewardTarget':
        fieldName = t('netBonusRewardConfig.rewardTarget');
        break;
      case 'selected':
        fieldName = t('netBonusRewardConfig.fundDepositStatistics');
        break;
      case 'startAmount':
      case 'endAmount':
        fieldName = t('netBonusRewardConfig.amountRange');
        break;
      case 'rewardParam':
        fieldName = t('table.rewardParams');
        break;
    }
    return t('rules.required', { field: fieldName });
  };

  const hasValue = (value: string) => value.trim() !== '';

  const rewardIntervalSchema = z
    .array(
      z.object({
        startAmount: z.string(),
        endAmount: z.string(),
        rewardParam: z.string(),
        type: z.string(),
      }),
    )
    .superRefine((items, ctx) => {
      items.forEach((item, index) => {
        if (!hasValue(item.startAmount)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: required('startAmount'),
            path: [index, 'startAmount'],
          });
        }

        if (!hasValue(item.rewardParam)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: required('rewardParam'),
            path: [index, 'rewardParam'],
          });
        }

        const isLastRow = index === items.length - 1;
        if (!isLastRow && !hasValue(item.endAmount)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: required('endAmount'),
            path: [index, 'endAmount'],
          });
        }
      });
    });

  return {
    rewardTarget: z.array(z.string()),
    selected: z.array(z.string()).min(1, required('selected')),
    status: z.string(),
    depositSubType: z.array(z.string()),
    withdrawSelected: z.array(z.string()),
    withdrawSubType: z.array(z.string()),
    dataStatisticsTimeRange: z.number(),
    autoReview: z.number(),
    fixedParams: z.array(
      z.object({
        userId: z.string(),
        userLabel: z.string().optional(),
        rewardParam: z.string(),
        type: z.string(),
      }),
    ),
    agentRewardIntervals: rewardIntervalSchema,
    salesRewardIntervals: rewardIntervalSchema,
    businessRewardIntervals: rewardIntervalSchema,
  };
};

// 处理接口数据，构建提交数据结构
const buildEditPointsConfigPayload = (
  values: FormValues,
  configData?: NetBonusRewardConfigData,
): EditNetBonusRewardConfigParams => {
  const currentSetting = configData?.netDepositBonus;

  const rewardTarget = values.rewardTarget;
  const crmDeposit = values.selected.includes('1') ? '1' : '0';
  const sysDeposit = values.selected.includes('2') ? '1' : '0';
  const crmWithdraw = values.withdrawSelected.includes('1') ? '1' : '0';
  const sysWithdraw = values.withdrawSelected.includes('2') ? '1' : '0';
  const dataStatisticsTimeRange = values.dataStatisticsTimeRange;

  return {
    id: currentSetting?.id || '',
    status: values.status,
    autoReview: String(currentSetting?.autoReview ?? '0'),
    rewardTarget: rewardTarget,
    crmDeposit,
    sysDeposit,
    crmWithdraw,
    sysWithdraw,
    dataStatisticsTimeRange: dataStatisticsTimeRange,
    depositSubType: sysDeposit === '1' ? values.depositSubType : [],
    withdrawSubType: sysWithdraw === '1' ? values.withdrawSubType : [],
  };
};

const buildEditFixedParamsPayload = (values: FormValues): EditNetBonusRewardConfigFixedParams => {
  return values.fixedParams
    .map(item => ({
      userId: item.userId?.trim(),
      rewardParam: item.rewardParam?.toString().trim(),
      type: item.type?.trim() || '1',
    }))
    .filter(item => item.userId && item.rewardParam)
    .map(item => ({
      ...item,
      userId: item.userId,
      rewardParam: item.rewardParam,
    }));
};

const buildEditIntervalsPayload = (values: FormValues): EditNetBonusIntervalsParams => {
  const mapByType = (
    items: FormValues['agentRewardIntervals'],
    type: 'agent' | 'sales' | 'business',
  ) =>
    items.map(item => ({
      startAmount: Number(item.startAmount),
      endAmount: Number(item.endAmount),
      rewardParam: Number(item.rewardParam),
      type,
    }));

  return [
    ...mapByType(values.agentRewardIntervals, 'agent'),
    ...mapByType(values.salesRewardIntervals, 'sales'),
    ...mapByType(values.businessRewardIntervals, 'business'),
  ].filter(
    item =>
      Number.isFinite(item.startAmount) &&
      Number.isFinite(item.endAmount) &&
      Number.isFinite(item.rewardParam),
  );
};

// 处理接口数据，构建表单初始值结构
const buildFormValuesFromConfigData = (
  payload: NetBonusRewardConfigData,
  intervalGroups: {
    agent: GroupItem[];
    sales: GroupItem[];
    business: GroupItem[];
  },
): FormValues => {
  const setting = payload.netDepositBonus;

  const selected: string[] = [];
  if (setting.crmDeposit === '1') {
    selected.push('1');
  }
  if (setting.sysDeposit === '1') {
    selected.push('2');
  }

  const withdrawSelected: string[] = [];
  if (setting.crmWithdraw === '1') {
    withdrawSelected.push('1');
  }
  if (setting.sysWithdraw === '1') {
    withdrawSelected.push('2');
  }

  const mapIntervals = (intervals: GroupItem[], type: 'agent' | 'sales' | 'business') => {
    const mapped = (intervals || []).map(item => ({
      startAmount: String(item.startAmount ?? ''),
      endAmount: String(item.endAmount ?? ''),
      rewardParam: String(item.rewardParam ?? ''),
      type,
    }));

    return mapped.length > 0 ? mapped : [createEmptyRewardInterval(type)];
  };

  return {
    rewardTarget: toArray(setting.rewardTarget),
    status: setting.status ?? '0',
    selected,
    depositSubType: toArray(setting.depositSubType),
    withdrawSelected,
    withdrawSubType: toArray(setting.withdrawSubType),
    dataStatisticsTimeRange: setting.dataStatisticsTimeRange ?? 1,
    autoReview: setting.autoReview ?? 0,
    fixedParams: payload.fixedParams?.map(item => ({
      userId: item.userId ?? '',
      userLabel: `${item.userName ?? ''} (${item.showId ?? '-'})`,
      rewardParam: String(item.rewardParam ?? ''),
      type: item.type ?? '1',
    })) ?? [createEmptyFixedParam()],
    agentRewardIntervals: mapIntervals(intervalGroups.agent, 'agent'),
    salesRewardIntervals: mapIntervals(intervalGroups.sales, 'sales'),
    businessRewardIntervals: mapIntervals(intervalGroups.business, 'business'),
  };
};

export function NetBonusRewardConfigPage() {
  const { withLoading } = useGlobalLoading();
  const [isFormReady, setIsFormReady] = useState(false);
  const { t } = useTranslation();
  const [editable, setEditable] = useState(false);
  const initialFormValuesRef = useRef<FormValues | null>(null);
  const lastHydratedAtRef = useRef<number>(0);
  const { data: inMoneyData, isLoading: isInMoneyLoading } = useDictType('crm_adjust_in_type'); // 入金
  const { data: outMoneyData, isLoading: isOutMoneyLoading } = useDictType('crm_adjust_out_type'); // 出金
  const { data: configData, isLoading, refetch, dataUpdatedAt } = useNetBonusRewardConfig();
  const { data: agentIntervalsData, isLoading: isAgentIntervalsLoading } = useGetNetBonusIntervals({
    type: 'agent',
  });
  const { data: salesIntervalsData, isLoading: isSalesIntervalsLoading } = useGetNetBonusIntervals({
    type: 'sales',
  });
  const { data: businessIntervalsData, isLoading: isBusinessIntervalsLoading } =
    useGetNetBonusIntervals({
      type: 'business',
    });
  const { mutateAsync: editPointsConfig } = useEditNetBonusRewardConfig();
  const { mutateAsync: editPointsConfigFixed } = useEditNetBonusRewardConfigFixed();
  const { mutateAsync: editNetBonusIntervals } = useEditNetBonusIntervals();

  const status = configData?.data?.subStatus;
  const subscription = configData?.data?.subscription;
  const sysDepositOptions = useMemo(
    () =>
      (inMoneyData || []).map(i => ({
        label: i.dictLabel,
        value: i.dictValue,
      })),
    [inMoneyData],
  );
  const sysWithdrawOptions = useMemo(
    () =>
      (outMoneyData || []).map(i => ({
        label: i.dictLabel,
        value: i.dictValue,
      })),
    [outMoneyData],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(z.object(mySchema(t))),
    defaultValues: {
      rewardTarget: [],
      status: '0',
      selected: [],
      depositSubType: [],
      withdrawSelected: [],
      withdrawSubType: [],
      dataStatisticsTimeRange: 1,
      autoReview: 0,
      fixedParams: [createEmptyFixedParam()],
      agentRewardIntervals: [createEmptyRewardInterval('agent')],
      salesRewardIntervals: [createEmptyRewardInterval('sales')],
      businessRewardIntervals: [createEmptyRewardInterval('business')],
    },
  });

  useEffect(() => {
    const payload = configData?.data;
    const agentIntervals = agentIntervalsData?.data;
    const salesIntervals = salesIntervalsData?.data;
    const businessIntervals = businessIntervalsData?.data;
    if (!payload || !agentIntervals || !salesIntervals || !businessIntervals) return;
    const resetValues = buildFormValuesFromConfigData(payload, {
      agent: agentIntervals.map(i => ({
        startAmount: `${i.startAmount ?? ''}`,
        endAmount: `${i.endAmount ?? ''}`,
        rewardParam: `${i.rewardParam ?? ''}`,
        type: i.type ?? '1',
      })),
      sales: salesIntervals.map(i => ({
        startAmount: `${i.startAmount ?? ''}`,
        endAmount: `${i.endAmount ?? ''}`,
        rewardParam: `${i.rewardParam ?? ''}`,
        type: i.type ?? '1',
      })),
      business: businessIntervals.map(i => ({
        startAmount: `${i.startAmount ?? ''}`,
        endAmount: `${i.endAmount ?? ''}`,
        rewardParam: `${i.rewardParam ?? ''}`,
        type: i.type ?? '1',
      })),
    });

    // Keep editing values stable; apply fresh server values only when not editing.
    if (editable) {
      if (!isFormReady) {
        initialFormValuesRef.current = cloneFormValues(resetValues);
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
    initialFormValuesRef.current = cloneFormValues(resetValues);
    lastHydratedAtRef.current = dataUpdatedAt;
    setIsFormReady(true);
  }, [
    agentIntervalsData,
    businessIntervalsData,
    configData,
    dataUpdatedAt,
    editable,
    form,
    isFormReady,
    salesIntervalsData,
  ]);

  const save = async () => {
    form.handleSubmit(submit)();
  };

  const submit = async (values: FormValues) => {
    await withLoading(async () => {
      try {
        const params = buildEditPointsConfigPayload(values, configData?.data);
        const fixedParams = buildEditFixedParamsPayload(values);
        const intervalParams = buildEditIntervalsPayload(values);

        const [baseRes, fixedRes, intervalRes] = await Promise.all([
          editPointsConfig(params),
          editPointsConfigFixed(fixedParams),
          editNetBonusIntervals(intervalParams),
        ]);

        if (baseRes.code === 0 && fixedRes.code === 0 && intervalRes.code === 0) {
          initialFormValuesRef.current = cloneFormValues(values);
          setEditable(false);
          toast.success(t('common.success'));
          refetch();
        } else {
          toast.error(
            baseRes.msg || fixedRes.msg || intervalRes.msg || t('common.AnErrorOccurred'),
          );
        }
      } catch {
        toast.error(t('common.AnErrorOccurred'));
      }
    });
  };

  const onStartEdit = () => {
    initialFormValuesRef.current = cloneFormValues(form.getValues());
    setEditable(true);
  };

  const onCancelEdit = () => {
    if (initialFormValuesRef.current) {
      form.reset(cloneFormValues(initialFormValuesRef.current));
    }
    setEditable(false);
  };

  if (
    isLoading ||
    !isFormReady ||
    isInMoneyLoading ||
    isOutMoneyLoading ||
    isAgentIntervalsLoading ||
    isSalesIntervalsLoading ||
    isBusinessIntervalsLoading
  ) {
    return (
      <div className="h-100">
        <RrhCircleLoading />
      </div>
    );
  }
  return (
    <>
      <div className="flex items-center justify-between">
        <PageInfo wrapperCls="py-3" title={t('netBonusRewardConfig.title')} />
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
      </div>

      <RrhForm form={form}>
        <div className="relative flex flex-col gap-3 md:flex-row md:gap-8">
          <div className="flex-1">
            <BaseConfig
              editable={editable}
              sysDepositOptions={sysDepositOptions}
              sysWithdrawOptions={sysWithdrawOptions}
            />
          </div>

          <div className="relative md:w-93.5">
            <div className="sticky top-0 flex flex-col gap-3 md:gap-6">
              <RewardActivationStatus
                status={Number(status)}
                subscription={subscription}
                success={refetch}
              />
              <Faq />
            </div>
          </div>
        </div>
      </RrhForm>
    </>
  );
}
