import { Form } from '@/components/ui/form';
import { FormProvider } from '@/contexts/form';
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
  RebateBaseTypeItem,
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
          detailData.languageList.map(item => {
            return {
              ...item,
              isDefault: item.language === detailData.defaultLanguage.language ? 'Y' : '',
            };
          }) || [],
      };
      if (detailData.languageList && detailData.languageList.length > 0) {
        setSelectedLanguageOptions(detailData.languageList.map(lang => lang.language).join(','));
      }
      form.reset(data);

      // Update selectedServerIds for edit mode
      const serverIds = traderServerList?.map(s => s.serverId) || [];
      setSelectedServerIds(serverIds);

      // Fetch MT groups and rebate types for edit mode to populate step 2 options
      if (serverIds.length > 0 && traderServerList && traderServerList.length > 0) {
        const fetchEditModeData = async () => {
          try {
            const fetchPromises = traderServerList.map(server =>
              getMtAndRebateType({ serverId: server.serverId }),
            );
            const results = await Promise.all(fetchPromises);

            // Update cache with fetched data
            setMtDataCache(prevCache => {
              const newCache = new Map(prevCache);
              traderServerList.forEach((server, index) => {
                newCache.set(server.serverId, {
                  groups: results[index].groups,
                  types: results[index].types,
                });
              });
              return newCache;
            });

            // Set mtAndRebateTypeList for step 2
            setMtAndRebateTypeList(
              results.map(result => ({
                groups: result.groups,
                types: result.types,
              })),
            );
          } catch (error) {
            console.error('Failed to fetch MT and rebate type data in edit mode:', error);
          }
        };

        fetchEditModeData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailRes?.data, item]);

  const [step, setStep] = useState(1);
  const [settleUnitOptions, setSettleUnitOptions] = useState<BaseOption[]>([
    {
      label: t('table.perOrder'),
      value: '1',
    },
  ]);
  const [mtAndRebateTypeList, setMtAndRebateTypeList] = useState<
    { groups: string[]; types: RebateBaseTypeItem[] }[]
  >([]);
  const [selectedLanguageOptions, setSelectedLanguageOptions] = useState<string>('');
  const [selectedServerIds, setSelectedServerIds] = useState<string[]>([]);
  const [getMtTypesLoading, setGetMtTypesLoading] = useState(false);
  // 缓存已请求的服务器数据，避免重复请求
  const [mtDataCache, setMtDataCache] = useState<
    Map<string, { groups: string[]; types: RebateBaseTypeItem[] }>
  >(new Map());

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
      settleValue: String(data.settleValue || 1),
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

  // 处理下一步按钮点击，验证当前步骤的字段
  const handleNextStep = async () => {
    let isValid = false;

    if (step === 1) {
      // Step 1 需要验证的字段
      const step1Fields = [
        'ruleName',
        'serverName',
        'settleUnit',
        'settleValue',
        'serialNumber',
      ] as const;
      isValid = await form.trigger(step1Fields);

      // 验证通过后，在进入 step 2 前获取 MT 组和返佣类型数据
      if (isValid && selectedServerOptions.length > 0) {
        // 找出未缓存的服务器
        const uncachedServers = selectedServerOptions.filter(server => !mtDataCache.has(server.id));

        if (uncachedServers.length > 0) {
          setGetMtTypesLoading(true);
          try {
            // 只请求未缓存的服务器数据
            const fetchPromises = uncachedServers.map(item =>
              getMtAndRebateType({ serverId: item.id }),
            );
            const results = await Promise.all(fetchPromises);

            // 更新缓存
            const newCache = new Map(mtDataCache);
            uncachedServers.forEach((server, index) => {
              newCache.set(server.id, {
                groups: results[index].groups,
                types: results[index].types,
              });
            });
            setMtDataCache(newCache);

            // 使用缓存数据构建完整列表
            const fullList = selectedServerOptions.map(
              server => newCache.get(server.id) || { groups: [], types: [] },
            );
            setMtAndRebateTypeList(fullList);
          } catch (error) {
            console.error('Failed to fetch MT and rebate type data:', error);
          } finally {
            setGetMtTypesLoading(false);
          }
        } else {
          // 全部命中缓存，直接使用缓存数据
          const fullList = selectedServerOptions.map(
            server => mtDataCache.get(server.id) || { groups: [], types: [] },
          );
          setMtAndRebateTypeList(fullList);
        }
      }
    } else if (step === 2) {
      // Step 2 验证 traderServers（可选的，所以直接通过）
      isValid = true;
    }

    if (isValid) {
      setStep(step + 1);
    }
  };

  const onServerChange = (value: string[]) => {
    setSelectedServerIds(value);
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

  // 用于第二步中渲染选中的服务器数据
  const selectedServerOptions = useMemo(() => {
    return (serverList?.rows || []).filter(item => selectedServerIds.includes(item.id));
  }, [selectedServerIds, serverList?.rows]);

  // 监听服务器选择变化，仅初始化 traderServers 数组结构（不请求数据）
  useEffect(() => {
    if (selectedServerOptions.length) {
      const currentTraderServers = form.getValues('traderServers');

      // 检查服务器列表是否真的发生了变化
      const currentServerIds =
        currentTraderServers
          ?.map(s => s.serverId)
          .sort()
          .join(',') || '';
      const newServerIds = selectedServerOptions
        .map(s => s.id)
        .sort()
        .join(',');

      // 只有当服务器列表真正改变时才重新初始化数组结构
      if (currentServerIds !== newServerIds) {
        // 保留已有的选择数据
        const initialServers: RebateRuleFormValues['traderServers'] = selectedServerOptions.map(
          server => {
            const existingServer = currentTraderServers?.find(s => s.serverId === server.id);
            return {
              serverType: server.serviceType?.toString() || '',
              serverId: server.id,
              serverName: server.serverName,
              // 保留已有的选择数据
              mtGroups: existingServer?.mtGroups || [],
              rebateGroupTypes: existingServer?.rebateGroupTypes || [],
            };
          },
        );
        form.setValue('traderServers', initialServers, { shouldValidate: false });
      }
    }
  }, [selectedServerOptions, form, isEditMode]);

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

  const defaultLang = useMemo(
    () => languageList?.find(item => item.isDefault === 'Y')?.dictLabel || '',
    [languageList],
  );

  // 根据选中的语言选项生成完整的语言列表（包含默认语言 + 选中的其他语言）
  const selectedLangList = useMemo(() => {
    if (!languageList) return [];

    const defaultLanguage = languageList.find(item => item.isDefault === 'Y');
    if (!defaultLanguage) return [];

    // 默认语言始终在第一位
    const result = [
      {
        dictLabel: defaultLanguage.dictLabel,
        dictValue: defaultLanguage.dictValue,
        isDefault: 'Y',
      },
    ];

    // 添加用户选中的其他语言
    const selectedValues = selectedLanguageOptions.split(',').filter(Boolean);
    selectedValues.forEach(value => {
      const lang = languageList.find(item => item.dictValue === value && item.isDefault === 'N');
      if (lang) {
        result.push({
          dictLabel: lang.dictLabel,
          dictValue: lang.dictValue,
          isDefault: 'N',
        });
      }
    });
    return result;
  }, [languageList, selectedLanguageOptions]);

  // 同步 traderLanguages 数组结构
  const ruleName = form.watch('ruleName');

  // 当 selectedLangList 变化时，初始化/重建整个 traderLanguages 数组
  useEffect(() => {
    if (selectedLangList.length > 0) {
      const currentValues = form.getValues('traderLanguages') || [];
      const currentRuleName = form.getValues('ruleName');

      // 构建完整的 traderLanguages 数组，保留用户已输入的值
      const newTraderLanguages: RebateRuleFormValues['traderLanguages'] = selectedLangList.map(
        (lang, index) => {
          const existingValue = currentValues[index];
          return {
            ruleName: existingValue?.ruleName || (index === 0 ? currentRuleName : ''),
            language: lang.dictValue,
            isDefault: lang.isDefault,
          };
        },
      );
      form.setValue('traderLanguages', newTraderLanguages, { shouldValidate: false });
    }
  }, [selectedLangList, form]);

  // 单独同步默认语言的 ruleName（仅在有额外语言时）
  useEffect(() => {
    const currentTraderLanguages = form.getValues('traderLanguages') || [];
    if (currentTraderLanguages.length > 0) {
      form.setValue('traderLanguages.0.ruleName', ruleName, { shouldValidate: false });
    }
  }, [ruleName, selectedLangList, form]);

  return (
    <FormProvider form={form}>
      <Form {...form}>
        <form
          className="max-h-[75vh] overflow-y-auto px-0.75"
          onSubmit={form.handleSubmit(onSubmit, onError)}
        >
          {isEditMode && (
            <FormHiddenInput name="id" value={item?.id || ''} control={form.control} />
          )}
          <FormHiddenInput name="rebateType" value="1" control={form.control} />

          <div className={cn(step === 1 ? 'block' : 'hidden')}>
            <RebateRuleFormStep1
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
        </form>
      </Form>
    </FormProvider>
  );
};
