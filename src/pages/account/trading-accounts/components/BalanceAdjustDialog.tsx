import { FormField } from '@/components/ui/form';

import { CircleAlert } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useBalanceAdjust } from '@/api/hooks/account';
import { toast } from 'sonner';
import { FormSelect } from '@/components/form/FormSelect';
import { FormInput } from '@/components/form/FormInput';
import { SelectMethod } from './SelectMethod';
import { useGetDictType } from '@/api/hooks/system/system';
import { TFunction } from 'i18next';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RrhForm } from '@/components/form/RrhForm';

type FormValues = {
  serverId?: string;
  amount: string;
  operationType: string;
  remark: string;
  logins?: string;
  opType: string;
};

const initSchema = (t: TFunction<'translation', undefined>) => {
  return {
    operationType: z.string().min(1, t('rules.required', { field: t('table.inMethod') })),
    opType: z.string().min(1, t('rules.required', { field: t('table.operationType') })),
    amount: z.string().min(1, t('rules.required', { field: t('table.operationAmount') })),
    remark: z.string().min(1, t('rules.required', { field: t('table.remarks') })),
  };
};
export const BalanceAdjustDialog = ({
  onSuccess,
  accounts,
  serverId,
  open,
  setOpen,
}: {
  onSuccess?: () => void;
  accounts: string[];
  serverId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hideFlag, setHideFlag] = useState(true);
  const [typeOptions, setTypeOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [operationTypeLoading, setOperationTypeLoading] = useState(false);
  const { mutateAsync: getOperationTypeData } = useGetDictType();
  const { mutateAsync: balanceAdjust } = useBalanceAdjust();

  const schema = useMemo(() => z.object(initSchema(t)), [t]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      serverId: serverId,
      amount: '',
      operationType: '0',
      remark: '',
      logins: '',
      opType: '',
    },
  });

  const operationType = form.watch('operationType');

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const param = {
        serverId: data?.serverId || '',
        amount: data?.amount,
        operationType: data?.operationType,
        remark: data?.remark,
        logins: accounts.join(',') || '',
        opType: data?.opType,
      };
      const res = await balanceAdjust(param);
      if (res.code === 0) {
        form.reset();
        toast.success(t('common.success'));
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancel = () => {
    form.reset();
    setOpen(false);
  };

  const onConfirm = () => {
    form.handleSubmit(onSubmit)();
  };

  const onClose = (open: boolean) => {
    setOpen(open);
    form.reset();
  };

  useEffect(() => {
    // 2 3 不需要请求操作类型
    if (['2', '3'].includes(operationType)) {
      form.setValue('opType', '');
      setHideFlag(false);
      setTypeOptions([]);
      return;
    }
    setHideFlag(true);
    let mounted = true;
    const fetch = async (operationType?: string) => {
      if (!operationType) {
        if (mounted) setTypeOptions([]);
        return;
      }
      if (mounted) setOperationTypeLoading(true);
      try {
        // 枚举出对应的参数
        const typeMenu: Record<string, string> = {
          '0': 'crm_adjust_in_type',
          '1': 'crm_adjust_out_type',
        };
        const key = operationType as keyof typeof typeMenu;
        const type = await getOperationTypeData(typeMenu[key]);
        if (!mounted) return;
        if (type?.length > 0) {
          const typeOptions = type
            .filter(i => i)
            .map(i => ({
              label: i.dictLabel,
              value: i.dictValue,
            }));
          setTypeOptions(typeOptions);
        } else {
          setTypeOptions([]);
        }
      } catch (error) {
        console.error(error);
        if (mounted) setTypeOptions([]);
      } finally {
        if (mounted) setOperationTypeLoading(false);
      }
    };
    fetch(operationType);
    form.setValue('opType', '');
    return () => {
      mounted = false;
    };
  }, [form, getOperationTypeData, operationType]);

  return (
    <RrhDialog
      title={t('tradingAccountTransactions.balanceAdjust')}
      isConfirmDisabled={isSubmitting}
      open={open}
      variant="middle"
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={onConfirm}
      type="submit"
      formLoading={isSubmitting}
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
            count: accounts.length,
          })}
        </div>

        <div className="grid gap-2">
          <div className="text-foreground text-sm leading-5 font-medium">{t('table.account')}</div>
          <div className="text-muted-foreground text-sm leading-5">{accounts?.join(', ')}</div>
        </div>

        <FormField
          name="operationType"
          render={({ field }) => {
            return <SelectMethod verticalLabel field={field} />;
          }}
        />
        {hideFlag && (
          <FormSelect
            name="opType"
            label={t('table.operationType')}
            verticalLabel
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={typeOptions}
            loading={operationTypeLoading}
          />
        )}

        <FormInput
          name="amount"
          label={t('table.operationAmount')}
          placeholder={t('rules.limitLength', { field: 11 })}
          maxLength={11}
        />

        <FormInput
          name="remark"
          label={t('table.remarks')}
          placeholder={t('rules.limitLength', { field: 10 })}
          maxLength={10}
        />
      </RrhForm>
    </RrhDialog>
  );
};
