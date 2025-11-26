import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { FormProvider } from '@/contexts/form';
import { FormInput } from '@/components/form/FormInput';
import { RrhSelectAccountsPopup } from '@/components/common/RrhSelectAccountPopup';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import {
  useGetGroupByServer,
  CrmDealAccountListParams,
  useGetDealAccountGroupList,
} from '@/api/hooks/account';
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

type FormData = {
  serverId: string;
  fuzzyAccount: string;
  fuzzyName: string;
  threeCons: string;
  Time: { from: string; to: string };
  serverGroupList: string;
  accounts: string;
  accountGroupList: string;
};
export const TradingAccountsForm = ({
  setOtherParams,
  setParams,
  serverOptions,
  initialServerId,
  setServerId,
  loading,
}: {
  setParams: Dispatch<SetStateAction<CrmDealAccountListParams['params']>>;
  setOtherParams: Dispatch<
    SetStateAction<
      Omit<
        CrmDealAccountListParams,
        'params' | 'pageSize' | 'pageNum' | 'orderByColumn' | 'isAsc' | 'server'
      >
    >
  >;
  serverOptions: ServerItem[];
  initialServerId?: string;
  setServerId: (id: string) => void;
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const { data: dealAccountGroupListData } = useGetDealAccountGroupList(); // 账户组数据

  const form = useForm({
    defaultValues: {
      serverId: initialServerId || '',
      fuzzyAccount: '',
      fuzzyName: '',
      threeCons: '',
      serverGroupList: '',
      accounts: '',
      accountGroupList: '',
      Time: { from: '', to: '' },
    },
  });

  // 当父级提供初始 serverId 或服务器列表加载完成后自动填充
  if (!form.getValues('serverId') && (initialServerId || serverOptions[0])) {
    const auto = initialServerId || serverOptions[0]?.id || '';
    if (auto) form.setValue('serverId', auto, { shouldDirty: false, shouldTouch: false });
  }
  const { data: groupData } = useGetGroupByServer({
    serverId: form.watch('serverId'),
  }); // 组别列表数据

  const onSubmit = (data: FormData) => {
    setParams({
      regStartTime: formatDate(data.Time.from),
      regEndTime: formatDate(data.Time.to),
      fuzzyAccount: data.fuzzyAccount,
      fuzzyName: data.fuzzyName,
      accounts: data.accounts,
      threeCons: data.threeCons,
    });
    setOtherParams({
      serverGroupList: data.serverGroupList,
      accounts: data.accounts,
      accountGroupList: data.accountGroupList,
    });
    setServerId(data.serverId);
  };
  const onReset = () => {
    setParams({
      regStartTime: '',
      regEndTime: '',
      fuzzyAccount: '',
      fuzzyName: '',
      accounts: '',
      threeCons: '',
    });
    setOtherParams({
      serverGroupList: '',
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
          <RrhServerSelector serverOptions={serverOptions} />

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
          <FormField
            name="Time"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('CRMAccountPage.RegisterTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="Time" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormInput
            verticalLabel
            name="fuzzyAccount"
            label={t('financial.tradingAccountTransactions.login')}
            placeholder={t('common.pleaseInput', {
              field: t('financial.tradingAccountTransactions.login'),
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
            name="threeCons"
            label={t('table.threeCons')}
            placeholder={t('common.pleaseInput', {
              field: t('table.threeCons'),
            })}
          />
          <div className="flex justify-end gap-4">
            <RrhButton type="reset" variant={'outline'} onClick={onReset}>
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
