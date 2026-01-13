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
import { useCallback, useEffect, useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';
import { useCrmDealAccountResetPwd, useMtServerGroup } from '@/api/hooks/system/system';
import { JSEncrypt } from 'jsencrypt';
import { FormSelect } from '@/components/form/FormSelect';
import { FormProvider } from '@/contexts/form';

import { passwordTypeOptions } from '@/lib/const';
import { CrmDealAccountListItem } from '@/api/hooks/account';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
type resetPasswordFormValues = {
  pwdType: string;
  newPassword: string;
  againPassword: string;
};

const resetPasswordSchema = (
  t: TFunction<'translation', undefined>,
  maxLength?: number,
  minLength?: number,
) => {
  return z
    .object({
      newPassword: z
        .string()
        .min(1, t('rules.required', { field: t('common.newPassword') }))
        .min(
          minLength || 8,
          t('rules.crmAccountPassword', { min: minLength || 8, max: maxLength || 16 }),
        )
        .max(
          maxLength || 16,
          t('rules.crmAccountPassword', { min: minLength || 8, max: maxLength || 16 }),
        )
        .regex(
          new RegExp(
            `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=[\\]{};:'",.<>/\\\\?|\\\`~])[A-Za-z\\d!@#$%^&*()_+\\-=[\\]{};:'",.<>/\\\\?|\\\`~]{${minLength || 8},${maxLength || 16}}$`,
          ),
          t('rules.crmAccountPassword', { min: minLength || 8, max: maxLength || 16 }),
        ),
      againPassword: z.string().min(1, t('rules.required', { field: t('common.confirmPassword') })),
      pwdType: z.string().min(1, t('rules.required', { field: t('common.pwdType') })),
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
  title,
  info,
}: {
  isResetDialogOpen: boolean;
  setIsResetDialogOpen: (open: boolean) => void;
  title: string;
  info: CrmDealAccountListItem | null;
}) => {
  /**
   * serviceType 1 MT5 5 XOH
   * mt5的密码长度控制由useMtServerGroup接口控制 如果没有长度 则默认 16 8
   */
  const { data } = useMtServerGroup(info?.server || '', info?.account || '');
  const { t } = useTranslation();
  const changePwdMutation = useCrmDealAccountResetPwd();

  const [showNewPWD, setShowNewPWD] = useState(false);
  const [showAgainPWD, setShowAgainPWD] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<resetPasswordFormValues>({
    resolver: zodResolver(
      resetPasswordSchema(t, data?.maxpwdlength || 16, data?.minpwdlength || 8),
    ),
    defaultValues: {
      newPassword: '',
      againPassword: '',
      pwdType: '',
    },
  });

  const onSubmit = async (values: resetPasswordFormValues) => {
    setIsSubmitting(true);
    try {
      const pubKey = localStorage.getItem('publicKey');
      const encryptor = new JSEncrypt();
      encryptor.setPublicKey(`-----BEGIN PUBLIC KEY-----${pubKey}-----END PUBLIC KEY-----`);
      const encryptedNewPassword = encryptor.encrypt(values.newPassword);
      const res = await changePwdMutation.mutateAsync({
        accountId: info?.id || '',
        pwdType: values.pwdType,
        pwd: encryptedNewPassword || '',
      });

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
        <FormProvider form={form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-4 grid gap-2">
                <div className="text-foreground text-sm leading-5 font-medium">
                  {t('common.accountType')}
                </div>
                <div className="text-muted-foreground text-sm leading-5">{info?.account}</div>
              </div>
              <div className="mb-4">
                <FormSelect
                  verticalLabel
                  name="pwdType"
                  label={t('common.pwdType')}
                  placeholder={t('common.pleaseSelect')}
                  showRowValue={false}
                  options={passwordTypeOptions
                    .map(i => ({ label: t(i.label), value: i.value }))
                    .filter(i => {
                      if (info?.serviceType === 5) {
                        // XOH 只展示交易密码
                        return i.value === '1';
                      } else {
                        // 其他 展示所有
                        return i.value !== '';
                      }
                    })}
                />
              </div>
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
        </FormProvider>
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
