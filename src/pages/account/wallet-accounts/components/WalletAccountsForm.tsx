import { RrhButton } from '@/components/common/RrhButton';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { FormInput } from '@/components/form/FormInput';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useForm } from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';
import { FormSelect } from '@/components/form/FormSelect';
import { WalletAccountsListParams } from '@/api/hooks/account/types';
import { formatDate } from '@/lib/utils';
import { BasicParams } from '@/api/types';
import { RrhForm } from '@/components/form/RrhForm';

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
  reset,
  params,
  otherParams,
}: {
  setParams: Dispatch<SetStateAction<WalletAccountsListParams['params']>>;
  setOtherParams: Dispatch<
    SetStateAction<Omit<WalletAccountsListParams, 'params' | keyof BasicParams>>
  >;
  walletData: Array<{ id: string; currencyAbbr: string }>;
  loading: boolean;
  reset: () => void;
  params: WalletAccountsListParams['params'];
  otherParams: Omit<WalletAccountsListParams, 'params' | keyof BasicParams>;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      threeCons: params.threeCons || '',
      currency: otherParams.currency || '',
      time: { from: params.regStartTime || '', to: params.regEndTime || '' },
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setOtherParams({
      currency: data.currency,
    });
    setParams(pre => ({
      ...pre,
      regStartTime: formatDate(data.time.from),
      regEndTime: formatDate(data.time.to),
      threeCons: data.threeCons,
    }));
  };
  const onReset = () => {
    reset();
    form.reset({
      threeCons: '',
      currency: '',
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
