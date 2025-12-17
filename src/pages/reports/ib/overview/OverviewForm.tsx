import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { FormProvider } from '@/contexts/form';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RebateLevelItem, ServerItem } from '@/api/hooks/system/types';
import { RrhServerSelector } from '@/components/common/RrhServerSelector';
import { formatDate } from '@/lib/utils';

type FormData = {
  serverId: string;
  userName: string;
  email: string;
  beginTime: { from: string; to: string };
  level: string;
};

export const OverviewForm = ({
  setParams,
  reset,
  params,
  setServerId,
  serverOptions,
  rebateLevelOptions,
  initialServerId,
}: {
  setParams: Dispatch<
    SetStateAction<{
      userName: string;
      email: string;
      beginTime: string;
      endTime: string;
      level: string;
    }>
  >;
  reset: () => void;
  params: {
    userName: string;
    email: string;
    beginTime: string;
    endTime: string;
    level: string;
  };
  setServerId: (id: string) => void;
  serverOptions: ServerItem[];
  rebateLevelOptions: RebateLevelItem[];
  initialServerId?: string;
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      serverId: initialServerId || '',
      userName: params.userName || '',
      email: params.email || '',
      beginTime: {
        from: params.beginTime || '',
        to: params.endTime || '',
      },
      level: params.level || '',
    },
  });

  // 当父级提供初始 serverId 或服务器列表加载完成后自动填充
  if (!form.getValues('serverId') && (initialServerId || serverOptions[0])) {
    const auto = initialServerId || serverOptions[0]?.id || '';
    if (auto) form.setValue('serverId', auto, { shouldDirty: false, shouldTouch: false });
  }

  const onSubmit = (data: FormData) => {
    setParams({
      userName: data.userName,
      email: data.email,
      beginTime: formatDate(data.beginTime.from),
      endTime: formatDate(data.beginTime.to),
      level: data.level,
    });
    setServerId(data.serverId);
  };

  const onReset = () => {
    setServerId(initialServerId || '');
    reset();
    form.reset({
      serverId: initialServerId || '',
      userName: '',
      email: '',
      beginTime: { from: '', to: '' },
      level: '',
    });
  };

  return (
    <FormProvider form={form}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
          className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20"
        >
          <RrhServerSelector serverOptions={serverOptions} />
          <FormInput
            verticalLabel
            name="userName"
            label={t('CRMAccountPage.NameOrAccountId')}
            placeholder={t('ib.CustomerTracking.nameOrAccountId')}
          />
          <FormInput
            verticalLabel
            name="email"
            label={t('ib.CustomerTracking.email') + ':'}
            placeholder={t('ib.CustomerTracking.enteremail')}
          />
          <FormField
            name="beginTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('ib.CustomerTracking.time') + ':'}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="beginTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormSelect
            verticalLabel
            name="level"
            label={t('ib.CustomerTracking.levelName') + ':'}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={rebateLevelOptions.map(item => ({ label: item.levelName, value: item.id }))}
          />
          <div className="bg-background absolute inset-x-0 bottom-0 flex gap-4 p-4">
            <RrhButton type="reset" variant={'outline'} onClick={onReset}>
              <RefreshCcw className="size-3.5" />
              <span>{t('common.Reset')}</span>
            </RrhButton>
            <RrhButton type="submit">
              <Search className="size-3.5" />
              <span>{t('common.Search')}</span>
            </RrhButton>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};
