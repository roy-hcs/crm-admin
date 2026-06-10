import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { RefreshCcw, Search } from 'lucide-react';
import { FormInput } from '@/components/form/FormInput';

import { RrhButton } from '@/components/common/RrhButton';
import { useTranslation } from 'react-i18next';
import { UserOrderLogListParams } from '@/api/hooks/system';
import { Dispatch, SetStateAction } from 'react';
import { BasicParams, ThirdPaymentItem } from '@/api/hooks/review/types';
import { FormSelect } from '@/components/form/FormSelect';
import { OrderStatusOptions } from '@/lib/const';
import { formatDate } from '@/lib/utils';
import { RrhForm } from '@/components/form/RrhForm';

type FormData = {
  orderId: string;
  orderStatus: string;
  userName: string;
  channelName: string;
  payResult: string;
  operationTime: { from: string; to: string };
};

export const PaymentLogsForm = ({
  setOtherParams,
  setParams,
  loading,
  paymentMethods,
  reset,
  params,
  otherParams,
}: {
  setOtherParams: Dispatch<
    SetStateAction<Omit<UserOrderLogListParams, 'params' | keyof BasicParams>>
  >;
  setParams: Dispatch<SetStateAction<UserOrderLogListParams['params']>>;
  loading: boolean;
  paymentMethods?: ThirdPaymentItem[];
  reset: () => void;
  params: UserOrderLogListParams['params'];
  otherParams: Omit<UserOrderLogListParams, 'params' | keyof BasicParams>;
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      orderId: otherParams.orderId || '',
      orderStatus: otherParams.orderStatus || '',
      userName: params.userName || '',
      channelName: otherParams.channelName || '',
      payResult: otherParams.payResult || '',
      operationTime: { from: params.operationStart || '', to: params.operationEnd || '' },
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setParams(pre => ({
      ...pre,
      operationStart: formatDate(data.operationTime.from),
      operationEnd: formatDate(data.operationTime.to),
      userName: data.userName,
    }));
    setOtherParams(pre => ({
      ...pre,
      orderId: data.orderId,
      channelName: data.channelName,
      payResult: data.payResult,
      orderStatus: data.orderStatus,
    }));
  };
  const onReset = () => {
    reset();
    form.reset({
      orderId: '',
      orderStatus: '',
      userName: '',
      channelName: '',
      payResult: '',
      operationTime: { from: '', to: '' },
    });
  };

  return (
    <RrhForm
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
      onReset={onReset}
      className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20 md:px-12 md:pt-12"
    >
      <FormInput
        name="orderId"
        label={t('table.orderNumber')}
        placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
      />
      <FormField
        name="operationTime"
        render={() => (
          <FormItem className="flex flex-col gap-2 text-sm">
            <FormLabel className="basis-3/12">{t('table.orderTime')}</FormLabel>
            <FormControl className="basis-9/12">
              <FormDateRangeInput name="operationTime" control={form.control} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormSelect
        verticalLabel
        name="orderStatus"
        label={t('paymentOrders.orderStatus')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={OrderStatusOptions.map(item => ({ label: t(item.label), value: item.value }))}
      />
      <FormInput
        name="userName"
        label={t('table.nameOrId')}
        placeholder={t('common.pleaseInput', { field: t('table.title') })}
      />
      <FormSelect
        verticalLabel
        name="channelName"
        label={t('paymentOrders.channelName')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={
          paymentMethods?.map(item => ({ label: item.channelName, value: item.channelName })) || []
        }
      />
      <FormSelect
        verticalLabel
        name="payResult"
        label={t('table.payResult')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={[
          { label: t('table.paySuccess'), value: '1' },
          { label: t('table.payFailed'), value: '0' },
        ]}
      />

      <div className="bg-background absolute inset-x-0 bottom-0 flex justify-end gap-4 p-4">
        <RrhButton type="reset" variant="outline" onClick={onReset}>
          <RefreshCcw className="size-3.5" />
          <span>{t('common.Reset')}</span>
        </RrhButton>
        <RrhButton type="submit" loading={loading}>
          <Search className="size-3.5" />
          <span>{t('common.Search')}</span>
        </RrhButton>
      </div>
    </RrhForm>
  );
};
