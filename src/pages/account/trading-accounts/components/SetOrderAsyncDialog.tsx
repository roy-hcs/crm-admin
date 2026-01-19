import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormProvider } from '@/contexts/form';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useBatchOrderSync } from '@/api/hooks/account';
import { toast } from 'sonner';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { formatDate } from '@/lib/utils';

type FormValues = {
  orderTime: { from: string; to: string };
};

export const SetOrderAsyncDialog = ({
  onSuccess,
  serverId,
  accounts,
}: {
  onSuccess?: () => void;
  serverId: string;
  accounts: string[];
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      orderTime: { from: '', to: '' },
    },
  });
  const { mutateAsync: setOrderAsync } = useBatchOrderSync();

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const param = {
        startDate: formatDate(data.orderTime.from),
        endDate: formatDate(data.orderTime.to),
        accounts: accounts.join(','),
        serverId: serverId,
      };
      const res = await setOrderAsync(param);
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
          {t('financial.tradingAccountTransactions.batchOrderAsync')}
        </RrhButton>
      }
      title={t('financial.tradingAccountTransactions.batchOrderAsync')}
      isConfirmDisabled={isSubmitting}
      open={open}
      onOpenChange={setOpen}
      footerShow={false}
      variant="small"
      formLoading={isSubmitting}
    >
      <FormProvider form={form}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-1"
          >
            <div className="bg-destructive/5 mb-5 flex items-center gap-1 rounded-md p-2">
              <span className="text-destructive text-sm leading-5 font-medium">
                {t('financial.tradingAccountTransactions.OrderAsyncTips')}
              </span>
            </div>

            <div className="mb-4 grid gap-2">
              <div className="text-foreground text-sm leading-5 font-medium">
                {t('table.account')}
              </div>
              <div className="text-muted-foreground text-sm leading-5">{accounts?.join(', ')}</div>
            </div>

            <FormField
              name="orderTime"
              render={() => (
                <FormItem className="flex flex-col gap-2 text-sm">
                  <FormLabel className="basis-3/12">{t('table.orderTime')}</FormLabel>
                  <FormControl className="basis-9/12">
                    <FormDateRangeInput name="orderTime" control={form.control} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-full -mx-6 flex justify-end px-6 pt-6 pb-6 sm:pb-0">
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
