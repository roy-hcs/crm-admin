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
import { RrhSelectAccountsPopup } from '@/components/common/RrhSelectAccountPopup';
import { PaymentChannelItem } from '@/api/hooks/system/types';
import { OrderStatusOptions } from '@/lib/const';

type FormData = {
  userName: string;
  account: string;
  accounts: string;
  operationTime: { from: string; to: string };
  channelId: string;
  orderStatus: string;
  orderId: string;
};

export interface PaymentOrdersFormRef {
  onReset: () => void;
}
export const PaymentOrdersForm = forwardRef<
  PaymentOrdersFormRef,
  {
    setParams: (params: {
      userName: string;
      account: string;
      accounts: string;
      operationStart: string;
      operationEnd: string;
    }) => void;
    setCommonParams: (params: {
      channelId: string;
      orderStatus: string;
      orderId: string;
      accounts: string;
    }) => void;
    channelList: PaymentChannelItem[];
  }
>(({ setParams, setCommonParams, channelList }, ref) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      userName: '',
      account: '',
      accounts: '',
      operationTime: { from: '', to: '' },
      channelId: '',
      orderStatus: '',
      orderId: '',
    },
  });

  useImperativeHandle(ref, () => ({
    onReset: () => {
      form.reset();
    },
  }));

  const onSubmit = (data: FormData) => {
    setParams({
      userName: data.userName,
      account: data.account,
      accounts: data.accounts,
      operationStart: data.operationTime?.from || '',
      operationEnd: data.operationTime?.to || '',
    });
    setCommonParams({
      channelId: data.channelId,
      orderStatus: data.orderStatus,
      orderId: data.orderId,
      accounts: data.accounts,
    });
  };
  const onReset = () => {
    setParams({
      userName: '',
      account: '',
      accounts: '',
      operationStart: '',
      operationEnd: '',
    });
    setCommonParams({
      channelId: '',
      orderStatus: '',
      orderId: '',
      accounts: '',
    });
    form.reset({
      userName: '',
      account: '',
      accounts: '',
      operationTime: { from: '', to: '' },
      channelId: '',
      orderStatus: '',
      orderId: '',
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
            name="userName"
            label={t('financial.paymentOrders.userName')}
            placeholder={t('common.pleaseInput', {
              field: t('financial.paymentOrders.userName'),
            })}
          />
          <FormInput
            verticalLabel
            name="account"
            label={t('financial.paymentOrders.account')}
            placeholder={t('common.pleaseInput', {
              field: t('financial.paymentOrders.account'),
            })}
          />
          <FormSelect
            verticalLabel
            name="channelId"
            label={t('financial.paymentOrders.channelId')}
            placeholder={t('common.pleaseSelect')}
            options={channelList.map(item => ({ label: item.channelName, value: item.id }))}
          />
          <FormSelect
            verticalLabel
            name="orderStatus"
            label={t('financial.paymentOrders.orderStatus')}
            placeholder={t('common.pleaseSelect')}
            options={OrderStatusOptions}
          />
          <FormInput
            verticalLabel
            name="orderId"
            label={t('financial.paymentOrders.orderId')}
            placeholder={t('common.pleaseInput', {
              field: t('financial.paymentOrders.orderId'),
            })}
          />
          <FormField
            name="accounts"
            render={({ field }) => {
              return <RrhSelectAccountsPopup verticalLabel field={field} />;
            }}
          />
          <FormField
            name="operationTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12 text-[#757F8D]">
                  {t('financial.paymentOrders.orderTime')}
                </FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="operationTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
