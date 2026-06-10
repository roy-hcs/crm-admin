import { Dispatch, SetStateAction } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { infoTypesMap } from '@/lib/constant';
import { GetMsgListParams } from '@/api/hooks/message';
import { BasicParams } from '@/api/types';
import { formatDate } from '@/lib/utils';
import { RrhForm } from '@/components/form/RrhForm';

type FormData = {
  name: string;
  title: string;
  type: string;
  sendTime: { from: string; to: string };
};

export const MessageManagementForm = ({
  setOtherParams,
  setParams,
  loading,
  params,
  otherParams,
  reset,
}: {
  setParams: Dispatch<SetStateAction<GetMsgListParams['params']>>;
  setOtherParams: Dispatch<SetStateAction<Omit<GetMsgListParams, 'params' | keyof BasicParams>>>;
  loading: boolean;
  params: GetMsgListParams['params'];
  otherParams: Omit<GetMsgListParams, 'params'>;
  reset: () => void;
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      name: params?.fuzzyName || '',
      title: params?.fuzzyTitle || '',
      type: (otherParams as { type?: string })?.type || '',
      sendTime: {
        from: params?.sendStartTime || '',
        to: params?.sendEndTime || '',
      },
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setOtherParams({
      type: data.type,
    });
    setParams({
      sendStartTime: formatDate(data.sendTime.from),
      sendEndTime: formatDate(data.sendTime.to),
      fuzzyName: data.name,
      fuzzyTitle: data.title,
    });
  };

  const onReset = () => {
    reset();
    form.reset({
      name: '',
      title: '',
      type: '',
      sendTime: { from: '', to: '' },
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
        name="title"
        label={t('table.title')}
        placeholder={t('common.pleaseInput', { field: t('table.title') })}
      />

      <FormSelect
        verticalLabel
        name="type"
        label={t('table.infoType')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={Object.entries(infoTypesMap).map(([key, value]) => ({
          label: t(`messageManagement.${value}`),
          value: key,
        }))}
      />
      <FormInput
        name="name"
        label={t('table.submitter')}
        placeholder={t('common.pleaseInput', { field: t('table.nameOrLastNameOrId') })}
      />
      <FormField
        name="sendTime"
        render={() => (
          <FormItem className="flex flex-col gap-2 text-sm">
            <FormLabel className="text-foreground basis-3/12">{t('table.sendTime')}</FormLabel>
            <FormControl className="basis-9/12">
              <FormDateRangeInput name="sendTime" control={form.control} />
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
    </RrhForm>
  );
};
