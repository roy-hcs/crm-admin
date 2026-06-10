import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormInput } from '@/components/form/FormInput';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { useGetEmailVerificationCode, usePostEmailChange } from '@/api/hooks/system/system';
import { zodResolver } from '@hookform/resolvers/zod';
import { TFunction } from 'i18next';
import z from 'zod';
import { toast } from 'sonner';
import { RrhForm } from '@/components/form/RrhForm';

type FormValues = {
  method?: string;
  address: string;
  code: string;
  target?: string;
};

const addUserSchema = (t: TFunction<'translation', undefined>) => {
  return {
    address: z.string().min(1, t('rules.required', { field: t('table.email') })),
    code: z.string().min(1, t('rules.required', { field: t('common.verificationCode') })),
    method: z.string().optional(),
    target: z.string().optional(),
  };
};

export const BindNewEmailDialog = ({ onSuccess }: { onSuccess: () => void }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { mutateAsync: getCode } = useGetEmailVerificationCode();
  const { mutateAsync: postEmailChange } = usePostEmailChange();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const schema = useMemo(() => z.object(addUserSchema(t)), [t]);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      method: '1',
      address: '',
      code: '',
      target: '6',
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
    setIsSubmitting(true);
    const params = {
      method: form.getValues('method') || '1',
      address: form.getValues('address') || '',
      code: form.getValues('code') || '',
      target: form.getValues('target') || '6',
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

    const { address, method = '1', target = '6' } = form.getValues();
    setIsSendingCode(true);
    try {
      const res = await getCode({
        method,
        target,
        email: address,
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
      title={t('profile.bindNewEmail')}
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
        <FormInput
          className="py-3"
          name="address"
          label={t('table.email')}
          placeholder={t('rules.limitLength', { field: 32 })}
          maxLength={32}
        />
        {/* 缺少入机校验 */}
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="py-3">
              <FormLabel>{t('common.verificationCode')}</FormLabel>
              <FormControl>
                <div className="grid w-full gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
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
      </RrhForm>
    </RrhDialog>
  );
};
