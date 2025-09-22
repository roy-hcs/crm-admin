import { forwardRef, useImperativeHandle } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
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
import { serverMap } from '@/lib/constant';
import { BaseOption } from '@/components/common/RrhSelect';
export interface OverviewFormRef {
  onReset: () => void;
}
type ClientTrackingFormValues = {
  serverId: string;
  userName: string;
  email: string;
  beginTime: { from: string; to: string };
  level: string;
};
export const OverviewForm = forwardRef<
  OverviewFormRef,
  {
    setParams: (params: {
      serverId: string;
      userName: string;
      email: string;
      beginTime: string;
      endTime: string;
      level: string;
    }) => void;
    setServerId: (id: string) => void;
    serverOptions: ServerItem[];
    rebateLevelOptions: RebateLevelItem[];
    initialServerId?: string;
  }
>(({ setParams, serverOptions, initialServerId, rebateLevelOptions }, ref) => {
  const { t } = useTranslation();
  const form = useForm<ClientTrackingFormValues>({
    defaultValues: {
      serverId: initialServerId || '',
      userName: '',
      email: '',
      beginTime: {
        from: '',
        to: '',
      },
      level: '',
    },
  });

  // 当父级提供初始 serverId 或服务器列表加载完成后自动填充
  if (!form.getValues('serverId') && (initialServerId || serverOptions[0])) {
    const auto = initialServerId || serverOptions[0]?.id || '';
    if (auto) form.setValue('serverId', auto, { shouldDirty: false, shouldTouch: false });
  }
  useImperativeHandle(ref, () => ({
    onReset: () => {
      form.reset();
    },
  }));

  const onSubmit: SubmitHandler<ClientTrackingFormValues> = data => {
    setParams({
      serverId: data.serverId,
      userName: data.userName,
      email: data.email,
      beginTime: data.beginTime.from,
      endTime: data.beginTime.to,
      level: data.level,
    });
  };
  const onReset = () => {
    const first = serverOptions[0]?.id || '';
    setParams({
      serverId: first,
      userName: '',
      email: '',
      beginTime: '',
      endTime: '',
      level: '',
    });
    form.reset();
  };

  return (
    <FormProvider form={form}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
          className="flex flex-col gap-4 overflow-auto p-4"
        >
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
            options={serverOptions.map(item => ({
              label: item.serverName,
              value: item.id,
              serviceProperty: item.serviceProperty,
              serviceType: item.serviceType,
            }))}
            renderItem={option => {
              return (
                <div>
                  {/* TODO: 优化样式 */}
                  <span>{option.serviceProperty === 1 ? t('common.live') : t('common.demo')}</span>
                  {option.serviceType && <span> {serverMap[option.serviceType]} | </span>}
                  <span>{option.label}</span>
                </div>
              );
            }}
          />
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
                <FormLabel className="basis-3/12 text-[#757F8D]">
                  {t('ib.CustomerTracking.time') + ':'}
                </FormLabel>
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
            options={rebateLevelOptions.map(item => ({ label: item.levelName, value: item.id }))}
          />
          <div className="flex justify-end gap-4">
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
});
