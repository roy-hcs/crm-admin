import { Dispatch, SetStateAction } from 'react';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { FormProvider } from '@/contexts/form';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { FormMonthPicker } from '@/components/form/FormMonthPicker';
import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRebateLevelList } from '@/api/hooks/system/system';
import { ClientTrackingParams } from '@/api/hooks/report';

type FormData = {
  userName: string;
  email: string;
  statisticMonth: string;
  level: string;
};

export const ClientTrackingForm = ({
  setParams,
  reset,
  params,
}: {
  setParams: Dispatch<
    SetStateAction<Pick<ClientTrackingParams, 'userName' | 'email' | 'statisticMonth' | 'level'>>
  >;
  reset: () => void;
  params: Pick<ClientTrackingParams, 'userName' | 'email' | 'statisticMonth' | 'level'>;
}) => {
  const { t } = useTranslation();
  const { data: rebateLevel } = useRebateLevelList();
  const form = useForm<FormData>({
    defaultValues: {
      userName: params.userName || '',
      email: params.email || '',
      statisticMonth: params.statisticMonth || '',
      level: params.level || '',
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setParams({
      userName: data.userName,
      email: data.email,
      statisticMonth: data.statisticMonth,
      level: data.level,
    });
  };

  const onReset = () => {
    reset();
    form.reset({
      userName: '',
      email: '',
      statisticMonth: '',
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
          <FormInput
            verticalLabel
            name="userName"
            label={t('CRMAccountPage.NameOrAccountId')}
            placeholder={t('customerTracking.nameOrAccountId')}
          />
          <FormInput
            verticalLabel
            name="email"
            label={t('customerTracking.email') + ':'}
            placeholder={t('customerTracking.enteremail')}
          />
          <FormMonthPicker
            control={form.control}
            name="statisticMonth"
            label={t('customerTracking.time') + ':'}
            placeholder={t('customerTracking.enterstatisticMonthStr')}
          />
          <FormSelect
            verticalLabel
            name="level"
            label={t('customerTracking.levelName') + ':'}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={(rebateLevel?.rows || []).map(item => ({
              label: item.levelName,
              value: item.id,
            }))}
          />
          <div className="bg-background absolute inset-x-0 bottom-0 flex justify-end gap-4 p-4">
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
