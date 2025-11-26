import { RrhButton } from '@/components/common/RrhButton';
import { FormInput } from '@/components/form/FormInput';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FormProvider } from '@/contexts/form';
import { useForm } from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';
import { PointsBalanceParams } from '@/api/hooks/pointsMall';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { formatDate } from '@/lib/utils';

type FormData = {
  fuzzyName: string;
  email: string;
  time: { from: string; to: string };
};

export const PointsBalanceForm = ({
  setParams,
  loading,
}: {
  setParams: Dispatch<SetStateAction<PointsBalanceParams['params']>>;
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      fuzzyName: '',
      email: '',
      time: { from: '', to: '' },
    },
  });
  const onSubmit = (data: FormData) => {
    setParams(pre => ({
      ...pre,
      fuzzyName: data.fuzzyName,
      email: data.email,
      timeStart: formatDate(data.time.from),
      timeEnd: formatDate(data.time.to),
    }));
  };
  const onReset = () => {
    setParams(pre => ({
      ...pre,
      fuzzyName: '',
      email: '',
      timeStart: '',
      timeEnd: '',
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
            name="fuzzyName"
            label={t('table.nameOrId')}
            placeholder={t('common.pleaseInput', {
              field: t('table.nameOrId'),
            })}
          />
          <FormInput
            verticalLabel
            name="email"
            label={t('table.email')}
            placeholder={t('common.pleaseInput', {
              field: t('table.email'),
            })}
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
          <div>{t('pointspBalance.timeFilterTipOne')}</div>
          <div>{t('pointspBalance.timeFilterTipTwo')}</div>
        </div>
      </Form>
    </FormProvider>
  );
};
