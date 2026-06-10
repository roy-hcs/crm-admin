import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/FormInput';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { useGetDealAccountGroupList } from '@/api/hooks/account';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ServerItem } from '@/api/hooks/system/types';
import { RrhServerSelector } from '@/components/common/RrhServerSelector';
import { formatDate } from '@/lib/utils';
import { TradingAccountFundsStatsParams } from '@/api/hooks/report';
import { BasicParams } from '@/api/types';
import { useGetGroup } from '@/api/hooks/system/system';
import { SelectUpperDropdown } from '@/components/common/SelectUpperDropdown';
import { RrhForm } from '@/components/form/RrhForm';
type FormData = {
  serverId: string;
  serverGroupList: string;
  fuzzyAccount: string;
  fuzzyName: string;
  statisticTime: { from: string; to: string };
  serverGroup: string;
  accounts: string;
  accountGroupList: string;
};
export const TradingAccountTransactionsForm = ({
  setParams,
  setCommonParams,
  setServerId,
  serverOptions,
  initialServerId,
  reset,
  params,
  commonParams,
}: {
  setParams: Dispatch<SetStateAction<TradingAccountFundsStatsParams['params']>>;
  setCommonParams: Dispatch<
    SetStateAction<Omit<TradingAccountFundsStatsParams, 'params' | keyof BasicParams>>
  >;
  reset: () => void;
  params: TradingAccountFundsStatsParams['params'];
  commonParams: Omit<TradingAccountFundsStatsParams, 'params' | keyof BasicParams>;
  setServerId: (id: string) => void;
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
      serverGroupList: params.serverGroupList || '',
      fuzzyAccount: params.fuzzyAccount || '',
      fuzzyName: params.fuzzyName || '',
      statisticTime: { from: params.statisticStartTime || '', to: params.statisticEndTime || '' },
      serverGroup: commonParams.serverGroup || '',
      accounts: params.accounts || '',
      accountGroupList: commonParams.accountGroupList || '',
    },
  });

  if (!form.getValues('serverId') && (initialServerId || serverOptions[0])) {
    const auto = initialServerId || serverOptions[0]?.id || '';
    if (auto) form.setValue('serverId', auto, { shouldDirty: false, shouldTouch: false });
  }

  const serverId = form.watch('serverId');

  const onSubmit = (data: FormData) => {
    reset();
    const selectedAccounts = JSON.parse(data.accounts || '{"id": "", "label": ""}') as {
      id: string;
      label: string;
    };
    setParams({
      serverGroupList: data.serverGroupList,
      fuzzyAccount: data.fuzzyAccount,
      fuzzyName: data.fuzzyName,
      statisticStartTime: formatDate(data.statisticTime.from),
      statisticEndTime: formatDate(data.statisticTime.to),
      accounts: selectedAccounts.label,
    });
    setCommonParams({
      serverGroup: data.serverGroup,
      accounts: selectedAccounts.id,
      accountGroupList: data.accountGroupList,
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
    form.setValue('serverGroup', '');
    return () => {
      mounted = false;
    };
  }, [form, getGroupData, serverId]);

  return (
    <RrhForm
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
      onReset={onReset}
      className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20 md:px-12 md:pt-12"
    >
      <RrhServerSelector serverOptions={serverOptions} />
      <FormMultiSelect
        name="serverGroupList"
        label={t('table.groups')}
        placeholder={t('common.pleaseSelect')}
        options={groupList}
        loading={groupLoading}
      />
      <FormInput
        name="fuzzyAccount"
        label={t('tradingAccountFundsStats.fuzzyAccount')}
        placeholder={t('common.pleaseInput', {
          field: t('tradingAccountFundsStats.fuzzyAccount'),
        })}
      />
      <FormInput
        name="fuzzyName"
        label={t('tradingAccountTransactions.name')}
        placeholder={t('common.pleaseInput', {
          field: t('tradingAccountTransactions.name'),
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
      <SelectUpperDropdown />
      <FormMultiSelect
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
