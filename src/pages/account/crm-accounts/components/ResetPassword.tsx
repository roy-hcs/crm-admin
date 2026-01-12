import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RrhDialog } from '@/components/common/RrhDialog';
import { Input } from '@/components/ui/input';
import { useForm, type Control } from 'react-hook-form';
import { TFunction } from 'i18next';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';
import { useCrmUserResetPwd, useCrmUserResetFundsPwd } from '@/api/hooks/system/system';
import { JSEncrypt } from 'jsencrypt';
type resetPasswordFormValues = {
  newPassword: string;
  againPassword: string;
};

const resetPasswordSchema = (t: TFunction<'translation', undefined>) => {
  return z
    .object({
      newPassword: z
        .string()
        .min(1, t('rules.required', { field: t('common.newPassword') }))
        .min(8, t('rules.passwordComplexity', { min: 8, max: 20 }))
        .max(20, t('rules.passwordComplexity', { min: 8, max: 20 }))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/,
          t('rules.passwordComplexity', { min: 8, max: 20 }),
        ),
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
      const pubKey = localStorage.getItem('publicKey');
      const encryptor = new JSEncrypt();
      encryptor.setPublicKey(`-----BEGIN PUBLIC KEY-----${pubKey}-----END PUBLIC KEY-----`);
      const encryptedNewPassword = encryptor.encrypt(values.newPassword);
      const encryptedAgainPassword = encryptor.encrypt(values.againPassword);

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

  const onConfirm = () => {
    form.handleSubmit(onSubmit)();
  };

  // 关闭后的回调方法清除数据状态
  const closeCallback = () => {
    setIsResetDialogOpen(false);
    form.reset();
    setShowNewPWD(false);
    setShowAgainPWD(false);
  };

  return (
    <RrhDialog
      title={title}
      trigger={<></>}
      open={isResetDialogOpen}
      cancelText={t('common.Cancel')}
      confirmText={isSubmitting ? t('common.loading') : t('common.Confirm')}
      isConfirmDisabled={isSubmitting}
      onConfirm={() => onConfirm()}
      onCancel={() => closeCallback()}
      className="w-full sm:w-112"
    >
      <div className="w-full sm:w-100">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
          </form>
        </Form>
      </div>
    </RrhDialog>
  );
};
