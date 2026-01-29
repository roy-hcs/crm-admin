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
import { PerformanceFeePayStatusOptions } from '@/lib/const';
import { useServerList } from '@/api/hooks/system';
import { PerformanceFeeListParams } from '@/api/hooks/copyTrading/type';
import { RrhServerSelector } from '@/components/common/RrhServerSelector';
import { formatDate } from '@/lib/utils';

type FormData = {
  Time: { from: string; to: string };
  PayTime: { from: string; to: string };
  signalSourceOwner: string;
  follower: string;
  signalSourceName: string;
  traderServerId: string;
  trader: string;
  client: string;
  payStatus: string;
};

export const PerformanceFeeRecordForm = ({
  setParams,
  setOtherParams,
  reset,
  loading,
  params,
  otherParams,
}: {
  setParams: Dispatch<SetStateAction<PerformanceFeeListParams['params']>>;
  setOtherParams: Dispatch<
    SetStateAction<Omit<PerformanceFeeListParams, 'params' | keyof BasicParams>>
  >;
  reset: () => void;
  loading: boolean;
  params: PerformanceFeeListParams['params'];
  otherParams: Omit<PerformanceFeeListParams, 'params' | keyof BasicParams>;
}) => {
  const { t } = useTranslation();
  const { data: server } = useServerList();
  const form = useForm({
    defaultValues: {
      Time: { from: params.beginTime || '', to: params.endTime || '' },
      PayTime: { from: params.beginPayTime || '', to: params.endPayTime || '' },
      signalSourceOwner: params.signalSourceOwner || '',
      follower: params.follower || '',
      signalSourceName: otherParams.signalSourceName || '',
      traderServerId: otherParams.traderServerId || '',
      trader: otherParams.trader || '',
      client: otherParams.client || '',
      payStatus: otherParams.payStatus || '',
    },
  });
  const onSubmit = (data: FormData) => {
    reset();
    setParams(pre => ({
      ...pre,
      signalSourceOwner: data.signalSourceOwner,
      follower: data.follower,
      beginTime: formatDate(data.Time.from),
      endTime: formatDate(data.Time.to),
      beginPayTime: formatDate(data.PayTime.from),
      endPayTime: formatDate(data.PayTime.to),
    }));
    setOtherParams(pre => ({
      ...pre,
      signalSourceName: data.signalSourceName,
      traderServerId: data.traderServerId,
      trader: data.trader,
      client: data.client,
      payStatus: data.payStatus,
    }));
  };
  const onReset = () => {
    reset();
    form.reset({
      Time: { from: '', to: '' },
      PayTime: { from: '', to: '' },
      signalSourceOwner: '',
      follower: '',
      signalSourceName: '',
      traderServerId: '',
      trader: '',
      client: '',
      payStatus: '',
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
            name="follower"
            label={t('performanceFeeRecord.clientName')}
            placeholder={t('common.pleaseInput', {
              field: t('performanceFeeRecord.clientName'),
            })}
          />
          <RrhServerSelector serverOptions={serverData} name="traderServerId" />
          <FormInput
            verticalLabel
            name="trader"
            label={t('performanceFeeRecord.trader')}
            placeholder={t('common.pleaseInput', {
              field: t('performanceFeeRecord.trader'),
            })}
          />
          <FormInput
            verticalLabel
            name="client"
            label={t('performanceFeeRecord.payAccountName')}
            placeholder={t('common.pleaseInput', {
              field: t('performanceFeeRecord.payAccountName'),
            })}
          />
          <FormSelect
            verticalLabel
            name="payStatus"
            label={t('performanceFeeRecord.arrivalStatus')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={PerformanceFeePayStatusOptions.map(i => ({
              label: t(i.label),
              value: i.value,
            }))}
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
            name="PayTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('performanceFeeRecord.payTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="PayTime" control={form.control} />
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
