import { LimitOrderListParams } from '@/api/hooks/report';
import { useGetGroupByServer } from '@/api/hooks/account';
import { ServerItem } from '@/api/hooks/system/types';
import { RrhButton } from '@/components/common/RrhButton';
import { BaseOption } from '@/components/common/RrhMultiSelect';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { FormInput } from '@/components/form/FormInput';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import { FormSelect } from '@/components/form/FormSelect';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from '@/components/ui/form';
import { serverMap } from '@/lib/constant';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FormProvider } from '@/contexts/form';
import { useForm } from 'react-hook-form';
import { formatDate } from '@/lib/utils';
import { Dispatch, SetStateAction } from 'react';
import { BasicParams } from '@/api/types';
import { SelectUpperDropdown } from '@/components/common/SelectUpperDropdown';

type FormData = {
  serverId: string;
  serverGroupList: string[];
  type: number | string;
  name: string;
  login: string;
  symbol: string;
  ticket: string;
  accounts: string;
  openTime: { from: string; to: string };
};

export const LimitOrderForm = ({
  serverList,
  serverListLoading,
  setOtherParams,
  setParams,
  loading,
  reset,
  params,
  otherParams,
}: {
  serverList: ServerItem[];
  serverListLoading: boolean;
  setParams: Dispatch<SetStateAction<LimitOrderListParams['params']>>;
  setOtherParams: Dispatch<
    SetStateAction<Omit<LimitOrderListParams, 'params' | keyof BasicParams>>
  >;
  loading: boolean;
  reset: () => void;
  params: LimitOrderListParams['params'];
  otherParams: Omit<LimitOrderListParams, 'params' | keyof BasicParams>;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      serverId: otherParams.server || '',
      serverGroupList: otherParams.serverGroupList ? otherParams.serverGroupList.split(',') : [],
      type: params.positionFuzzyType || '',
      name: params.positionFuzzyName || '',
      login: params.positionFuzzyLogin || '',
      symbol: params.positionFuzzySymbol || '',
      ticket: params.positionFuzzyTicket || '',
      accounts: otherParams.accounts || '',
      openTime: {
        from: params.positionDealBJStartTime || '',
        to: params.positionDealBJEndTime || '',
      },
    },
  });
  if (!form.getValues('serverId') && serverList.length && !serverListLoading) {
    form.setValue('serverId', serverList[0].id, { shouldDirty: false, shouldTouch: false });
  }

  const { data: groupData } = useGetGroupByServer({
    serverId: form.watch('serverId'),
  });

  const onSubmit = (data: FormData) => {
    reset();
    const selectedAccounts = JSON.parse(data.accounts || '{"id": "", "label": ""}') as {
      id: string;
      label: string;
    };
    setOtherParams({
      server: data.serverId,
      serverGroupList: data.serverGroupList.join(','),
      accounts: selectedAccounts.id,
    });
    setParams({
      positionFuzzyType: data.type,
      positionFuzzyName: data.name,
      positionFuzzyLogin: data.login,
      positionFuzzySymbol: data.symbol,
      positionFuzzyTicket: data.ticket,
      accounts: selectedAccounts.label,
      positionDealBJStartTime: formatDate(data.openTime.from),
      positionDealBJEndTime: formatDate(data.openTime.to),
    });
  };
  const onReset = () => {
    reset();
    form.reset({
      serverId: '',
      serverGroupList: [],
      type: '',
      name: '',
      login: '',
      symbol: '',
      ticket: '',
      accounts: '',
      openTime: { from: '', to: '' },
    });
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
          className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20 md:px-12 md:pt-12"
        >
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
            options={serverList.map(item => ({
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
          <FormMultiSelect
            verticalLabel
            name="serverGroupList"
            label={t('table.groups')}
            placeholder={t('common.pleaseSelect')}
            options={
              groupData
                ?.filter(item => item)
                .map(item => ({
                  label: item,
                  value: item,
                })) || []
            }
          />
          <FormSelect
            verticalLabel
            name="type"
            label={t('table.transactionType')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={[
              { label: 'buy', value: 0 },
              { label: 'sell', value: 1 },
            ]}
          />
          <FormInput
            verticalLabel
            name="symbol"
            label={t('table.symbol')}
            placeholder={t('common.pleaseInput', { field: t('table.symbol') })}
          />
          <FormInput
            verticalLabel
            name="ticket"
            type="number"
            label={t('table.orderNumber')}
            placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
          />
          <FormInput
            verticalLabel
            name="name"
            label={t('table.fullName')}
            placeholder={t('common.pleaseInput', { field: t('table.firstNameOrLastName') })}
          />

          <FormInput
            verticalLabel
            name="login"
            label={t('table.tradingAccount')}
            placeholder={t('common.pleaseInput', { field: t('table.tradingAccount') })}
          />
          <SelectUpperDropdown />

          <FormField
            name="openTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('table.orderPlacementTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="openTime" control={form.control} />
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
        </form>
      </Form>
    </FormProvider>
  );
};
