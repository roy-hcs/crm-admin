import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { FormSelect } from '@/components/form/FormSelect';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { RrhDialog } from '@/components/common/RrhDialog';
import { toast } from 'sonner';
import { SelectOption } from '@/api/types';
import { FormTextarea } from '@/components/form/FormTextarea';
import { RrhForm } from '@/components/form/RrhForm';
import { FormSwitchGroup } from '@/components/form/FormSwitchGroup';
import { FormInput } from '@/components/form/FormInput';
import { useWalletBalanceAdjust } from '@/api/hooks/account';
import { CircleAlert } from 'lucide-react';

type FormValues = {
  amount: string;
  operationType: string;
  opType: string;
  remark?: string;
};

const schemaConfig = (t: TFunction<'translation', undefined>) => {
  return {
    remark: z.string().optional(),
    amount: z.string().min(1, t('rules.required', { field: t('table.operationAmount') })),
    operationType: z.string().min(1, t('rules.required', { field: t('table.inMethod') })),
    opType: z.string().min(1, t('rules.required', { field: t('table.operationType') })),
  };
};

export const WalletBalanceAdjustDialog = ({
  open,
  setOpen,
  onSuccess,
  operationType,
  ids,
}: {
  onSuccess?: () => void;
  operationType: SelectOption[];
  userOptions: SelectOption[];
  open: boolean;
  setOpen: (open: boolean) => void;
  ids: string[];
}) => {
  const { t } = useTranslation();

  const schema = useMemo(() => z.object(schemaConfig(t)), [t]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: '',
      operationType: '1',
      opType: '',
      remark: '',
    },
  });
  const { mutateAsync: adjustWalletBalance, isPending } = useWalletBalanceAdjust();

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await adjustWalletBalance({
        ...data,
        remark: data.remark || '',
        ids: ids ? ids.join(',') : '',
      });
      if (res.code === 0) {
        toast.success(t('common.success'));
        form.reset();
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const onCancel = () => {
    form.reset();
    setOpen(false);
  };

  const onClose = (open: boolean) => {
    setOpen(open);
    form.reset();
    if (!open) {
      form.reset({
        amount: '',
        operationType: '1',
        opType: '',
        remark: '',
      });
    }
  };

  return (
    <RrhDialog
      title={t('walletAdjustment.title')}
      isConfirmDisabled={isPending}
      open={open}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={() => form.handleSubmit(onSubmit)()}
      variant="middle"
      type="submit"
      formLoading={isPending}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
        <div className="bg-destructive/5 flex items-center gap-1 rounded-md p-2">
          <CircleAlert className="text-destructive size-4" />
          <span className="text-destructive text-sm leading-5 font-medium">
            {t('tradingAccountTransactions.balanceAdjustDescription')}
          </span>
        </div>
        <div className="text-foreground text-sm leading-5 font-medium">
          {t('tradingAccountTransactions.selectedAccounts', {
            count: ids.length,
          })}
        </div>
        <FormSwitchGroup
          name="operationType"
          label={t('table.inMethod')}
          switchItems={[
            {
              value: '1',
              label: t('table.Deposit'),
            },
            {
              value: '2',
              label: t('table.Withdrawal'),
            },
          ]}
        />

        <FormSelect
          name="opType"
          label={t('table.operationType')}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={operationType}
        />

        <FormInput
          name="amount"
          label={t('table.operationAmount')}
          placeholder={t('common.pleaseInput', { field: t('table.operationAmount') })}
          maxLength={25}
        />

        <FormTextarea
          name="remark"
          label={t('table.remarks')}
          placeholder={t('rules.limitLength', { field: 32 })}
          maxLength={32}
        />
      </RrhForm>
    </RrhDialog>
  );
};
