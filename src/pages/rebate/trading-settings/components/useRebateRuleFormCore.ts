import { useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { GetMtAndRebateTypeRes, RebateBaseTypeItem, TraderServerInfo } from '@/api/hooks/rebate';
import { DictTypeResponse, ServerListResponse } from '@/api/hooks/system';

type SelectedLangItem = {
  dictLabel: string;
  dictValue: string;
  isDefault: string;
};

type UseRebateRuleFormCoreParams = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  serverList: ServerListResponse | undefined;
  languageList: DictTypeResponse | undefined;
  isEditMode: boolean;
  getMtAndRebateType: (params: { serverId: string }) => Promise<GetMtAndRebateTypeRes>;
  step1FieldsToValidate: readonly string[];
};

export function useRebateRuleFormCore({
  form,
  serverList,
  languageList,
  isEditMode,
  getMtAndRebateType,
  step1FieldsToValidate,
}: UseRebateRuleFormCoreParams) {
  const [step, setStep] = useState(1);
  const [mtAndRebateTypeList, setMtAndRebateTypeList] = useState<
    { groups: string[]; types: RebateBaseTypeItem[] }[]
  >([]);
  const [selectedLanguageOptions, setSelectedLanguageOptions] = useState<string>('');
  const [selectedServerIds, setSelectedServerIds] = useState<string[]>([]);
  const [getMtTypesLoading, setGetMtTypesLoading] = useState(false);
  const [mtDataCache, setMtDataCache] = useState<
    Map<string, { groups: string[]; types: RebateBaseTypeItem[] }>
  >(new Map());

  const onServerChange = (value: string[]) => {
    setSelectedServerIds(value);
  };

  const selectedServerOptions = useMemo(() => {
    return (serverList?.rows || []).filter(item => selectedServerIds.includes(item.id));
  }, [selectedServerIds, serverList?.rows]);

  /**
   * Call this from the component's edit-mode useEffect after form.reset().
   * Sets selectedServerIds and fetches MT data for the pre-selected servers.
   */
  const syncEditModeServers = (traderServerList: TraderServerInfo[]) => {
    const serverIds = traderServerList.map(s => s.serverId);
    setSelectedServerIds(serverIds);

    if (serverIds.length === 0) return;

    const fetchData = async () => {
      try {
        const results = await Promise.all(
          traderServerList.map(server => getMtAndRebateType({ serverId: server.serverId })),
        );

        setMtDataCache(prev => {
          const next = new Map(prev);
          traderServerList.forEach((server, i) => {
            next.set(server.serverId, { groups: results[i].groups, types: results[i].types });
          });
          return next;
        });

        setMtAndRebateTypeList(results.map(r => ({ groups: r.groups, types: r.types })));
      } catch (error) {
        console.error('Failed to fetch MT and rebate type data in edit mode:', error);
      }
    };

    fetchData();
  };

  // Sync selectedServerOptions → traderServers form field structure
  useEffect(() => {
    if (!selectedServerOptions.length) return;

    const currentTraderServers = form.getValues('traderServers') as
      | { serverId?: string; mtGroups?: string[]; rebateGroupTypes?: string[] }[]
      | undefined;

    const currentServerIds =
      currentTraderServers
        ?.map(s => s.serverId)
        .sort()
        .join(',') ?? '';
    const newServerIds = selectedServerOptions
      .map(s => s.id)
      .sort()
      .join(',');

    if (currentServerIds === newServerIds) return;

    const initialServers = selectedServerOptions.map(server => {
      const existing = currentTraderServers?.find(s => s.serverId === server.id);
      return {
        serverType: server.serviceType?.toString() ?? '',
        serverId: server.id,
        serverName: server.serverName,
        mtGroups: existing?.mtGroups ?? [],
        rebateGroupTypes: existing?.rebateGroupTypes ?? [],
      };
    });

    form.setValue('traderServers', initialServers, { shouldValidate: false });
  }, [selectedServerOptions, form, isEditMode]);

  const defaultLang = useMemo(
    () => languageList?.find(item => item.isDefault === 'Y')?.dictLabel ?? '',
    [languageList],
  );

  const selectedLangList = useMemo((): SelectedLangItem[] => {
    if (!languageList) return [];
    const defaultLanguage = languageList.find(item => item.isDefault === 'Y');
    if (!defaultLanguage) return [];

    const result: SelectedLangItem[] = [
      {
        dictLabel: defaultLanguage.dictLabel,
        dictValue: defaultLanguage.dictValue,
        isDefault: 'Y',
      },
    ];

    selectedLanguageOptions
      .split(',')
      .filter(Boolean)
      .forEach(value => {
        const lang = languageList.find(item => item.dictValue === value && item.isDefault === 'N');
        if (lang) {
          result.push({ dictLabel: lang.dictLabel, dictValue: lang.dictValue, isDefault: 'N' });
        }
      });

    return result;
  }, [languageList, selectedLanguageOptions]);

  const ruleName = form.watch('ruleName') as string;

  // Sync selectedLangList → traderLanguages array (rebuild when lang selection changes)
  useEffect(() => {
    if (!selectedLangList.length) return;
    const currentValues = (form.getValues('traderLanguages') as { ruleName?: string }[]) ?? [];
    const currentRuleName = form.getValues('ruleName') as string;

    const newTraderLanguages = selectedLangList.map((lang, index) => ({
      ruleName: currentValues[index]?.ruleName ?? (index === 0 ? currentRuleName : ''),
      language: lang.dictValue,
      isDefault: lang.isDefault,
    }));

    form.setValue('traderLanguages', newTraderLanguages, { shouldValidate: false });
  }, [selectedLangList, form]);

  // Keep traderLanguages[0].ruleName in sync with the form's ruleName field
  useEffect(() => {
    const langs = form.getValues('traderLanguages') as unknown[];
    if (langs?.length) {
      form.setValue('traderLanguages.0.ruleName', ruleName, { shouldValidate: false });
    }
  }, [ruleName, selectedLangList, form]);

  const suitTypeValue = form.watch('suitType');
  const handleNextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await form.trigger(step1FieldsToValidate as string[]);

      if (isValid && selectedServerOptions.length > 0) {
        const uncachedServers = selectedServerOptions.filter(s => !mtDataCache.has(s.id));

        if (uncachedServers.length > 0) {
          setGetMtTypesLoading(true);
          try {
            const results = await Promise.all(
              uncachedServers.map(s => getMtAndRebateType({ serverId: s.id })),
            );

            const newCache = new Map(mtDataCache);
            uncachedServers.forEach((server, i) => {
              newCache.set(server.id, { groups: results[i].groups, types: results[i].types });
            });
            setMtDataCache(newCache);

            setMtAndRebateTypeList(
              selectedServerOptions.map(s => newCache.get(s.id) ?? { groups: [], types: [] }),
            );
          } catch (error) {
            console.error('Failed to fetch MT and rebate type data:', error);
          } finally {
            setGetMtTypesLoading(false);
          }
        } else {
          setMtAndRebateTypeList(
            selectedServerOptions.map(s => mtDataCache.get(s.id) ?? { groups: [], types: [] }),
          );
        }
      }
    } else if (step === 2) {
      isValid = true;
    }

    if (isValid) {
      if (step === 1 && suitTypeValue === '1') {
        setStep(3);
      } else {
        setStep(step + 1);
      }
    }
  };
  const handlePrevStep = () => {
    if (step === 3 && suitTypeValue === '1') {
      setStep(1);
    } else {
      setStep(step - 1);
    }
  };

  return {
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
    handlePrevStep,
  };
}
