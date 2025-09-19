import { PositionOrderParams } from '@/api/hooks/report/types';
import { useGetDealAccountGroupList, useGetGroupByServer } from '@/api/hooks/system/system';
import { ServerItem } from '@/api/hooks/system/types';
import { RrhButton } from '@/components/common/RrhButton';
import { BaseOption } from '@/components/common/RrhMultiSelect';
import { RrhSelectAccountsPopup } from '@/components/common/RrhSelectAccountPopup';
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

type FormData = {
  serverId: string;
  serverGroupList: string[];
  type: number | string;
  name: string;
  login: string;
  symbol: string;
  ticket: string;
  accounts: string;
  accountGroupList: string[];
  openTime: { from: string; to: string };
};

export interface PositionOrderRef {
  onReset: () => void;
}

export const PositionOrderForm = ({
  serverList,
  serverListLoading,
  setOtherParams,
  setParams,
}: {
  serverList: ServerItem[];
  serverListLoading: boolean;
  setParams: (params: PositionOrderParams['params']) => void;
  setOtherParams: (params: {
    server?: string;
    type?: number | string;
    accountGroupList?: string;
    accounts?: string;
    serverGroupList?: string;
  }) => void;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      serverId: '',
      serverGroupList: [],
      type: '',
      name: '',
      login: '',
      symbol: '',
      ticket: '',
      accounts: '',
      accountGroupList: [],
      openTime: { from: '', to: '' },
    },
  });
  if (!form.getValues('serverId') && serverList.length && !serverListLoading) {
    form.setValue('serverId', serverList[0].id, { shouldDirty: false, shouldTouch: false });
  }

  const { data: groupData } = useGetGroupByServer({
    serverId: form.watch('serverId'),
  });

  const { data: dealAccountGroupListData } = useGetDealAccountGroupList();

  const onSubmit = (data: FormData) => {
    const selectedAccounts = JSON.parse(data.accounts || '{"id": "", "label": ""}') as {
      id: string;
      label: string;
    };
    setOtherParams({
      server: data.serverId,
      serverGroupList: data.serverGroupList.join(','),
      type: data.type,
      accountGroupList: data.accountGroupList.join(','),
      accounts: selectedAccounts.id,
    });
    setParams({
      random: new Date().getTime() + '' + Math.floor(Math.random() * 100 + 1),
      positionFuzzyName: data.name,
      positionFuzzyLogin: data.login,
      positionFuzzySymbol: data.symbol,
      positionFuzzyTicket: data.ticket,
      accounts: selectedAccounts.label,
      positionDealBJStartTime: data.openTime.from,
      positionDealBJEndTime: data.openTime.to,
    });
  };
  const onReset = () => {
    setOtherParams({
      server: form.watch('serverId') || '',
      serverGroupList: '',
      type: '',
      accountGroupList: '',
      accounts: '',
    });
    setParams({
      random: new Date().getTime() + '' + Math.floor(Math.random() * 100 + 1),
      positionFuzzyName: '',
      positionFuzzyLogin: '',
      positionFuzzySymbol: '',
      positionFuzzyTicket: '',
      accounts: '',
      positionDealBJStartTime: '',
      positionDealBJEndTime: '',
    });
    form.reset();
  };
  return (
    <FormProvider form={form}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
          className="flex flex-col gap-4 overflow-auto p-4"
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
          <FormMultiSelect
            verticalLabel
            name="accountGroupList"
            label={t('table.accountGroup')}
            placeholder={t('common.pleaseSelect')}
            options={
              dealAccountGroupListData?.map(item => ({
                label: item.name,
                value: item.id,
              })) || []
            }
          />
          <FormField
            name="accounts"
            render={({ field }) => {
              return <RrhSelectAccountsPopup verticalLabel field={field} />;
            }}
          />

          <FormField
            name="openTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12 text-[#757F8D]">{t('table.time')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="openTime" control={form.control} />
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
