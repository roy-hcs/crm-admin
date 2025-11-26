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
import { Dispatch, SetStateAction } from 'react';
import { PointsHistoryListParams } from '@/api/hooks/pointsMall';
import { FormSelect } from '@/components/form/FormSelect';
import { pointsHistoryPayType, pointsHistoryVerifyStatus } from '@/lib/const';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { formatDate } from '@/lib/utils';

type FormData = {
  fuzzyName: string;
  fuzzyEmail: string;
  fuzzyGoods: string;
  verifyStatus: string;
  updateTime: { from: string; to: string };
  exchangeTime: { from: string; to: string };
  payType: string;
};

export const RedemptionRecordsForm = ({
  setParams,
  setOtherParams,
  loading,
}: {
  setParams: Dispatch<SetStateAction<PointsHistoryListParams['params']>>;
  setOtherParams: Dispatch<
    SetStateAction<
      Omit<PointsHistoryListParams, 'params' | 'pageSize' | 'pageNum' | 'orderByColumn' | 'isAsc'>
    >
  >;
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      payType: '',
      fuzzyName: '',
      fuzzyEmail: '',
      fuzzyGoods: '',
      verifyStatus: '',
      updateTime: { from: '', to: '' },
      exchangeTime: { from: '', to: '' },
    },
  });

  const onSubmit = (data: FormData) => {
    setParams(pre => ({
      ...pre,
      fuzzyName: data.fuzzyName,
      fuzzyEmail: data.fuzzyEmail,
      fuzzyGoods: data.fuzzyGoods,
      verifyStatus: data.verifyStatus,
      exchangeTimeStart: formatDate(data.exchangeTime.from),
      exchangeTimeEnd: formatDate(data.exchangeTime.to),
      updateTimeStart: formatDate(data.updateTime.from),
      updateTimeEnd: formatDate(data.updateTime.to),
    }));
    setOtherParams(pre => ({
      ...pre,
      payType: data.payType,
    }));
  };
  const onReset = () => {
    setParams(pre => ({
      ...pre,
      fuzzyName: '',
      fuzzyEmail: '',
      fuzzyGoods: '',
      verifyStatus: '',
      exchangeTimeStart: '',
      exchangeTimeEnd: '',
      updateTimeStart: '',
      updateTimeEnd: '',
    }));
    setOtherParams(pre => ({
      ...pre,
      payType: '',
    }));
    form.reset();
  };
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
          className="flex flex-col gap-4 overflow-auto p-4"
        >
          <FormInput
            verticalLabel
            name="fuzzyName"
            label={t('table.nameOrId')}
            placeholder={t('common.pleaseInput', {
              field: t('table.nameOrId'),
            })}
          />
          <FormInput
            verticalLabel
            name="fuzzyEmail"
            label={t('table.email')}
            placeholder={t('common.pleaseInput', {
              field: t('table.email'),
            })}
          />
          <FormInput
            verticalLabel
            name="fuzzyGoods"
            label={t('redemptionRecords.fuzzyGoods')}
            placeholder={t('common.pleaseInput', {
              field: t('redemptionRecords.fuzzyGoods'),
            })}
          />
          <FormSelect
            verticalLabel
            name="verifyStatus"
            label={t('common.status')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={pointsHistoryVerifyStatus.map(i => ({ label: t(i.label), value: i.value }))}
          />
          <FormSelect
            verticalLabel
            name="payType"
            label={t('redemptionRecords.payType')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={pointsHistoryPayType.map(i => ({ label: t(i.label), value: i.value }))}
          />
          <FormField
            name="exchangeTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('redemptionRecords.exchangeTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="exchangeTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="updateTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('table.updateTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="updateTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-4">
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
