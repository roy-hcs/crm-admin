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
import { PointsChangeListParams } from '@/api/hooks/pointsMall';
import { FormSelect } from '@/components/form/FormSelect';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
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
      time: { from: '', to: '' },
    },
  });
  const onSubmit = (data: FormData) => {
    setParams(pre => ({
      ...pre,
      fuzzyName: data.fuzzyName,
      fuzzyEmail: data.fuzzyEmail,
      timeStart: formatDate(data.time.from),
      timeEnd: formatDate(data.time.to),
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
          className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20"
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
          <div className="bg-background absolute inset-x-0 bottom-0 flex gap-4 p-4">
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
