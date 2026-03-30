import { RrhButton } from '@/components/common/RrhButton';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { FormInput } from '@/components/form/FormInput';
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
import { Dispatch, SetStateAction } from 'react';
import { formatDate } from '@/lib/utils';
import { CrmDealAccountLimitOrderParams } from '@/api/hooks/account';
import { FormSelect } from '@/components/form/FormSelect';

type FormData = {
  positionFuzzyTicket: string;
  positionFuzzyType: string;
  positionFuzzySymbol: string;
  time: { from: string; to: string };
};

export const LimitForm = ({
  setParams,
  loading,
  reset,
  typeOptions,
  params,
}: {
  setParams: Dispatch<SetStateAction<CrmDealAccountLimitOrderParams['params']>>;
  loading: boolean;
  reset: () => void;
  typeOptions: Array<{ label: string; value: string }>;
  params: CrmDealAccountLimitOrderParams['params'];
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      positionFuzzyTicket: params?.positionFuzzyTicket || '',
      positionFuzzyType: params?.positionFuzzyType || '',
      positionFuzzySymbol: params?.positionFuzzySymbol || '',
      time: {
        from: params?.positionDealBJStartTime || '',
        to: params?.positionDealBJEndTime || '',
      },
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setParams(pre => ({
      ...pre,
      positionDealBJStartTime: formatDate(data.time.from),
      positionDealBJEndTime: formatDate(data.time.to),
      positionFuzzyTicket: data?.positionFuzzyTicket || '',
      positionFuzzyType: data?.positionFuzzyType || '',
      positionFuzzySymbol: data?.positionFuzzySymbol || '',
    }));
  };
  const onReset = () => {
    reset();
    form.reset({
      positionFuzzyTicket: '',
      positionFuzzyType: '',
      positionFuzzySymbol: '',
      time: {
        from: '',
        to: '',
      },
    });
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
            name="positionFuzzyType"
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
                <FormLabel className="basis-3/12">{t('table.orderPlacementTime')}</FormLabel>
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
        </form>
      </Form>
    </FormProvider>
  );
};
