import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useForm } from 'react-hook-form';
import { useRestPwd } from '@/api/hooks/system/system';
import { zodResolver } from '@hookform/resolvers/zod';
import { TFunction } from 'i18next';
import z from 'zod';
import { passwordSchema } from '@/lib/validators';
import { toast } from 'sonner';
import { encryptWithPublicKey } from '@/lib/utils';
import { RrhForm } from '@/components/form/RrhForm';
import { FormPwdInput } from '@/components/form/FormPwdInput';

type FormValues = {
  newPassword: string;
  confirmPassword: string;
};

const schemaConfig = (t: TFunction<'translation', undefined>) => {
  return {
    newPassword: passwordSchema(t, { field: t('common.newPassword') }),
    confirmPassword: z.string().min(1, t('rules.required', { field: t('common.confirmPassword') })),
  };
};

export const ChangePasswordDialog = ({ onSuccess }: { onSuccess: () => void }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { mutateAsync: restPwd } = useRestPwd();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const schema = useMemo(() => z.object(schemaConfig(t)), [t]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onClose = (open: boolean) => {
    setOpen(open);
    form.reset();
  };

  const onCancel = () => {
    onClose(false);
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const encryptedNewPassword = encryptWithPublicKey(values.newPassword);
      const res = await restPwd({
        newPassword: encryptedNewPassword || '',
        confirmPassword: encryptedNewPassword || '',
      });
      if (res?.code === 0) {
        toast.success(res?.msg || t('common.success'));
        onCancel();
        onSuccess();
      } else {
        toast.error(res.msg);
      }
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onConfirm = () => {
    form.handleSubmit(onSubmit)();
  };

  useEffect(() => {
    if (!open || countdown <= 0) {
      return;
    }
    const timer = window.setTimeout(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [countdown, open]);

  return (
    <RrhDialog
      trigger={
        <RrhButton variant="outline">
          {t('common.modify', {
            field: '',
          })}
        </RrhButton>
      }
      title={t('common.modify', {
        field: t('rules.pwd'),
      })}
      open={open}
      confirmText={t('common.Confirm')}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={onConfirm}
      variant="small"
      type="submit"
      formLoading={isSubmitting}
    >
      <RrhForm form={form}>
        <FormPwdInput
          name="newPassword"
          label={t('common.newPassword')}
          placeholder={t('common.newPassword')}
          className="mb-4"
          autoComplete="new-password"
        />

        <FormPwdInput
          name="confirmPassword"
          label={t('common.confirmPassword')}
          placeholder={t('common.confirmPassword')}
          className="mb-4"
          autoComplete="new-password"
        />
      </RrhForm>
    </RrhDialog>
  );
};
