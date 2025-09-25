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
import { applySourceMap, reviewStatusMap } from '@/lib/constant';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FormProvider } from '@/contexts/form';
import { useForm } from 'react-hook-form';
import { AgentApplyListParams } from '@/api/hooks/review/types';

type FormData = {
  name: string;
  mobile: string | number;
  email: string;
  verifyStatus: string;
  submitTime: { from: string; to: string };
  applySource: string;
  verifyUserName: string;
};

export const ReviewAgentForm = ({
  setOtherParams,
  setParams,
  loading,
}: {
  setParams: (params: AgentApplyListParams['params']) => void;
  setOtherParams: (params: {
    name?: string;
    mobile?: number | string;
    email?: string;
    verifyStatus?: string;
    applySource?: string;
    verifyUserName?: string;
  }) => void;
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      name: '',
      mobile: '',
      email: '',
      verifyStatus: '',
      applySource: '',
      verifyUserName: '',
      submitTime: { from: '', to: '' },
    },
  });

  const onSubmit = (data: FormData) => {
    setOtherParams({
      name: data.name,
      mobile: data.mobile,
      email: data.email,
      verifyStatus: data.verifyStatus,
      applySource: data.applySource,
      verifyUserName: data.verifyUserName,
    });
    setParams({
      beginTime: data.submitTime.from,
      endTime: data.submitTime.to,
    });
  };
  const onReset = () => {
    setOtherParams({
      name: '',
      mobile: '',
      email: '',
      verifyStatus: '',
      applySource: '',
      verifyUserName: '',
    });
    setParams({
      beginTime: '',
      endTime: '',
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
          <FormInput
            verticalLabel
            name="mobile"
            label={t('table.mobile')}
            placeholder={t('common.pleaseInput', { field: t('table.mobile') })}
          />
          <FormInput
            verticalLabel
            name="email"
            label={t('table.email')}
            placeholder={t('common.pleaseInput', { field: t('table.email') })}
          />
          <FormSelect
            verticalLabel
            name="verifyStatus"
            label={t('table.status')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={Object.entries(reviewStatusMap).map(([key, value]) => {
              return { label: t(`table.${value}`), value: key };
            })}
          />
          <FormField
            name="submitTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12 text-[#757F8D]">
                  {t('table.orderPlacementTime')}
                </FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="submitTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormSelect
            verticalLabel
            name="applySource"
            label={t('table.applySource')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={Object.entries(applySourceMap).map(([key, value]) => {
              return { label: t(`table.${value}`), value: key };
            })}
          />
          <FormInput
            verticalLabel
            name="verifyUserName"
            label={t('table.currentAuditor')}
            placeholder={t('common.pleaseInput', { field: t('table.currentAuditor') })}
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
