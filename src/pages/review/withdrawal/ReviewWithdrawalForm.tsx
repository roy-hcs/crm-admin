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
import { WithdrawListParams } from '@/api/hooks/review/types';
import { Dispatch, SetStateAction } from 'react';
import { RrhSelectAccountsPopup } from '@/components/common/RrhSelectAccountPopup';

type FormData = {
  name: string;
  withdrawWay: string;
  tradeAccount: string;
  orderNumber: string;
  verifyStatus: string | number;
  submitTime: { from: string; to: string };
  verifyUserName: string;
  status: string | number;
  tradeServerOrderNumber: string;
  outAccountType: string;
  accounts: string;
  finishTime: { from: string; to: string };
};

export const ReviewWithdrawalForm = ({
  setOtherParams,
  setParams,
  loading,
}: {
  setParams: Dispatch<SetStateAction<WithdrawListParams['params']>>;
  setOtherParams: Dispatch<SetStateAction<Omit<WithdrawListParams, 'params'>>>;
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      withdrawWay: '',
      tradeAccount: '',
      orderNumber: '',
      verifyStatus: '',
      submitTime: { from: '', to: '' },
      verifyUserName: '',
      status: '',
      tradeServerOrderNumber: '',
      outAccountType: '',
      accounts: '',
      finishTime: { from: '', to: '' },
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
      method: data.withdrawWay,
      login: data.tradeAccount,
      orderNum: data.orderNumber,
      exceptionFlag: data.status,
      accounts: selectedAccounts.id,
    });
    setParams({
      beginTime: data.submitTime.from,
      endTime: data.submitTime.to,
      outMoneyAccount: data.outAccountType,
      accounts: selectedAccounts.label,
      finishBeginTime: data.finishTime.from,
      finishEndTime: data.finishTime.to,
    });
  };
  const onReset = () => {
    setOtherParams({
      userId: '',
      status: '',
      verifyUserName: '',
      dealTicket: '',
      method: '',
      login: '',
      orderNum: '',
      exceptionFlag: '',
      accounts: '',
    });
    setParams({
      beginTime: '',
      endTime: '',
      outMoneyAccount: '',
      accounts: '',
      finishBeginTime: '',
      finishEndTime: '',
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
            name="withdrawMethods"
            label={t('table.withdrawMethods')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={[
              { label: t('table.internationalTransfer'), value: '1' },
              { label: t('table.bankTransfer'), value: '2' },
              { label: t('table.quickPayment'), value: '4' },
              { label: t('table.cryptocurrency'), value: '6' },
              { label: 'payID', value: '13' },
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
            label={t('table.reviewStatus')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={[
              { label: t('table.pending'), value: '2' },
              { label: t('table.reviewing'), value: '-1' },
              { label: t('table.pass'), value: '1' },
              { label: t('table.refuse'), value: '0' },
              { label: t('common.Cancel'), value: '-2' },
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
            name="outAccountType"
            label={t('table.status')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={[
              { label: t('common.normal'), value: '0' },
              { label: t('common.abnormal'), value: '1' },
            ]}
          />

          <FormInput
            verticalLabel
            name="tradeServerOrderNumber"
            label={t('table.tradeServerOrderNumber')}
            placeholder={t('common.pleaseInput', { field: t('table.tradeServerOrderNumber') })}
          />
          <FormSelect
            verticalLabel
            name="outAccountType"
            label={t('table.withdrawAccount')}
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
          <FormField
            name="finishTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12 text-[#757F8D]">{t('table.submitTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="finishTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
