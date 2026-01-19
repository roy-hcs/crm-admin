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
import { useCrmDealAccountResetPwd, useMtServerGroup } from '@/api/hooks/system/system';
import { JSEncrypt } from 'jsencrypt';
import { FormSelect } from '@/components/form/FormSelect';
import { FormProvider } from '@/contexts/form';

import { passwordTypeOptions } from '@/lib/const';
import { CrmDealAccountListItem } from '@/api/hooks/account';
import { RrhButton } from '@/components/common/RrhButton';
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

export const ResetPasswordDialog = ({
  title,
  info,
  open,
  setOpen,
}: {
  title: string;
  open: boolean;
  info: CrmDealAccountListItem | null;
  setOpen: (open: boolean) => void;
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
        setOpen(false);
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
      title={title}
      trigger={<button></button>}
      isConfirmDisabled={isSubmitting}
      open={open}
      onOpenChange={setOpen}
      footerShow={false}
      variant="small"
      formLoading={isSubmitting}
    >
      <div>
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

              <div className="col-span-full -mx-6 flex justify-end px-6 pt-6 pb-6 sm:pb-0">
                <div className="flex justify-end gap-4">
                  <RrhButton
                    variant="outline"
                    type="button"
                    className="px-4 py-2"
                    onClick={onCancel}
                  >
                    {t('common.Cancel')}
                  </RrhButton>
                  <RrhButton type="submit" className="px-4 py-2">
                    {t('common.Confirm')}
                  </RrhButton>
                </div>
              </div>
            </form>
          </Form>
        </FormProvider>
      </div>
    </RrhDialog>
  );
};
