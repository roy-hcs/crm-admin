import { forwardRef, useImperativeHandle } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { useForm } from 'react-hook-form';
import { FormProvider } from '@/contexts/form';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StatusOptions } from '@/lib/const';

type FormData = {
  operationTime: { from: string; to: string };
  userId: string;
  status: string;
  refundAccount: string;
};

export interface RefundFailureLogsFormRef {
  onReset: () => void;
}
export const RefundFailureLogsForm = forwardRef<
  RefundFailureLogsFormRef,
  {
    setParams: (params: { beginTime: string; endTime: string }) => void;
    setCommonParams: (params: { userId: string; status: string; refundAccount: string }) => void;
  }
>(({ setParams, setCommonParams }, ref) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      userId: '',
      status: '',
      refundAccount: '',
      operationTime: { from: '', to: '' },
    },
  });

  useImperativeHandle(ref, () => ({
    onReset: () => {
      form.reset();
    },
  }));

  const onSubmit = (data: FormData) => {
    setParams({
      beginTime: data.operationTime?.from || '',
      endTime: data.operationTime?.to || '',
    });
    setCommonParams({
      userId: data.userId,
      status: data.status,
      refundAccount: data.refundAccount,
    });
  };
  const onReset = () => {
    setParams({
      beginTime: '',
      endTime: '',
    });
    setCommonParams({
      userId: '',
      status: '',
      refundAccount: '',
    });
    form.reset({
      userId: '',
      status: '',
      refundAccount: '',
      operationTime: { from: '', to: '' },
    });
  };

  return (
    <FormProvider form={form}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
          className="flex flex-col gap-4 overflow-auto p-4"
        >
          <FormInput
            verticalLabel
            name="userId"
            label={t('financial.paymentOrders.userName')}
            placeholder={t('common.pleaseInput', {
              field: t('financial.paymentOrders.userName'),
            })}
          />
          <FormSelect
            verticalLabel
            name="status"
            label={t('common.status')}
            placeholder={t('common.pleaseSelect')}
            options={StatusOptions}
          />
          <FormField
            name="operationTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('common.operationTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="operationTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormInput
            verticalLabel
            name="refundAccount"
            label={t('financial.refundFailLog.refundAccount')}
            placeholder={t('common.pleaseInput', {
              field: t('financial.refundFailLog.refundAccount'),
            })}
          />
          <div className="flex justify-end gap-4">
            <RrhButton type="reset" variant={'outline'} onClick={onReset}>
              <RefreshCcw className="size-3.5" />
              <span>{t('common.Reset')}</span>
            </RrhButton>
            <RrhButton type="submit">
              <Search className="size-3.5" />
              <span>{t('common.Search')}</span>
            </RrhButton>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
});
