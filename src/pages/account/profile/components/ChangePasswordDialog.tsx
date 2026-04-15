import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider } from '@/contexts/form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Control, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { useRestPwd } from '@/api/hooks/system/system';
import { zodResolver } from '@hookform/resolvers/zod';
import { TFunction } from 'i18next';
import z from 'zod';
import { Eye, EyeClosed } from 'lucide-react';
import { toast } from 'sonner';
import { JSEncrypt } from 'jsencrypt';

type FormValues = {
  newPassword: string;
  confirmPassword: string;
};

const schemaConfig = (t: TFunction<'translation', undefined>) => {
  return {
    newPassword: z
      .string()
      .min(1, t('rules.required', { field: t('common.newPassword') }))
      .min(8, t('rules.userPwdTips', { min: 8, max: 20 }))
      .max(20, t('rules.userPwdTips', { min: 8, max: 20 }))
      .regex(
        new RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,20}$`),
        t('rules.userPwdTips', { min: 8, max: 20 }),
      ),
    confirmPassword: z.string().min(1, t('rules.required', { field: t('common.confirmPassword') })),
  };
};

const PasswordField = ({
  control,
  name,
  label,
  show,
  setShow,
}: {
  control: Control<FormValues>;
  name: 'newPassword' | 'confirmPassword';
  label: string;
  show: boolean;
  setShow: (v: boolean) => void;
}) => {
  const autoComplete = name === 'newPassword' ? 'new-password' : 'new-password';
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="mb-4">
          <FormLabel className="capitalize">{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type={show ? 'text' : 'password'}
                placeholder={label}
                {...field}
                autoComplete={autoComplete}
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                onClick={() => setShow(!show)}
              >
                {show ? <Eye className="size-4" /> : <EyeClosed className="size-4" />}
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const ChangePasswordDialog = ({ onSuccess }: { onSuccess: () => void }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { mutateAsync: restPwd } = useRestPwd();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const schema = useMemo(() => z.object(schemaConfig(t)), [t]);

  const [showNewPWD, setShowNewPWD] = useState(false);
  const [showAgainPWD, setShowAgainPWD] = useState(false);
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
      const pubKey = localStorage.getItem('publicKey');
      const encryptor = new JSEncrypt();
      encryptor.setPublicKey(`-----BEGIN PUBLIC KEY-----${pubKey}-----END PUBLIC KEY-----`);
      const encryptedNewPassword = encryptor.encrypt(values.newPassword);
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
        <RrhButton className="border" variant="ghost">
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
      <FormProvider form={form}>
        <Form {...form}>
          <form>
            <PasswordField
              control={form.control}
              name="newPassword"
              label={t('common.newPassword')}
              show={showNewPWD}
              setShow={setShowNewPWD}
            />

            <PasswordField
              control={form.control}
              name="confirmPassword"
              label={t('common.confirmPassword')}
              show={showAgainPWD}
              setShow={setShowAgainPWD}
            />
          </form>
        </Form>
      </FormProvider>
    </RrhDialog>
  );
};
