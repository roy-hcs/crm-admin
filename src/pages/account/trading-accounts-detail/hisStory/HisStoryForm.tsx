import { RrhButton } from '@/components/common/RrhButton';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { FormInput } from '@/components/form/FormInput';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useForm } from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';
import { formatDate } from '@/lib/utils';
import { BasicParams } from '@/api/types';
import { CrmDealAccountFundHistoryParams } from '@/api/hooks/account';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhForm } from '@/components/form/RrhForm';

type FormData = {
  ticket: string;
  type: string;
  symbol: string;
  positionID: string;
  entry: string;
  time: { from: string; to: string };
};

export const HisStoryForm = ({
  setOtherParams,
  setParams,
  loading,
  reset,
  typeOptions,
  entryOptions,
  params,
  otherParams,
}: {
  setParams: Dispatch<SetStateAction<CrmDealAccountFundHistoryParams['params']>>;
  setOtherParams: Dispatch<
    SetStateAction<Omit<CrmDealAccountFundHistoryParams, 'params' | keyof BasicParams>>
  >;
  loading: boolean;
  reset: () => void;
  typeOptions: Array<{ label: string; value: string }>;
  entryOptions: Array<{ label: string; value: string }>;
  params: CrmDealAccountFundHistoryParams['params'];
  otherParams: Omit<CrmDealAccountFundHistoryParams, 'params' | keyof BasicParams>;
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      ticket: otherParams.ticket || '',
      type: otherParams.type || '',
      symbol: otherParams.symbol || '',
      positionID: otherParams.positionID || '',
      entry: otherParams.entry || '',
      time: { from: params.historyDealBJStartTime || '', to: params.historyDealBJEndTime || '' },
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setOtherParams({
      ticket: data.ticket,
      type: data.type,
      symbol: data.symbol,
      positionID: data.positionID,
      entry: data.entry,
    });
    setParams(pre => ({
      ...pre,
      historyDealBJStartTime: formatDate(data.time.from),
      historyDealBJEndTime: formatDate(data.time.to),
    }));
  };
  const onReset = () => {
    reset();
    form.reset({
      ticket: '',
      type: '',
      symbol: '',
      positionID: '',
      entry: '',
      time: { from: '', to: '' },
    });
  };

  return (
    <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)}
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
            verticalLabel
            name="ticket"
            label={t('table.orderNumber')}
            placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
          />
          <FormSelect
            verticalLabel
            name="type"
            label={t('table.transactionType')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={typeOptions}
          />
          <FormField
            name="time"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('table.tradingTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="time" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormInput
            verticalLabel
            name="symbol"
            label={t('table.symbol')}
            placeholder={t('common.pleaseInput', { field: t('table.symbol') })}
          />
          <FormSelect
            verticalLabel
            name="entry"
            label={t('table.entry')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={entryOptions}
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
