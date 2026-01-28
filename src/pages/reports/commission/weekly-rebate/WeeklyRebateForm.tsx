import { Dispatch, SetStateAction } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { useForm } from 'react-hook-form';
import { FormProvider } from '@/contexts/form';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RebateTypeOptions, RebateStatusOptions } from '@/lib/const';
import { formatDate } from '@/lib/utils';
import { DailyRebateParams } from '@/api/hooks/report';
import { BasicParams } from '@/api/types';

type FormData = {
  // 结算日期
  settlementTime: { from: string; to: string };
  // 返佣账户
  account: string;
  // 返佣类型
  rebateType: string;
  // 返佣状态
  rebateStatus: string;
  // 结算订单号
  id: string;
};

export const WeeklyRebateForm = ({
  setParams,
  setCommonParams,
  reset,
  params,
  commonParams,
}: {
  setParams: Dispatch<SetStateAction<DailyRebateParams['params']>>;
  setCommonParams: Dispatch<SetStateAction<Omit<DailyRebateParams, 'params' | keyof BasicParams>>>;
  reset: () => void;
  params: DailyRebateParams['params'];
  commonParams: Omit<DailyRebateParams, 'params' | keyof BasicParams>;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      // 结算日期
      settlementTime: { from: params.beginTime || '', to: params.endTime || '' },
      // 返佣账户
      account: params.account || '',
      // 返佣类型
      rebateType: commonParams.rebateType || '',
      // 返佣状态
      rebateStatus: commonParams.rebateStatus || '',
      // 结算订单号
      id: commonParams.id || '',
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setParams({
      beginTime: formatDate(data.settlementTime.from),
      endTime: formatDate(data.settlementTime.to),
      account: data.account,
    });
    setCommonParams({
      settleStyle: '2',
      rebateType: data.rebateType,
      rebateStatus: data.rebateStatus,
      id: data.id,
    });
  };

  const onReset = () => {
    reset();
    form.reset({
      settlementTime: { from: '', to: '' },
      account: '',
      rebateType: '',
      rebateStatus: '',
      id: '',
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
          <FormField
            name="settlementTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">
                  {t('commission.daily-rebate.settleTime')}
                </FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="settlementTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormInput
            verticalLabel
            name="account"
            label={t('commission.daily-rebate.account')}
            placeholder={t('common.pleaseInput', { field: t('commission.daily-rebate.account') })}
          />
          <FormSelect
            verticalLabel
            name="rebateType"
            label={t('commission.daily-rebate.rebateType')}
            placeholder={t('common.pleaseSelect')}
            options={RebateTypeOptions.map(i => ({ label: t(i.label), value: i.value }))}
          />
          <FormSelect
            verticalLabel
            name="rebateStatus"
            label={t('commission.daily-rebate.rebateStatus')}
            placeholder={t('common.pleaseSelect')}
            options={RebateStatusOptions.map(i => ({ label: t(i.label), value: i.value }))}
          />
          <FormInput
            verticalLabel
            name="id"
            label={t('commission.daily-rebate.id')}
            placeholder={t('common.pleaseInput', {
              field: t('commission.daily-rebate.id'),
            })}
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
