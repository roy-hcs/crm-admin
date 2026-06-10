import { RebateSettingsTemplate, useEditRebateSettingsTemplate } from '@/api/hooks/rebate';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { RrhDialog } from '@/components/common/RrhDialog';
import { FormSelect } from '@/components/form/FormSelect';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RrhForm } from '@/components/form/RrhForm';

export const SetDefaultTemplateButton = ({
  type,
  onSuccess,
  templates,
}: {
  type: number;
  onSuccess: () => void;
  templates: RebateSettingsTemplate[];
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { mutateAsync: edit, isPending } = useEditRebateSettingsTemplate(type);
  const form = useForm();
  const onSubmit = async () => {
    try {
      const id = form.getValues('defaultTemplate');
      await edit({
        templateDefault: 'Y',
        defaultTemplate: id,
        id,
      });
      afterSuccess();
    } catch (error) {
      console.error('Failed to set default template', error);
    }
  };
  const afterSuccess = () => {
    setOpen(false);
    onSuccess();
  };

  return (
    <RrhDialog
      open={open}
      onOpenChange={setOpen}
      title={t('RebateTemplate.setDefaultRebateTemplate')}
      trigger={
        <RrhButton variant="outline">{t('RebateTemplate.setDefaultRebateTemplate')}</RrhButton>
      }
      footerShow={false}
      className="pb-22"
    >
      <RrhForm
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        className="text-primary flex flex-col gap-4 py-4 text-xs"
      >
        <FormSelect
          options={templates.map(item => ({
            label: item.templateName,
            value: item.id,
          }))}
          name="defaultTemplate"
          label={t('RebateTemplate.defaultTemplate')}
          showRowValue={false}
          placeholder={t('common.pleaseSelect')}
        />
        <div>{t('RebateTemplate.setDefaultTemplateTip')}</div>
        <div className="border-border bg-background absolute inset-x-0 bottom-0 flex justify-end gap-4 rounded-b-lg border-t p-6">
          <RrhButton type="button" onClick={() => setOpen(false)}>
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
    </RrhDialog>
  );
};
