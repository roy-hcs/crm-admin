import {
  RebateBaseTypeItem,
  useAddRebateBaseType,
  useEditRebateBaseType,
  useSelectServerList,
} from '@/api/hooks/rebate';
import { RrhButton } from '@/components/common/RrhButton';
import { BaseOption } from '@/components/common/RrhSelect';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { FormField } from '@/components/ui/form';

import { serverMap } from '@/lib/constant';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SelectMtTypeGroup } from '../../../../components/common/SelectMtTypeGroup';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DictTypeItem } from '@/api/hooks/system/types';
import { useEffect, useMemo, useRef } from 'react';
import { RrhForm } from '@/components/form/RrhForm';

export const TypeGroupForm = ({
  serverTypes,
  onSuccess,
  onCancel,
  productGroupItem,
}: {
  serverTypes: DictTypeItem[];
  onSuccess: () => void;
  onCancel: () => void;
  productGroupItem?: RebateBaseTypeItem | null;
}) => {
  const { t } = useTranslation();
  const addTypeGroupSchema = z.object({
    typeGroupName: z
      .string()
      .min(1, t('rules.required', { field: t('table.typeGroup') }))
      .max(16, t('rules.limitLength', { field: 16 })),
    id: z.optional(z.string()),
    serverType: z.string().min(1, t('rules.required', { field: t('table.transactionPlatform') })),
    serverId: z.string().min(1, t('rules.required', { field: t('table.server') })),
    typeName: z.optional(z.string()),
  });

  const form = useForm({
    resolver: zodResolver(addTypeGroupSchema),
    defaultValues: {
      typeGroupName: '',
      id: '',
      serverType: '',
      serverId: '',
      typeName: '',
    },
  });

  const initializedRef = useRef<string | null>(null);
  const serverTypeRef = useRef<string>('');

  // 使用 productGroupItem 的 serverType 或 form 的值
  // 一旦设置了 serverType，就固定使用它，避免后续变化
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

  const { mutateAsync: addRebateBaseType, isPending: isAddPending } = useAddRebateBaseType();
  const { mutateAsync: editRebateBaseType, isPending: isEditPending } = useEditRebateBaseType();
  const isPending = useMemo(() => isAddPending || isEditPending, [isAddPending, isEditPending]);
  const onSubmit = async (data: { [key: string]: string }) => {
    const addParams = {
      typeGroupName: data.typeGroupName,
      serverId: data.serverId,
      typeName: data.typeName,
      serverType: data.serverType,
    };
    try {
      const res = productGroupItem
        ? await editRebateBaseType({
            id: productGroupItem.id,
            ...addParams,
          })
        : await addRebateBaseType(addParams);
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
        form.setValue('typeGroupName', productGroupItem.typeGroupName);
        form.setValue('id', productGroupItem.id);
        form.setValue('serverType', productGroupItem.serverType);
        form.setValue('serverId', productGroupItem.serverId);
        form.setValue('typeName', productGroupItem.typeName || '');

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
        name="typeGroupName"
        label={t('table.typeGroup')}
        placeholder={t('rules.limitLength', { field: 16 })}
      />
      <FormSelect
        key={`serverType-${initializedRef.current || 'new'}`}
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
      <FormField
        name="typeName"
        render={({ field }) => {
          return (
            <SelectMtTypeGroup
              defaultValue={productGroupItem?.typeName || ''}
              verticalLabel
              field={field}
              serverId={form.watch('serverId')}
            />
          );
        }}
      />
      <div className="border-border -mx-6 flex justify-end gap-4 border-t px-6 pt-6">
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
