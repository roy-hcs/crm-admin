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
import { DictTypeItem } from '@/api/hooks/system';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';

type FormValues = {
  depositMethods: string;
  withdrawMethods: string;
  depositSubTypes: string;
  withdrawSubTypes: string;
};

export const PreferDialog = ({
  onSuccess,
  adjustInTypeOptions,
  adjustOutTypeOptions,
}: {
  onSuccess: () => void;
  adjustInTypeOptions: DictTypeItem[];
  adjustOutTypeOptions: DictTypeItem[];
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: setPreference } = useAgencyPreference();
  const { mutateAsync: getPreference } = useGetAgencyPreference();

  const form = useForm<FormValues>({
    defaultValues: {
      depositMethods: '',
      withdrawMethods: '',
      depositSubTypes: '',
      withdrawSubTypes: '',
    },
  });

  const depositMethodsValue = form.watch('depositMethods');
  const withdrawMethodsValue = form.watch('withdrawMethods');

  useEffect(() => {
    async function fetchData() {
      const res = await getPreference(3);
      if (res?.code === 0) {
        form.reset({
          depositMethods: res?.data?.depositMethods || '',
          withdrawMethods: res?.data?.withdrawMethods || '',
          depositSubTypes: res?.data?.depositSubTypes || '',
          withdrawSubTypes: res?.data?.withdrawSubTypes || '',
        });
      } else {
        form.reset({
          depositMethods: '',
          withdrawMethods: '',
          depositSubTypes: '',
          withdrawSubTypes: '',
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
        bizType: '3',
        depositMethods: data?.depositMethods,
        withdrawMethods: data?.withdrawMethods,
        depositSubTypes: data?.depositSubTypes,
        withdrawSubTypes: data?.withdrawSubTypes,
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
          options={[
            {
              value: '1',
              label: t('table.Deposit'),
            },
            {
              value: '2',
              label: t('table.SystemDeposit'),
            },
          ]}
        />

        {depositMethodsValue.includes('2') && (
          <FormMultiSelect
            name="depositSubTypes"
            label={t('table.depositWay')}
            placeholder={t('common.pleaseSelect')}
            options={adjustInTypeOptions.map(i => ({
              value: i.dictValue,
              label: i.dictLabel,
            }))}
          />
        )}

        <FormCheckBoxGroup
          name="withdrawMethods"
          options={[
            {
              value: '1',
              label: t('table.Withdrawal'),
            },
            {
              value: '2',
              label: t('table.SystemWithdrawal'),
            },
          ]}
        />

        {withdrawMethodsValue.includes('2') && (
          <FormMultiSelect
            name="withdrawSubTypes"
            placeholder={t('common.pleaseSelect')}
            label={t('table.withdrawMethods')}
            options={adjustOutTypeOptions.map(i => ({
              value: i.dictValue,
              label: i.dictLabel,
            }))}
          />
        )}
      </RrhForm>
    </RrhDialog>
  );
};
