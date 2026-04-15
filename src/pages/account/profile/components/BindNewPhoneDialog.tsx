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
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useGetPhoneVerificationCode, usePostEmailChange } from '@/api/hooks/system/system';
import { zodResolver } from '@hookform/resolvers/zod';
import { TFunction } from 'i18next';
import z from 'zod';
import { FormPhoneInput } from '@/components/form/FormPhoneInput';
import { useCheckUserPhone } from '@/api/hooks/common';
import { toast } from 'sonner';

type FormValues = {
  address: string;
  code: string;
  mzone?: string;
};

const addUserSchema = (t: TFunction<'translation', undefined>) => {
  return {
    address: z.string().min(1, t('rules.required', { field: t('table.email') })),
    code: z.string().min(1, t('rules.required', { field: t('common.verificationCode') })),
    mzone: z.string().optional(),
  };
};

export const BindNewPhoneDialog = ({ onSuccess }: { onSuccess: () => void }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { mutateAsync: getCode } = useGetPhoneVerificationCode();
  const { mutateAsync: postEmailChange } = usePostEmailChange();
  const { mutateAsync: checkPhone } = useCheckUserPhone();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const schema = useMemo(() => z.object(addUserSchema(t)), [t]);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      address: '',
      code: '',
      mzone: '+86-0',
    },
  });

  const onClose = (open: boolean) => {
    setOpen(open);
    form.reset();
    if (!open) {
      setCountdown(0);
      setIsSendingCode(false);
    }
  };

  const onCancel = () => {
    onClose(false);
  };

  const onConfirm = async () => {
    if (isSubmitting) return;
    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }
    const { address: phone } = form.getValues();
    let address = '';
    const mzone = form.getValues('mzone') ? form.getValues('mzone')?.match(/\+(.+?)-/) : null;
    if (mzone) {
      address = `${mzone[1]}${phone}`;
    } else {
      address = phone;
    }
    setIsSubmitting(true);
    const params = {
      method: '2',
      address: address,
      code: form.getValues('code') || '',
      target: '5',
    };

    try {
      const res = await postEmailChange(params);
      if (res?.resultCode === 0) {
        toast.success(res?.resultMsg || t('common.success'));
        onCancel();
        onSuccess();
      } else {
        toast.error(res.resultMsg);
      }
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    } finally {
      setIsSubmitting(false);
    }
  };
  // 获取验证码
  const onGetVerificationCode = async () => {
    const isAddressValid = await form.trigger('address');
    if (!isAddressValid) {
      return;
    }

    const { address: phone } = form.getValues();
    let address = '';
    const mzone = form.getValues('mzone') ? form.getValues('mzone')?.match(/\+(.+?)-/) : null;
    if (mzone) {
      address = `${mzone[1]}${phone}`;
    } else {
      address = phone;
    }
    setIsSendingCode(true);
    try {
      const res = await getCode({
        method: '1',
        target: '5',
        phone: address,
      });
      if (res?.resultCode === 0) {
        setCountdown(60);
      } else {
        toast.error(res.resultMsg);
      }
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    try {
      const match = form.getValues('mzone') ? form?.getValues('mzone')?.match(/\+(.+?)-/) : null;
      const params = {
        phonenumber: e.target.value,
        mzone: match ? match[1] : '',
      };
      const res = await checkPhone(params);
      if (res === 1) {
        form.setError('address', {
          message: t('rules.phoneExists'),
        });
      } else {
        form.clearErrors('address');
      }
    } catch (error) {
      console.log('error', error);
    }
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
      title={t('profile.bindNewPhone')}
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
            <FormPhoneInput
              name="address"
              mzoneFieldName="mzone"
              label={t('CRMAccountPage.Mobile')}
              placeholder={`${t('CRMAccountPage.Mobile')}`}
              verticalLabel
              onBlur={handleBlur}
            />
            {/* 缺少入机校验 */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="py-3">
                  <FormLabel>{t('common.verificationCode')}</FormLabel>
                  <FormControl>
                    <div
                      className={cn(
                        'grid w-full gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center',
                      )}
                    >
                      <Input
                        placeholder={t('common.pleaseInput', {
                          field: t('common.verificationCode'),
                        })}
                        value={field.value ?? ''}
                        className="h-10 text-sm"
                        onChange={e => field.onChange(e.target.value)}
                      />
                      <RrhButton
                        type="button"
                        className="border"
                        variant="ghost"
                        disabled={isSendingCode || countdown > 0}
                        onClick={onGetVerificationCode}
                      >
                        {countdown > 0 ? `${countdown}s` : t('common.getVerificationCode')}
                      </RrhButton>
                    </div>
                  </FormControl>
                  <FormMessage className="text-end" />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </FormProvider>
    </RrhDialog>
  );
};
