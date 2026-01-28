import { RrhButton } from '@/components/common/RrhButton';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { FormInput } from '@/components/form/FormInput';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from '@/components/ui/form';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FormProvider } from '@/contexts/form';
import { useForm } from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';
import { FormSelect } from '@/components/form/FormSelect';
import { RewardRecordsListParams } from '@/api/hooks/marketing';
import { formatDate } from '@/lib/utils';

type FormData = {
  rewardId: string;
  rewardTitle: string;
  crmAccount: string;
  businessType: string;
  time: { from: string; to: string };
};

export const RewardRecordsForm = ({
  setOtherParams,
  setParams,
  reset,
  params,
  loading,
  bonusDictType,
}: {
  setOtherParams: Dispatch<
    SetStateAction<
      Omit<RewardRecordsListParams, 'params' | 'pageSize' | 'pageNum' | 'orderByColumn' | 'isAsc'>
    >
  >;
  setParams: Dispatch<SetStateAction<RewardRecordsListParams['params']>>;
  reset: () => void;
  params: RewardRecordsListParams['params'];
  loading: boolean;
  bonusDictType: { dictLabel: string; dictValue: string }[];
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      rewardId: '',
      rewardTitle: params.rewardTitle || '',
      crmAccount: params.crmAccount || '',
      businessType: params.businessType || '',
      time: {
        from: params.bonusTimeStart || '',
        to: params.bonusTimeEnd || '',
      },
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setOtherParams({
      rewardId: data.rewardId,
    });
    setParams(pre => ({
      ...pre,
      beginTime: formatDate(data.time.from),
      endTime: formatDate(data.time.to),
      rewardTitle: data.rewardTitle,
      crmAccount: data.crmAccount,
      businessType: data.businessType,
    }));
  };

  const onReset = () => {
    reset();
    form.reset({
      rewardId: '',
      rewardTitle: '',
      crmAccount: '',
      businessType: '',
      time: { from: '', to: '' },
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
            name="rewardTitle"
            label={t('table.activityName')}
            placeholder={t('common.pleaseInput', { field: t('table.activityName') })}
          />
          <FormInput
            verticalLabel
            name="crmAccount"
            label={t('table.CRMAccount')}
            placeholder={t('common.pleaseInput', { field: t('table.CRMAccount') })}
          />
          <FormSelect
            verticalLabel
            name="businessType"
            label={t('table.triggerBusiness')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={bonusDictType?.map(i => ({ label: i.dictLabel, value: i.dictValue }))}
          />
          <FormField
            name="time"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('table.updateTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="time" control={form.control} />
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
