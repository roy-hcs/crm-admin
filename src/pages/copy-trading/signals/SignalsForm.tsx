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
import { SignalStatusOptions } from '@/lib/const';
import { useServerList } from '@/api/hooks/system';
import { MamSignalSourceListParams } from '@/api/hooks/copyTrading/type';
import { RrhServerSelector } from '@/components/common/RrhServerSelector';
import { formatDate } from '@/lib/utils';

type FormData = {
  Time: { from: string; to: string };
  name: string;
  userName: string;
  serverId: string;
  account: string;
  status: string;
};

export const SignalsForm = ({
  setParams,
  setOtherParams,
  reset,
  loading,
  otherParams,
  params,
}: {
  setParams: Dispatch<SetStateAction<MamSignalSourceListParams['params']>>;
  setOtherParams: Dispatch<
    SetStateAction<Omit<MamSignalSourceListParams, 'params' | keyof BasicParams>>
  >;
  reset: () => void;
  loading: boolean;
  otherParams: Omit<MamSignalSourceListParams, 'params' | keyof BasicParams>;
  params: MamSignalSourceListParams['params'];
}) => {
  const { t } = useTranslation();
  const { data: server } = useServerList();
  const form = useForm({
    defaultValues: {
      Time: { from: params.beginTime || '', to: params.endTime || '' },
      name: otherParams.name || '',
      userName: otherParams.userName || '',
      serverId: otherParams.serverId || '',
      account: otherParams.account || '',
      status: otherParams.status || '',
    },
  });
  const onSubmit = (data: FormData) => {
    reset();
    setParams(pre => ({
      ...pre,
      beginTime: formatDate(data.Time.from),
      endTime: formatDate(data.Time.to),
    }));
    setOtherParams(pre => ({
      ...pre,
      name: data.name,
      userName: data.userName,
      serverId: data.serverId,
      account: data.account,
      status: data.status,
    }));
  };
  const onReset = () => {
    reset();
    form.reset({
      Time: { from: '', to: '' },
      name: '',
      userName: '',
      serverId: '',
      account: '',
      status: '',
    });
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
          className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20"
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
            name="status"
            label={t('table.status')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={SignalStatusOptions.map(i => ({ label: t(i.label), value: i.value }))}
          />

          <FormField
            name="Time"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('common.createTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="Time" control={form.control} />
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
