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
import { AdminOperLogParams, DictTypeItem } from '@/api/hooks/system';
import { FormSelect } from '@/components/form/FormSelect';
import { adminOperationsStatusOptions } from '@/lib/const';
import { formatDate } from '@/lib/utils';

type FormData = {
  title: string;
  operName: string;
  status: string;
  businessTypes: string;
  time: { from: string; to: string };
};

export const AdminOperationsForm = ({
  setOtherParams,
  setParams,
  loading,
  operTypeList,
}: {
  setParams: Dispatch<SetStateAction<AdminOperLogParams['params']>>;
  setOtherParams: Dispatch<
    SetStateAction<
      Omit<AdminOperLogParams, 'params' | 'pageSize' | 'pageNum' | 'orderByColumn' | 'isAsc'>
    >
  >;
  loading: boolean;
  operTypeList: DictTypeItem[];
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      title: '',
      operName: '',
      status: '',
      businessTypes: '',
      time: { from: '', to: '' },
    },
  });

  const onSubmit = (data: FormData) => {
    setOtherParams({
      title: data.title,
      operName: data.operName,
      status: data.status === '3' ? '' : data.status,
      businessTypes: data.businessTypes,
    });
    setParams(pre => ({
      ...pre,
      beginTime: formatDate(data.time.from),
      endTime: formatDate(data.time.to),
    }));
  };
  const onReset = () => {
    setOtherParams({
      title: '',
      operName: '',
      status: '',
      businessTypes: '',
    });
    setParams(pre => ({
      ...pre,
      beginTime: '',
      endTime: '',
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
            name="title"
            label={t('system.adminOperations.systemModule')}
            placeholder={t('common.pleaseInput', {
              field: t('system.adminOperations.systemModule'),
            })}
          />
          <FormInput
            verticalLabel
            name="operName"
            label={t('common.operName')}
            placeholder={t('common.pleaseInput', {
              field: t('common.operName'),
            })}
          />
          <FormSelect
            verticalLabel
            name="businessTypes"
            label={t('common.operType')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={operTypeList.map(i => ({ label: i.dictLabel, value: i.dictValue }))}
          />
          <FormSelect
            verticalLabel
            name="status"
            label={t('common.operStatus')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={adminOperationsStatusOptions.map(i => ({ label: t(i.label), value: i.value }))}
          />
          <FormField
            name="time"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('common.operTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="time" control={form.control} />
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
