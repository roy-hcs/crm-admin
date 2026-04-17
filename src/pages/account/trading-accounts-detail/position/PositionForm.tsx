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
import { CrmDealAccountPositionOrderParams } from '@/api/hooks/account';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhForm } from '@/components/form/RrhForm';

type FormData = {
  type: string;
  positionFuzzyTicket: string;
  positionFuzzySymbol: string;
  time: { from: string; to: string };
};

export const PositionForm = ({
  setOtherParams,
  setParams,
  loading,
  reset,
  typeOptions,
  params,
  otherParams,
}: {
  setParams: Dispatch<SetStateAction<CrmDealAccountPositionOrderParams['params']>>;
  setOtherParams: Dispatch<
    SetStateAction<Omit<CrmDealAccountPositionOrderParams, 'params' | keyof BasicParams>>
  >;
  loading: boolean;
  reset: () => void;
  typeOptions: Array<{ label: string; value: string }>;
  entryOptions: Array<{ label: string; value: string }>;
  params: CrmDealAccountPositionOrderParams['params'];
  otherParams: Omit<CrmDealAccountPositionOrderParams, 'params' | keyof BasicParams>;
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      type: otherParams.type || '',
      positionFuzzyTicket: params.positionFuzzyTicket || '',
      positionFuzzySymbol: params.positionFuzzySymbol || '',
      time: {
        from: params?.positionDealBJStartTime ?? '',
        to: params?.positionDealBJEndTime || '',
      },
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setOtherParams({
      type: data.type,
    });
    setParams(pre => ({
      ...pre,
      historyDealBJStartTime: formatDate(data.time.from),
      historyDealBJEndTime: formatDate(data.time.to),
      positionFuzzyTicket: data.positionFuzzyTicket,
      positionFuzzySymbol: data.positionFuzzySymbol,
    }));
  };
  const onReset = () => {
    reset();
    form.reset({
      type: '',
      positionFuzzyTicket: '',
      positionFuzzySymbol: '',
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
            name="positionFuzzyTicket"
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
          <FormInput
            verticalLabel
            name="positionFuzzySymbol"
            label={t('table.symbol')}
            placeholder={t('common.pleaseInput', { field: t('table.symbol') })}
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
