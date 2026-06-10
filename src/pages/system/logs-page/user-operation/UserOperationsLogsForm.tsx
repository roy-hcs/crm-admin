import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { RefreshCcw, Search } from 'lucide-react';
import { FormInput } from '@/components/form/FormInput';

import { RrhButton } from '@/components/common/RrhButton';
import { useTranslation } from 'react-i18next';
import { DictTypeItem } from '@/api/hooks/system';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import { Dispatch, SetStateAction } from 'react';
import { UserOperationsLogsParams } from '@/api/hooks/monitor/type';
import { BasicParams } from '@/api/hooks/review/types';
import { FormSelect } from '@/components/form/FormSelect';
import { formatDate } from '@/lib/utils';
import { RrhForm } from '@/components/form/RrhForm';

type FormData = {
  systemModule: string;
  operator: string;
  operationType: string[];
  operationStatus: string;
  operationTime: { from: string; to: string };
};

export const UserOperationsLogsForm = ({
  setOtherParams,
  setParams,
  operationType = [],
  loading,
  reset,
  params,
  otherParams,
}: {
  operationType?: DictTypeItem[];
  setOtherParams: Dispatch<
    SetStateAction<Omit<UserOperationsLogsParams, 'params' | keyof BasicParams>>
  >;
  setParams: Dispatch<SetStateAction<UserOperationsLogsParams['params']>>;
  loading: boolean;
  reset: () => void;
  params: UserOperationsLogsParams['params'];
  otherParams: Omit<UserOperationsLogsParams, 'params' | keyof BasicParams>;
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      systemModule: otherParams?.title || '',
      operationStatus: otherParams?.status || '',
      operationTime: { from: params?.beginTime || '', to: params?.endTime || '' },
      operationType: otherParams?.businessTypes ? otherParams.businessTypes.split(',') : [],
      operator: otherParams?.operName || '',
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setParams(pre => ({
      ...pre,
      beginTime: formatDate(data.operationTime.from),
      endTime: formatDate(data.operationTime.to),
    }));
    setOtherParams(pre => ({
      ...pre,
      title: data.systemModule,
      operName: data.operator,
      status: data.operationStatus === 'all' ? '' : data.operationStatus,
      businessTypes: data.operationType.join(','),
    }));
  };
  const onReset = () => {
    reset();
    form.reset({
      systemModule: '',
      operationStatus: '',
      operationTime: { from: '', to: '' },
      operationType: [],
      operator: '',
    });
  };

  return (
    <RrhForm
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
      onReset={onReset}
      className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20 md:px-12 md:pt-12"
    >
      <FormInput
        name="systemModule"
        label={t('table.systemModule')}
        placeholder={t('common.pleaseInput', { field: t('table.systemModule') })}
      />
      <FormInput
        name="operator"
        label={t('table.operator')}
        placeholder={t('common.pleaseInput', { field: t('table.operator') })}
      />
      <FormMultiSelect
        name="operationType"
        label={t('table.operationType')}
        placeholder={t('common.pleaseSelect')}
        options={
          operationType.map(item => ({
            label: item.dictLabel,
            value: item.dictValue,
          })) || []
        }
      />
      <FormSelect
        name="operationStatus"
        label={t('table.operationStatus')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={[
          { label: t('table.all'), value: 'all' },
          { label: t('common.success'), value: '0' },
          { label: t('common.fail'), value: '1' },
        ]}
      />

      <FormField
        name="operationTime"
        render={() => (
          <FormItem className="flex flex-col gap-2 text-sm">
            <FormLabel className="basis-3/12">{t('table.operationTime')}</FormLabel>
            <FormControl className="basis-9/12">
              <FormDateRangeInput name="operationTime" control={form.control} />
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
