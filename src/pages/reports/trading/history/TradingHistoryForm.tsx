import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { RefreshCcw, Search } from 'lucide-react';
import { FormInput } from '@/components/form/FormInput';
import { FormProvider } from '@/contexts/form';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhButton } from '@/components/common/RrhButton';
import { useTranslation } from 'react-i18next';
import { ServerItem } from '@/api/hooks/system/types';
import { BaseOption } from '@/components/common/RrhSelect';
import { useGetDealAccountGroupList, useGetGroupByServer } from '@/api/hooks/system/system';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import { RrhSelectAccountsPopup } from '@/components/common/RrhSelectAccountPopup';
import { serverMap } from '@/lib/constant';

type FormData = {
  serverId: string;
  serverGroupList: string[];
  type: string;
  symbol: string;
  ticket: string;
  name: string;
  login: string;
  accountGroupList: string[];
  accounts: string;
  positionID: string;
  entry: string;
  openTime: { from: string; to: string };
  closeTime: { from: string; to: string };
};

export const TradingHistoryForm = ({
  setOtherParams,
  setParams,
  serverList,
  serverListLoading,
}: {
  serverList: ServerItem[];
  serverListLoading: boolean;
  setOtherParams: (params: {
    serverType: string;
    serverId: string;
    serverGroupList: string;
    serverGroup: string;
    type: string;
    symbol: string;
    ticket: string;
    login: string;
    accountGroupList: string;
    accounts: string;
    positionID: string;
    entry: string;
  }) => void;
  setParams: (params: {
    selectOther: string;
    historyDealBJStartTime: string;
    historyDealBJEndTime: string;
    historyCloseStartTime: string;
    historyCloseEndTime: string;
    accounts: string;
    historyFuzzyName: string;
  }) => void;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      serverId: '',
      serverGroupList: [],
      type: '',
      symbol: '',
      ticket: '',
      name: '',
      login: '',
      accounts: '',
      positionID: '',
      entry: '',
      accountGroupList: [],
      openTime: { from: '', to: '' },
      closeTime: { from: '', to: '' },
    },
  });

  if (!form.getValues('serverId') && serverList.length && !serverListLoading) {
    form.setValue('serverId', serverList[0].id, { shouldDirty: false, shouldTouch: false });
  }

  const { data: groupData } = useGetGroupByServer({
    serverId: form.watch('serverId'),
  });

  const { data: dealAccountGroupListData } = useGetDealAccountGroupList();

  const selectedServer = serverList.find(item => item.id === form.watch('serverId'));

  const onSubmit = (data: FormData) => {
    const selectedServer = serverList.find(item => item.id === data.serverId);
    if (!selectedServer) return;
    // 需要一个函数来处理selectOther的值，当data中除了serverId之外，任意一个字段值不为空（其中openTime和closeTime对应from和to有值）时，selectOther值为‘1’，否则为‘0’
    const selectedAccounts = JSON.parse(data.accounts || '{"id": "", "label": ""}') as {
      id: string;
      label: string;
    };
    setParams({
      selectOther: Object.keys(data).some(key => {
        if (key === 'accountGroupList' || key === 'serverGroupList') {
          return data[key] && data[key].length > 0;
        }
        if (key === 'openTime' || key === 'closeTime') {
          return data[key].from || data[key].to;
        }
        if (key !== 'serverId') {
          return data[key as keyof FormData];
        }
        return false;
      })
        ? '1'
        : '0',
      historyDealBJStartTime: data.openTime.from,
      historyDealBJEndTime: data.openTime.to,
      historyCloseStartTime: data.closeTime.from,
      historyCloseEndTime: data.closeTime.to,
      accounts: selectedAccounts.label,
      historyFuzzyName: data.name,
    });
    setOtherParams({
      serverType: selectedServer.serviceType.toString(),
      serverId: selectedServer.id,
      serverGroupList: data.serverGroupList.join(','),
      serverGroup:
        data.serverGroupList.length > 0
          ? data.serverGroupList[data.serverGroupList.length - 1]
          : '',
      type: data.type,
      symbol: data.symbol,
      ticket: data.ticket,
      login: data.login,
      accountGroupList: data.accountGroupList.join(','),
      accounts: selectedAccounts.id,
      positionID: data.positionID || '',
      entry: data.entry || '',
    });
  };
  const onReset = () => {
    form.reset();
    setParams({
      selectOther: '',
      historyDealBJStartTime: '',
      historyDealBJEndTime: '',
      historyCloseStartTime: '',
      historyCloseEndTime: '',
      historyFuzzyName: '',
      accounts: '',
    });
    setOtherParams({
      serverType: '',
      serverId: '',
      serverGroupList: '',
      serverGroup: '',
      type: '',
      symbol: '',
      ticket: '',
      login: '',
      accountGroupList: '',
      accounts: '',
      positionID: '',
      entry: '',
    });
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
          {selectedServer?.serviceType === 1 && (
            <FormInput
              verticalLabel
              name="positionID"
              label={t('table.positionID')}
              placeholder={t('common.pleaseSelect')}
            />
          )}

          <FormField
            name="openTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12 text-[#757F8D]">
                  {selectedServer?.serviceType === 1 ? t('table.tradingTime') : t('table.openTime')}
                </FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="openTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {selectedServer?.serviceType !== 1 && (
            <FormField
              name="closeTime"
              render={() => (
                <FormItem className="flex flex-col gap-2 text-sm">
                  <FormLabel className="basis-3/12 text-[#757F8D]">
                    {t('table.closeTime')}
                  </FormLabel>
                  <FormControl className="basis-9/12">
                    <FormDateRangeInput name="closeTime" control={form.control} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {selectedServer?.serviceType === 1 && (
            <FormSelect
              verticalLabel
              name="entry"
              label={t('table.entry')}
              placeholder={t('common.pleaseSelect')}
              showRowValue={false}
              options={[
                { label: 'in', value: 0 },
                { label: 'out', value: 1 },
                { label: 'in/out', value: 2 },
                { label: 'out by', value: 3 },
              ]}
            />
          )}

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
