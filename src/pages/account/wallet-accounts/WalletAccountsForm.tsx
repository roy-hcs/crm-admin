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
import dayjs from 'dayjs';
import { FormSelect } from '@/components/form/FormSelect';
import { WalletAccountsListParams } from '@/api/hooks/account/types';

type FormData = {
  threeCons: string;
  currency: string;
  time: { from: string; to: string };
};

export const WalletAccountsForm = ({
  setOtherParams,
  setParams,
  walletData,
  loading,
}: {
  setParams: Dispatch<SetStateAction<WalletAccountsListParams['params']>>;
  setOtherParams: Dispatch<
    SetStateAction<
      Omit<WalletAccountsListParams, 'params' | 'pageSize' | 'pageNum' | 'orderByColumn' | 'isAsc'>
    >
  >;
  walletData: Array<{ id: string; currencyAbbr: string }>;
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      threeCons: '',
      currency: '',
      time: { from: '', to: '' },
    },
  });

  const onSubmit = (data: FormData) => {
    setOtherParams({
      currency: data.currency,
    });
    setParams(pre => ({
      ...pre,
      regStartTime: data.time.from ? dayjs(data.time.from).format('YYYY-MM-DD') : '',
      regEndTime: data.time.to ? dayjs(data.time.to).format('YYYY-MM-DD') : '',
      threeCons: data.threeCons,
    }));
  };
  const onReset = () => {
    setOtherParams({
      currency: '',
    });
    setParams(pre => ({
      ...pre,
      threeCons: '',
      regStartTime: '',
      regEndTime: '',
    }));
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
            name="threeCons"
            label={t('table.nameOrId')}
            placeholder={t('common.pleaseInput', { field: t('table.nameOrId') })}
          />
          <FormSelect
            verticalLabel
            name="currency"
            label={t('table.currency')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={walletData.map(i => {
              return { label: i.currencyAbbr, value: i.id };
            })}
          />

          <FormField
            name="time"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('common.createTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="time" control={form.control} />
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
