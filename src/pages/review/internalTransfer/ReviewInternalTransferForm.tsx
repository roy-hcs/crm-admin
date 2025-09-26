import { RrhButton } from '@/components/common/RrhButton';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
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
import { InternalTransferListParams } from '@/api/hooks/review/types';
import { Dispatch, SetStateAction } from 'react';

type FormData = {
  name: string;
  status: string | number;
  submitTime: { from: string; to: string };
  inAccount: string;
  outAccount: string;
  verifyUserName: string;
  dealTicket: string;
};

export const ReviewInternalTransferForm = ({
  setOtherParams,
  setParams,
  loading,
}: {
  setParams: Dispatch<SetStateAction<InternalTransferListParams['params']>>;
  setOtherParams: Dispatch<SetStateAction<Omit<InternalTransferListParams, 'params'>>>;
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      status: '',
      inAccount: '',
      outAccount: '',
      dealTicket: '',
      verifyUserName: '',
      submitTime: { from: '', to: '' },
    },
  });

  const onSubmit = (data: FormData) => {
    setOtherParams({
      userId: data.name,
      status: data.status,
      dealTicket: data.dealTicket,
      verifyUserName: data.verifyUserName,
    });
    setParams({
      fuzzyStartTime: data.submitTime.from,
      fuzzyEndTime: data.submitTime.to,
      fuzzyOutAccount: data.outAccount,
      fuzzyInAccount: data.inAccount,
    });
  };
  const onReset = () => {
    setOtherParams({
      userId: '',
      status: '',
      verifyUserName: '',
      dealTicket: '',
    });
    setParams({
      fuzzyStartTime: '',
      fuzzyEndTime: '',
      fuzzyOutAccount: '',
      fuzzyInAccount: '',
    });
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
            name="name"
            label={t('table.fullName')}
            placeholder={t('common.pleaseInput', { field: t('table.fullName') })}
          />
          <FormSelect
            verticalLabel
            name="verifyStatus"
            label={t('table.status')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={[
              { label: t('table.pending'), value: '2' },
              { label: t('table.reviewing'), value: '-1' },
              { label: t('table.pass'), value: '1' },
              { label: t('table.refuse'), value: '0' },
            ]}
          />
          <FormField
            name="submitTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12 text-[#757F8D]">{t('table.submitTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="submitTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormInput
            verticalLabel
            name="transferOutAccount"
            label={t('table.transferOutAccount')}
            placeholder={t('common.pleaseInput', { field: t('table.transferOutAccount') })}
          />
          <FormInput
            verticalLabel
            name="transferInAccount"
            label={t('table.transferInAccount')}
            placeholder={t('common.pleaseInput', { field: t('table.transferInAccount') })}
          />

          <FormInput
            verticalLabel
            name="verifyUserName"
            label={t('table.currentAuditor')}
            placeholder={t('common.pleaseInput', { field: t('table.currentAuditor') })}
          />
          <FormInput
            verticalLabel
            name="tradeServerOrderNumber"
            label={t('table.tradeServerOrderNumber')}
            placeholder={t('common.pleaseInput', { field: t('table.tradeServerOrderNumber') })}
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
