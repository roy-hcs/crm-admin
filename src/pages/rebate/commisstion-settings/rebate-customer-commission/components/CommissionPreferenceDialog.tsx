import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RrhDialog } from '@/components/common/RrhDialog';
import { RrhForm } from '@/components/form/RrhForm';
import { RrhButton } from '@/components/common/RrhButton';
import { useGetCommissionSetting, useSetCommissionType } from '@/api/hooks/rebate';
import { FormInput } from '@/components/form/FormInput';
import { toast } from 'sonner';
import { FormSwitchGroup } from '@/components/form/FormSwitchGroup';
import { FormSwitch } from '@/components/form/FormSwitch';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';

type FormValues = {
  commissionType: string;
  paramFillType: string;
  notFillType: string;
  agentEdit: string;
  editLevel: string[];
  viewSubordinate: string;
  viewGenerations: string;
};

const DEFAULT_FORM_VALUES: FormValues = {
  commissionType: '2',
  paramFillType: '2',
  notFillType: '1',
  agentEdit: '1',
  editLevel: [],
  viewSubordinate: '1',
  viewGenerations: '',
};

export const CommissionPreferenceDialog = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { mutateAsync: editCommissionType, isPending } = useSetCommissionType();
  const { data: detailData } = useGetCommissionSetting({
    enabled: open,
  });

  const form = useForm<FormValues>({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const commissionTypeValue = form.watch('commissionType');
  const paramFillTypeValue = form.watch('paramFillType');
  const agentEditValue = form.watch('agentEdit');
  const viewSubordinateValue = form.watch('viewSubordinate');

  useEffect(() => {
    if (!open) {
      return;
    }

    const detailItem = detailData?.data;
    if (!detailItem) {
      return;
    }

    form.reset({
      commissionType: detailItem.commissionType ?? DEFAULT_FORM_VALUES.commissionType,
      paramFillType: detailItem.paramFillType ?? DEFAULT_FORM_VALUES.paramFillType,
      notFillType: detailItem.notFillType ?? DEFAULT_FORM_VALUES.notFillType,
      agentEdit: detailItem.agentEdit ?? DEFAULT_FORM_VALUES.agentEdit,
      editLevel: detailItem.editLevel
        ? detailItem.editLevel
            .split(',')
            .map(item => item.trim())
            .filter(Boolean)
        : DEFAULT_FORM_VALUES.editLevel,
      viewSubordinate: detailItem.viewSubordinate ?? DEFAULT_FORM_VALUES.viewSubordinate,
      viewGenerations: detailItem.viewGenerations ?? DEFAULT_FORM_VALUES.viewGenerations,
    });
  }, [detailData, form, open]);

  const onCancel = () => {
    onClose(false);
  };

  const onSubmit = async (values: FormValues) => {
    if (values.commissionType === '2' && values.paramFillType === '1') {
      toast.error(t('commissionRebateSettings.parameterFillMethodTips'));
      return;
    }

    const normalizedValues = {
      ...values,
      paramFillType: values.commissionType === '2' ? values.paramFillType : '',
      notFillType: values.commissionType === '2' ? values.notFillType : '',
      agentEdit:
        values.commissionType === '2' && values.paramFillType === '2' ? values.agentEdit : '',
      editLevel:
        values.commissionType === '2' && values.paramFillType === '2' && values.agentEdit === '1'
          ? values.editLevel
          : [],
      viewSubordinate:
        values.commissionType === '2' && values.paramFillType === '2' ? values.viewSubordinate : '',
      viewGenerations:
        values.commissionType === '2' &&
        values.paramFillType === '2' &&
        values.viewSubordinate === '1'
          ? values.viewGenerations
          : '',
    };

    const params = {
      agentEdit: normalizedValues.agentEdit,
      commissionType: normalizedValues.commissionType,
      editLevel: normalizedValues.editLevel.join(','),
      notFillType: normalizedValues.notFillType,
      paramFillType: normalizedValues.paramFillType,
      viewSubordinate: normalizedValues.viewSubordinate,
      viewGenerations: normalizedValues.viewGenerations,
    };

    try {
      const res = await editCommissionType(params);

      if (res?.code === 0) {
        toast.success(t('common.success'));
        onClose(false);
        return;
      }
      toast.error(res?.msg || t('common.AnErrorOccurred'));
    } catch (error) {
      console.error(error);
    }
  };

  const onConfirm = async () => {
    form.handleSubmit(onSubmit)();
  };

  const onClose = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset(DEFAULT_FORM_VALUES);
    }
  };

  const levelOptions =
    detailData?.data?.allLevel?.map(level => ({
      label: level.levelName,
      value: String(level.level),
    })) ?? [];

  return (
    <RrhDialog
      trigger={
        <RrhButton type="button">
          {t('commissionRebateSettings.commissionPreferenceSettings')}
        </RrhButton>
      }
      title={t('commissionRebateSettings.commissionPreferenceSettings')}
      open={open}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={onConfirm}
      variant="large"
      type="submit"
      formLoading={isPending}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <FormSwitchGroup
          className="py-6"
          name="commissionType"
          label={t('commissionRebateSettings.commissionParameterScheme')}
          switchItems={[
            {
              value: '1',
              label: t('commissionRebateSettings.commissionTypeOptions.1'),
            },
            {
              value: '2',
              label: t('commissionRebateSettings.commissionTypeOptions.2'),
            },
          ]}
          labeTipsDom={
            <div className="text-muted-foreground text-xs leading-4">
              {t('commissionRebateSettings.commissionParameterSchemeDesc')}
            </div>
          }
        />

        {commissionTypeValue === '2' && (
          <div>
            <FormSwitchGroup
              className="py-6"
              name="paramFillType"
              label={t('commissionRebateSettings.parameterFillMethod')}
              switchItems={[
                {
                  value: '1',
                  label: t('commissionRebateSettings.paramFillTypeOptions.1'),
                },
                {
                  value: '2',
                  label: t('commissionRebateSettings.paramFillTypeOptions.2'),
                },
              ]}
            />

            <FormSwitchGroup
              className="py-6"
              name="notFillType"
              label={t('commissionRebateSettings.paramsNotMethod')}
              switchItems={[
                {
                  value: '1',
                  label: t('commissionRebateSettings.notFillTypeOptions.1'),
                },
                {
                  value: '2',
                  label: t('commissionRebateSettings.notFillTypeOptions.2'),
                },
              ]}
            />

            {paramFillTypeValue === '2' && (
              <div>
                <FormSwitch
                  className="py-6"
                  verticalLabel
                  name="agentEdit"
                  label={t('commissionRebateSettings.agentEdit')}
                  labeTipsDom={
                    <div className="text-muted-foreground text-xs leading-4">
                      {t('commissionRebateSettings.agentEditDesc')}
                    </div>
                  }
                />
                {agentEditValue === '1' && (
                  <FormMultiSelect
                    className="py-6"
                    verticalLabel
                    name="editLevel"
                    label={t('commissionRebateSettings.editLevel')}
                    options={levelOptions}
                    placeholder={t('common.pleaseSelect')}
                  />
                )}

                <FormSwitch
                  className="py-6"
                  verticalLabel
                  name="viewSubordinate"
                  label={t('commissionRebateSettings.viewSubordinate')}
                  labeTipsDom={
                    <div className="text-muted-foreground text-xs leading-4">
                      {t('commissionRebateSettings.viewSubordinateDesc')}
                    </div>
                  }
                />
                {viewSubordinateValue === '1' && (
                  <FormInput
                    className="py-6"
                    name="viewGenerations"
                    label={t('commissionRebateSettings.viewGenerations')}
                    placeholder={t('commissionRebateSettings.viewGenerationsPlaceholder')}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </RrhForm>
    </RrhDialog>
  );
};
