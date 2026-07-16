import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RrhDialog } from '@/components/common/RrhDialog';
import { Input } from '@/components/ui/input';
import { useForm, type Control } from 'react-hook-form';
import { TFunction } from 'i18next';
import * as z from 'zod';
import { passwordSchema } from '@/lib/validators';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';
import { useCrmUserResetPwd, useCrmUserResetFundsPwd } from '@/api/hooks/system/system';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { cn, encryptWithPublicKey } from '@/lib/utils';
import { RrhForm } from '@/components/form/RrhForm';
type resetPasswordFormValues = {
  newPassword: string;
  againPassword: string;
};

const resetPasswordSchema = (t: TFunction<'translation', undefined>) => {
  return z
    .object({
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
  control: Control<resetPasswordFormValues>;
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

export const ResetPassword = ({
  isResetDialogOpen,
  setIsResetDialogOpen,
  id,
  title,
  type,
}: {
  isResetDialogOpen: boolean;
  setIsResetDialogOpen: (open: boolean) => void;
  id: string;
  title: string;
  type: 'password' | 'fundPassword';
}) => {
  const { t } = useTranslation();
  const changePwdMutation = useCrmUserResetPwd();
  const changeFundsPwdMutation = useCrmUserResetFundsPwd();

  const [showNewPWD, setShowNewPWD] = useState(false);
  const [showAgainPWD, setShowAgainPWD] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<resetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema(t)),
    defaultValues: {
      newPassword: '',
      againPassword: '',
    },
  });

  const onSubmit = async (values: resetPasswordFormValues) => {
    setIsSubmitting(true);
    try {
      const encryptedNewPassword = encryptWithPublicKey(values.newPassword);
      const encryptedAgainPassword = encryptWithPublicKey(values.againPassword);

      let res;
      if (type === 'password') {
        res = await changePwdMutation.mutateAsync({
          id: id,
          pwd: encryptedNewPassword || '',
          confirmPassword: encryptedAgainPassword || '',
        });
      } else {
        res = await changeFundsPwdMutation.mutateAsync({
          id: id,
          dealPwd: encryptedNewPassword || '',
          dealConfirmPassword: encryptedAgainPassword || '',
        });
      }

      if (res.code === 0) {
        toast.success(t('common.success'));
        setIsResetDialogOpen(false);
      } else {
        toast.error(res.msg);
      }
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = () => {
    form.handleSubmit(onSubmit)();
  };

  const closeCallback = useCallback(() => {
    form.reset();
    setShowNewPWD(false);
    setShowAgainPWD(false);
  }, [form]);

  useEffect(() => {
    if (!isResetDialogOpen) {
      closeCallback();
    }
  }, [closeCallback, isResetDialogOpen]);

  return (
    <RrhDialog
      title={title}
      trigger={<button></button>}
      open={isResetDialogOpen}
      onOpenChange={setIsResetDialogOpen}
      footerShow={false}
      className="w-full sm:w-112"
    >
      <div className="w-full sm:w-100">
        <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)}>
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
      </div>
      <DialogFooter className="border-muted -mx-6 gap-2 border-t px-6 pt-6 sm:justify-end">
        <DialogClose>
          <div
            className="cursor-pointer rounded-sm border bg-white px-4 py-2 text-[#1E1E1E]"
            onClick={closeCallback}
          >
            {t('common.Cancel')}
          </div>
        </DialogClose>
        <div
          onClick={() => {
            if (isSubmitting) return;
            handleConfirm();
          }}
          className={cn(
            'bg-primary rounded-sm border px-4 py-2 text-white',
            isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          )}
        >
          {t('common.Confirm')}
        </div>
      </DialogFooter>
    </RrhDialog>
  );
};
