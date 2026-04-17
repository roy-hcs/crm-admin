import { FormField } from '@/components/ui/form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { FormInput } from '@/components/form/FormInput';
import { MsgTemplateItem, useAddMsgTemplate, useEditMsgTemplate } from '@/api/hooks/message';
import { toast } from 'sonner';
import { RichTextEditor } from '../../management/components/RichTextEditor';
import { RrhForm } from '@/components/form/RrhForm';

type FormValues = {
  content: string;
  title: string;
};

const newMessageSchema = (t: TFunction<'translation', undefined>) => {
  return {
    title: z.string().min(1, t('rules.required', { field: t('table.title') })),
    content: z.string().min(1, t('rules.required', { field: t('table.content') })),
  };
};

export const AddEditTemplateDialog = ({
  mode,
  open: openProp,
  onOpenChange,
  detail,
  onSuccess,
}: {
  mode: 'add' | 'edit';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  detail?: MsgTemplateItem | null;
  onSuccess: () => void;
}) => {
  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = useMemo(() => z.object(newMessageSchema(t)), [t]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const { mutateAsync: addTemplate } = useAddMsgTemplate();
  const { mutateAsync: editTemplate } = useEditMsgTemplate();

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const param = {
        title: data.title,
        content: data.content,
      };
      const res =
        mode === 'add'
          ? await addTemplate(param)
          : await editTemplate({
              id: detail?.id || '',
              ...param,
            });
      if (res.code === 0) {
        toast.success(t('common.success'));
        onClose(false);
        onSuccess();
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancel = () => {
    onClose(false);
  };

  const onConfirm = async () => {
    form.handleSubmit(onSubmit)();
  };

  const onClose = (open: boolean) => {
    setOpen(open);
    form.reset();
  };

  useEffect(() => {
    if (mode !== 'edit' || !detail) return;
    setIsSubmitting(true);
    form.reset({
      title: detail.title || '',
      content: detail.content || '',
    });
    setIsSubmitting(false);
  }, [mode, form, detail, open]);

  return (
    <RrhDialog
      trigger={
        mode === 'add' ? (
          <RrhButton type="button" Icon={<Plus className="size-3.5" />}>
            {t('common.add')}
          </RrhButton>
        ) : null
      }
      title={mode === 'add' ? t('messageTemplate.add') : t('messageTemplate.edit')}
      isConfirmDisabled={isSubmitting}
      open={open}
      cancelText={t('common.Cancel')}
      confirmText={t('common.Confirm')}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={onConfirm}
      variant="large"
      type="submit"
      formLoading={isSubmitting}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)}>
            <div className="py-6">
              <FormInput
                verticalLabel
                name="title"
                label={t('table.title')}
                placeholder={t('common.pleaseInput', { field: t('table.title') })}
                maxLength={64}
              />
            </div>
            <div className="py-6">
              <FormField
                name="content"
                render={({ field }) => {
                  return (
                    <RichTextEditor
                      field={field}
                      title={t('table.content')}
                      placeholder={t('common.pleaseInput', {
                        field: t('table.content'),
                      })}
                    />
                  );
                }}
              />
            </div>
          </RrhForm>
    </RrhDialog>
  );
};
