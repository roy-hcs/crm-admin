import { Dispatch, SetStateAction } from 'react';
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
import { OrderStatusOptions } from '@/lib/const';
import { useChannelList } from '@/api/hooks/system/system';
import { formatDate } from '@/lib/utils';
import { PaymentOrderListParams } from '@/api/hooks/report';
import { BasicParams } from '@/api/hooks/review/types';
import { SelectUpperDropdown } from '@/components/common/SelectUpperDropdown';

type FormData = {
  userName: string;
  account: string;
  accounts: string;
  operationTime: { from: string; to: string };
  channelId: string;
  orderStatus: string;
  orderId: string;
};
export const PaymentOrdersForm = ({
  setParams,
  setCommonParams,
  reset,
  params,
  commonParams,
}: {
  setParams: Dispatch<SetStateAction<PaymentOrderListParams['params']>>;
  setCommonParams: Dispatch<
    SetStateAction<Omit<PaymentOrderListParams, 'params' | keyof BasicParams>>
  >;
  reset: () => void;
  params: PaymentOrderListParams['params'];
  commonParams: Omit<PaymentOrderListParams, 'params' | keyof BasicParams>;
}) => {
  const { data: channelRes } = useChannelList();
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      userName: params.userName || '',
      account: params.account || '',
      accounts: params.accounts || '',
      operationTime: { from: params.operationStart || '', to: params.operationEnd || '' },
      channelId: commonParams.channelId || '',
      orderStatus: commonParams.orderStatus || '',
      orderId: commonParams.orderId || '',
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    const selectedAccounts = JSON.parse(data.accounts || '{"id": "", "label": ""}') as {
      id: string;
      label: string;
    };
    setParams({
      userName: data.userName,
      account: data.account,
      accounts: selectedAccounts.label,
      operationStart: formatDate(data.operationTime.from),
      operationEnd: formatDate(data.operationTime.to),
    });
    setCommonParams({
      channelId: data.channelId,
      orderStatus: data.orderStatus,
      orderId: data.orderId,
      accounts: selectedAccounts.id,
    });
  };
  const onReset = () => {
    reset();
    form.reset();
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
            name="userName"
            label={t('paymentOrders.userName')}
            placeholder={t('common.pleaseInput', {
              field: t('paymentOrders.userName'),
            })}
          />
          <FormInput
            verticalLabel
            name="account"
            label={t('paymentOrders.account')}
            placeholder={t('common.pleaseInput', {
              field: t('paymentOrders.account'),
            })}
          />
          <FormSelect
            verticalLabel
            name="channelId"
            label={t('paymentOrders.channelId')}
            placeholder={t('common.pleaseSelect')}
            options={
              channelRes
                ?.filter(item => item)
                .map(item => ({
                  label: item.channelName,
                  value: item.id,
                })) || []
            }
          />
          <FormSelect
            verticalLabel
            name="orderStatus"
            label={t('paymentOrders.orderStatus')}
            placeholder={t('common.pleaseSelect')}
            options={OrderStatusOptions.map(i => ({ label: t(i.label), value: i.value }))}
          />
          <FormInput
            verticalLabel
            name="orderId"
            label={t('paymentOrders.orderId')}
            placeholder={t('common.pleaseInput', {
              field: t('paymentOrders.orderId'),
            })}
          />
          <SelectUpperDropdown />
          <FormField
            name="operationTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('paymentOrders.orderTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="operationTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
