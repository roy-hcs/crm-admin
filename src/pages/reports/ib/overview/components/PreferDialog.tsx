import { CircleAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useAgencyPreference, useGetAgencyPreference } from '@/api/hooks/report/report';
import { toast } from 'sonner';
import { RrhForm } from '@/components/form/RrhForm';
import { FormCheckBoxGroup } from '@/components/form/FormCheckBoxGroup';

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
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
        <div className="bg-primary/5 flex items-center gap-1 rounded-md p-2">
          <CircleAlert className="text-primary size-4" />
          <span className="text-primary text-sm leading-5 font-medium">
            {t('overview.preferenceSettingsDescription')}
          </span>
        </div>

        <FormCheckBoxGroup
          name="depositMethods"
          label={t('table.depositWay')}
          options={[
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

        <FormCheckBoxGroup
          name="withdrawMethods"
          label={t('table.depositWay')}
          options={[
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
      </RrhForm>
    </RrhDialog>
  );
};
