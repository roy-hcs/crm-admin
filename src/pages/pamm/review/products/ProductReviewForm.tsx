import { Dispatch, SetStateAction } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { useForm } from 'react-hook-form';
import { FormProvider } from '@/contexts/form';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ProductReviewListParams } from '@/api/hooks/pamm/type';
import { commissionReviewOptions } from '@/lib/const';
import { formatDate } from '@/lib/utils';

type FormData = {
  submitTime: { from: string; to: string };
  verifyTime: { from: string; to: string };
  investmentManager: string;
  projectName: string;
  login: string;
  applyStatus: string;
};

export const ProductReviewForm = ({
  setOtherParams,
  reset,
  otherParams,
}: {
  setOtherParams: Dispatch<SetStateAction<Omit<ProductReviewListParams, 'BasicParams'>>>;
  reset: () => void;
  otherParams: Omit<ProductReviewListParams, 'BasicParams'>;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      submitTime: { from: otherParams.submitStartTime || '', to: otherParams.submitEndTime || '' },
      verifyTime: { from: otherParams.verifyStartTime || '', to: otherParams.verifyEndTime || '' },
      investmentManager: otherParams.investmentManager || '',
      projectName: otherParams.projectName || '',
      login: otherParams.login || '',
      applyStatus: otherParams.applyStatus || '',
    },
  });

  const onSubmit = (data: FormData) => {
    setOtherParams({
      projectName: data.projectName,
      investmentManager: data.investmentManager,
      login: data.login,
      applyStatus: data.applyStatus,
      submitStartTime: formatDate(data.submitTime.from),
      submitEndTime: formatDate(data.submitTime.to),
      verifyStartTime: formatDate(data.verifyTime.from),
      verifyEndTime: formatDate(data.verifyTime.to),
    });
  };

  const onReset = () => {
    reset();
    form.reset({
      submitTime: { from: '', to: '' },
      verifyTime: { from: '', to: '' },
      investmentManager: '',
      projectName: '',
      login: '',
      applyStatus: '',
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
            name="investmentManager"
            label={t('productReview.investmentManager')}
            placeholder={t('common.pleaseInput', {
              field: t('productReview.investmentManager'),
            })}
          />
          <FormInput
            verticalLabel
            name="projectName"
            label={t('table.projectName')}
            placeholder={t('common.pleaseInput', {
              field: t('table.projectName'),
            })}
          />
          <FormField
            name="submitTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('table.submitTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="submitTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="verifyTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('table.verifyTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="verifyTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormInput
            verticalLabel
            name="login"
            label={t('table.login')}
            placeholder={t('common.pleaseInput', {
              field: t('table.login'),
            })}
          />
          <FormSelect
            verticalLabel
            name="applyStatus"
            label={t('table.status')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={commissionReviewOptions.map(i => ({
              label: t(i.label),
              value: i.value,
            }))}
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
