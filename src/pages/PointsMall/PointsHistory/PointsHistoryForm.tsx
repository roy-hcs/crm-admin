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
import { PointsChangeListParams } from '@/api/hooks/pointsMall/types';
import dayjs from 'dayjs';
import { FormSelect } from '@/components/form/FormSelect';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';

type FormData = {
  fuzzyName: string;
  fuzzyEmail: string;
  Time: { from: string; to: string };
  businessType: string;
};

export const PointsHistoryForm = ({
  setParams,
  setOtherParams,
  operTypeList,
  loading,
}: {
  setParams: Dispatch<SetStateAction<PointsChangeListParams['params']>>;
  setOtherParams: Dispatch<
    SetStateAction<
      Omit<PointsChangeListParams, 'params' | 'pageSize' | 'pageNum' | 'orderByColumn' | 'isAsc'>
    >
  >;
  operTypeList: { dictLabel: string; dictValue: string }[];
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      businessType: '',
      fuzzyName: '',
      fuzzyEmail: '',
      Time: { from: '', to: '' },
    },
  });
  const onSubmit = (data: FormData) => {
    setParams(pre => ({
      ...pre,
      fuzzyName: data.fuzzyName,
      fuzzyEmail: data.fuzzyEmail,
      timeStart: data.Time.from ? dayjs(data.Time.from).format('YYYY-MM-DD') : '',
      timeEnd: data.Time.to ? dayjs(data.Time.to).format('YYYY-MM-DD') : '',
    }));
    setOtherParams(pre => ({
      ...pre,
      businessType: data.businessType,
    }));
  };
  const onReset = () => {
    setParams(pre => ({
      ...pre,
      fuzzyName: '',
      fuzzyEmail: '',
      timeStart: '',
      timeEnd: '',
    }));
    setOtherParams(pre => ({
      ...pre,
      businessType: '',
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
          <FormSelect
            verticalLabel
            name="businessType"
            label={t('PointsHistory.businessType')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={operTypeList.map(i => ({ label: i.dictLabel, value: i.dictValue }))}
          />
          <FormField
            name="Time"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('table.time')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="Time" control={form.control} />
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
