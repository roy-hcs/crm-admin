import { RrhButton } from '@/components/common/RrhButton';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { FormInput } from '@/components/form/FormInput';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useForm } from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';
import { FundFlowParams } from '@/api/hooks/account/types';
import { formatDate } from '@/lib/utils';
import { BasicParams } from '@/api/types';
import { FormSelect } from '@/components/form/FormSelect';
import { useSelectMethod } from '@/hooks/useSelectMethod';
import { useGetDictType } from '@/api/hooks/system/system';
import { RrhForm } from '@/components/form/RrhForm';

type FormData = {
  inMethod: string;
  outMethod: string;
  transMethod: string;
  remaidMethod: string;
  walletId: string;
  operationType: string;
  serialNum: string;
  time: { from: string; to: string };
};

const operationTypeToMethodDictMap: Record<string, string> = {
  '1': 'crm_wallet_in_method',
  '2': 'crm_wallet_out_method',
  '3': 'crm_wallet_trans_method',
  '4': 'crm_wallet_remaid_method',
};

export const FundFlowForm = ({
  setOtherParams,
  setParams,
  loading,
  reset,
  typeOptions,
}: {
  setParams: Dispatch<SetStateAction<FundFlowParams['params']>>;
  setOtherParams: Dispatch<SetStateAction<Omit<FundFlowParams, 'params' | keyof BasicParams>>>;
  loading: boolean;
  reset: () => void;
  typeOptions: Array<{ label: string; value: string }>;
}) => {
  const { t } = useTranslation();
  const { mutateAsync: getDictType } = useGetDictType();
  const form = useForm<FormData>({
    defaultValues: {
      inMethod: '',
      outMethod: '',
      transMethod: '',
      remaidMethod: '',
      walletId: '',
      operationType: '',
      serialNum: '',
      time: { from: '', to: '' },
    },
  });

  const { options: inMethodOptions, loading: inMethodLoading } = useSelectMethod({
    form,
    operationTypeName: 'operationType',
    methodName: 'inMethod',
    operationTypeToDictTypeMap: operationTypeToMethodDictMap,
    fetchOptions: getDictType,
  });

  const onSubmit = (data: FormData) => {
    reset();
    setOtherParams({
      walletId: data.walletId,
      operationType: data.operationType,
      serialNum: data.serialNum,
    });
    setParams(pre => ({
      ...pre,
      operationStart: formatDate(data.time.from),
      operationEnd: formatDate(data.time.to),
      inMethod: data.inMethod,
      outMethod: data.outMethod,
      transMethod: data.transMethod,
      remaidMethod: data.remaidMethod,
    }));
  };
  const onReset = () => {
    reset();
    form.reset({
      inMethod: '',
      outMethod: '',
      transMethod: '',
      remaidMethod: '',
      walletId: '',
      operationType: '',
      serialNum: '',
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
          <FormSelect
            verticalLabel
            name="operationType"
            label={t('table.operationType')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={typeOptions}
          />

          <FormSelect
            verticalLabel
            name="inMethod"
            label={t('table.inMethod')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={inMethodOptions}
            loading={inMethodLoading}
          />

          <FormInput
            verticalLabel
            name="serialNum"
            label={t('walletTransactions.serialNumTable')}
            placeholder={t('common.pleaseInput', { field: t('walletTransactions.serialNumTable') })}
          />

          <FormField
            name="time"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">
                  {t('walletTransactions.operationTimeTable')}
                </FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="time" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
