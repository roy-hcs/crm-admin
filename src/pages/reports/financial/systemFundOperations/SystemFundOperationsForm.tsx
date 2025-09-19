import { SystemFundOperationRecordListParams } from '@/api/hooks/report/types';
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

type FormData = {
  way: number | string;
  name: string;
  login: string;
  tradingAccount: string;
  serverOrder: string;
  operationTime: { from: string; to: string };
  operator: string;
};

export const SystemFundOperationsForm = ({
  setOtherParams,
  setParams,
}: {
  setParams: (params: SystemFundOperationRecordListParams['params']) => void;
  setOtherParams: (params: { type?: number | string }) => void;
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      way: '',
      name: '',
      login: '',
      tradingAccount: '',
      serverOrder: '',
      operationTime: { from: '', to: '' },
      operator: '',
    },
  });

  const onSubmit = (data: FormData) => {
    setOtherParams({
      type: data.way,
    });
    setParams({
      name: data.name,
      login: data.login,
      ticket: data.serverOrder,
      operationStart: data.operationTime.from,
      operationEnd: data.operationTime.to,
      operName: data.operator,
    });
  };
  const onReset = () => {
    setOtherParams({
      type: '',
    });
    setParams({
      name: '',
      login: '',
      ticket: '',
      operationStart: '',
      operationEnd: '',
      operName: '',
    });
    form.reset();
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
            name="name"
            label={t('table.nameOrId')}
            placeholder={t('common.pleaseInput', { field: t('table.nameOrId') })}
          />
          <FormSelect
            verticalLabel
            name="way"
            label={t('table.depositWay')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={[
              { label: t('table.Deposit'), value: 1 },
              { label: t('table.Withdrawal'), value: 2 },
              { label: t('table.SystemDeposit'), value: 3 },
              { label: t('table.SystemWithdrawal'), value: 4 },
              { label: t('table.SystemCreditDeposit'), value: 5 },
              { label: t('table.SystemCreditWithdrawal'), value: 6 },
              { label: t('table.RebateDeposit'), value: 7 },
              { label: t('table.InternalTransferIn'), value: 8 },
              { label: t('table.InternalTransferOut'), value: 9 },
              { label: t('table.DemoAccountDeposit'), value: 10 },
              { label: t('table.DemoAccountWithdrawal'), value: 11 },
              { label: t('table.Charge'), value: 12 },
            ]}
          />
          <FormInput
            verticalLabel
            name="tradingAccount"
            label={t('table.tradingAccount')}
            placeholder={t('common.pleaseInput', { field: t('table.tradingAccount') })}
          />
          <FormInput
            verticalLabel
            name="serverOrder"
            label={t('table.tradingServerOrderNumber')}
            placeholder={t('common.pleaseInput', { field: t('table.tradingServerOrderNumber') })}
          />

          <FormField
            name="operationTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12 text-[#757F8D]">{t('table.time')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="operationTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormInput
            verticalLabel
            name="operator"
            label={t('table.operationPerson')}
            placeholder={t('common.pleaseInput', { field: t('table.operationPerson') })}
          />

          <div className="flex justify-end gap-4">
            <RrhButton type="reset" variant="outline" onClick={onReset}>
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
