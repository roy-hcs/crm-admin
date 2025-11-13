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
import { FormSelect } from '@/components/form/FormSelect';
import { priorityOptions, ticketStatusOptions } from '@/lib/const';
import { CrmTicketParams } from '@/api/hooks/ticket/types';
import dayjs from 'dayjs';
import { BasicParams } from '@/api/types';

type FormData = {
  isAll: string;
  orderId: string;
  content: string;
  priority: string;
  status: string;
  time: { from: string; to: string };
};

export const MyTicketsForm = ({
  setOtherParams,
  loading,
  showStatus = true,
}: {
  setOtherParams: Dispatch<SetStateAction<Omit<CrmTicketParams, keyof BasicParams>>>;
  loading: boolean;
  showStatus?: boolean;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      isAll: '',
      orderId: '',
      content: '',
      priority: '',
      status: '',
      time: { from: '', to: '' },
    },
  });

  const onSubmit = (data: FormData) => {
    const submitData: Omit<CrmTicketParams, keyof BasicParams> = {
      isAll: data.isAll,
      orderId: data.orderId,
      content: data.content,
      priority: data.priority,
      startDate: data.time.from ? dayjs(data.time.from).format('YYYY-MM-DD') : '',
      endDate: data.time.to ? dayjs(data.time.to).format('YYYY-MM-DD') : '',
    };
    if (showStatus) {
      submitData.status = data.status;
    }
    setOtherParams(submitData);
  };
  const onReset = () => {
    const resetData: Omit<CrmTicketParams, keyof BasicParams> = {
      isAll: '',
      orderId: '',
      content: '',
      priority: '',
      startDate: '',
      endDate: '',
    };

    if (showStatus) {
      resetData.status = '';
    }
    setOtherParams(resetData);
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
            name="orderId"
            label={t('ticketList.orderId')}
            placeholder={t('common.pleaseInput', { field: t('ticketList.orderId') })}
          />
          <FormInput
            verticalLabel
            name="content"
            label={t('ticketList.content')}
            placeholder={t('common.pleaseInput', { field: t('ticketList.content') })}
          />
          <FormSelect
            verticalLabel
            name="priority"
            label={t('ticketList.priority')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={priorityOptions.map(i => ({ label: t(i.label), value: i.value }))}
          />
          <FormField
            name="time"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('common.createTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="time" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {showStatus && (
            <FormSelect
              verticalLabel
              name="status"
              label={t('common.status')}
              placeholder={t('common.pleaseSelect')}
              showRowValue={false}
              options={ticketStatusOptions.map(i => ({ label: t(i.label), value: i.value }))}
            />
          )}

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
