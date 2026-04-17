

import { cn } from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormHiddenInput } from '@/components/form/FormHiddenInput';
import { BaseOption } from '@/components/common/RrhSelect';
import { toast } from 'sonner';
import {
  useGetMtAndRebateType,
  AddTradingRebateRuleParams,
  useAddRebateTraderDeal,
  useEditRebateTraderDeal,
  useGetRebateTraderDealDetail,
  RebateTraderDealItem,
  RebateLevelRes,
} from '@/api/hooks/rebate';
import { DealAccountGroupListResponse } from '@/api/hooks/account';
import { RebateRuleFormStep1 } from './RebateRuleFormStep1';
import { RebateRuleFormStep2 } from './RebateRuleFormStep2';
import { RebateRuleFormStep3 } from './RebateRuleFormStep3';
import { RebateRuleFormNavigation } from './RebateRuleFormNavigation';
import { DictTypeResponse, ServerListResponse } from '@/api/hooks/system';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { useRebateRuleFormCore } from './useRebateRuleFormCore';
import { RrhForm } from '@/components/form/RrhForm';

// 表单内部使用的类型（与表单字段对应）
type RebateRuleFormValues = {
  id?: string; // 编辑模式时的ID
  ruleName: string;
  model: string;
  rebateType: string;
  hasUsed: string; // '1' 或 '0'
  settleUnit: string;
  settleValue?: number; // optional
  settleType?: string; // optional
  serialNumber: string;
  highestRebateLevel?: string | null; // optional
  commissionSettlementTiming?: string; // optional
  remark?: string; // optional
  serverName: string[]; // 仅用于表单选择，不提交
  accountGroup: string[]; // 必填但可为空数组
  traderServers?: Array<{
    serverType?: string;
    serverId?: string;
    serverName?: string;
    mtGroups?: string[];
    rebateGroupTypes?: string[];
  }>;
  traderLanguages?: Array<{
    ruleName: string;
    language: string;
    isDefault: string;
  }>;
};

