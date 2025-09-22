import { forwardRef, useImperativeHandle } from 'react';
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

export interface FormRef {
  onReset: () => void;
}
export const WeeklyRebateForm = forwardRef<
  FormRef,
  {
    setParams: (params: { beginTime: string; endTime: string; account: string }) => void;
    setCommonParams: (params: {
      settleStyle: string;
      rebateType: string;
      rebateStatus: string;
      id: string;
    }) => void;
  }
>(({ setParams, setCommonParams }, ref) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      // 结算日期
      settlementTime: { from: '', to: '' },
      // 返佣账户
      account: '',
      // 返佣类型
      rebateType: '',
      // 返佣状态
      rebateStatus: '',
      // 结算订单号
      id: '',
    },
  });

  useImperativeHandle(ref, () => ({
    onReset: () => {
      form.reset();
    },
  }));

  const onSubmit = (data: FormData) => {
    setParams({
      beginTime: data.settlementTime.from,
      endTime: data.settlementTime.to,
      account: data.account,
    });
    setCommonParams({
      settleStyle: '1',
      rebateType: data.rebateType,
      rebateStatus: data.rebateStatus,
      id: data.id,
    });
  };
  const onReset = () => {
    setParams({
      beginTime: '',
      endTime: '',
      account: '',
    });
    setCommonParams({
      settleStyle: '1',
      rebateType: '',
      rebateStatus: '',
      id: '',
    });
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
          className="flex flex-col gap-4 overflow-auto p-4"
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
            name="mtOrder"
            label={t('commission.daily-rebate.account')}
            placeholder={t('common.pleaseInput', { field: t('commission.daily-rebate.account') })}
          />
          <FormSelect
            verticalLabel
            name="rebateTraderId"
            label={t('commission.daily-rebate.rebateType')}
            placeholder={t('common.pleaseSelect')}
            options={RebateTypeOptions}
          />
          <FormSelect
            verticalLabel
            name="rebateStatus"
            label={t('commission.daily-rebate.rebateStatus')}
            placeholder={t('common.pleaseSelect')}
            options={RebateStatusOptions}
          />
          <FormInput
            verticalLabel
            name="id"
            label={t('commission.daily-rebate.id')}
            placeholder={t('common.pleaseInput', {
              field: t('commission.daily-rebate.id'),
            })}
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
