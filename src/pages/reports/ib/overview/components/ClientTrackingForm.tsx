import { forwardRef, useImperativeHandle } from 'react';
// import { Form } from '@/components/ui/form';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FormProvider } from '@/contexts/form';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
// import { FormMonthPicker } from '@/components/form/FormMonthPicker';
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
import { RebateLevelOptions } from '@/lib/const';
import { useTranslation } from 'react-i18next';
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
    serverOptions: { label: string; value: string }[];
    initialServerId?: string;
  }
>(({ setParams, serverOptions, initialServerId }, ref) => {
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
    const auto = initialServerId || serverOptions[0]?.value || '';
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
    const first = serverOptions[0]?.value || '';
    setParams({
      serverId: first,
      userName: '',
      email: '',
      beginTime: '',
      endTime: '',
      level: '',
    });
    form.reset({
      serverId: first,
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
          className="flex flex-col gap-4 overflow-auto p-4"
        >
          <FormSelect
            verticalLabel
            name="serverId"
            label={t('ib.overview.serverId')}
            placeholder={t('common.pleaseSelect')}
            options={serverOptions}
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
            options={RebateLevelOptions}
          />
          <div className="flex justify-end gap-4">
            <RrhButton
              type="reset"
              className="flex h-9 items-center gap-2 border border-[#1E1E1E] bg-white !px-6 text-sm text-[#1E1E1E]"
            >
              <RefreshCcw className="size-3.5" />
              <span>{t('common.Reset')}</span>
            </RrhButton>
            <RrhButton
              type="submit"
              className="flex h-9 items-center gap-2 border-[#1E1E1E] bg-[#1E1E1E] !px-6 text-sm text-white"
            >
              <Search className="size-3.5" />
              <span>{t('common.Search')}</span>
            </RrhButton>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
});
