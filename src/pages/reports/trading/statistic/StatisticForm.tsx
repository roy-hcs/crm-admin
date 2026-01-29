import { AccountStatisticListParams } from '@/api/hooks/report';
import { useGetDealAccountGroupList, useGetGroupByServer } from '@/api/hooks/account';
import { ServerItem } from '@/api/hooks/system/types';
import { RrhButton } from '@/components/common/RrhButton';
import { BaseOption } from '@/components/common/RrhMultiSelect';
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
import { formatDate } from '@/lib/utils';
import { Dispatch, SetStateAction } from 'react';
import { BasicParams } from '@/api/types';

type FormData = {
  serverId: string;
  serverGroupList: string[];
  name: string;
  login: string;
  accountGroupList: string[];
  statisticTime: { from: string; to: string };
};

export const StatisticForm = ({
  serverList,
  serverListLoading,
  setOtherParams,
  setParams,
  loading,
  reset,
  params,
  otherParams,
}: {
  serverList: ServerItem[];
  serverListLoading: boolean;
  setParams: Dispatch<SetStateAction<AccountStatisticListParams['params']>>;
  setOtherParams: Dispatch<
    SetStateAction<Omit<AccountStatisticListParams, 'params' | keyof BasicParams>>
  >;
  loading: boolean;
  reset: () => void;
  params: AccountStatisticListParams['params'];
  otherParams: Omit<AccountStatisticListParams, 'params' | keyof BasicParams>;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      serverId: otherParams.server || '',
      serverGroupList: (params.serverGroupList as string)?.split(',') || [],
      name: params.fuzzyName || '',
      login: params.fuzzyAccount || '',
      accountGroupList: (otherParams.accountGroupList as string)?.split(',') || [],
      statisticTime: { from: params.statisticStartTime || '', to: params.statisticEndTime || '' },
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
    reset();
    setOtherParams({
      server: data.serverId,
      accountGroupList: data.accountGroupList.join(','),
    });
    setParams({
      serverGroupList: data.serverGroupList.join(','),
      fuzzyAccount: data.login,
      fuzzyName: data.name,
      statisticStartTime: formatDate(data.statisticTime.from),
      statisticEndTime: formatDate(data.statisticTime.to),
    });
  };
  const onReset = () => {
    reset();
    form.reset({
      serverId: '',
      serverGroupList: [],
      name: '',
      login: '',
      accountGroupList: [],
      statisticTime: { from: '', to: '' },
    });
  };
  return (
    <FormProvider form={form}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              if (e.target instanceof HTMLTextAreaElement) return;

              e.preventDefault();
              form.handleSubmit(onSubmit)();
            }
          }}
          className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20"
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

          <FormInput
            verticalLabel
            name="login"
            label={t('table.tradingAccount')}
            placeholder={t('common.pleaseInput', { field: t('table.tradingAccount') })}
          />

          <FormInput
            verticalLabel
            name="name"
            label={t('table.fullName')}
            placeholder={t('common.pleaseInput', { field: t('table.firstNameOrLastName') })}
          />

          <FormField
            name="statisticTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('table.statisticTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="statisticTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
        </form>
      </Form>
    </FormProvider>
  );
};
