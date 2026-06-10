import {
  RebateSettingsTemplate,
  useAddRebateSettingsTemplate,
  useEditRebateSettingsTemplate,
  useGetRebateLevelList,
  useGetUniqueTemplateName,
} from '@/api/hooks/rebate';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { FormHiddenInput } from '@/components/form/FormHiddenInput';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RrhForm } from '@/components/form/RrhForm';

type RebateTemplateFormValues = {
  rebateType: number;
  templateName: string;
  rebateLevel: string;
  rebateTraderCommissionRule?: string;
};
export const RebateSettingsTemplateForm = ({
  type,
  onCancel,
  onSuccess,
  currentTemplate,
}: {
  type: number;
  onCancel: () => void;
  onSuccess: () => void;
  currentTemplate?: RebateSettingsTemplate;
}) => {
  const { t } = useTranslation();
  const [templateName, setTemplateName] = useState('');
  // rebate template display only when model is 1, so rebate level list only need to fetch when type is 1
  const { data: rebateLevelList } = useGetRebateLevelList(1);
  const levelId = useMemo(() => {
    if (!currentTemplate) return '';
    return rebateLevelList?.find(item => item.levelName === currentTemplate.rebateLevel)?.id;
  }, [currentTemplate, rebateLevelList]);
  const isEditMode = !!currentTemplate;
  const form = useForm<RebateTemplateFormValues>({
    defaultValues: {
      rebateType: type,
      templateName,
      rebateLevel: levelId,
      rebateTraderCommissionRule: '',
    },
  });
  useEffect(() => {
    if (currentTemplate) {
      form.reset({
        rebateType: type,
        templateName: currentTemplate.templateName,
        rebateLevel: levelId,
        rebateTraderCommissionRule: currentTemplate.rebateTraderCommissionRule,
      });
    }
  }, [currentTemplate, form, levelId, type]);
  const { mutateAsync: getUniqueTemplateName, isPending: getPending } = useGetUniqueTemplateName();
  const { mutateAsync: addRebateSettingsTemplate, isPending: addPending } =
    useAddRebateSettingsTemplate(type);
  const { mutateAsync: editRebateSettingsTemplate, isPending: editPending } =
    useEditRebateSettingsTemplate(type);
  const isPending = getPending || addPending || editPending;
  const onSubmit = async (values: RebateTemplateFormValues) => {
    try {
      const uniqueTemplateName = await getUniqueTemplateName({
        name: values.templateName,
        rebateType: type,
        id: currentTemplate?.id,
      });
      if (uniqueTemplateName !== 0) {
        console.error('name is not unique');
        form.setError('templateName', { message: t('rules.nameAlreadyUsed') });
        return;
      }
      const operation = isEditMode ? editRebateSettingsTemplate : addRebateSettingsTemplate;
      await operation({
        rebateType: type,
        templateName: values.templateName,
        rebateLevel: values.rebateLevel,
        rebateTraderCommissionRule: values.rebateTraderCommissionRule,
        id: currentTemplate?.id,
      });
      onSuccess();
    } catch (error) {
      console.error(error);
      return;
    }
  };

  return (
    <RrhForm
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4 py-4"
    >
      <FormHiddenInput name="rebateType" value={type} control={form.control} />
      <FormInput
        name="templateName"
        label={t('RebateTemplate.templateName')}
        placeholder={t('rules.limitLength', { field: 16 })}
        onChange={e => setTemplateName(e.target.value)}
      />
      <FormSelect
        name="rebateLevel"
        label={t('table.rebateLevel')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={(rebateLevelList || [])?.map(item => ({
          label: item.levelName,
          value: item.id.toString(),
        }))}
      />
      <div className="border-border bg-background absolute inset-x-0 bottom-0 flex justify-end gap-4 rounded-b-lg border-t p-6">
        <RrhButton type="button" onClick={onCancel}>
          {t('common.Cancel')}
        </RrhButton>
        <RrhButton type="submit">{t('common.Confirm')}</RrhButton>
      </div>
      {isPending && (
        <div className="bg-background/60 absolute inset-0">
          <RrhCircleLoading />
        </div>
      )}
    </RrhForm>
  );
};
