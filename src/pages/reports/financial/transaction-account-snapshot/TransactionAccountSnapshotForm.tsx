import { Dispatch, SetStateAction } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/lib/utils';
import { TradingAccountSnapshotParams } from '@/api/hooks/report';
import { BasicParams, SelectOption } from '@/api/types';
import { RrhForm } from '@/components/form/RrhForm';

type FormData = {
  snapshotId: string;
  server: string;
  account: string;
  currency: string;
  triggeringEvent: string;
  createTime: { from: string; to: string };
};

export const TransactionAccountSnapshotForm = ({
  setParams,
  setCommonParams,
  reset,
  params,
  commonParams,
  serverOptions,
  triggeringEventOptions,
}: {
  setParams: Dispatch<SetStateAction<TradingAccountSnapshotParams['params']>>;
  setCommonParams: Dispatch<
    SetStateAction<Omit<TradingAccountSnapshotParams, 'params' | keyof BasicParams>>
  >;
  reset: () => void;
  params: TradingAccountSnapshotParams['params'];
  commonParams: Omit<TradingAccountSnapshotParams, 'params' | keyof BasicParams>;
  serverOptions: SelectOption[];
  triggeringEventOptions: SelectOption[];
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      snapshotId: commonParams.snapshotId || '',
      server: commonParams.server || '',
      account: commonParams.account || '',
      currency: commonParams.currency || '',
      triggeringEvent: commonParams.triggeringEvent || '',
      createTime: { from: params.createTimeStart || '', to: params.createTimeEnd || '' },
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setParams({
      createTimeStart: formatDate(data.createTime.from),
      createTimeEnd: formatDate(data.createTime.to),
    });
    setCommonParams({
      snapshotId: data.snapshotId,
      server: data.server,
      account: data.account,
      currency: data.currency,
      triggeringEvent: data.triggeringEvent,
    });
  };
  const onReset = () => {
    reset();
    form.reset();
  };

  return (
    <RrhForm
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
      onReset={onReset}
      className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20 md:px-12 md:pt-12"
    >
      <FormSelect
        name="server"
        label={t('transactionAccountSnapshotPage.serverName')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={serverOptions}
      />
      <FormInput
        name="account"
        label={t('transactionAccountSnapshotPage.account')}
        placeholder={t('common.pleaseInput', {
          field: t('transactionAccountSnapshotPage.account'),
        })}
      />
      <FormSelect
        name="triggeringEvent"
        label={t('transactionAccountSnapshotPage.event')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={triggeringEventOptions}
      />

      <FormField
        name="createTime"
        render={() => (
          <FormItem className="flex flex-col gap-2 text-sm">
            <FormLabel className="basis-3/12">
              {t('transactionAccountSnapshotPage.snapshotTime')}
            </FormLabel>
            <FormControl className="basis-9/12">
              <FormDateRangeInput name="createTime" control={form.control} />
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
    </RrhForm>
  );
};
