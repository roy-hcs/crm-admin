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
import { PointsChangeListParams } from '@/api/hooks/pointsMall';
import { formatDate } from '@/lib/utils';

type FormData = {
  fuzzyName: string;
  fuzzyEmail: string;
  time: { from: string; to: string };
  businessType: string;
};

export const PointsHistoryForm = ({
  setParams,
  setOtherParams,
  operationTypeList,
  loading,
  params,
  otherParams,
  reset,
}: {
  setParams: Dispatch<SetStateAction<PointsChangeListParams['params']>>;
  setOtherParams: Dispatch<
    SetStateAction<
      Omit<PointsChangeListParams, 'params' | 'pageSize' | 'pageNum' | 'orderByColumn' | 'isAsc'>
    >
  >;
  operationTypeList: { dictLabel: string; dictValue: string }[];
  loading: boolean;
  params: PointsChangeListParams['params'];
  otherParams: Omit<
    PointsChangeListParams,
    'params' | 'pageSize' | 'pageNum' | 'orderByColumn' | 'isAsc'
  >;
  reset: () => void;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      businessType: otherParams.businessType || '',
      fuzzyName: params.fuzzyName || '',
      fuzzyEmail: params.fuzzyEmail || '',
      time: { from: params.timeStart || '', to: params.timeEnd || '' },
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setParams({
      fuzzyName: data.fuzzyName,
      fuzzyEmail: data.fuzzyEmail,
      timeStart: formatDate(data.time.from),
      timeEnd: formatDate(data.time.to),
    });
    setOtherParams({
      businessType: data.businessType,
    });
  };

  const onReset = () => {
    reset();
    form.reset({
      businessType: '',
      fuzzyName: '',
      fuzzyEmail: '',
      time: { from: '', to: '' },
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
          <FormSelect
            verticalLabel
            name="businessType"
            label={t('table.triggerBusiness')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={operationTypeList.map(i => ({ label: i.dictLabel, value: i.dictValue }))}
          />
          <FormField
            name="time"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('table.time')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="time" control={form.control} />
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
            <RrhButton type="submit" loading={loading} disabled={loading}>
              <Search className="size-3.5" />
              <span>{t('common.Search')}</span>
            </RrhButton>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};
