import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RefreshCcw, Search } from 'lucide-react';

import { PerformanceFeeRebateReportListParams } from '@/api/hooks/copyTrading/type';
import { RrhButton } from '@/components/common/RrhButton';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { RrhForm } from '@/components/form/RrhForm';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { formatDate } from '@/lib/utils';
import {
  performanceFeeRebateReportPayStatusOptions,
  PerformanceFeeRebateReportSearchFormData,
} from './data';
import { FormCrmUserSelect } from '@/components/form/FormCrmUserSelect';

export function PerformanceFeeRebateReportForm({
  loading,
  params,
  onSearch,
  onReset,
}: {
  loading: boolean;
  params: PerformanceFeeRebateReportListParams;
  onSearch: Dispatch<SetStateAction<PerformanceFeeRebateReportListParams>>;
  onReset: () => void;
}) {
  const { t } = useTranslation();
  const form = useForm<PerformanceFeeRebateReportSearchFormData>({
    defaultValues: {
      orderNo: params.orderNo || '',
      performanceFeeOrderNo: params.performanceFeeOrderNo || '',
      signalSourceName: params.signalSourceName || '',
      trader: params.trader || '',
      client: params.client || '',
      payStatus: params.payStatus || '',
      userId: params.userId || '',
      timeRange: {
        from: params.params.beginTime || '',
        to: params.params.endTime || '',
      },
      payTimeRange: {
        from: params.params.beginPayTime || '',
        to: params.params.endPayTime || '',
      },
    },
  });

  const submit = (values: PerformanceFeeRebateReportSearchFormData) => {
    onSearch(prev => ({
      ...prev,
      orderNo: values.orderNo,
      performanceFeeOrderNo: values.performanceFeeOrderNo,
      signalSourceName: values.signalSourceName,
      trader: values.trader,
      client: values.client,
      payStatus: values.payStatus,
      userId: values.userId,
      pageNum: 1,
      params: {
        beginTime: formatDate(values.timeRange.from),
        endTime: formatDate(values.timeRange.to),
        beginPayTime: formatDate(values.payTimeRange.from),
        endPayTime: formatDate(values.payTimeRange.to),
      },
    }));
  };

  const reset = () => {
    onReset();
    form.reset({
      orderNo: '',
      performanceFeeOrderNo: '',
      signalSourceName: '',
      trader: '',
      client: '',
      payStatus: '',
      userId: '',
      timeRange: { from: '', to: '' },
      payTimeRange: { from: '', to: '' },
    });
  };

  return (
    <RrhForm
      form={form}
      onSubmit={form.handleSubmit(submit)}
      onReset={reset}
      onKeyDown={e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          if (e.target instanceof HTMLTextAreaElement) return;
          e.preventDefault();
          form.handleSubmit(submit)();
        }
      }}
      className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20 md:px-12 md:pt-12"
    >
      <FormInput
        verticalLabel
        name="orderNo"
        label={t('table.orderNumber')}
        placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
      />

      <FormInput
        verticalLabel
        name="performanceFeeOrderNo"
        label={t('performanceFeeRebatePage.performanceFeeOrderNo')}
        placeholder={t('common.pleaseInput', {
          field: t('performanceFeeRebatePage.performanceFeeOrderNo'),
        })}
      />

      <FormInput
        verticalLabel
        name="signalSourceName"
        label={t('signals.name')}
        placeholder={t('common.pleaseInput', { field: t('signals.name') })}
      />

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
        name="payStatus"
        label={t('table.status')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={performanceFeeRebateReportPayStatusOptions.map(item => ({
          label: t(item.label),
          value: item.value,
        }))}
      />

      <FormCrmUserSelect verticalLabel name="userId" label={t('rewardRecords.rewardTarget')} />

      <FormField
        name="timeRange"
        render={() => (
          <FormItem className="flex flex-col gap-2 text-sm">
            <FormLabel className="basis-3/12">{t('common.createTime')}</FormLabel>
            <FormControl className="basis-9/12">
              <FormDateRangeInput name="timeRange" control={form.control} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="payTimeRange"
        render={() => (
          <FormItem className="flex flex-col gap-2 text-sm">
            <FormLabel className="basis-3/12">{t('performanceFeeRecord.payTime')}</FormLabel>
            <FormControl className="basis-9/12">
              <FormDateRangeInput name="payTimeRange" control={form.control} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="bg-background absolute inset-x-0 bottom-0 flex justify-end gap-4 p-4">
        <RrhButton type="reset" variant="outline" onClick={reset}>
          <RefreshCcw className="size-3.5" />
          <span>{t('common.Reset')}</span>
        </RrhButton>
        <RrhButton type="submit" loading={loading}>
          <Search className="size-3.5" />
          <span>{t('common.Search')}</span>
        </RrhButton>
      </div>
    </RrhForm>
  );
}
