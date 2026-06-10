import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { useDictType, useGetGroup } from '@/api/hooks/system/system';
import { useGetDealAccountGroupList } from '@/api/hooks/account';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ServerItem } from '@/api/hooks/system/types';
import { RrhServerSelector } from '@/components/common/RrhServerSelector';
import { formatDate } from '@/lib/utils';
import { CrmUserDealListParams } from '@/api/hooks/report';
import { BasicParams } from '@/api/types';
import { SelectUpperDropdown } from '@/components/common/SelectUpperDropdown';
import { RrhForm } from '@/components/form/RrhForm';
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
  serverGroupList: string[];
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
      ticket: commonParams.ticket || '',
      historyFuzzyName: params.historyFuzzyName || '',
      login: commonParams.login || '',
      comment: commonParams.comment || '',
      accounts: params.accounts || '',
      fuzzyCrmAccount: params.fuzzyCrmAccount || '',
      operationTime: { from: params.operationStart || '', to: params.operationEnd || '' },
      opeTypeList: commonParams.opeTypeList || '',
      serverGroupList: commonParams.serverGroupList ? commonParams.serverGroupList.split(',') : [],
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
    reset();
    const selectedAccounts = JSON.parse(data.accounts || '{"id": "", "label": ""}') as {
      id: string;
      label: string;
    };
    setParams({
      historyFuzzyName: data.historyFuzzyName,
      accounts: selectedAccounts.label,
      operationStart: formatDate(data.operationTime.from),
      operationEnd: formatDate(data.operationTime.to),
      fuzzyCrmAccount: data.fuzzyCrmAccount,
    });
    setCommonParams({
      opeTypeList: data.opeTypeList,
      serverGroupList: data.serverGroupList.join(','),
      accountGroupList: data.accountGroupList.join(','),
      accounts: selectedAccounts.id,
      ticket: data.ticket,
      login: data.login,
      comment: data.comment,
    });
    setServerId(data.serverId);
  };
  const onReset = () => {
    reset();
    setServerId(initialServerId || '');
    form.reset({
      serverId: initialServerId || '',
      ticket: '',
      historyFuzzyName: '',
      login: '',
      comment: '',
      accounts: '',
      fuzzyCrmAccount: '',
      operationTime: { from: '', to: '' },
      opeTypeList: '',
      serverGroupList: [],
      accountGroupList: [],
    });
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
        const group = await getGroupData(serverId);
        if (!mounted) return;
        if (group?.length > 0) {
          const leverOptions = group
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
      <FormSelect
        name="opeTypeList"
        label={t('table.operationType')}
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
        name="serverGroupList"
        label={t('table.groups')}
        placeholder={t('common.pleaseSelect')}
        options={groupList}
        loading={groupLoading}
      />

      <FormInput
        name="ticket"
        label={t('table.orderNumber')}
        placeholder={t('common.pleaseInput', {
          field: t('table.orderNumber'),
        })}
      />
      <FormInput
        name="historyFuzzyName"
        label={t('tradingAccountTransactions.name')}
        placeholder={t('common.pleaseInput', {
          field: t('tradingAccountTransactions.name'),
        })}
      />
      <FormInput
        name="login"
        label={t('tradingAccountTransactions.login')}
        placeholder={t('common.pleaseInput', {
          field: t('tradingAccountTransactions.login'),
        })}
      />

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
      <FormInput
        name="comment"
        label={t('tradingAccountTransactions.comment')}
        placeholder={t('common.pleaseInput', {
          field: t('tradingAccountTransactions.comment'),
        })}
      />
      <SelectUpperDropdown />
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
        name="fuzzyCrmAccount"
        label={t('tradingAccountTransactions.crmLastName')}
        placeholder={t('common.pleaseInput', {
          field: t('tradingAccountTransactions.crmLastName'),
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
