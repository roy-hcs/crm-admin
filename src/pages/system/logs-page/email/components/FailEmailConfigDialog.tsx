import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { toast } from 'sonner';
import { RrhForm } from '@/components/form/RrhForm';
import { useGetFailEmailConfig, useSetFailEmailConfig } from '@/api/hooks/system/system';
import { FormSwitch } from '@/components/form/FormSwitch';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type FormValues = {
  resendStatus: string;
  resendTimes: string;
};

export const FailEmailConfigDialog = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      resendStatus: '1',
      resendTimes: '',
    },
  });
  const { mutateAsync: setData } = useSetFailEmailConfig();
  const { mutateAsync: getDetail } = useGetFailEmailConfig();

  useEffect(() => {
    // 打开弹窗时需要初始化详情数据
    if (!open) return;
    (async () => {
      try {
        setIsSubmitting(true);
        const res = await getDetail();
        if (res.code === 0 && res.data) {
          form.reset({
            resendStatus: res.data.resendStatus,
            resendTimes: res.data.resendTimes,
          });
        } else {
          toast.error(res.msg);
        }
      } catch {
        toast.error(t('common.AnErrorOccurred'));
      } finally {
        setIsSubmitting(false);
      }
    })();
  }, [form, getDetail, open, t]);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const params = {
        resendStatus: data.resendStatus,
        resendTimes: data.resendTimes,
      };
      const res = await setData(params);

      if (res.code === 0) {
        toast.success(t('common.success'));
        setOpen(false);
        onSuccess?.();
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
      trigger={
        <RrhButton type="button" className="flex items-center gap-2">
          <Plus className="size-4" />
          {t('emailLogsPage.reSendFailedEmailConfig')}
        </RrhButton>
      }
      title={t('emailLogsPage.reSendFailedEmailConfig')}
      isConfirmDisabled={isSubmitting}
      open={open}
      onOpenChange={setOpen}
      footerShow={false}
      variant="small"
      formLoading={isSubmitting}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
        <FormSwitch name="resendStatus" label={t('emailLogsPage.resendStatus')} />

        <FormField
          control={form.control}
          name="resendTimes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('emailLogsPage.resendTimes')}</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <RrhButton
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const newValue = Math.max(1, Number(field.value) - 1);
                      form.setValue('resendTimes', String(newValue), { shouldValidate: true });
                    }}
                    disabled={Number(field.value) <= 1}
                  >
                    -
                  </RrhButton>
                  <Input
                    value={field.value}
                    type="text"
                    className={cn('h-10 w-full border px-2')}
                    placeholder=""
                    onBlur={() => {
                      field.onBlur();
                    }}
                    disabled={true}
                  />
                  <RrhButton
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const newValue = Math.min(3, Number(field.value) + 1);
                      form.setValue('resendTimes', String(newValue), { shouldValidate: true });
                    }}
                    disabled={Number(field.value) >= 3}
                  >
                    +
                  </RrhButton>
                </div>
              </FormControl>
              <FormMessage className="text-end" />
            </FormItem>
          )}
        />

        <div className="col-span-full -mx-6 flex justify-end px-6 py-6 sm:pb-0">
          <div className="flex justify-end gap-4">
            <RrhButton variant="outline" type="button" className="px-4 py-2" onClick={onCancel}>
              {t('common.Cancel')}
            </RrhButton>
            <RrhButton type="submit" className="px-4 py-2">
              {t('common.Confirm')}
            </RrhButton>
          </div>
        </div>
      </RrhForm>
    </RrhDialog>
  );
};
