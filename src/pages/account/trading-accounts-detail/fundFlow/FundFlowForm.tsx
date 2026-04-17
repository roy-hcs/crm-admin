import { RrhButton } from '@/components/common/RrhButton';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { FormInput } from '@/components/form/FormInput';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useForm } from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';
import { formatDate } from '@/lib/utils';
import { BasicParams } from '@/api/types';
import { CrmDealAccountFundFlowParams } from '@/api/hooks/account';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import { RrhForm } from '@/components/form/RrhForm';

type FormData = {
  ticket: string;
  opeTypeList: string;
  comment: string;
  time: { from: string; to: string };
};

export const FundFlowForm = ({
  setOtherParams,
  setParams,
  loading,
  reset,
  typeOptions,
  params,
  otherParams,
}: {
  setParams: Dispatch<SetStateAction<CrmDealAccountFundFlowParams['params']>>;
  setOtherParams: Dispatch<
    SetStateAction<Omit<CrmDealAccountFundFlowParams, 'params' | keyof BasicParams>>
  >;
  loading: boolean;
  reset: () => void;
  typeOptions: Array<{ label: string; value: string }>;
  params: CrmDealAccountFundFlowParams['params'];
  otherParams: Omit<CrmDealAccountFundFlowParams, 'params' | keyof BasicParams>;
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      ticket: otherParams.ticket || '',
      opeTypeList: otherParams.opeTypeList || '',
      comment: otherParams.comment || '',
      time: { from: params.operationStart || '', to: params.operationEnd || '' },
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setOtherParams({
      ticket: data.ticket,
      opeTypeList: data.opeTypeList,
      comment: data.comment,
    });
    setParams(pre => ({
      ...pre,
      operationStart: formatDate(data.time.from),
      operationEnd: formatDate(data.time.to),
    }));
  };
  const onReset = () => {
    reset();
    form.reset({
      ticket: '',
      opeTypeList: '',
      comment: '',
      time: { from: '', to: '' },
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
            name="ticket"
            label={t('table.orderNumber')}
            placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
          />
          <FormMultiSelect
            verticalLabel
            name="opeTypeList"
            label={t('table.operationType')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={typeOptions}
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
          <FormInput
            verticalLabel
            name="comment"
            label={t('table.comment')}
            placeholder={t('common.pleaseInput', { field: t('table.comment') })}
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
