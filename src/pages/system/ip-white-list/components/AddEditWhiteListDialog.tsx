import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { toast } from 'sonner';
import { RrhForm } from '@/components/form/RrhForm';
import { FormSwitchGroup } from '@/components/form/FormSwitchGroup';
import { FormInput } from '@/components/form/FormInput';
import { FormTextarea } from '@/components/form/FormTextarea';
import { useAddWhiteList, useEditWhiteList } from '@/api/hooks/system/system';
import { IpWhiteListItem } from '@/api/hooks/system';

type FormValues = {
  ipType: string;
  ipAddress: string;
  ipEndAddress: string;
  remark: string;
};

const walletSchema = (t: TFunction<'translation', undefined>) => {
  return {
    ipAddress: z.string().min(1, t('rules.required', { field: t('table.ipAddress') })),
    ipEndAddress: z.string(),
    ipType: z.string().min(1, t('rules.required', { field: t('table.ipAddress') })),
    remark: z.string(),
  };
};

export const AddEditWhiteListDialog = ({
  mode,
  open: openProp,
  onOpenChange,
  onSuccess,
  currentItem,
}: {
  onSuccess?: () => void;
  mode: 'add' | 'edit';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  currentItem?: IpWhiteListItem;
}) => {
  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = useMemo(
    () =>
      z.object(walletSchema(t)).superRefine((data, ctx) => {
        // 仅在展示结束IP输入框时校验必填
        if (data.ipType === '2' && !data.ipEndAddress.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['ipEndAddress'],
            message: t('rules.required', { field: t('ipWhiteList.endIP') }),
          });
        }
      }),
    [t],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      ipType: '1',
      ipAddress: '',
      ipEndAddress: '',
      remark: '',
    },
  });
  const ipTypeValue = form.watch('ipType');
  const { mutateAsync: add } = useAddWhiteList();
  const { mutateAsync: edit } = useEditWhiteList();

  useEffect(() => {
    if (mode === 'edit' && currentItem) {
      form.reset({
        ipType: String(currentItem.ipType),
        ipAddress: currentItem.ipAddress,
        ipEndAddress: currentItem.ipEndAddress || '',
        remark: currentItem.remark || '',
      });
    } else {
      form.reset({
        ipType: '1',
        ipAddress: '',
        ipEndAddress: '',
        remark: '',
      });
    }
  }, [mode, currentItem, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const params = {
        ipType: data.ipType,
        ipAddress: data.ipAddress,
        ipEndAddress: data.ipEndAddress,
        remark: data.remark,
        status: '1',
      };
      const res =
        mode === 'add' ? await add(params) : await edit({ ...params, id: currentItem?.id || '' });

      if (res.code === 0) {
        toast.success(t('common.success'));
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(res.msg);
      }
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancel = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <RrhDialog
      trigger={
        mode === 'add' ? (
          <RrhButton type="button" className="flex items-center gap-2">
            <Plus className="size-4" />
            {t('common.add')}
          </RrhButton>
        ) : null
      }
      title={mode === 'add' ? t('ipWhiteList.add') : t('ipWhiteList.edit')}
      isConfirmDisabled={isSubmitting}
      open={open}
      onOpenChange={setOpen}
      footerShow={false}
      variant="small"
      formLoading={isSubmitting}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
        <FormSwitchGroup
          name="ipType"
          label={t('table.ipAddress')}
          switchItems={[
            {
              value: '1',
              label: t('ipWhiteList.ipTypeOptions.1'),
            },
            {
              value: '2',
              label: t('ipWhiteList.ipTypeOptions.2'),
            },
          ]}
        />

        <FormInput
          name="ipAddress"
          label={ipTypeValue === '1' ? '' : t('ipWhiteList.startIP')}
          placeholder={t('common.pleaseInput', {
            field: ipTypeValue === '1' ? t('table.ipAddress') : t('ipWhiteList.startIP'),
          })}
        />

        {ipTypeValue === '2' && (
          <FormInput
            name="ipEndAddress"
            label={t('ipWhiteList.endIP')}
            placeholder={t('common.pleaseInput', { field: t('ipWhiteList.endIP') })}
          />
        )}

        <FormTextarea
          name="remark"
          label={t('table.remarks')}
          placeholder={t('rules.limitLength', { field: 200 })}
          maxLength={200}
        />

        <div className="col-span-full -mx-6 flex justify-end px-6 py-6 sm:pb-0">
          <div className="flex justify-end gap-4">
            <RrhButton variant="outline" type="button" className="px-4 py-2" onClick={onCancel}>
              {t('common.Cancel')}
            </RrhButton>
            <RrhButton type="submit" className="px-4 py-2">
              {t('common.Confirm')}
            </RrhButton>
          </div>
        </div>
      </RrhForm>
    </RrhDialog>
  );
};
