import { Form, FormField } from '@/components/ui/form';
import { FormProvider } from '@/contexts/form';
import { CircleAlert, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
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
}: {
  onSuccess?: () => void;
  accounts: string[];
  serverId: string;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hideFlag, setHideFlag] = useState(true);
  const [opTypeptions, setOpTypeptions] = useState<Array<{ label: string; value: string }>>([]);
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

  useEffect(() => {
    // 2 3 不需要请求操作类型
    if (['2', '3'].includes(operationType)) {
      form.setValue('opType', '');
      setHideFlag(false);
      setOpTypeptions([]);
      return;
    }
    setHideFlag(true);
    let mounted = true;
    const fetch = async (operationType?: string) => {
      if (!operationType) {
        if (mounted) setOpTypeptions([]);
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
        const operType = await getOperationTypeData(typeMenu[key]);
        if (!mounted) return;
        if (operType?.length > 0) {
          const operTypeOptions = operType
            .filter(i => i)
            .map(i => ({
              label: i.dictLabel,
              value: i.dictValue,
            }));
          setOpTypeptions(operTypeOptions);
        } else {
          setOpTypeptions([]);
        }
      } catch (error) {
        console.error(error);
        if (mounted) setOpTypeptions([]);
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
      trigger={
        <RrhButton
          onClick={e => {
            if (accounts && accounts?.length > 0) {
              setOpen(true);
            } else {
              toast.error(t('financial.tradingAccountTransactions.atLeastOneAccount'));
              e.preventDefault();
            }
          }}
          type="button"
          Icon={<Plus className="size-3.5" />}
        >
          {t('financial.tradingAccountTransactions.balanceAdjust')}
        </RrhButton>
      }
      title={t('financial.tradingAccountTransactions.balanceAdjust')}
      isConfirmDisabled={isSubmitting}
      open={open}
      onOpenChange={setOpen}
      footerShow={false}
      variant="middle"
      formLoading={isSubmitting}
    >
      <FormProvider form={form}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-1"
          >
            <div className="bg-destructive/5 flex items-center gap-1 rounded-md p-2">
              <CircleAlert className="text-destructive h-4 w-4" />
              <span className="text-destructive text-sm leading-5 font-medium">
                {t('financial.tradingAccountTransactions.balanceAdjustDescription')}
              </span>
            </div>
            <div className="text-foreground text-sm leading-5 font-medium">
              {t('financial.tradingAccountTransactions.selectedAccounts', {
                count: accounts.length,
              })}
            </div>

            <div className="grid gap-2">
              <div className="text-foreground text-sm leading-5 font-medium">
                {t('table.account')}
              </div>
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
                placeholder={`${t('common.pleaseSelect')}`}
                showRowValue={false}
                options={opTypeptions}
                loading={operationTypeLoading}
              />
            )}

            <FormInput
              name="amount"
              label={t('table.operationAmount')}
              verticalLabel
              placeholder={t('rules.limitLength', { field: 11 })}
            />

            <FormInput
              name="remark"
              label={t('table.remarks')}
              verticalLabel
              placeholder={t('rules.limitLength', { field: 10 })}
            />

            <div className="border-muted col-span-full -mx-6 flex justify-end border-t px-6 pt-6 pb-6 sm:pb-0">
              <div className="flex justify-end gap-4">
                <RrhButton variant="outline" type="button" className="px-4 py-2" onClick={onCancel}>
                  {t('common.Cancel')}
                </RrhButton>
                <RrhButton type="submit" className="px-4 py-2" disabled={isSubmitting}>
                  {t('common.Confirm')}
                </RrhButton>
              </div>
            </div>
          </form>
        </Form>
      </FormProvider>
    </RrhDialog>
  );
};
