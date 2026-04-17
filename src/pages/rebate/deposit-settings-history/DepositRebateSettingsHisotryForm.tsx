import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { RefreshCcw, Search } from 'lucide-react';
import { FormInput } from '@/components/form/FormInput';

import { FormSelect } from '@/components/form/FormSelect';
import { RrhButton } from '@/components/common/RrhButton';
import { useTranslation } from 'react-i18next';
import { ServerItem } from '@/api/hooks/system/types';
import { BaseOption } from '@/components/common/RrhSelect';
import { useGetDealAccountGroupList, useGetGroupByServer } from '@/api/hooks/account';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import { serverMap } from '@/lib/constant';
import { formatDate } from '@/lib/utils';
import { Dispatch, SetStateAction } from 'react';
import { BasicParams } from '@/api/types';
import { RebateFeeSettingsHistoryListParams } from '@/api/hooks/rebate';
import { SelectUpperDropdown } from '@/components/common/SelectUpperDropdown';
import { RrhForm } from '@/components/form/RrhForm';

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
  entry: string;
  openTime: { from: string; to: string };
};

export const DepositRebateSettingsHistoryForm = ({
  setOtherParams,
  setParams,
  serverList,
  serverLoading,
  loading,
  reset,
  params,
  otherParams,
  setTimeStamp,
}: {
  serverList: ServerItem[];
  serverLoading: boolean;
  setOtherParams: Dispatch<
    SetStateAction<Omit<RebateFeeSettingsHistoryListParams, 'params' | keyof BasicParams>>
  >;
  setParams: Dispatch<SetStateAction<RebateFeeSettingsHistoryListParams['params']>>;
  loading: boolean;
  reset: () => void;
  params: RebateFeeSettingsHistoryListParams['params'];
  otherParams: Omit<RebateFeeSettingsHistoryListParams, 'params' | keyof BasicParams>;
  setTimeStamp: Dispatch<SetStateAction<number>>;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      serverId: otherParams.serverId || '',
      serverGroupList: otherParams.serverGroupList ? otherParams.serverGroupList.split(',') : [],
      type: otherParams.type ? otherParams.type.toString() : '',
      symbol: otherParams.symbol || '',
      ticket: otherParams.ticket || '',
      name: params.historyFuzzyName || '',
      login: otherParams.login || '',
      accounts: otherParams.accounts || '',
      entry: otherParams.entry.toString() || '',
      accountGroupList: otherParams.accountGroupList ? otherParams.accountGroupList.split(',') : [],
      openTime: {
        from: params.historyDealBJStartTime || '',
        to: params.historyDealBJEndTime || '',
      },
    },
  });

  if (!form.getValues('serverId') && serverList.length && !serverLoading) {
    form.setValue('serverId', serverList[0].id, { shouldDirty: false, shouldTouch: false });
  }

  const { data: groupData } = useGetGroupByServer({
    serverId: form.watch('serverId'),
  });

  const { data: dealAccountGroupListData } = useGetDealAccountGroupList();

  const selectedServer = serverList.find(item => item.id === form.watch('serverId'));

  const onSubmit = (data: FormData) => {
    reset();
    const selectedServer = serverList.find(item => item.id === data.serverId);
    if (!selectedServer) return;
    const selectedAccounts = JSON.parse(data.accounts || '{"id": "", "label": ""}') as {
      id: string;
      label: string;
    };
    setParams({
      historyDealBJStartTimeRingOut: '',
      historyDealBJEndTimeRingOut: '',
      historyDealBJStartTime: formatDate(data.openTime.from, 'YYYY-MM-DD HH:mm'),
      historyDealBJEndTime: formatDate(data.openTime.to, 'YYYY-MM-DD HH:mm'),
      accounts: selectedAccounts.label,
      historyFuzzyName: data.name,
    });
    const timestamp = Date.now();
    setTimeStamp(timestamp);
    setOtherParams({
      // 这里需要调整，和外部共用一个timestamp参数，计算返佣时需要使用这个参数,每次查询或刷新时会更新这个时间戳
      timestamp,
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
      dealAccountGroupIds: data.accountGroupList.join(','),
      accounts: selectedAccounts.id,
      entry: data.entry || '',
    });
  };
  const onReset = () => {
    reset();
    form.reset();
  };

  return (
    <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
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
          <SelectUpperDropdown />

          <FormField
            name="openTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">
                  {selectedServer?.serviceType === 1 ? t('table.tradingTime') : t('table.openTime')}
                </FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="openTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
