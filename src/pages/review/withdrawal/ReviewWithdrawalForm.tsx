import { RrhButton } from '@/components/common/RrhButton';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useForm } from 'react-hook-form';
import { WithdrawListParams } from '@/api/hooks/review';
import { Dispatch, SetStateAction } from 'react';
import { formatDate } from '@/lib/utils';
import { SelectUpperDropdown } from '@/components/common/SelectUpperDropdown';
import { RrhForm } from '@/components/form/RrhForm';

type FormData = {
  name: string;
  withdrawWay: string;
  tradeAccount: string;
  orderNumber: string;
  verifyStatus: string | number;
  submitTime: { from: string; to: string };
  verifyUserName: string;
  status: string;
  tradeServerOrderNumber: string;
  outAccountType: string;
  accounts: string;
  finishTime: { from: string; to: string };
};

export const ReviewWithdrawalForm = ({
  setOtherParams,
  setParams,
  loading,
  withdrawMethodList,
  reset,
  params,
  otherParams,
}: {
  setParams: Dispatch<SetStateAction<WithdrawListParams['params']>>;
  setOtherParams: Dispatch<SetStateAction<Omit<WithdrawListParams, 'params'>>>;
  loading: boolean;
  withdrawMethodList: { id: string; name: string }[];
  reset: () => void;
  params: WithdrawListParams['params'];
  otherParams: Omit<WithdrawListParams, 'params'>;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      name: otherParams.userId || '',
      withdrawWay: otherParams.method || '',
      tradeAccount: otherParams.login || '',
      orderNumber: otherParams.orderNum || '',
      verifyStatus: otherParams.status || '',
      submitTime: { from: params.beginTime || '', to: params.endTime || '' },
      verifyUserName: otherParams.verifyUserName || '',
      status: otherParams.exceptionFlag || '',
      tradeServerOrderNumber: otherParams.dealTicket || '',
      outAccountType: params.outMoneyAccount || '',
      accounts: params.accounts || '',
      finishTime: { from: params.finishBeginTime || '', to: params.finishEndTime || '' },
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
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
      beginTime: formatDate(data.submitTime.from),
      endTime: formatDate(data.submitTime.to),
      outMoneyAccount: data.outAccountType,
      accounts: selectedAccounts.label,
      finishBeginTime: formatDate(data.finishTime.from),
      finishEndTime: formatDate(data.finishTime.to),
    });
  };
  const onReset = () => {
    reset();
    form.reset({
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
    });
  };
  return (
    <RrhForm
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
      onReset={onReset}
      onKeyDown={e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          if (e.target instanceof HTMLTextAreaElement) return;

          e.preventDefault();
          form.handleSubmit(onSubmit)();
        }
      }}
      className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20 md:px-12 md:pt-12"
    >
      <FormInput
        name="name"
        label={t('table.nameOrLastNameOrId')}
        placeholder={t('common.pleaseInput', { field: t('table.nameOrLastNameOrId') })}
      />
      <FormSelect
        name="withdrawWay"
        label={t('table.withdrawMethods')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={withdrawMethodList.map(item => ({
          label: item.name,
          value: item.id,
        }))}
      />
      <FormInput
        name="tradeAccount"
        label={t('table.tradingAccount')}
        placeholder={t('common.pleaseInput', { field: t('table.tradingAccount') })}
      />
      <FormInput
        name="orderNumber"
        label={t('table.orderNumber')}
        placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
      />
      <FormSelect
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
            <FormLabel className="text-foreground basis-3/12">{t('table.submitTime')}</FormLabel>
            <FormControl className="basis-9/12">
              <FormDateRangeInput name="submitTime" control={form.control} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormInput
        name="verifyUserName"
        label={t('table.currentAuditor')}
        placeholder={t('common.pleaseInput', { field: t('table.currentAuditor') })}
      />
      <FormSelect
        name="status"
        label={t('table.status')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={[
          { label: t('common.normal'), value: '0' },
          { label: t('common.abnormal'), value: '1' },
        ]}
      />

      <FormInput
        name="tradeServerOrderNumber"
        label={t('table.tradeServerOrderNumber')}
        placeholder={t('common.pleaseInput', { field: t('table.tradeServerOrderNumber') })}
      />
      <FormSelect
        name="outAccountType"
        label={t('table.withdrawAccount')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={[
          { label: t('table.tradingAccount'), value: '1' },
          { label: t('table.wallet'), value: '2' },
        ]}
      />
      <SelectUpperDropdown />
      <FormField
        name="finishTime"
        render={() => (
          <FormItem className="flex flex-col gap-2 text-sm">
            <FormLabel className="text-foreground basis-3/12">{t('table.submitTime')}</FormLabel>
            <FormControl className="basis-9/12">
              <FormDateRangeInput name="finishTime" control={form.control} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
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
