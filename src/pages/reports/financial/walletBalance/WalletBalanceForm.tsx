import { WalletBalanceParams } from '@/api/hooks/report/types';
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
}: {
  setParams: Dispatch<SetStateAction<WalletBalanceParams['params']>>;
  setOtherParams: Dispatch<SetStateAction<{ accounts: string }>>;
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      accounts: '',
      time: { from: '', to: '' },
    },
  });

  const onSubmit = (data: FormData) => {
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
      timeStart: data.time.from,
      timeEnd: data.time.to,
      accounts: selectedAccounts.label,
    }));
  };
  const onReset = () => {
    setOtherParams({
      accounts: '',
    });
    setParams(pre => ({
      ...pre,
      fuzzyName: '',
      email: '',
      timeStart: '',
      timeEnd: '',
      accounts: '',
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
                <FormLabel className="basis-3/12 text-[#757F8D]">{t('table.time')}</FormLabel>
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
        <div className="mt-3.5 px-4">
          <div>{t('walletBalancePage.timeFilter')}:</div>
          <div>{t('walletBalancePage.timeFilterTipOne')}</div>
          <div>{t('walletBalancePage.timeFilterTipTwo')}</div>
        </div>
      </Form>
    </FormProvider>
  );
};
