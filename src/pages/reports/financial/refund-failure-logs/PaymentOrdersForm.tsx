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
import { formatDate } from '@/lib/utils';
import { Dispatch, SetStateAction } from 'react';
import { RefundFailLogListParams } from '@/api/hooks/report';
import { BasicParams } from '@/api/types';

type FormData = {
  operationTime: { from: string; to: string };
  userId: string;
  status: string;
  refundAccount: string;
};

export const RefundFailureLogsForm = ({
  setParams,
  setCommonParams,
  reset,
  params,
  commonParams,
}: {
  setParams: Dispatch<SetStateAction<RefundFailLogListParams['params']>>;
  setCommonParams: Dispatch<
    SetStateAction<Omit<RefundFailLogListParams, 'params' | keyof BasicParams>>
  >;
  reset: () => void;
  params: RefundFailLogListParams['params'];
  commonParams: Omit<RefundFailLogListParams, 'params' | keyof BasicParams>;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      userId: commonParams.userId || '',
      status: commonParams.status || '',
      refundAccount: commonParams.refundAccount || '',
      operationTime: { from: params.beginTime || '', to: params.endTime || '' },
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setParams({
      beginTime: formatDate(data.operationTime.from),
      endTime: formatDate(data.operationTime.to),
    });
    setCommonParams({
      userId: data.userId,
      status: data.status,
      refundAccount: data.refundAccount,
    });
  };
  const onReset = () => {
    reset();
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
          className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20 md:px-12 md:pt-12"
        >
          <FormInput
            verticalLabel
            name="userId"
            label={t('paymentOrders.userName')}
            placeholder={t('common.pleaseInput', {
              field: t('paymentOrders.userName'),
            })}
          />
          <FormSelect
            verticalLabel
            name="status"
            label={t('common.status')}
            placeholder={t('common.pleaseSelect')}
            options={StatusOptions.map(i => ({ label: t(i.label), value: i.value }))}
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
            label={t('refundFailLog.refundAccount')}
            placeholder={t('common.pleaseInput', {
              field: t('refundFailLog.refundAccount'),
            })}
          />
          <div className="bg-background absolute inset-x-0 bottom-0 flex justify-end gap-4 p-4">
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
};
