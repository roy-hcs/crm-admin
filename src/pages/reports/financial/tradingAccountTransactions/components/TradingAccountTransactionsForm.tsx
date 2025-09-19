import { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { FormProvider } from '@/contexts/form';
import { FormInput } from '@/components/form/FormInput';
import { RrhSelectAccountsPopup } from '@/components/common/RrhSelectAccountPopup';
import { FormSelect } from '@/components/form/FormSelect';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { useDictType, useGetGroupByServer } from '@/api/hooks/system/system';
import { DictTypeItem } from '@/api/hooks/system/types';
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
  ticket: string;
  historyFuzzyName: string;
  login: string;
  comment: string;
  accounts: string;
  fuzzyCrmAccount: string;
  operationTime: { from: string; to: string };
  opeTypeList: string;
  opeType: string;
  serverGroupList: string;
  serverGroup: string;
  accountGroupList: string;
};
export const TradingAccountTransactionsForm = forwardRef<
  TradingAccountTransactionsFormRef,
  {
    setParams: (params: {
      ticket: string;
      historyFuzzyName: string;
      login: string;
      comment: string;
      accounts: string;
      operationStart: string;
      operationEnd: string;
      fuzzyCrmAccount: string;
    }) => void;
    setCommonParams: (params: {
      opeTypeList: string;
      opeType: string;
      serverGroupList: string;
      serverGroup: string;
      accountGroupList: string;
      accounts: string;
    }) => void;
    setServerId: (id: string) => void;
    serverOptions: ServerItem[];
    initialServerId?: string;
  }
>(({ setParams, setCommonParams, setServerId, serverOptions, initialServerId }, ref) => {
  const { data: dealAccountGroupListData } = useGetDealAccountGroupList();
  // 获取操作类型 操作方式
  const { data: operationTypeResp } = useDictType('crm_wallet_opr_type');
  // 统一归一化为数组
  const operationTypeItems: DictTypeItem[] = Array.isArray(operationTypeResp)
    ? operationTypeResp
    : [];
  const operationTypeOptions = operationTypeItems.map(i => ({
    label: i.dictLabel,
    value: i.dictValue,
  }));
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      serverId: initialServerId || '',
      ticket: '',
      historyFuzzyName: '',
      login: '',
      comment: '',
      accounts: '',
      fuzzyCrmAccount: '',
      operationTime: { from: '', to: '' },
      opeTypeList: '',
      opeType: '',
      serverGroupList: '',
      serverGroup: '',
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
      ticket: data.ticket,
      historyFuzzyName: data.historyFuzzyName,
      login: data.login,
      comment: data.comment,
      accounts: data.accounts,
      operationStart: data.operationTime.from,
      operationEnd: data.operationTime.to,
      fuzzyCrmAccount: data.fuzzyCrmAccount,
    });
    setCommonParams({
      opeTypeList: data.opeTypeList,
      opeType: data.opeType,
      serverGroupList: data.serverGroupList,
      serverGroup: data.serverGroup,
      accountGroupList: data.accountGroupList,
      accounts: data.accounts,
    });
    setServerId(data.serverId);
  };
  const onReset = () => {
    setParams({
      ticket: '',
      historyFuzzyName: '',
      login: '',
      comment: '',
      accounts: '',
      operationStart: '',
      operationEnd: '',
      fuzzyCrmAccount: '',
    });
    setCommonParams({
      opeTypeList: '',
      opeType: '',
      serverGroupList: '',
      serverGroup: '',
      accountGroupList: '',
      accounts: '',
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
          <FormSelect
            verticalLabel
            name="operationType"
            label={t('financial.walletTransactions.operationType')}
            placeholder={t('common.pleaseSelect')}
            options={operationTypeOptions}
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
            name="ticket"
            label={t('financial.tradingAccountTransactions.ticket')}
            placeholder={t('common.pleaseInput', {
              field: t('financial.tradingAccountTransactions.ticket'),
            })}
          />
          <FormInput
            verticalLabel
            name="historyFuzzyName"
            label={t('financial.tradingAccountTransactions.name')}
            placeholder={t('common.pleaseInput', {
              field: t('financial.tradingAccountTransactions.name'),
            })}
          />
          <FormInput
            verticalLabel
            name="login"
            label={t('financial.tradingAccountTransactions.login')}
            placeholder={t('common.pleaseInput', {
              field: t('financial.tradingAccountTransactions.login'),
            })}
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
            name="comment"
            label={t('financial.tradingAccountTransactions.comment')}
            placeholder={t('common.pleaseInput', {
              field: t('financial.tradingAccountTransactions.comment'),
            })}
          />
          <FormField
            name="accounts"
            render={({ field }) => {
              return <RrhSelectAccountsPopup verticalLabel field={field} />;
            }}
          />
          <FormField
            name="operationTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12 text-[#757F8D]">
                  {t('common.operationTime')}
                </FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="operationTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormInput
            verticalLabel
            name="fuzzyCrmAccount"
            label={t('financial.tradingAccountTransactions.crmLastName')}
            placeholder={t('common.pleaseInput', {
              field: t('financial.tradingAccountTransactions.crmLastName'),
            })}
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
