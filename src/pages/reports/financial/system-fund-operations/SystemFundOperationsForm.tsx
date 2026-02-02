import { SystemFundOperationRecordListParams } from '@/api/hooks/report';
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
import { formatDate } from '@/lib/utils';
import { BasicParams } from '@/api/types';

type FormData = {
  way: number | string;
  name: string;
  login: string;
  serverOrder: string;
  operationTime: { from: string; to: string };
  operator: string;
};

export const SystemFundOperationsForm = ({
  setOtherParams,
  setParams,
  loading,
  reset,
  params,
  otherParams,
}: {
  setParams: (params: SystemFundOperationRecordListParams['params']) => void;
  setOtherParams: (params: { type?: number | string }) => void;
  loading: boolean;
  reset: () => void;
  params: SystemFundOperationRecordListParams['params'];
  otherParams: Omit<SystemFundOperationRecordListParams, 'params' | keyof BasicParams>;
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      way: otherParams.type || '',
      name: params.name || '',
      login: params.login || '',
      serverOrder: params.ticket || '',
      operationTime: { from: params.operationStart || '', to: params.operationEnd || '' },
      operator: params.operName || '',
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setOtherParams({
      type: data.way,
    });
    setParams({
      name: data.name,
      login: data.login,
      ticket: data.serverOrder,
      operationStart: formatDate(data.operationTime.from),
      operationEnd: formatDate(data.operationTime.to),
      operName: data.operator,
    });
  };
  const onReset = () => {
    reset();
    form.reset({
      way: '',
      name: '',
      login: '',
      serverOrder: '',
      operationTime: { from: '', to: '' },
      operator: '',
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
            name="login"
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
                <FormLabel className="basis-3/12">{t('table.time')}</FormLabel>
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
        </form>
      </Form>
    </FormProvider>
  );
};
