import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { RefreshCcw, Search } from 'lucide-react';
import { FormInput } from '@/components/form/FormInput';
import { FormProvider } from '@/contexts/form';
import { RrhButton } from '@/components/common/RrhButton';
import { useTranslation } from 'react-i18next';
import { EmailListParams } from '@/api/hooks/system';
import { Dispatch, SetStateAction } from 'react';
import { BasicParams } from '@/api/hooks/review/types';
import { FormSelect } from '@/components/form/FormSelect';
import { formatDate } from '@/lib/utils';

type FormData = {
  acceptEmail: string;
  title: string;
  status: string;
  sendTime: { from: string; to: string };
};

export const EmailLogsForm = ({
  setOtherParams,
  setParams,
  loading,
  reset,
  params,
  otherParams,
}: {
  setOtherParams: Dispatch<SetStateAction<Omit<EmailListParams, 'params' | keyof BasicParams>>>;
  setParams: Dispatch<SetStateAction<EmailListParams['params']>>;
  loading: boolean;
  reset: () => void;
  params: EmailListParams['params'];
  otherParams: Omit<EmailListParams, 'params' | keyof BasicParams>;
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      acceptEmail: otherParams.acceptEmail || '',
      title: otherParams.title || '',
      status: otherParams.status || '',
      sendTime: {
        from: params.sendStartTime || formatDate(new Date()),
        to: params.sendEndTime || '',
      },
    },
  });

  const onSubmit = (data: FormData) => {
    setParams(pre => ({
      ...pre,
      sendStartTime: formatDate(data.sendTime.from),
      sendEndTime: formatDate(data.sendTime.to),
    }));
    setOtherParams(pre => ({
      ...pre,
      title: data.title,
      acceptEmail: data.acceptEmail,
      status: data.status,
    }));
  };
  const onReset = () => {
    reset();
    form.reset({
      acceptEmail: '',
      title: '',
      status: '',
      sendTime: { from: formatDate(new Date()), to: '' },
    });
  };

  return (
    <FormProvider form={form}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
          className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20"
        >
          <FormInput
            verticalLabel
            name="acceptEmail"
            label={t('table.acceptEmail')}
            placeholder={t('common.pleaseInput', { field: t('table.acceptEmail') })}
          />
          <FormInput
            verticalLabel
            name="title"
            label={t('table.title')}
            placeholder={t('common.pleaseInput', { field: t('table.title') })}
          />
          <FormSelect
            verticalLabel
            name="status"
            label={t('common.status')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={[
              { label: t('table.sendSuccess'), value: '1' },
              { label: t('table.sendFailed'), value: '-1' },
            ]}
          />

          <FormField
            name="sendTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('table.sendTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="sendTime" control={form.control} />
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
