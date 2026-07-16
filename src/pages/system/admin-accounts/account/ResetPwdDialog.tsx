import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhDialog } from '@/components/common/RrhDialog';
import { FormInput } from '@/components/form/FormInput';
import { useResetUserPwd } from '@/api/hooks/system/system';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RrhForm } from '@/components/form/RrhForm';
import { toast } from 'sonner';
import { UserItem } from '@/api/hooks/system';
import { TFunction } from 'i18next';
import z from 'zod';
import { passwordSchema } from '@/lib/validators';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Eye, EyeClosed } from 'lucide-react';
import md5 from 'blueimp-md5';

type FormValues = {
  wholeName: string;
  newPassword: string;
  againPassword: string;
};

const resetPasswordSchema = (t: TFunction<'translation', undefined>) => {
  return z
    .object({
      wholeName: z.string(),
      newPassword: passwordSchema(t, { field: t('common.newPassword') }),
      againPassword: z.string().min(1, t('rules.required', { field: t('common.confirmPassword') })),
    })
    .refine(data => data.newPassword === data.againPassword, {
      message: t('common.passwordsNotMatch') || 'Passwords do not match',
      path: ['againPassword'],
    });
};

const PasswordField = ({
  control,
  name,
  label,
  show,
  setShow,
}: {
  control: Control<FormValues>;
  name: 'newPassword' | 'againPassword';
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

export const ResetPwdDialog = ({
  onSuccess,
  open: openProp,
  setOpen: onOpenChange,
  userItem,
}: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  onSuccess?: () => void;
  userItem?: UserItem;
}) => {
  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;
  const [showNewPWD, setShowNewPWD] = useState(false);
  const [showAgainPWD, setShowAgainPWD] = useState(false);
  const { mutateAsync: resetPwd, isPending } = useResetUserPwd();

  const form = useForm<FormValues>({
    resolver: zodResolver(resetPasswordSchema(t)),
    defaultValues: {
      wholeName: userItem?.wholeName || '',
      newPassword: '',
      againPassword: '',
    },
  });

  useEffect(() => {
    if (!userItem && !open) return;
    form.reset({
      wholeName: userItem?.wholeName || '',
      newPassword: '',
      againPassword: '',
    });
  }, [userItem, form, open]);

  const updateOpen = (nextOpen: boolean) => {
    setOpen(nextOpen);
  };

  const onCancel = () => {
    onClose(false);
  };

  const onConfirm = () => {
    form.handleSubmit(onSubmit)();
  };

  const onClose = (nextOpen: boolean) => {
    updateOpen(nextOpen);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const newPassword = md5(data.newPassword.trim());
      const confirmPassword = md5(data.againPassword.trim());
      const param = {
        userId: userItem?.userId || '',
        wholeName: userItem?.wholeName || '',
        password: newPassword,
        confirmPassword: confirmPassword,
      };
      const res = await resetPwd(param);
      if (res.code === 0) {
        toast.success(t('common.success'));
        form.reset();
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
      title={t('common.addField', {
        field: t('adminAccounts.temporaryAdmin'),
      })}
      open={open}
      trigger={null}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={onConfirm}
      variant="middle"
      type="submit"
      isConfirmDisabled={isPending}
      formLoading={isPending}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <FormInput name="wholeName" label={t('table.fullName')} placeholder="" disabled={true} />

        <PasswordField
          control={form.control}
          name="newPassword"
          label={t('common.newPassword')}
          show={showNewPWD}
          setShow={setShowNewPWD}
        />

        <PasswordField
          control={form.control}
          name="againPassword"
          label={t('common.confirmPassword')}
          show={showAgainPWD}
          setShow={setShowAgainPWD}
        />
      </RrhForm>
    </RrhDialog>
  );
};
