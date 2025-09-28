import { RrhButton } from '@/components/common/RrhButton';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from '@/components/ui/form';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FormProvider } from '@/contexts/form';
import { useForm } from 'react-hook-form';
import { DepositListParams, ThirdPaymentItem } from '@/api/hooks/review/types';
import { Dispatch, SetStateAction } from 'react';
import { RrhSelectAccountsPopup } from '@/components/common/RrhSelectAccountPopup';
import { CurrencyItem } from '@/api/hooks/system/types';

type FormData = {
  name: string;
  depositMethods: string;
  tradeAccount: string;
  orderNumber: string;
  verifyStatus: string | number;
  submitTime: { from: string; to: string };
  verifyUserName: string;
  inAccountType: string;
  accounts: string;
  currency: string;
  tradeServerOrderNumber: string;
  payOrderNum: string;
  channel: string;
};

export const ReviewDepositForm = ({
  setOtherParams,
  setParams,
  loading,
  currencyList,
  thirdPaymentList,
}: {
  setParams: Dispatch<SetStateAction<DepositListParams['params']>>;
  setOtherParams: Dispatch<SetStateAction<Omit<DepositListParams, 'params'>>>;
  currencyList: CurrencyItem[];
  thirdPaymentList: ThirdPaymentItem[];
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      depositMethods: '',
      tradeAccount: '',
      orderNumber: '',
      verifyStatus: '',
      submitTime: { from: '', to: '' },
      verifyUserName: '',
      inAccountType: '',
      tradeServerOrderNumber: '',
      currency: '',
      accounts: '',
      payOrderNum: '',
      channel: '',
    },
  });

  const onSubmit = (data: FormData) => {
    const selectedAccounts = JSON.parse(data.accounts || '{"id": "", "label": ""}') as {
      id: string;
      label: string;
    };
    setOtherParams({
      userId: data.name,
      status: data.verifyStatus,
      verifyUserName: data.verifyUserName,
      dealTicket: data.tradeServerOrderNumber,
      method: data.depositMethods,
      login: data.tradeAccount,
      orderNum: data.orderNumber,
      orderId: data.payOrderNum,
      channelId: data.channel,
      depositCurrency: data.currency,
      accounts: selectedAccounts.id,
    });
    setParams({
      beginTime: data.submitTime.from,
      endTime: data.submitTime.to,
      inMoneyAccount: data.inAccountType,
      accounts: selectedAccounts.label,
    });
  };
  const depositMethod = form.watch('depositMethods');
  const onReset = () => {
    setOtherParams({
      userId: '',
      status: '',
      verifyUserName: '',
      dealTicket: '',
      method: '',
      login: '',
      orderNum: '',
      orderId: '',
      channelId: '',
      depositCurrency: '',
      accounts: '',
    });
    setParams({
      beginTime: '',
      endTime: '',
      inMoneyAccount: '',
      accounts: '',
    });
    form.reset();
  };
  return (
    <FormProvider form={form}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              if (e.target instanceof HTMLTextAreaElement) return;

              e.preventDefault();
              form.handleSubmit(onSubmit)();
            }
          }}
          className="flex flex-col gap-4 overflow-auto p-4"
        >
          <FormInput
            verticalLabel
            name="name"
            label={t('table.nameOrLastNameOrId')}
            placeholder={t('common.pleaseInput', { field: t('table.nameOrLastNameOrId') })}
          />
          <FormSelect
            verticalLabel
            name="depositMethods"
            label={t('table.depositMethods')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={[
              { label: t('table.internationalTransfer'), value: '1' },
              { label: t('table.bankTransfer'), value: '2' },
              { label: t('table.thirdPayment'), value: '5' },
              { label: t('table.cryptocurrency'), value: '6' },
              { label: t('table.quickPayment'), value: '7' },
              { label: t('table.payID'), value: '13' },
            ]}
          />
          <FormInput
            verticalLabel
            name="tradeAccount"
            label={t('table.tradeAccount')}
            placeholder={t('common.pleaseInput', { field: t('table.tradeAccount') })}
          />
          <FormInput
            verticalLabel
            name="orderNumber"
            label={t('table.orderNumber')}
            placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
          />
          <FormSelect
            verticalLabel
            name="verifyStatus"
            label={t('table.status')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={[
              { label: t('table.pending'), value: '2' },
              { label: t('table.reviewing'), value: '-1' },
              { label: t('table.pass'), value: '1' },
              { label: t('table.refuse'), value: '0' },
            ]}
          />
          <FormField
            name="submitTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12 text-[#757F8D]">{t('table.submitTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="submitTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormInput
            verticalLabel
            name="verifyUserName"
            label={t('table.currentAuditor')}
            placeholder={t('common.pleaseInput', { field: t('table.currentAuditor') })}
          />

          <FormSelect
            verticalLabel
            name="inAccountType"
            label={t('table.depositAccount')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={[
              { label: t('table.tradeAccount'), value: '1' },
              { label: t('table.wallet'), value: '2' },
            ]}
          />

          <FormField
            name="accounts"
            render={({ field }) => {
              return <RrhSelectAccountsPopup verticalLabel field={field} />;
            }}
          />
          {depositMethod === '5' && (
            <FormSelect
              verticalLabel
              name="channel"
              label={t('table.paymentChannel')}
              placeholder={t('common.pleaseSelect')}
              showRowValue={false}
              options={thirdPaymentList.map(item => ({
                label: item.channelName,
                value: item.id,
              }))}
            />
          )}
          <FormSelect
            verticalLabel
            name="currency"
            label={t('table.paymentCurrency')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={currencyList.map(currency => ({
              label: currency.currencyAbbr,
              value: currency.currencyAbbr,
            }))}
          />

          <FormInput
            verticalLabel
            name="tradeServerOrderNumber"
            label={t('table.tradeServerOrderNumber')}
            placeholder={t('common.pleaseInput', { field: t('table.tradeServerOrderNumber') })}
          />
          <FormInput
            verticalLabel
            name="payOrderNum"
            label={t('table.paymentOrderNumber')}
            placeholder={t('common.pleaseInput', { field: t('table.paymentOrderNumber') })}
          />

          <div className="flex justify-end gap-4">
            <RrhButton type="reset" variant="outline" onClick={onReset}>
              <RefreshCcw className="size-3.5" />
              <span>{t('common.Reset')}</span>
            </RrhButton>
            <RrhButton type="submit" loading={loading}>
              <Search className="size-3.5" />
              <span>{t('common.Search')}</span>
            </RrhButton>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};
