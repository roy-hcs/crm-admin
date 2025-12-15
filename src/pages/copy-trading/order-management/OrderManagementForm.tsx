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
import { arrivalStatusOptions } from '@/lib/const';
import { useServerList } from '@/api/hooks/system';
import { MamFollowListParams } from '@/api/hooks/copyTrading/type';
import { RrhServerSelector } from '@/components/common/RrhServerSelector';
import { formatDate } from '@/lib/utils';

type FormData = {
  Time: { from: string; to: string };
  arrivalTime: { from: string; to: string };
  signalSourceOwner: string;
  signalSourceName: string;
  userName: string;
  traderServerId: string;
  trader: string;
  client: string;
  arrivalStatus: string;
};

export const OrderManagementForm = ({
  setParams,
  setOtherParams,
  loading,
}: {
  setParams: Dispatch<SetStateAction<MamFollowListParams['params']>>;
  setOtherParams: Dispatch<SetStateAction<Omit<MamFollowListParams, 'params' | keyof BasicParams>>>;
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const { data: server } = useServerList();
  const form = useForm({
    defaultValues: {
      Time: { from: '', to: '' },
      arrivalTime: { from: '', to: '' },
      signalSourceOwner: '',
      signalSourceName: '',
      userName: '',
      traderServerId: '',
      trader: '',
      client: '',
      arrivalStatus: '',
    },
  });
  const onSubmit = (data: FormData) => {
    setParams(pre => ({
      ...pre,
      signalSourceOwner: data.signalSourceOwner,
      beginTime: formatDate(data.Time.from),
      endTime: formatDate(data.Time.to),
      beginArrivalTime: formatDate(data.arrivalTime.from),
      endArrivalTime: formatDate(data.arrivalTime.to),
    }));
    setOtherParams(pre => ({
      ...pre,
      signalSourceName: data.signalSourceName,
      userName: data.userName,
      traderServerId: data.traderServerId,
      trader: data.trader,
      client: data.client,
      arrivalStatus: data.arrivalStatus,
    }));
  };
  const onReset = () => {
    setParams(pre => ({
      ...pre,
      signalSourceOwner: '',
      beginTime: '',
      endTime: '',
      beginArrivalTime: '',
      endArrivalTime: '',
    }));
    setOtherParams(pre => ({
      ...pre,
      signalSourceName: '',
      userName: '',
      traderServerId: '',
      trader: '',
      client: '',
      arrivalStatus: '',
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
          className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20"
        >
          <FormInput
            verticalLabel
            name="signalSourceName"
            label={t('signals.name')}
            placeholder={t('common.pleaseInput', {
              field: t('signals.name'),
            })}
          />

          <FormInput
            verticalLabel
            name="signalSourceOwner"
            label={t('signals.signalSourceAuthor')}
            placeholder={t('common.pleaseInput', {
              field: t('signals.signalSourceAuthor'),
            })}
          />
          <FormInput
            verticalLabel
            name="userName"
            label={t('table.subscriptionUsers')}
            placeholder={t('common.pleaseInput', {
              field: t('table.subscriptionUsers'),
            })}
          />

          <RrhServerSelector serverOptions={serverData} name="traderServerId" />

          <FormInput
            verticalLabel
            name="trader"
            label={t('table.signalSourceAccount')}
            placeholder={t('common.pleaseInput', {
              field: t('table.signalSourceAccount'),
            })}
          />
          <FormInput
            verticalLabel
            name="client"
            label={t('table.subscriberAccount')}
            placeholder={t('common.pleaseInput', {
              field: t('table.subscriberAccount'),
            })}
          />

          <FormSelect
            verticalLabel
            name="arrivalStatus"
            label={t('table.arrivalStatus')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={arrivalStatusOptions.map(i => ({ label: t(i.label), value: i.value }))}
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
          <FormField
            name="arrivalTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('table.arrivalTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="arrivalTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="bg-background absolute inset-x-0 bottom-0 flex gap-4 p-4">
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
