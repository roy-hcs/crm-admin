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
import dayjs from 'dayjs';
import { FormSelect } from '@/components/form/FormSelect';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { BasicParams } from '@/api/types';
import { SignalStatusOptions } from '@/lib/const';
import { useServerList } from '@/api/hooks/system';
import { BaseOption } from '@/components/common/RrhSelect';
import { serverMap } from '@/lib/constant';
import { MamSignalSourceListParams } from '@/api/hooks/copyTrading/type';

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
  loading,
}: {
  setParams: Dispatch<SetStateAction<MamSignalSourceListParams['params']>>;
  setOtherParams: Dispatch<
    SetStateAction<Omit<MamSignalSourceListParams, 'params' | keyof BasicParams>>
  >;
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const { data: server, isLoading: serverLoading } = useServerList();
  const form = useForm({
    defaultValues: {
      Time: { from: '', to: '' },
      name: '',
      userName: '',
      serverId: '',
      account: '',
      status: '',
    },
  });
  const onSubmit = (data: FormData) => {
    setParams(pre => ({
      ...pre,
      beginTime: data.Time.from ? dayjs(data.Time.from).format('YYYY-MM-DD') : '',
      endTime: data.Time.to ? dayjs(data.Time.to).format('YYYY-MM-DD') : '',
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
    setParams(pre => ({
      ...pre,
      beginTime: '',
      endTime: '',
    }));
    setOtherParams(pre => ({
      ...pre,
      name: '',
      userName: '',
      serverId: '',
      account: '',
      status: '',
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

          {!serverLoading && (
            <FormSelect<
              Record<string, string>,
              BaseOption & {
                serviceProperty: number;
                serviceType: number;
              }
            >
              verticalLabel
              name="serverId"
              label={t('table.server')}
              placeholder={t('common.pleaseSelect')}
              showRowValue={false}
              options={(server?.rows || []).map(item => ({
                label: item.serverName,
                value: item.id,
                serviceProperty: item.serviceProperty,
                serviceType: item.serviceType,
              }))}
              renderItem={option => {
                return (
                  <div>
                    <span>
                      {option.serviceProperty === 1 ? t('common.live') : t('common.demo')}
                    </span>
                    {option.serviceType && <span> {serverMap[option.serviceType]} | </span>}
                    <span>{option.label}</span>
                  </div>
                );
              }}
            />
          )}

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
