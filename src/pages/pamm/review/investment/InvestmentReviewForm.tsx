import { RrhButton } from '@/components/common/RrhButton';
import { FormInput } from '@/components/form/FormInput';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FormProvider } from '@/contexts/form';
import { useForm } from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';
import { FormSelect } from '@/components/form/FormSelect';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { PammAuditLogListParams } from '@/api/hooks/pamm/type';
import { InvestmentReviewOperTypeOptions, InvestmentReviewStatusOptions } from '@/lib/const';
import { formatDate } from '@/lib/utils';

type FormData = {
  createTime: { from: string; to: string };
  auditTime: { from: string; to: string };
  projectName: string;
  investor: string;
  operType: string;
  orderNo: string;
  auditStatus: string;
};

export const InvestmentReviewForm = ({
  setOtherParams,
  loading,
}: {
  setOtherParams: Dispatch<SetStateAction<Omit<PammAuditLogListParams, 'BasicParams'>>>;
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      createTime: { from: '', to: '' },
      auditTime: { from: '', to: '' },
      projectName: '',
      investor: '',
      operType: '',
      orderNo: '',
      auditStatus: '',
    },
  });
  const onSubmit = (data: FormData) => {
    setOtherParams(pre => ({
      ...pre,
      projectName: data.projectName,
      investor: data.investor,
      operType: data.operType,
      orderNo: data.orderNo,
      auditStatus: data.auditStatus,

      createStartTime: formatDate(data.createTime.from),
      createEndTime: formatDate(data.createTime.to),

      auditStartTime: formatDate(data.auditTime.from),
      auditEndTime: formatDate(data.auditTime.to),
    }));
  };
  const onReset = () => {
    setOtherParams(pre => ({
      ...pre,
      projectName: '',
      investor: '',
      operType: '',
      orderNo: '',
      auditStatus: '',
      createStartTime: '',
      createEndTime: '',
      auditStartTime: '',
      auditEndTime: '',
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
            name="projectName"
            label={t('table.projectName')}
            placeholder={t('common.pleaseInput', {
              field: t('table.projectName'),
            })}
          />
          <FormInput
            verticalLabel
            name="investor"
            label={t('table.customerName')}
            placeholder={t('common.pleaseInput', {
              field: t('table.customerName'),
            })}
          />
          <FormSelect
            verticalLabel
            name="operType"
            label={t('investmentReview.operType')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={InvestmentReviewOperTypeOptions.map(i => ({
              label: t(i.label),
              value: i.value,
            }))}
          />
          <FormInput
            verticalLabel
            name="orderNo"
            label={t('table.orderNumber')}
            placeholder={t('common.pleaseInput', {
              field: t('table.orderNumber'),
            })}
          />
          <FormSelect
            verticalLabel
            name="auditStatus"
            label={t('table.status')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={InvestmentReviewStatusOptions.map(i => ({
              label: t(i.label),
              value: i.value,
            }))}
          />
          <FormField
            name="createTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('table.submitTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="createTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="auditTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('table.verifyTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="auditTime" control={form.control} />
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
