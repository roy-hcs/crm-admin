import { RrhButton } from '@/components/common/RrhButton';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { applySourceMap, reviewStatusMap } from '@/lib/constant';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useForm } from 'react-hook-form';
import { AgentApplyListParams } from '@/api/hooks/review';
import { formatDate } from '@/lib/utils';
import { RrhForm } from '@/components/form/RrhForm';

type FormData = {
  name: string;
  mobile: string | number;
  email: string;
  verifyStatus: string | number;
  submitTime: { from: string; to: string };
  applySource: string | number;
  verifyUserName: string;
};

export const ReviewAgentForm = ({
  setOtherParams,
  setParams,
  loading,
  reset,
  params,
  otherParams,
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
  reset: () => void;
  params: AgentApplyListParams['params'];
  otherParams: Omit<AgentApplyListParams, 'params'>;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      name: otherParams.name || '',
      mobile: otherParams.mobile || '',
      email: otherParams.email || '',
      verifyStatus: otherParams.verifyStatus || '',
      applySource: otherParams.applySource || '',
      verifyUserName: otherParams.verifyUserName || '',
      submitTime: { from: params.beginTime || '', to: params.endTime || '' },
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setOtherParams({
      name: data.name,
      mobile: data.mobile,
      email: data.email,
      verifyStatus: data.verifyStatus?.toString(),
      applySource: data.applySource?.toString(),
      verifyUserName: data.verifyUserName,
    });
    setParams({
      beginTime: formatDate(data.submitTime.from),
      endTime: formatDate(data.submitTime.to),
    });
  };
  const onReset = () => {
    reset();
    form.reset({
      name: '',
      mobile: '',
      email: '',
      verifyStatus: '',
      applySource: '',
      verifyUserName: '',
      submitTime: { from: '', to: '' },
    });
  };
  return (
    <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              if (e.target instanceof HTMLTextAreaElement) return;

              e.preventDefault();
              form.handleSubmit(onSubmit)();
            }
          }}
          className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20 md:px-12 md:pt-12"
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
                <FormLabel className="text-foreground basis-3/12">
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
          <div className="bg-background absolute inset-x-0 bottom-0 flex justify-end gap-4 p-4">
            <RrhButton type="reset" variant="outline" onClick={onReset}>
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
