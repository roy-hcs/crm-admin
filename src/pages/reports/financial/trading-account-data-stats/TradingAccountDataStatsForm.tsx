import { useForm } from 'react-hook-form';
import { FormProvider } from '@/contexts/form';
import { FormInput } from '@/components/form/FormInput';
import { RrhSelectAccountsPopup } from '@/components/common/RrhSelectAccountPopup';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { useGetDealAccountGroupList } from '@/api/hooks/account';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ServerItem } from '@/api/hooks/system/types';
import { RrhServerSelector } from '@/components/common/RrhServerSelector';
import { formatDate } from '@/lib/utils';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { DataStatisticsParams } from '@/api/hooks/report';
import { BasicParams } from '@/api/types';
import { useGetGroup } from '@/api/hooks/system/system';
type FormData = {
  serverId: string;
  onlyViewRebateAccount: string;
  serverGroupList: string;
  fuzzyAccount: string;
  fuzzyName: string;
  statisticTime: { from: string; to: string };
  accounts: string;
  accountGroupList: string;
  username: string;
  directBroker: string;
};
export const TradingAccountDataStatsForm = ({
  setParams,
  setCommonParams,
  setServerId,
  serverOptions,
  initialServerId,
  reset,
  params,
  commonParams,
}: {
  setParams: Dispatch<SetStateAction<DataStatisticsParams['params']>>;
  setCommonParams: Dispatch<
    SetStateAction<Omit<DataStatisticsParams, 'params' | keyof BasicParams>>
  >;
  setServerId: (id: string) => void;
  reset: () => void;
  params: DataStatisticsParams['params'];
  commonParams: Omit<DataStatisticsParams, 'params' | keyof BasicParams>;
  serverOptions: ServerItem[];
  initialServerId?: string;
}) => {
  const { t } = useTranslation();
  const [groupList, setGroupList] = useState<Array<{ label: string; value: string }>>([]);
  const [groupLoading, setGroupLoading] = useState(false);
  const { mutateAsync: getGroupData } = useGetGroup();
  const { data: dealAccountGroupListData } = useGetDealAccountGroupList();
  const form = useForm({
    defaultValues: {
      serverId: initialServerId || '',
      onlyViewRebateAccount: params.onlyViewRebateAccount || '',
      serverGroupList: params.serverGroupList || '',
      fuzzyAccount: params.fuzzyAccount || '',
      fuzzyName: params.fuzzyName || '',
      statisticTime: { from: params.statisticStartTime || '', to: params.statisticEndTime || '' },
      accounts: commonParams.accounts || '',
      accountGroupList: commonParams.accountGroupList || '',
      username: commonParams.username || '',
      directBroker: commonParams.directBroker || '',
    },
  });

  if (!form.getValues('serverId') && (initialServerId || serverOptions[0])) {
    const auto = initialServerId || serverOptions[0]?.id || '';
    if (auto) form.setValue('serverId', auto, { shouldDirty: false, shouldTouch: false });
  }

  const serverId = form.watch('serverId');

  const onSubmit = (data: FormData) => {
    setParams({
      onlyViewRebateAccount: data.onlyViewRebateAccount,
      serverGroupList: data.serverGroupList,
      fuzzyAccount: data.fuzzyAccount,
      fuzzyName: data.fuzzyName,
      statisticStartTime: formatDate(data.statisticTime.from),
      statisticEndTime: formatDate(data.statisticTime.to),
      accounts: data.accounts,
    });
    setCommonParams({
      accounts: data.accounts,
      accountGroupList: data.accountGroupList,
      username: data.username,
      directBroker: data.directBroker,
    });
    setServerId(data.serverId);
  };
  const onReset = () => {
    reset();
    setServerId(initialServerId || '');
    form.reset();
  };

  useEffect(() => {
    if (!serverId) return;
    let mounted = true;
    const fetch = async (serverId?: string) => {
      if (!serverId) {
        if (mounted) setGroupList([]);
        return;
      }
      if (mounted) setGroupLoading(true);
      try {
        const gruop = await getGroupData(serverId);
        if (!mounted) return;
        if (gruop?.length > 0) {
          const leverOptions = gruop
            .filter(i => i)
            .map((item: string) => ({
              label: item,
              value: item,
            }));
          setGroupList(leverOptions);
        } else {
          setGroupList([]);
        }
      } catch (error) {
        console.error(error);
        if (mounted) setGroupList([]);
      } finally {
        if (mounted) setGroupLoading(false);
      }
    };
    fetch(serverId);
    form.setValue('serverGroupList', '');
    return () => {
      mounted = false;
    };
  }, [form, getGroupData, serverId]);

  return (
    <FormProvider form={form}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
          className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20"
        >
          <RrhServerSelector serverOptions={serverOptions} />
          <FormMultiSelect
            verticalLabel
            name="serverGroupList"
            label={t('commission.trading.serverGroup')}
            placeholder={t('common.pleaseSelect')}
            options={groupList}
            loading={groupLoading}
          />
          <FormInput
            verticalLabel
            name="fuzzyAccount"
            label={t('financial.tradingAccountFundsStats.fuzzyAccount')}
            placeholder={t('common.pleaseInput', {
              field: t('financial.tradingAccountFundsStats.fuzzyAccount'),
            })}
          />
          <FormInput
            verticalLabel
            name="fuzzyName"
            label={t('financial.tradingAccountTransactions.name')}
            placeholder={t('common.pleaseInput', {
              field: t('financial.tradingAccountTransactions.name'),
            })}
          />
          <FormField
            name="statisticTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('common.statisticTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="statisticTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="accounts"
            render={({ field }) => {
              return <RrhSelectAccountsPopup verticalLabel field={field} />;
            }}
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
          <FormInput
            verticalLabel
            name="username"
            label={t('financial.tradingAccountDataStats.username')}
            placeholder={t('common.pleaseInput', {
              field: t('financial.tradingAccountDataStats.username'),
            })}
          />
          <FormInput
            verticalLabel
            name="directBroker"
            label={t('financial.tradingAccountDataStats.directBroker')}
            placeholder={t('common.pleaseInput', {
              field: t('financial.tradingAccountDataStats.directBroker'),
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
        </form>
      </Form>
    </FormProvider>
  );
};
