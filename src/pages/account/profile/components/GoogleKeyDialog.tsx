import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';


import { useForm } from 'react-hook-form';
import { useBind, useUnbind } from '@/api/hooks/system/system';
import { zodResolver } from '@hookform/resolvers/zod';
import { TFunction } from 'i18next';
import z from 'zod';
import { toast } from 'sonner';
import { FormInput } from '@/components/form/FormInput';
import { RrhQrCode } from '@/components/common/RrhQrCode';
import md5 from 'blueimp-md5';
import { RrhForm } from '@/components/form/RrhForm';

type FormValues = {
  code: string;
  password: string;
};

const schemaConfig = (t: TFunction<'translation', undefined>) => {
  return {
    password: z.string().min(1, t('rules.required', { field: t('profile.loginPwd') })),
    code: z.string().min(1, t('rules.required', { field: t('profile.googleAuthCode') })),
  };
};

export const GoogleKeyDialog = ({
  onSuccess,
  qrCodeValue,
  key,
}: {
  onSuccess: () => void;
  qrCodeValue: string;
  key: string;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { mutateAsync: bind } = useBind();
  const { mutateAsync: unbind } = useUnbind();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const schema = useMemo(() => z.object(schemaConfig(t)), [t]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: '',
      password: '',
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
      const passwordMd5 = md5(values.password.trim());
      const res = key
        ? await bind({
            code: values.code,
            password: passwordMd5 || '',
            key: key,
          })
        : await unbind({
            code: values.code,
            password: passwordMd5 || '',
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

  return (
    <RrhDialog
      trigger={
        <RrhButton variant="outline">{key ? t('profile.bind') : t('profile.unBind')}</RrhButton>
      }
      title={key ? t('profile.bind') : t('profile.unBind')}
      open={open}
      confirmText={t('common.Confirm')}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={onConfirm}
      variant="large"
      type="submit"
      formLoading={isSubmitting}
    >
      <RrhForm form={form}>
            {key && (
              <div className="grid gap-6">
                <div>
                  <div className="text-foreground text-base leading-4 font-semibold">
                    {t('profile.bingtips.1')}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-6">
                    <div>
                      <img
                        className="size-30 rounded-lg border bg-white p-2.5"
                        src="http://admin-1.hcs55.com:38080/img/android.png"
                        alt={t('profile.android')}
                      />
                    </div>
                    <div>
                      <img
                        className="size-30 rounded-lg border bg-white p-2.5"
                        src="http://admin-1.hcs55.com:38080/img/IOS.png"
                        alt={t('profile.ios')}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="text-foreground text-base leading-4 font-semibold">
                    {t('profile.bingtips.2')}
                  </div>
                  <div className="text-muted-foreground text-xs leading-4">
                    {t('profile.googleAuthTips')}
                  </div>
                  <div className="flex flex-wrap gap-6">
                    <div className="rounded-lg border bg-white p-2.5">
                      {qrCodeValue ? (
                        <RrhQrCode value={qrCodeValue} size={120} />
                      ) : (
                        <div className="text-muted-foreground flex size-30 items-center justify-center text-xs">
                          {t('common.NoData')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-muted-foreground text-xs leading-4">
                    {`${t('profile.key')}: ${key}`}
                  </div>
                </div>
                <div>
                  <div className="text-foreground text-base leading-4 font-semibold">
                    {t('profile.bingtips.3')}
                  </div>
                </div>
              </div>
            )}
            <FormInput
              className="py-3"
              name="password"
              label={t('profile.loginPwd')}
              verticalLabel
              placeholder={t('common.pleaseInput', { field: t('rules.pwd') })}
            />
            <FormInput
              className="py-3"
              name="code"
              label={t('profile.googleAuthCode')}
              verticalLabel
              placeholder={t('common.pleaseInput', { field: t('profile.googleAuthCode') })}
            />
          </RrhForm>
    </RrhDialog>
  );
};
