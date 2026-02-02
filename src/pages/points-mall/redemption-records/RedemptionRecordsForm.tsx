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
import { PointsHistoryListParams } from '@/api/hooks/pointsMall';
import { pointsHistoryPayType, pointsHistoryVerifyStatus } from '@/lib/const';
import { formatDate } from '@/lib/utils';
import { BasicParams } from '@/api/types';

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
  params,
  otherParams,
  reset,
}: {
  setParams: Dispatch<SetStateAction<PointsHistoryListParams['params']>>;
  setOtherParams: Dispatch<
    SetStateAction<Omit<PointsHistoryListParams, 'params' | keyof BasicParams>>
  >;
  loading: boolean;
  params: PointsHistoryListParams['params'];
  otherParams: Omit<PointsHistoryListParams, 'params' | keyof BasicParams>;
  reset: () => void;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      payType: otherParams.payType || '',
      fuzzyName: params.fuzzyName || '',
      fuzzyEmail: params.fuzzyEmail || '',
      fuzzyGoods: params.fuzzyGoods || '',
      verifyStatus: params.verifyStatus || '',
      updateTime: { from: params.updateTimeStart || '', to: params.updateTimeEnd || '' },
      exchangeTime: { from: params.exchangeTimeStart || '', to: params.exchangeTimeEnd || '' },
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setParams({
      fuzzyName: data.fuzzyName,
      fuzzyEmail: data.fuzzyEmail,
      fuzzyGoods: data.fuzzyGoods,
      verifyStatus: data.verifyStatus,
      exchangeTimeStart: formatDate(data.exchangeTime.from),
      exchangeTimeEnd: formatDate(data.exchangeTime.to),
      updateTimeStart: formatDate(data.updateTime.from),
      updateTimeEnd: formatDate(data.updateTime.to),
    });
    setOtherParams({
      payType: data.payType,
    });
  };

  const onReset = () => {
    reset();
    form.reset({
      payType: '',
      fuzzyName: '',
      fuzzyEmail: '',
      fuzzyGoods: '',
      verifyStatus: '',
      updateTime: { from: '', to: '' },
      exchangeTime: { from: '', to: '' },
    });
  };

  return (
    <FormProvider form={form}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
          className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20 md:px-12 md:pt-12"
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
          <div className="bg-background absolute inset-x-0 bottom-0 flex justify-end gap-4 p-4">
            <RrhButton type="reset" variant={'outline'} onClick={onReset}>
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
