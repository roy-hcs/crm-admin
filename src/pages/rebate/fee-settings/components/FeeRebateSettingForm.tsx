import { FormHiddenInput } from '@/components/form/FormHiddenInput';


import { RebateRuleFormStep1 } from '../../trading-settings/components/RebateRuleFormStep1';
import { RebateRuleFormStep2 } from '../../trading-settings/components/RebateRuleFormStep2';
import { RebateRuleFormStep3 } from '../../trading-settings/components/RebateRuleFormStep3';
import { cn } from '@/lib/utils';
import { RebateRuleFormNavigation } from '../../trading-settings/components/RebateRuleFormNavigation';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { useRebateRuleFormCore } from '../../trading-settings/components/useRebateRuleFormCore';
import {
  AddRebateFeeSettingParams,
  RebateLevelRes,
  RebateTraderDealItem,
  useAddRebateFeeSetting,
  useEditRebateFeeSetting,
  useGetMtAndRebateType,
  useGetRebateFeeSettingDetail,
} from '@/api/hooks/rebate';
import { DictTypeResponse, ServerListResponse } from '@/api/hooks/system';
import { DealAccountGroupListResponse } from '@/api/hooks/account/types';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { RrhForm } from '@/components/form/RrhForm';

type RebateRuleFormValues = {
  id?: string;
  ruleName: string;
  model: string;
  rebateType: string;
  hasUsed: string;
  settleUnit: string;
  serialNumber: string;
  highestRebateLevel?: string | null;
  commissionSettlementTiming?: string;
  remark?: string;
  serverName: string[];
  accountGroup: string[];
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

export const FeeRebateSettingForm = ({
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

  const { data: detailRes } = useGetRebateFeeSettingDetail(item?.id || '', { enabled: isEditMode });
  const { mutateAsync: getMtAndRebateType } = useGetMtAndRebateType();
  const { mutateAsync: addRebateFeeSetting } = useAddRebateFeeSetting();
  const { mutateAsync: editRebateFeeSetting } = useEditRebateFeeSetting();
  const [submitLoading, setSubmitLoading] = useState(false);

  const addFeeRebateRuleSchema = z.object({
    id: z.string().optional(),
    ruleName: z
      .string()
      .min(1, t('rules.required', { field: t('table.ruleName') }))
      .max(64, t('rules.limitLength', { field: 64 })),
    model: z.string(),
    rebateType: z.string(),
    hasUsed: z.string(),
    settleUnit: z.string(),
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
    resolver: zodResolver(addFeeRebateRuleSchema),
    defaultValues: {
      ruleName: '',
      model: String(model || ''),
      rebateType: '2',
      hasUsed: '1',
      settleUnit: '-1',
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
    getMtAndRebateType,
    step1FieldsToValidate: ['ruleName', 'serverName', 'settleUnit', 'serialNumber'],
  });

  // 编辑模式下初始化表单数据
  useEffect(() => {
    if (detailRes?.data && item) {
      const detailData = detailRes.data;
      const traderServerList = detailData.serverList;
      const data = {
        ...item,
        model: String(item.model || ''),
        rebateType: String(item.rebateType || '2'),
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
    const submitData: AddRebateFeeSettingParams & { id?: string } = {
      ...(isEditMode && data.id ? { id: data.id } : {}),
      ruleName: data.ruleName,
      model: String(model || ''),
      rebateType: data.rebateType.toString(),
      hasUsed: data.hasUsed,
      settleUnit: data.settleUnit,
      serialNumber: String(data.serialNumber || ''),
      highestRebateLevel: data.highestRebateLevel || '',
      commissionSettlementTiming: data.commissionSettlementTiming || '0',
      remark: data.remark,
      accountGroups: data.accountGroup,
      traderServers: [],
      traderLanguages: [],
    };

    if (data.traderServers && data.traderServers.length > 0) {
      submitData.traderServers = data.traderServers.map(server => ({
        serverType: server.serverType || '',
        serverId: server.serverId || '',
        serverName: server.serverName || '',
        mtGroups: server.mtGroups || [],
        rebateGroupTypes: server.rebateGroupTypes || [],
      }));
    }

    if (languageList && languageList.length > 0) {
      submitData.traderLanguages = languageList.map(lang => {
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
        ? await editRebateFeeSetting(submitData)
        : await addRebateFeeSetting(submitData);
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
      console.error('Error adding rebate fee setting:', error);
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

    const errorObj = errors as Record<string, unknown>;
    const step1Fields = [
      'ruleName',
      'serverName',
      'settleUnit',
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

  return (
    <RrhForm form={form} className="max-h-[75vh] overflow-y-auto px-0.75"
          onSubmit={form.handleSubmit(onSubmit, onError)}
        >
          {isEditMode && (
            <FormHiddenInput name="id" value={item?.id || ''} control={form.control} />
          )}
          <FormHiddenInput name="rebateType" value="2" control={form.control} />

          <div className={cn(step === 1 ? 'block' : 'hidden')}>
            <RebateRuleFormStep1
              type="fee"
              isEditMode={isEditMode}
              defaultLang={defaultLang}
              serverList={serverList}
              dealAccountGroupListRes={dealAccountGroupListRes || []}
              levelList={levelList}
              model={model as number}
              onServerChange={onServerChange}
            />
          </div>

          <div className={cn(step === 2 ? 'block' : 'hidden')}>
            <RebateRuleFormStep2
              type="fee"
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
