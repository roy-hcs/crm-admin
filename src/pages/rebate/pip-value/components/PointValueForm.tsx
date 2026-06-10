import {
  RebateBasePointItem,
  useAddRebateBasePoint,
  useEditRebateBasePoint,
  useSelectServerList,
} from '@/api/hooks/rebate';
import { DictTypeItem, useCurrencyList } from '@/api/hooks/system';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { BaseOption } from '@/components/common/RrhSelect';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { FormField } from '@/components/ui/form';

import { serverMap } from '@/lib/constant';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useRef } from 'react';
import { SelectMtTypeGroup } from '../../../../components/common/SelectMtTypeGroup';
import { RrhForm } from '@/components/form/RrhForm';

export const PointValueForm = ({
  serverTypes,
  onSuccess,
  onCancel,
  productGroupItem,
}: {
  serverTypes: DictTypeItem[];
  onSuccess: () => void;
  onCancel: () => void;
  productGroupItem?: RebateBasePointItem | null;
}) => {
  const { t } = useTranslation();
  const addTypeGroupSchema = z
    .object({
      pointValueName: z
        .string()
        .min(1, t('rules.required', { field: t('table.pointValueName') }))
        .max(16, t('rules.limitLength', { field: 16 })),
      id: z.optional(z.string()),
      serverType: z.string().min(1, t('rules.required', { field: t('table.transactionPlatform') })),
      serverId: z.string().min(1, t('rules.required', { field: t('table.server') })),
      typeName: z.string().min(1, t('rules.required', { field: t('table.typeGroup') })),
      pointValueType: z.string().min(1, t('rules.required', { field: t('table.pointValueType') })),
      rebateType: z.string().optional(),
      pointValue: z.string().optional(),
      pointValueLots: z.string().optional(),
      pointValueRules: z.optional(z.string()),
      pointValueCurrency: z.string().optional(),
      serialNumber: z.string().min(1, t('rules.required', { field: t('table.sort') })),
    })
    .superRefine((data, ctx) => {
      if (data.pointValueType === '1') {
        if (!data.pointValue || data.pointValue.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('rules.required', { field: t('table.pointValue') }),
            path: ['pointValue'],
          });
        } else {
          const numValue = parseFloat(data.pointValue);
          if (isNaN(numValue) || numValue <= 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t('rules.greaterThanZero', { field: t('table.pointValue') }),
              path: ['pointValue'],
            });
          }
        }
      } else if (data.pointValueType === '2') {
        // 当 pointValueType 是 '2' 时，pointValueLots、rebateType、pointValueCurrency 必填
        if (!data.pointValueLots || data.pointValueLots.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('rules.required', { field: t('table.pointValue') }),
            path: ['pointValueLots'],
          });
        }
        if (!data.typeName || data.typeName.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('rules.required', { field: t('table.typeGroup') }),
            path: ['typeName'],
          });
        }
        if (!data.pointValueCurrency || data.pointValueCurrency.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('rules.required', {
              field: t('table.pointValueCurrency'),
            }),
            path: ['pointValueCurrency'],
          });
        }
      }
    });

  const form = useForm({
    resolver: zodResolver(addTypeGroupSchema),
    defaultValues: {
      pointValueName: '',
      id: '',
      serverType: '',
      serverId: '',
      typeName: '',
      pointValueType: productGroupItem?.pointValueType?.toString() || '1',
      pointValue: productGroupItem?.pointValue || '',
      pointValueLots: productGroupItem?.pointValueLots || '',
      pointValueRules: productGroupItem?.pointValueRules?.toString() || '1',
      pointValueCurrency: productGroupItem?.pointValueCurrency || '',
      serialNumber: productGroupItem?.serialNumber?.toString() || '',
    },
  });

  const initializedRef = useRef<string | null>(null);
  const serverTypeRef = useRef<string>('');

  const currentServerType = productGroupItem?.serverType || form.watch('serverType');
  if (currentServerType && !serverTypeRef.current) {
    serverTypeRef.current = currentServerType;
  }
  const serverTypeForQuery = serverTypeRef.current || currentServerType;

  const { data: serverList } = useSelectServerList(
    {
      serverProperty: 1,
      serverType: serverTypeForQuery,
    },
    { enabled: !!serverTypeForQuery },
  );

  const { mutateAsync: addRebateBasePoint, isPending: isAddPointPending } = useAddRebateBasePoint();
  const { mutateAsync: editRebateBasePoint, isPending: isEditPointPending } =
    useEditRebateBasePoint();
  const isPending = useMemo(
    () => isAddPointPending || isEditPointPending,
    [isAddPointPending, isEditPointPending],
  );
  const { data: currencyList } = useCurrencyList();
  const onSubmit = async (data: { [key: string]: string }) => {
    const addParams = {
      pointValueName: data.pointValueName,
      serverId: data.serverId,
      serverType: data.serverType,
      pointValueType: data.pointValueType,
      rebateType: data.typeName,
      pointValue: data.pointValue,
      pointValueLots: data.pointValueLots,
      pointValueRules: data.pointValueRules,
      pointValueCurrency: data.pointValueCurrency,
      serialNumber: data.serialNumber,
    };
    try {
      const res = productGroupItem
        ? await editRebateBasePoint({
            id: productGroupItem.id,
            ...addParams,
          })
        : await addRebateBasePoint(addParams);
      if (res.code === 0) {
        onSuccess();
      }
    } catch (error) {
      console.error(error);
    } finally {
      onCancel();
    }
  };
  // 当 serverList 加载完成后，设置完整的表单数据
  useEffect(() => {
    if (
      productGroupItem &&
      serverList &&
      serverList.length > 0 &&
      initializedRef.current !== productGroupItem.id
    ) {
      const serverExists = serverList.some(server => server.id === productGroupItem.serverId);

      if (serverExists) {
        // 先设置不依赖 serverList 的字段
        form.setValue('pointValueName', productGroupItem.pointValueName);
        form.setValue('id', productGroupItem.id);
        form.setValue('serverType', productGroupItem.serverType);
        form.setValue('serverId', productGroupItem.serverId);
        form.setValue('typeName', productGroupItem.rebateType || '');
        form.setValue('rebateType', productGroupItem.rebateType || '');
        form.setValue('pointValueType', productGroupItem.pointValueType?.toString() || '1');
        form.setValue('pointValue', productGroupItem.pointValue || '');
        form.setValue('pointValueLots', productGroupItem.pointValueLots || '');
        form.setValue('pointValueRules', productGroupItem.pointValueRules?.toString() || '1');
        form.setValue('pointValueCurrency', productGroupItem.pointValueCurrency || '');
        form.setValue('serialNumber', String(productGroupItem.serialNumber));

        // 标记已初始化
        initializedRef.current = productGroupItem.id;
      } else {
        console.warn('Server not found in serverList:', productGroupItem.serverId);
      }
    }
  }, [form, productGroupItem, serverList]);

  // 使用 useMemo 稳定 options，避免不必要的重新渲染
  const serverTypeOptions = useMemo(() => {
    return serverTypes.map(item => ({
      label: item.dictLabel,
      value: item.dictValue,
    }));
  }, [serverTypes]);

  const serverOptions = useMemo(() => {
    if (!serverList) return [];
    return serverList.map(item => ({
      label: item.serverName,
      value: item.id,
      serviceProperty: item.serviceProperty,
      serviceType: item.serviceType,
    }));
  }, [serverList]);

  return (
    <RrhForm form={form} className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
      <FormInput
        name="pointValueName"
        label={t('table.pointValueName')}
        placeholder={t('rules.limitLength', { field: 16 })}
      />
      <FormSelect
        key={`serverType-${initializedRef.current || 'new'}`}
        verticalLabel
        name="serverType"
        label={t('table.transactionPlatform')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={serverTypeOptions}
      />
      <FormSelect<
        Record<string, string>,
        BaseOption & {
          serviceProperty: number;
          serviceType: number;
        }
      >
        key={`server-${initializedRef.current || 'new'}`}
        verticalLabel
        name="serverId"
        label={t('table.server')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={serverOptions}
        renderItem={option => {
          return (
            <div>
              {/* TODO: 优化样式 */}
              <span>{option.serviceProperty === 1 ? t('common.live') : t('common.demo')}</span>
              {option.serviceType && <span> {serverMap[option.serviceType]} | </span>}
              <span>{option.label}</span>
            </div>
          );
        }}
      />
      <FormSelect
        verticalLabel
        name="pointValueType"
        label={t('table.pointValueType')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={[
          { value: '1', label: t('table.fixedPipValue') },
          { value: '2', label: t('table.floatingPipValue') },
        ]}
      />
      <FormField
        name="typeName"
        render={({ field }) => {
          return (
            <SelectMtTypeGroup
              defaultValue={productGroupItem?.rebateType || ''}
              verticalLabel
              field={field}
              serverId={form.watch('serverId')}
            />
          );
        }}
      />
      {form.watch('pointValueType') === '1' ? (
        <FormInput
          name="pointValue"
          label={t('table.pointValue')}
          placeholder={t('pipValueSettings.pointValuePlaceholder')}
        />
      ) : (
        <>
          <div>
            <div>{t('table.pointValueCalculationFormula')}</div>
            <div className="flex items-center gap-1">
              <FormInput
                className="flex-1"
                name="pointValueLots"
                label=""
                placeholder={t('pipValueSettings.pointValuePlaceholder')}
              />
              <span>*</span>
              <FormSelect
                verticalLabel
                className="mt-2"
                name="pointValueRules"
                label=""
                placeholder={t('common.pleaseSelect')}
                showRowValue={false}
                options={[
                  { value: '1', label: t('common.contractNumber') },
                  { value: '2', label: t('common.contractSize') },
                ]}
              />
            </div>
          </div>
          <FormSelect
            verticalLabel
            name="pointValueCurrency"
            label={t('table.pointValueCurrency')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={(currencyList?.rows || []).map(currency => ({
              label: currency.currencyAbbr,
              value: currency.currencyAbbr,
            }))}
          />
        </>
      )}

      <FormInput
        name="serialNumber"
        label={t('table.sort')}
        placeholder={t('common.sortPlaceholder')}
      />
      <div className="border-border -mx-6 flex justify-end gap-4 border-t px-6 pt-3 pb-3 md:pt-6 md:pb-0">
        <RrhButton type="button" variant="outline" disabled={isPending} onClick={onCancel}>
          {t('common.Cancel')}
        </RrhButton>
        <RrhButton loading={isPending} type="submit">
          {t('common.Confirm')}
        </RrhButton>
      </div>
    </RrhForm>
  );
};
