import { forwardRef, useImperativeHandle } from 'react';
import { Form } from '@/components/ui/form';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FormProvider } from '@/contexts/form';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { FormMonthPicker } from '@/components/form/FormMonthPicker';
import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RebateLevelOptions } from '@/lib/const';
export interface ClientTrackingFormRef {
  onReset: () => void;
}
type ClientTrackingFormValues = {
  userName: string;
  email: string;
  statisticMonth: string;
  level: string;
};
export const ClientTrackingForm = forwardRef<
  ClientTrackingFormRef,
  {
    setParams: (params: {
      userName: string;
      email: string;
      statisticMonth: string;
      level: string;
    }) => void;
  }
>(({ setParams }, ref) => {
  const { t } = useTranslation();
  const form = useForm<ClientTrackingFormValues>({
    defaultValues: {
      userName: '',
      email: '',
      statisticMonth: '',
      level: '',
    },
  });
  useImperativeHandle(ref, () => ({
    onReset: () => {
      form.reset();
    },
  }));

  const onSubmit: SubmitHandler<ClientTrackingFormValues> = data => {
    setParams({
      userName: data.userName,
      email: data.email,
      statisticMonth: data.statisticMonth,
      level: data.level,
    });
  };
  const onReset = () => {
    setParams({
      userName: '',
      email: '',
      statisticMonth: '',
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
          <FormMonthPicker
            control={form.control}
            name="statisticMonth"
            label={t('ib.CustomerTracking.time') + ':'}
            placeholder={t('ib.CustomerTracking.enterstatisticMonthStr')}
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
