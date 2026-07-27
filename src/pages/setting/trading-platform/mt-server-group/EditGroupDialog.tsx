import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useForm } from 'react-hook-form';
import { RrhForm } from '@/components/form/RrhForm';
import { toast } from 'sonner';
import { FormInput } from '@/components/form/FormInput';
import { useEditServerGroupSetting } from '@/api/hooks/setting/setting';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MtServerGroupRes } from '@/api/hooks/agent/types';
import {
  applyInputNormalizer,
  normalizePositiveIntegerInput,
} from '@/pages/marketing/shared/formValueUtils';

type FormValues = {
  name: string;
  group: string;
  accountAll: string;
  accountStart: string;
  accountEnd: string;
};

export const EditGroupDialog = ({
  open: openProp,
  setOpen: onOpenChange,
  item,
  name,
  accountAll,
  onSuccess,
}: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  item?: MtServerGroupRes;
  name: string;
  accountAll: string;
  onSuccess?: () => void;
}) => {
  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;

  const { groupName, accountStart, accountEnd } = item || {};

  const { mutateAsync: edit, isPending: isEditPending } = useEditServerGroupSetting();

  const schema = useMemo(
    () =>
      z.object({
        accountStart: z
          .string()
          .min(1, t('rules.required', { field: t('serversSettingPage.accountStart') })),
        accountEnd: z
          .string()
          .min(1, t('rules.required', { field: t('serversSettingPage.accountEnd') })),
        name: z.string(),
        group: z.string(),
        accountAll: z.string(),
      }),
    [t],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      group: '',
      accountAll: '',
      accountStart: '',
      accountEnd: '',
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      name: name || '',
      group: groupName || '',
      accountAll: accountAll || '',
      accountStart: `${accountStart ?? ''}`,
      accountEnd: `${accountEnd ?? ''}`,
    });
  }, [open, form, name, groupName, accountStart, accountEnd, accountAll]);

  const onCancel = () => {
    onClose(false);
  };

  const onClose = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await edit({
        id: item?.id || '',
        serverId: item?.serverId || '',
        accountStart: data.accountStart,
        accountEnd: data.accountEnd,
      });
      if (res.code === 0) {
        toast.success(t('common.success'));
        onClose(false);
        onSuccess?.();
      } else {
        toast.error(res.msg);
      }
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    }
  };

  return (
    <RrhDialog
      title={t('common.modify', {
        field: t('table.groups'),
      })}
      isConfirmDisabled={isEditPending}
      open={open}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={form.handleSubmit(onSubmit)}
      variant="large"
      type="submit"
      formLoading={isEditPending}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <FormInput name="name" label={t('table.server')} placeholder="" disabled />
        <FormInput name="group" label={t('table.groups')} placeholder="" disabled />
        <FormInput
          name="accountAll"
          label={t('serversSettingPage.accountAll')}
          placeholder=""
          disabled
        />

        <FormInput
          name="accountStart"
          label={t('serversSettingPage.accountStart')}
          placeholder={t('common.pleaseInput', { field: t('serversSettingPage.accountStart') })}
          onInput={event =>
            applyInputNormalizer(event.currentTarget, normalizePositiveIntegerInput)
          }
        />

        <FormInput
          name="accountEnd"
          label={t('serversSettingPage.accountEnd')}
          placeholder={t('common.pleaseInput', { field: t('serversSettingPage.accountEnd') })}
          onInput={event =>
            applyInputNormalizer(event.currentTarget, normalizePositiveIntegerInput)
          }
        />
      </RrhForm>
    </RrhDialog>
  );
};
