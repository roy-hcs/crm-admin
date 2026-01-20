import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormProvider } from '@/contexts/form';
import { FormInput } from '@/components/form/FormInput';
import { RrhSelectAccountsPopup } from '@/components/common/RrhSelectAccountPopup';
import { FormSelect } from '@/components/form/FormSelect';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { useDictType, useGetGroup } from '@/api/hooks/system/system';
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
import { CrmUserDealListParams } from '@/api/hooks/report';
import { BasicParams } from '@/api/types';
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
  serverGroupList: string[];
  serverGroup: string;
  accountGroupList: string[];
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
  setParams: Dispatch<SetStateAction<CrmUserDealListParams['params']>>;
  setCommonParams: Dispatch<
    SetStateAction<Omit<CrmUserDealListParams, 'params' | keyof BasicParams>>
  >;
  setServerId: (id: string) => void;
  serverOptions: ServerItem[];
  initialServerId?: string;
  reset: () => void;
  params: CrmUserDealListParams['params'];
  commonParams: Omit<CrmUserDealListParams, 'params' | keyof BasicParams>;
}) => {
  const { t } = useTranslation();
  const [groupList, setGroupList] = useState<Array<{ label: string; value: string }>>([]);
  const [groupLoading, setGroupLoading] = useState(false);
  const { mutateAsync: getGroupData } = useGetGroup();
  const { data: dealAccountGroupListData } = useGetDealAccountGroupList();
  const { data: operationTypeRes } = useDictType('crm_wallet_opr_type');

  const form = useForm({
    defaultValues: {
      serverId: initialServerId || '',
      ticket: params.ticket || '',
      historyFuzzyName: params.historyFuzzyName || '',
      login: params.login || '',
      comment: params.comment || '',
      accounts: params.accounts || '',
      fuzzyCrmAccount: params.fuzzyCrmAccount || '',
      operationTime: { from: params.operationStart || '', to: params.operationEnd || '' },
      opeTypeList: commonParams.opeTypeList || '',
      opeType: commonParams.opeType || '',
      serverGroupList: commonParams.serverGroupList ? commonParams.serverGroupList.split(',') : [],
      serverGroup: commonParams.serverGroup || '',
      accountGroupList: commonParams.accountGroupList
        ? commonParams.accountGroupList.split(',')
        : [],
    },
  });

  if (!form.getValues('serverId') && (initialServerId || serverOptions[0])) {
    const auto = initialServerId || serverOptions[0]?.id || '';
    if (auto) form.setValue('serverId', auto, { shouldDirty: false, shouldTouch: false });
  }

  const serverId = form.watch('serverId');

  const onSubmit = (data: FormData) => {
    setParams({
      ticket: data.ticket,
      historyFuzzyName: data.historyFuzzyName,
      login: data.login,
      comment: data.comment,
      accounts: data.accounts,
      operationStart: formatDate(data.operationTime.from),
      operationEnd: formatDate(data.operationTime.to),
      fuzzyCrmAccount: data.fuzzyCrmAccount,
    });
    setCommonParams({
      opeTypeList: data.opeTypeList,
      opeType: data.opeType,
      serverGroupList: data.serverGroupList.join(','),
      serverGroup: data.serverGroup,
      accountGroupList: data.accountGroupList.join(','),
      accounts: data.accounts,
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
    <FormProvider form={form}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
          className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20"
        >
          <RrhServerSelector serverOptions={serverOptions} />
          <FormSelect
            verticalLabel
            name="opeTypeList"
            label={t('financial.walletTransactions.operationType')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={
              operationTypeRes
                ?.filter(item => item)
                .map(item => ({
                  label: item.dictLabel,
                  value: item.dictValue,
                })) || []
            }
          />

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
                <FormLabel className="basis-3/12">{t('common.operationTime')}</FormLabel>
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
