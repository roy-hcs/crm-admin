import { WalletBalanceParams } from '@/api/hooks/report';
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
import { RrhSelectAccountsPopup } from '@/components/common/RrhSelectAccountPopup';
import { Dispatch, SetStateAction } from 'react';
import { formatDate } from '@/lib/utils';
import { BasicParams } from '@/api/types';

type FormData = {
  name: string;
  email: string;
  time: { from: string; to: string };
  accounts: string;
};

export const WalletBalanceForm = ({
  setOtherParams,
  setParams,
  loading,
  reset,
  params,
  otherParams,
}: {
  setParams: Dispatch<SetStateAction<WalletBalanceParams['params']>>;
  setOtherParams: Dispatch<SetStateAction<{ accounts: string }>>;
  loading: boolean;
  reset: () => void;
  params: WalletBalanceParams['params'];
  otherParams: Omit<WalletBalanceParams, 'params' | keyof BasicParams>;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      name: params.fuzzyName || '',
      email: params.email || '',
      accounts: otherParams.accounts || '',
      time: { from: params.timeStart || '', to: params.timeEnd || '' },
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    const selectedAccounts = JSON.parse(data.accounts || '{"id": "", "label": ""}') as {
      id: string;
      label: string;
    };
    setOtherParams({
      accounts: selectedAccounts.id,
    });
    setParams(pre => ({
      ...pre,
      fuzzyName: data.name,
      email: data.email,
      timeStart: formatDate(data.time.from),
      timeEnd: formatDate(data.time.to),
      accounts: selectedAccounts.label,
    }));
  };
  const onReset = () => {
    reset();
    form.reset({
      name: '',
      email: '',
      accounts: '',
      time: { from: '', to: '' },
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
            name="name"
            label={t('table.nameOrId')}
            placeholder={t('common.pleaseInput', { field: t('table.nameOrId') })}
          />
          <FormInput
            verticalLabel
            name="email"
            label={t('table.email')}
            placeholder={t('common.pleaseInput', { field: t('table.email') })}
          />

          <FormField
            name="time"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('table.time')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="time" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="accounts"
            render={({ field }) => {
              return <RrhSelectAccountsPopup verticalLabel field={field} />;
            }}
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
        <div className="mt-3.5 px-4">
          <div>{t('walletBalancePage.timeFilter')}:</div>
          <div>{t('walletBalancePage.timeFilterTipOne')}</div>
          <div>{t('walletBalancePage.timeFilterTipTwo')}</div>
        </div>
      </Form>
    </FormProvider>
  );
};
