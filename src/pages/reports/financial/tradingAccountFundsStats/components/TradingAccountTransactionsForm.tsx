import { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { FormProvider } from '@/contexts/form';
import { FormInput } from '@/components/form/FormInput';
import { RrhSelectAccountsPopup } from '@/components/common/RrhSelectAccountPopup';
import { FormSelect } from '@/components/form/FormSelect';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { useGetGroupByServer } from '@/api/hooks/system/system';
import { useGetDealAccountGroupList } from '@/api/hooks/system/system';
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
export interface TradingAccountTransactionsFormRef {
  onReset: () => void;
}
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
export const TradingAccountTransactionsForm = forwardRef<
  TradingAccountTransactionsFormRef,
  {
    setParams: (params: {
      serverGroupList: string;
      fuzzyAccount: string;
      fuzzyName: string;
      statisticStartTime: string;
      statisticEndTime: string;
      accounts: string;
    }) => void;
    setCommonParams: (params: {
      serverGroup: string;
      accounts: string;
      accountGroupList: string;
    }) => void;
    setServerId: (id: string) => void;
    serverOptions: ServerItem[];
    initialServerId?: string;
  }
>(({ setParams, setCommonParams, setServerId, serverOptions, initialServerId }, ref) => {
  const { data: dealAccountGroupListData } = useGetDealAccountGroupList();
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      serverId: initialServerId || '',
      serverGroupList: '',
      fuzzyAccount: '',
      fuzzyName: '',
      statisticTime: { from: '', to: '' },
      serverGroup: '',
      accounts: '',
      accountGroupList: '',
    },
  });

  // 当父级提供初始 serverId 或服务器列表加载完成后自动填充
  if (!form.getValues('serverId') && (initialServerId || serverOptions[0])) {
    const auto = initialServerId || serverOptions[0]?.id || '';
    if (auto) form.setValue('serverId', auto, { shouldDirty: false, shouldTouch: false });
  }
  const { data: groupData } = useGetGroupByServer({
    serverId: form.watch('serverId'),
  });
  useImperativeHandle(ref, () => ({
    onReset: () => {
      form.reset();
    },
  }));

  const onSubmit = (data: FormData) => {
    setParams({
      serverGroupList: data.serverGroupList,
      fuzzyAccount: data.fuzzyAccount,
      fuzzyName: data.fuzzyName,
      statisticStartTime: data.statisticTime?.from || '',
      statisticEndTime: data.statisticTime?.to || '',
      accounts: data.accounts,
    });
    setCommonParams({
      serverGroup: data.serverGroup,
      accounts: data.accounts,
      accountGroupList: data.accountGroupList,
    });
    setServerId(data.serverId);
  };
  const onReset = () => {
    setParams({
      serverGroupList: '',
      fuzzyAccount: '',
      fuzzyName: '',
      statisticStartTime: '',
      statisticEndTime: '',
      accounts: '',
    });
    setCommonParams({
      serverGroup: '',
      accounts: '',
      accountGroupList: '',
    });
    setServerId(initialServerId || '');
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
          <FormSelect
            verticalLabel
            name="serverId"
            label={t('ib.overview.serverId')}
            placeholder={t('common.pleaseSelect')}
            options={serverOptions.map(item => ({ label: item.serverName, value: item.id }))}
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
                <FormLabel className="basis-3/12 text-[#757F8D]">
                  {t('common.statisticTime')}
                </FormLabel>
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
          <div className="flex justify-end gap-4">
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
});
