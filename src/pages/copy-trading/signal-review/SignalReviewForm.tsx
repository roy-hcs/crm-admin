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
import { Dispatch, SetStateAction, useMemo } from 'react';
import { FormSelect } from '@/components/form/FormSelect';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { BasicParams } from '@/api/types';
import { SignalReviewverifyStatusOptions } from '@/lib/const';
import { useServerList } from '@/api/hooks/system';
import { MamSignalSourceListParams } from '@/api/hooks/copyTrading/type';
import { RrhServerSelector } from '@/components/common/RrhServerSelector';
import { formatDate } from '@/lib/utils';

type FormData = {
  Time: { from: string; to: string };
  reviewTime: { from: string; to: string };
  name: string;
  userName: string;
  serverId: string;
  account: string;
  verifyStatus: string;
};

export const SignalReviewForm = ({
  setParams,
  setOtherParams,
  loading,
}: {
  setParams: Dispatch<SetStateAction<MamSignalSourceListParams['params']>>;
  setOtherParams: Dispatch<
    SetStateAction<Omit<MamSignalSourceListParams, 'params' | keyof BasicParams>>
  >;
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const { data: server } = useServerList();
  const form = useForm({
    defaultValues: {
      Time: { from: '', to: '' },
      name: '',
      userName: '',
      serverId: '',
      account: '',
      verifyStatus: '',
      reviewTime: { from: '', to: '' },
    },
  });
  const onSubmit = (data: FormData) => {
    setParams(pre => ({
      ...pre,
      beginTime: formatDate(data.Time.from),
      endTime: formatDate(data.Time.to),
      beginReviewTime: formatDate(data.reviewTime.from),
      endReviewTime: formatDate(data.reviewTime.to),
    }));
    setOtherParams(pre => ({
      ...pre,
      name: data.name,
      userName: data.userName,
      serverId: data.serverId,
      account: data.account,
      verifyStatus: data.verifyStatus,
    }));
  };
  const onReset = () => {
    setParams(pre => ({
      ...pre,
      beginTime: '',
      endTime: '',
      beginReviewTime: '',
      endReviewTime: '',
    }));
    setOtherParams(pre => ({
      ...pre,
      name: '',
      userName: '',
      serverId: '',
      account: '',
      verifyStatus: '',
    }));
    form.reset();
  };

  const serverData = useMemo(() => {
    return server?.rows || [];
  }, [server]);
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
            label={t('signals.name')}
            placeholder={t('common.pleaseInput', {
              field: t('signals.name'),
            })}
          />

          <FormInput
            verticalLabel
            name="userName"
            label={t('signals.signalSourceAuthor')}
            placeholder={t('common.pleaseInput', {
              field: t('signals.signalSourceAuthor'),
            })}
          />

          <RrhServerSelector serverOptions={serverData} />

          <FormInput
            verticalLabel
            name="account"
            label={t('table.tradingAccount')}
            placeholder={t('common.pleaseInput', {
              field: t('table.tradingAccount'),
            })}
          />

          <FormSelect
            verticalLabel
            name="verifyStatus"
            label={t('table.status')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={SignalReviewverifyStatusOptions.map(i => ({
              label: t(i.label),
              value: i.value,
            }))}
          />
          <FormField
            name="Time"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('table.applicationTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="Time" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="reviewTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('table.verifyTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="reviewTime" control={form.control} />
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
