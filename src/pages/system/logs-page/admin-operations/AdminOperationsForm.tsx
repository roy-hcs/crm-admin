import { RrhButton } from '@/components/common/RrhButton';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { FormInput } from '@/components/form/FormInput';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useForm } from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';
import { AdminOperLogParams, DictTypeItem } from '@/api/hooks/system';
import { FormSelect } from '@/components/form/FormSelect';
import { adminOperationsStatusOptions } from '@/lib/const';
import { formatDate } from '@/lib/utils';
import { BasicParams } from '@/api/types';
import { RrhForm } from '@/components/form/RrhForm';

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
  reset,
  params,
  otherParams,
}: {
  setParams: Dispatch<SetStateAction<AdminOperLogParams['params']>>;
  setOtherParams: Dispatch<SetStateAction<Omit<AdminOperLogParams, 'params' | keyof BasicParams>>>;
  loading: boolean;
  operTypeList: DictTypeItem[];
  reset: () => void;
  params: AdminOperLogParams['params'];
  otherParams: Omit<AdminOperLogParams, 'params' | keyof BasicParams>;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      title: otherParams?.title || '',
      operName: otherParams?.operName || '',
      status: otherParams?.status || '',
      businessTypes: otherParams?.businessTypes || '',
      time: { from: params?.beginTime || '', to: params?.endTime || '' },
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
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
    reset();
    form.reset({
      title: '',
      operName: '',
      status: '',
      businessTypes: '',
      time: { from: '', to: '' },
    });
  };
  return (
    <RrhForm
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
      onReset={onReset}
      onKeyDown={e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          if (e.target instanceof HTMLTextAreaElement) return;

          e.preventDefault();
          form.handleSubmit(onSubmit)();
        }
      }}
      className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20 md:px-12 md:pt-12"
    >
      <FormInput
        name="title"
        label={t('table.systemModule')}
        placeholder={t('common.pleaseInput', {
          field: t('table.systemModule'),
        })}
      />
      <FormInput
        name="operName"
        label={t('common.operName')}
        placeholder={t('common.pleaseInput', {
          field: t('common.operName'),
        })}
      />
      <FormSelect
        name="businessTypes"
        label={t('table.operationType')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={operTypeList.map(i => ({ label: i.dictLabel, value: i.dictValue }))}
      />
      <FormSelect
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
    </RrhForm>
  );
};