export const RebateRuleForm = ({
  onSuccess,
  item,
  model,
  serverList,
  levelList,
  languageList,
  dealAccountGroupListRes,
}: {
  onSuccess: () => void;
  item?: RebateTraderDealItem | null;
  model?: number;
  serverList?: ServerListResponse;
  levelList?: RebateLevelRes;
  languageList?: DictTypeResponse;
  dealAccountGroupListRes?: DealAccountGroupListResponse;
}) => {
  const { t } = useTranslation();
  const isEditMode = !!item;
  const { data: detailRes } = useGetRebateTraderDealDetail(item?.id || '', { enabled: isEditMode });
  const { mutateAsync: getMtAndRebateType } = useGetMtAndRebateType();
  const { mutateAsync: addRebateTraderDeal } = useAddRebateTraderDeal();
  const { mutateAsync: editRebateTraderDeal } = useEditRebateTraderDeal();
  const [submitLoading, setSubmitLoading] = useState(false);

  const addTradingRebateRuleSchema = z.object({
    id: z.string().optional(),
    ruleName: z
      .string()
      .min(1, t('rules.required', { field: t('table.ruleName') }))
      .max(64, t('rules.limitLength', { field: 64 })),
    model: z.string(),
    rebateType: z.string(),
    hasUsed: z.string(),
    settleUnit: z.string(),
    settleValue: z.number().optional(),
    settleType: z.string().optional(),
    serialNumber: z.string().min(1, t('rules.required', { field: t('table.sort') })),
    highestRebateLevel: z.string().optional().nullable(),
    commissionSettlementTiming: z.string().optional(),
    remark: z.string().optional(),
    serverName: z.array(z.string()).min(1, t('rules.required', { field: t('table.server') })),
    accountGroup: z.array(z.string()),
    traderServers: z
      .array(
        z.object({
          serverType: z.string().optional(),
          serverId: z.string().optional(),
          serverName: z.string().optional(),
          mtGroups: z.array(z.string()).optional(),
          rebateGroupTypes: z.array(z.string()).optional(),
        }),
      )
      .optional(),
    traderLanguages: z
      .array(
        z.object({
          ruleName: z.string().min(1, t('rules.required', { field: t('table.ruleName') })),
          language: z.string(),
          isDefault: z.string(),
        }),
      )
      .optional(),
  });

  const form = useForm<RebateRuleFormValues>({
    resolver: zodResolver(addTradingRebateRuleSchema),
    defaultValues: {
      ruleName: '',
      model: String(model || ''),
      rebateType: '1',
      hasUsed: '1',
      settleUnit: '1',
      settleValue: 1,
      settleType: '1',
      serialNumber: '',
      highestRebateLevel: '',
      commissionSettlementTiming: '0',
      remark: '',
      serverName: [],
      accountGroup: [],
      traderServers: [],
      traderLanguages: [],
    },
  });

  const [settleUnitOptions, setSettleUnitOptions] = useState<BaseOption[]>([
    { label: t('table.perOrder'), value: '1' },
  ]);

  const {
    step,
    setStep,
    onServerChange,
    syncEditModeServers,
    selectedServerOptions,
    getMtTypesLoading,
    mtAndRebateTypeList,
    selectedLanguageOptions,
    setSelectedLanguageOptions,
    defaultLang,
    selectedLangList,
    handleNextStep,
  } = useRebateRuleFormCore({
    form,
    serverList,
    languageList,
    isEditMode,
    getMtAndRebateType: getMtAndRebateType,
    step1FieldsToValidate: ['ruleName', 'serverName', 'settleUnit', 'settleValue', 'serialNumber'],
  });

  // 编辑模式下初始化表单数据
  useEffect(() => {
    if (detailRes?.data && item) {
      const detailData = detailRes.data;
      const traderServerList = detailData.serverList;
      const data = {
        ...item,
        model: String(item.model || ''),
        rebateType: String(item.rebateType || '1'),
        hasUsed: String(item.hasUsed || '1'),
        serialNumber: String(item.serialNumber || ''),
        settleType: String(item.settleType || '1'),
        commissionSettlementTiming: String(item.commissionSettlementTiming || '0'),
        accountGroup: item.accountGroups?.split(',') || [],
        remark: item.remark || '',
        serverName: item.serverId?.split(',') || [],
        traderServers:
          traderServerList?.map(server => {
            let mtGroups: string[] = [];
            if (!server.mtGroups && server.mtGroup) {
              mtGroups = server.mtGroup.split('|');
            }
            let rebateGroupTypes: string[] = [];
            if (!server.rebateGroupTypes && server.rebateGroupType) {
              rebateGroupTypes = server.rebateGroupType.split(',');
            }
            return {
              serverType: server.serverType,
              serverId: server.serverId,
              serverName: server.serverName,
              mtGroups,
              rebateGroupTypes,
            };
          }) || [],
        traderLanguages:
          detailData.languageList.map(lang => ({
            ...lang,
            isDefault: lang.language === detailData.defaultLanguage.language ? 'Y' : '',
          })) || [],
      };
      if (detailData.languageList?.length > 0) {
        setSelectedLanguageOptions(detailData.languageList.map(lang => lang.language).join(','));
      }
      form.reset(data);
      syncEditModeServers(traderServerList || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailRes?.data, item]);

  const onSubmit = async (data: RebateRuleFormValues) => {
    setSubmitLoading(true);
    // 转换表单数据为 API 需要的格式
    const submitData: AddTradingRebateRuleParams & { id?: string } = {
      ...(isEditMode && data.id ? { id: data.id } : {}),
      ruleName: data.ruleName,
      model: String(model || ''),
      rebateType: data.rebateType.toString(),
      hasUsed: data.hasUsed,
      settleUnit: data.settleUnit,
      settleValue: data.settleValue || 1,
      settleType: data.settleType || '1',
      serialNumber: String(data.serialNumber || ''),
      highestRebateLevel: data.highestRebateLevel || '',
      commissionSettlementTiming: data.commissionSettlementTiming || '0',
      remark: data.remark,
      accountGroups: data.accountGroup,
      traderServers: [],
      traderLanguages: [],
    };

    // 处理 traderServers：确保包含完整的服务器信息（包括用户选择的 mtGroups 和 rebateGroupTypes）
    if (data.traderServers && data.traderServers.length > 0) {
      submitData.traderServers = data.traderServers.map(server => ({
        serverType: server.serverType || '',
        serverId: server.serverId || '',
        serverName: server.serverName || '',
        mtGroups: server.mtGroups || [],
        rebateGroupTypes: server.rebateGroupTypes || [],
      }));
    }

    // 处理 traderLanguages：提交所有语言的信息
    if (languageList && languageList.length > 0) {
      submitData.traderLanguages = languageList.map(lang => {
        // 查找是否有用户输入的值
        const userInput = data.traderLanguages?.find(item => item.language === lang.dictValue);

        return {
          ruleName: userInput?.ruleName || (lang.isDefault === 'Y' ? data.ruleName : ''),
          language: lang.dictValue,
          isDefault: lang.isDefault,
        };
      });
    }
    try {
      const res = isEditMode
        ? await editRebateTraderDeal(submitData)
        : await addRebateTraderDeal(submitData);
      if (res.code === 0) {
        toast.success(
          isEditMode
            ? t('common.modifyFieldSuccess', { field: t('trading.rebateTraderName') })
            : t('common.addFieldSuccess', { field: t('trading.rebateTraderName') }),
        );
        onSuccess();
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.error('Error adding rebate trader deal:', error);
      toast.error(
        isEditMode
          ? t('common.modifyFieldFailed', { field: t('trading.rebateTraderName') })
          : t('common.addFieldFailed', { field: t('trading.rebateTraderName') }),
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const onError = (errors: unknown) => {
    console.error('Form validation errors:', errors);
    toast.error(t('common.pleaseCheckFormErrors'));

    // 跳转到有错误的步骤
    const errorObj = errors as Record<string, unknown>;
    const step1Fields = [
      'ruleName',
      'serverName',
      'settleUnit',
      'settleValue',
      'serialNumber',
      'model',
      'rebateType',
      'settleType',
      'highestRebateLevel',
      'commissionSettlementTiming',
      'remark',
      'accountGroup',
    ];
    const step2Fields = ['traderServers'];
    const step3Fields = ['traderLanguages'];

    if (step1Fields.some(field => errorObj[field])) {
      setStep(1);
    } else if (step2Fields.some(field => errorObj[field])) {
      setStep(2);
    } else if (step3Fields.some(field => errorObj[field])) {
      setStep(3);
    }
  };

  const sirixServerIds = useMemo(() => {
    return (serverList?.rows || []).filter(item => item.serviceType === 3).map(item => item.id);
  }, [serverList?.rows]);
  // 监听服务器选择变化，自动设置结算单位选项
  const onBeforeValueChange = (newValue: string[]) => {
    const allInSirix = newValue.every(item => sirixServerIds?.includes(item));
    const allInOther = newValue.every(item => !sirixServerIds?.includes(item));
    if (allInSirix) {
      setSettleUnitOptions([
        {
          label: t('table.perOrder'),
          value: '1',
        },
        {
          label: t('table.perContract'),
          value: '2',
        },
      ]);
    } else {
      setSettleUnitOptions([
        {
          label: t('table.perOrder'),
          value: '1',
        },
        {
          label: t('table.perLot'),
          value: '0',
        },
      ]);
    }
    form.setValue('settleUnit', '1');
    // sirix服务器和非sirix服务器不能同时选择
    if (!allInSirix && !allInOther) {
      return {
        valid: false,
        message: t('TradingRebateSettings.sirixNotSupportOtherServer'),
      };
    }
    return { valid: true };
  };

  // 编辑模式下初始化结算单位选项
  useEffect(() => {
    if (isEditMode && item && serverList?.rows && sirixServerIds) {
      const serverIds = item.traderServers?.map(s => s.serverId) || [];
      const allInSirix = serverIds.every(id => sirixServerIds.includes(id));

      if (allInSirix) {
        setSettleUnitOptions([
          { label: t('table.perOrder'), value: '1' },
          { label: t('table.perContract'), value: '2' },
        ]);
      } else {
        setSettleUnitOptions([
          { label: t('table.perOrder'), value: '1' },
          { label: t('table.perLot'), value: '0' },
        ]);
      }
    }
  }, [isEditMode, item, serverList?.rows, sirixServerIds, t]);

  // 监听结算单位变化，自动设置结算数值的默认值（仅在新增模式）
  const currentSettleUnit = form.watch('settleUnit');
  useEffect(() => {
    if (isEditMode) return; // 编辑模式下不自动更改

    if (currentSettleUnit === '1') {
      form.setValue('settleValue', 1);
    } else if (currentSettleUnit === '2') {
      form.setValue('settleValue', 100000);
    } else {
      form.setValue('settleValue', 1);
    }
  }, [currentSettleUnit, form, isEditMode]); // 监听结算单位变化，自动设置结算数值

  return (
    <RrhForm form={form} className="max-h-[75vh] overflow-y-auto px-0.75"
          onSubmit={form.handleSubmit(onSubmit, onError)}
        >
          {isEditMode && (
            <FormHiddenInput name="id" value={item?.id || ''} control={form.control} />
          )}
          <FormHiddenInput name="rebateType" value="1" control={form.control} />

          <div className={cn(step === 1 ? 'block' : 'hidden')}>
            <RebateRuleFormStep1
              type="trading"
              isEditMode={isEditMode}
              defaultLang={defaultLang}
              serverList={serverList}
              dealAccountGroupListRes={dealAccountGroupListRes || []}
              settleUnitOptions={settleUnitOptions}
              levelList={levelList}
              model={model as number}
              currentSettleUnit={currentSettleUnit}
              onBeforeValueChange={onBeforeValueChange}
              onServerChange={onServerChange}
            />
          </div>

          <div className={cn(step === 2 ? 'block' : 'hidden')}>
            <RebateRuleFormStep2
              type="trading"
              selectedServerOptions={selectedServerOptions}
              mtAndRebateTypeList={mtAndRebateTypeList}
            />
          </div>

          <div className={cn(step === 3 ? 'block' : 'hidden')}>
            <RebateRuleFormStep3
              languageList={languageList}
              selectedLanguageOptions={selectedLanguageOptions}
              setSelectedLanguageOptions={setSelectedLanguageOptions}
              selectedLangList={selectedLangList}
            />
          </div>

          <RebateRuleFormNavigation
            step={step}
            onPrevious={() => setStep(step - 1)}
            onNext={handleNextStep}
            nextLoading={getMtTypesLoading || submitLoading}
          />
          {(getMtTypesLoading || submitLoading) && (
            <div className="bg-background/60 absolute inset-0">
              <RrhCircleLoading />
            </div>
          )}
        </RrhForm>
  );
};
