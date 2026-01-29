import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormProvider } from '@/contexts/form';
import { CircleAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useAgencyPreference, useGetAgencyPreference } from '@/api/hooks/report/report';
import { RrhCheckBoxGroup } from '@/components/common/RrhCheckBoxGroup';
import { toast } from 'sonner';

type FormValues = {
  depositMethods: string;
  withdrawMethods: string;
};

export const PreferDialog = ({ onSuccess }: { onSuccess: () => void }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: setPreference } = useAgencyPreference();
  const { mutateAsync: getPreference } = useGetAgencyPreference();

  const form = useForm<FormValues>({
    defaultValues: {
      depositMethods: '',
      withdrawMethods: '',
    },
  });

  useEffect(() => {
    async function fetchData() {
      const res = await getPreference();
      if (res?.code === 0) {
        form.reset({
          depositMethods: res?.data?.depositMethods || '',
          withdrawMethods: res?.data?.withdrawMethods || '',
        });
      } else {
        form.reset({
          depositMethods: '',
          withdrawMethods: '',
        });
      }
    }
    if (open) {
      fetchData();
    }
  }, [form, getPreference, open]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const param = {
        bizType: '2',
        depositMethods: data?.depositMethods,
        withdrawMethods: data?.withdrawMethods,
      };
      const res = await setPreference(param);
      if (res.code === 0) {
        toast.success(t('common.success'));
        setOpen(false);
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

  const onCancel = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <RrhDialog
      trigger={<RrhButton variant="outline">{t('overview.preferenceSettings')}</RrhButton>}
      title={t('overview.depositWithdrawPreference')}
      isConfirmDisabled={isSubmitting}
      open={open}
      onOpenChange={setOpen}
      variant="large"
      formLoading={isSubmitting}
      type="submit"
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <FormProvider form={form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
            <div className="bg-primary/5 flex items-center gap-1 rounded-md p-2">
              <CircleAlert className="text-primary size-4" />
              <span className="text-primary text-sm leading-5 font-medium">
                {t('overview.preferenceSettingsDescription')}
              </span>
            </div>

            <FormField
              name="depositMethods"
              render={({ field }) => {
                return (
                  <FormItem>
                    <div className="text-foreground text-sm">
                      <FormLabel className="mb-6">{t('table.depositWay')}</FormLabel>
                      <FormControl>
                        <RrhCheckBoxGroup
                          onValueChange={v => field.onChange(v)}
                          value={field.value}
                          labelClassName="font-medium"
                          checkItems={[
                            {
                              value: '1',
                              label: t('table.Deposit'),
                            },
                            {
                              value: '2',
                              label: t('table.SystemDeposit'),
                            },
                            {
                              value: '3',
                              label: t('table.RebateDeposit'),
                            },
                            {
                              value: '4',
                              label: t('table.InternalTransferIn'),
                            },
                            {
                              value: '6',
                              label: t('table.pammDeposit'),
                            },
                            {
                              value: '5',
                              label: t('table.other'),
                            },
                          ]}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                );
              }}
            />
            <FormField
              name="withdrawMethods"
              render={({ field }) => {
                return (
                  <FormItem>
                    <div className="text-foreground text-sm">
                      <FormLabel className="mb-6">{t('table.withdrawMethods')}</FormLabel>
                      <FormControl>
                        <RrhCheckBoxGroup
                          onValueChange={v => field.onChange(v)}
                          value={field.value}
                          labelClassName="font-medium"
                          checkItems={[
                            {
                              value: '1',
                              label: t('table.Withdrawal'),
                            },
                            {
                              value: '2',
                              label: t('table.SystemWithdrawal'),
                            },
                            {
                              value: '4',
                              label: t('table.InternalTransferOut'),
                            },
                            {
                              value: '6',
                              label: t('table.pammWithdrawal'),
                            },
                            {
                              value: '5',
                              label: t('table.other'),
                            },
                          ]}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                );
              }}
            />
          </form>
        </Form>
      </FormProvider>
    </RrhDialog>
  );
};
