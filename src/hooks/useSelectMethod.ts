import { DictTypeResponse } from '@/api/hooks/system/types';
import { BaseOption } from '@/components/common/RrhSelect';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FieldPath, FieldValues, PathValue, UseFormReturn, useWatch } from 'react-hook-form';

export type SelectMethodOption = BaseOption;

type UseSelectMethodOptions<T extends FieldValues> = {
  form: UseFormReturn<T>;
  operationTypeName: FieldPath<T>;
  methodName: FieldPath<T>;
  operationTypeToDictTypeMap?: Record<string, string>;
  fetchOptions: (dictType: string) => Promise<DictTypeResponse>;
  enabled?: boolean;
  clearMethodOnTypeChange?: boolean;
};

const defaultOperationTypeToDictTypeMap: Record<string, string> = {
  '1': 'crm_wallet_in_method',
  '2': 'crm_wallet_out_method',
  '3': 'crm_wallet_trans_method',
  '4': 'crm_wallet_remaid_method',
};

export const useSelectMethod = <T extends FieldValues>({
  form,
  operationTypeName,
  methodName,
  operationTypeToDictTypeMap = defaultOperationTypeToDictTypeMap,
  fetchOptions,
  enabled = true,
  clearMethodOnTypeChange = true,
}: UseSelectMethodOptions<T>) => {
  const [options, setOptions] = useState<SelectMethodOption[]>([]);
  const [loading, setLoading] = useState(false);
  const requestIdRef = useRef(0);
  const previousOperationTypeRef = useRef('');

  const operationTypeValue = useWatch({
    control: form.control,
    name: operationTypeName,
  });

  const operationType = operationTypeValue == null ? '' : String(operationTypeValue);

  const dictType = useMemo(() => {
    if (!operationType) return '';
    return operationTypeToDictTypeMap[operationType] || operationType;
  }, [operationType, operationTypeToDictTypeMap]);

  useEffect(() => {
    if (!clearMethodOnTypeChange) return;

    if (previousOperationTypeRef.current === '') {
      previousOperationTypeRef.current = operationType;
      return;
    }

    if (previousOperationTypeRef.current !== operationType) {
      previousOperationTypeRef.current = operationType;
      form.setValue(methodName, '' as PathValue<T, typeof methodName>);
    }
  }, [clearMethodOnTypeChange, form, methodName, operationType]);

  const runFetch = useCallback(async () => {
    if (!enabled || !dictType) {
      setOptions([]);
      setLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setLoading(true);

    try {
      const nextOptions = await fetchOptions(dictType);

      if (requestId !== requestIdRef.current) return;

      setOptions(
        nextOptions.map(option => ({
          label: option.dictLabel,
          value: option.dictValue,
        })),
      );

      const currentMethodValue = form.getValues(methodName);
      if (
        currentMethodValue &&
        !nextOptions.some(option => String(option.dictValue) === String(currentMethodValue))
      ) {
        form.setValue(methodName, '' as PathValue<T, typeof methodName>);
      }
    } catch {
      if (requestId !== requestIdRef.current) return;
      setOptions([]);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [dictType, enabled, fetchOptions, form, methodName]);

  useEffect(() => {
    runFetch();
  }, [runFetch]);

  return {
    options,
    loading,
    operationType,
    dictType,
    refetch: runFetch,
  } as const;
};
