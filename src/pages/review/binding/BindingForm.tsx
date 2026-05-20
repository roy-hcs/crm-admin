import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import { CrmNewLoginVerifyListParams } from '@/api/hooks/review';
import { typeOptions, VerifyStatusOptions } from '@/lib/const';
import { useServerList } from '@/api/hooks/system/system';
import { BaseOption } from '@/components/common/RrhSelect';
import { serverMap } from '@/lib/constant';
import { formatDate } from '@/lib/utils';
import { RrhForm } from '@/components/form/RrhForm';

type FormData = {
  time: { from: string; to: string };
  server: string;
  serverType: string;
  serverProperty: string;
  userId: string;
  status: string;
  login: string;
  verifyUserName: string;
};
export const BindingForm = ({
  setParams,
  setCommonParams,
  reset,
  params,
  commonParams,
}: {
  setParams: Dispatch<SetStateAction<CrmNewLoginVerifyListParams['params']>>;
  setCommonParams: Dispatch<
    SetStateAction<{ userId: string; status: string; login: string; verifyUserName: string }>
  >;
  reset: () => void;
  params: CrmNewLoginVerifyListParams['params'];
  commonParams: { userId: string; status: string; login: string; verifyUserName: string };
}) => {
  const { data: server } = useServerList();
  const serverOptions = server?.rows || [];
  const { t } = useTranslation();

  const form = useForm({
    defaultValues: {
      server: params.server || '',
      serverType: params.serverType || '',
      serverProperty: params.serverProperty || '',
      userId: commonParams.userId || '',
      status: commonParams.status || '',
      login: commonParams.login || '',
      verifyUserName: commonParams.verifyUserName || '',
      time: { from: params.beginTime || '', to: params.endTime || '' },
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setParams(pre => ({
      ...pre,
      server: data.server,
      serverType: data.serverType,
      serverProperty: data.serverProperty,
      beginTime: formatDate(data.time.from),
      endTime: formatDate(data.time.to),
    }));
    setCommonParams({
      userId: data.userId,
      status: data.status,
      login: data.login,
      verifyUserName: data.verifyUserName,
    });
  };

  const onReset = () => {
    reset();
    form.reset({
      server: '',
      serverType: '',
      serverProperty: '',
      userId: '',
      status: '',
      login: '',
      verifyUserName: '',
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
        verticalLabel
        name="userId"
        label={t('paymentOrders.userName')}
        placeholder={t('common.pleaseInput', {
          field: t('paymentOrders.userName'),
        })}
      />
      <FormInput
        verticalLabel
        name="login"
        label={t('table.tradingAccount')}
        placeholder={t('common.pleaseInput', {
          field: t('table.tradingAccount'),
        })}
      />

      <FormSelect<
        Record<string, string>,
        BaseOption & {
          serviceProperty: number;
          serviceType: number;
        }
      >
        verticalLabel
        name="serverId"
        label={t('table.server')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={serverOptions.map(item => ({
          label: item.serverName,
          value: item.id,
          serviceProperty: item.serviceProperty,
          serviceType: item.serviceType,
        }))}
        renderItem={option => {
          return (
            <div>
              {/* TODO: 优化样式 */}
              <span>{option.serviceProperty === 1 ? t('common.live') : t('common.demo')}</span>
              {option.serviceType && <span> {serverMap[option.serviceType]} | </span>}
              <span>{option.label}</span>
            </div>
          );
        }}
      />
      <FormSelect
        verticalLabel
        name="serverProperty"
        label={t('common.type')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={typeOptions.map(i => ({
          label: t(i.label),
          value: i.value,
        }))}
      />
      <FormSelect
        verticalLabel
        name="status"
        label={t('table.status')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={VerifyStatusOptions.map(i => ({ label: t(i.label), value: i.value }))}
      />
      <FormField
        name="time"
        render={() => (
          <FormItem className="flex flex-col gap-2 text-sm">
            <FormLabel className="basis-3/12">{t('common.subTime')}</FormLabel>
            <FormControl className="basis-9/12">
              <FormDateRangeInput name="time" control={form.control} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormInput
        verticalLabel
        name="verifyUserName"
        label={t('information.verifyUserName')}
        placeholder={t('common.pleaseInput', {
          field: t('information.verifyUserName'),
        })}
      />
      <div className="bg-background absolute inset-x-0 bottom-0 flex justify-end gap-4 p-4">
        <RrhButton type="reset" variant={'outline'} onClick={onReset}>
          <RefreshCcw className="size-3.5" />
          <span>{t('common.Reset')}</span>
        </RrhButton>
        <RrhButton type="submit">
          <Search className="size-3.5" />
          <span>{t('common.Search')}</span>
        </RrhButton>
      </div>
    </RrhForm>
  );
};
