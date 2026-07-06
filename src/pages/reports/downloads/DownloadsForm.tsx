import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { useForm } from 'react-hook-form';

import { FormSelect } from '@/components/form/FormSelect';
import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/lib/utils';
import { Dispatch, SetStateAction } from 'react';
import { DownloadsListParams } from '@/api/hooks/report';
import { BasicParams } from '@/api/types';
import { RrhForm } from '@/components/form/RrhForm';
import { dowLoadModuleOptions, downloadStatusOptions } from '@/lib/const';
type FormData = {
  createTime: { from: string; to: string };
  exportPath: string;
  status: string;
};
export const DownloadsForm = ({
  setCommonParams,
  reset,
  commonParams,
}: {
  setCommonParams: Dispatch<SetStateAction<Omit<DownloadsListParams, keyof BasicParams>>>;
  reset: () => void;
  commonParams: Omit<DownloadsListParams, keyof BasicParams>;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      exportPath: commonParams.exportPath,
      status: commonParams.status,
      createTime: {
        from: commonParams.beginTime ? formatDate(commonParams.beginTime) : '',
        to: commonParams.endTime ? formatDate(commonParams.endTime) : '',
      },
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setCommonParams({
      exportPath: data.exportPath,
      status: data.status,
      beginTime: data.createTime.from,
      endTime: data.createTime.to,
    });
  };
  const onReset = () => {
    reset();
    form.reset({
      exportPath: '',
      status: '',
      createTime: {
        from: '',
        to: '',
      },
    });
  };

  return (
    <RrhForm
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
      onReset={onReset}
      className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20 md:px-12 md:pt-12"
    >
      <FormSelect
        name="exportPath"
        label={t('downloadsPage.moduleName')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={dowLoadModuleOptions.map(i => ({ label: t(i.label), value: i.value }))}
      />
      <FormSelect
        name="status"
        label={t('table.status')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={downloadStatusOptions.map(i => ({ label: t(i.label), value: i.value }))}
      />
      <FormField
        name="tradingTime"
        render={() => (
          <FormItem className="flex flex-col gap-2 text-sm">
            <FormLabel className="basis-3/12">{t('common.createTime')}</FormLabel>
            <FormControl className="basis-9/12">
              <FormDateRangeInput name="createTime" control={form.control} />
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
        <RrhButton type="submit">
          <Search className="size-3.5" />
          <span>{t('common.Search')}</span>
        </RrhButton>
      </div>
    </RrhForm>
  );
};
