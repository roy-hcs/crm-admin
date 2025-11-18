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
import dayjs from 'dayjs';
import { FormSelect } from '@/components/form/FormSelect';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { ProductReviewListParams } from '@/api/hooks/pamm/type';
import { commissionReviewOptions } from '@/lib/const';

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
  loading,
}: {
  setOtherParams: Dispatch<SetStateAction<Omit<ProductReviewListParams, 'BasicParams'>>>;
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      submitTime: { from: '', to: '' },
      verifyTime: { from: '', to: '' },
      investmentManager: '',
      projectName: '',
      login: '',
      applyStatus: '',
    },
  });
  const onSubmit = (data: FormData) => {
    setOtherParams(pre => ({
      ...pre,
      projectName: data.projectName,
      investmentManager: data.investmentManager,
      login: data.login,
      applyStatus: data.applyStatus,

      submitStartTime: data.submitTime.from ? dayjs(data.submitTime.from).format('YYYY-MM-DD') : '',
      submitEndTime: data.submitTime.to ? dayjs(data.submitTime.to).format('YYYY-MM-DD') : '',
      verifyStartTime: data.verifyTime.from ? dayjs(data.verifyTime.from).format('YYYY-MM-DD') : '',
      verifyEndTime: data.verifyTime.to ? dayjs(data.verifyTime.to).format('YYYY-MM-DD') : '',
    }));
  };
  const onReset = () => {
    setOtherParams(pre => ({
      ...pre,
      investmentManager: '',
      projectName: '',
      submitStartTime: '',
      submitEndTime: '',
      verifyStartTime: '',
      verifyEndTime: '',
      login: '',
      applyStatus: '',
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
