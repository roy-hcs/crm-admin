import { RrhButton } from '@/components/common/RrhButton';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { FormInput } from '@/components/form/FormInput';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useForm } from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';
import { CrmLoginInfoParams } from '@/api/hooks/system';
import { FormSelect } from '@/components/form/FormSelect';
import { adminOperationsStatusOptions } from '@/lib/const';
import { formatDate } from '@/lib/utils';
import { BasicParams } from '@/api/types';
import { RrhForm } from '@/components/form/RrhForm';

type FormData = {
  ipaddr: string;
  userName: string;
  status: string;
  loginLocation: string;
  time: { from: string; to: string };
};

export const CrmUserLoginForm = ({
  setOtherParams,
  setParams,
  loading,
  reset,
  params,
  otherParams,
}: {
  setParams: Dispatch<SetStateAction<CrmLoginInfoParams['params']>>;
  setOtherParams: Dispatch<SetStateAction<Omit<CrmLoginInfoParams, 'params' | keyof BasicParams>>>;
  loading: boolean;
  reset: () => void;
  params: CrmLoginInfoParams['params'];
  otherParams: Omit<CrmLoginInfoParams, 'params' | keyof BasicParams>;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      ipaddr: otherParams.ipaddr || '',
      userName: otherParams.userName || '',
      status: otherParams.status || '',
      loginLocation: otherParams.loginLocation || '',
      time: { from: params.beginTime || '', to: params.endTime || '' },
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setOtherParams({
      ipaddr: data.ipaddr,
      userName: data.userName,
      status: data.status === '3' ? '' : data.status,
      loginLocation: data.loginLocation,
    });
    setParams(pre => ({
      ...pre,
      beginTime: formatDate(data.time.from),
      endTime: formatDate(data.time.to),
    }));
  };
  const onReset = () => {
    reset();
    form.reset({
      ipaddr: '',
      userName: '',
      status: '',
      loginLocation: '',
      time: { from: '', to: '' },
    });
  };
  return (
    <RrhForm
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
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
        name="ipaddr"
        label={t('table.operationIP')}
        placeholder={t('common.pleaseInput', { field: t('table.operationIP') })}
      />
      <FormInput
        name="userName"
        label={t('adminLogin.name')}
        placeholder={t('common.pleaseInput', { field: t('adminLogin.name') })}
      />
      <FormSelect
        name="status"
        label={t('common.operStatus')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={adminOperationsStatusOptions.map(i => ({ label: t(i.label), value: i.value }))}
      />
      <FormField
        name="time"
        render={() => (
          <FormItem className="flex flex-col gap-2 text-sm">
            <FormLabel className="basis-3/12">{t('common.operTime')}</FormLabel>
            <FormControl className="basis-9/12">
              <FormDateRangeInput name="time" control={form.control} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormInput
        name="loginLocation"
        label={t('common.operLocation')}
        placeholder={t('common.pleaseInput', { field: t('common.operLocation') })}
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
