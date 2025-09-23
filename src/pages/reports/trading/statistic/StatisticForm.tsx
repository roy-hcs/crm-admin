import { AccountStatisticListParams } from '@/api/hooks/report/types';
import { useGetDealAccountGroupList, useGetGroupByServer } from '@/api/hooks/system/system';
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
}: {
  serverList: ServerItem[];
  serverListLoading: boolean;
  setParams: (params: AccountStatisticListParams['params']) => void;
  setOtherParams: (params: { server?: string; accountGroupList?: string }) => void;
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      serverId: '',
      serverGroupList: [],
      name: '',
      login: '',
      accounts: '',
      accountGroupList: [],
      statisticTime: { from: '', to: '' },
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
    setOtherParams({
      server: data.serverId,
      accountGroupList: data.accountGroupList.join(','),
    });
    setParams({
      serverGroupList: data.serverGroupList.join(','),
      fuzzyAccount: data.login,
      fuzzyName: data.name,
      statisticStartTime: data.statisticTime.from,
      statisticEndTime: data.statisticTime.to,
    });
  };
  const onReset = () => {
    setOtherParams({
      server: form.watch('serverId') || '',
      accountGroupList: '',
    });
    setParams({
      serverGroupList: '',
      fuzzyAccount: '',
      fuzzyName: '',
      statisticStartTime: '',
      statisticEndTime: '',
    });
    form.reset();
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

          <div className="flex justify-end gap-4">
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
