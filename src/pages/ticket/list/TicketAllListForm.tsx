import { Dispatch, SetStateAction } from 'react';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { FormProvider } from '@/contexts/form';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UserItem } from '@/api/hooks/system';
import { CrmTicketParams } from '@/api/hooks/ticket/types';
import { BasicParams } from '@/api/types';
import { formatDate } from '@/lib/utils';
import { priorityOptions, ticketStatusOptions } from '@/lib/const';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

type FormData = {
  orderId: string;
  content: string;
  priority: string;
  status: string;
  receiverId: string;
  belongUser: string;
  time: { from: string; to: string };
};

export const TicketAllListForm = ({
  setParams,
  reset,
  params,
  userData,
}: {
  setParams: Dispatch<SetStateAction<Omit<CrmTicketParams, keyof BasicParams>>>;
  reset: () => void;
  params: Omit<CrmTicketParams, keyof BasicParams>;
  userData: UserItem[];
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      orderId: params.orderId || '',
      content: params.content || '',
      priority: params.priority || '',
      status: params.status || '',
      receiverId: params.receiverId || '',
      belongUser: params.belongUser || '',
      time: { from: '', to: '' },
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setParams({
      isAll: '1',
      orderId: data.orderId,
      content: data.content,
      priority: data.priority,
      startDate: formatDate(data.time.from),
      endDate: formatDate(data.time.to),
      status: data.status,
      receiverId: data.receiverId,
      belongUser: data.belongUser,
    });
  };

  const onReset = () => {
    reset();
    form.reset({
      orderId: '',
      content: '',
      priority: '',
      status: '',
      receiverId: '',
      belongUser: '',
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
          <FormSelect
            verticalLabel
            name="status"
            label={t('common.status')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={ticketStatusOptions.map(i => ({ label: t(i.label), value: i.value }))}
          />
          <FormSelect
            verticalLabel
            name="receiverId"
            label={t('ticketList.receiverId')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={userData.map(i => ({ label: i.wholeName, value: i.userId }))}
          />
          <FormInput
            verticalLabel
            name="belongUser"
            label={t('ticketList.belongUser')}
            placeholder={t('common.pleaseInput', { field: t('ticketList.belongUser') })}
          />

          <div className="bg-background absolute inset-x-0 bottom-0 flex justify-end gap-4 p-4">
            <RrhButton type="reset" variant="outline" onClick={onReset}>
              <RefreshCcw className="size-3.5" />
              <span>{t('common.Reset')}</span>
            </RrhButton>
            <RrhButton type="submit">
              <Search className="size-3.5" />
              <span>{t('common.Search')}</span>
            </RrhButton>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};
