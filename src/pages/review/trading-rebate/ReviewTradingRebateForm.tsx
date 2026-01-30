import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { RefreshCcw, Search } from 'lucide-react';
import { FormInput } from '@/components/form/FormInput';
import { FormProvider } from '@/contexts/form';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhButton } from '@/components/common/RrhButton';
import { useTranslation } from 'react-i18next';
import { ServerItem } from '@/api/hooks/system/types';
import { BaseOption } from '@/components/common/RrhSelect';
import { useGetDealAccountGroupList, useGetGroupByServer } from '@/api/hooks/account';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import { serverMap } from '@/lib/constant';
import { Dispatch, SetStateAction } from 'react';
import { RebateCommissionListParams, RebateCommissionRuleItem } from '@/api/hooks/review';
import { formatDate } from '@/lib/utils';

type FormData = {
  serverId: string;
  serverGroupList: string[];
  tradingOrderNumber: string | number;
  tradeAccount: string;
  tradeType: string;
  rebateStatus: string | number;
  tradingTime: { from: string; to: string };
  rebateUser: string;
  orderNumber: string;
  submitTime: { from: string; to: string };
  rule: string;
  verifyUserName: string;
  accountGroupList: string[];
};

export const ReviewTradingRebateForm = ({
  setOtherParams,
  setParams,
  serverList,
  serverListLoading,
  rebateRuleList,
  loading,
  reset,
  params,
  otherParams,
}: {
  serverList: ServerItem[];
  serverListLoading: boolean;
  setOtherParams: Dispatch<SetStateAction<Omit<RebateCommissionListParams, 'params'>>>;
  setParams: Dispatch<SetStateAction<RebateCommissionListParams['params']>>;
  rebateRuleList: RebateCommissionRuleItem[];
  loading: boolean;
  reset: () => void;
  params: RebateCommissionListParams['params'];
  otherParams: Omit<RebateCommissionListParams, 'params'>;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      serverId: otherParams.serverId || '',
      serverGroupList: otherParams.serverGroupList ? otherParams.serverGroupList.split(',') : [],
      tradingOrderNumber: otherParams.mtOrder || '',
      tradeAccount: otherParams.trderAccount || '',
      tradeType: otherParams.taderType || '',
      rebateStatus: otherParams.rebateStatus || '',
      rebateUser: otherParams.rebateTraderId || '',
      orderNumber: otherParams.id || '',
      rule: otherParams.conditionName || '',
      verifyUserName: otherParams.verifyUserName || '',
      accountGroupList: otherParams.accountGroupList ? otherParams.accountGroupList.split(',') : [],
      tradingTime: { from: params.startTraderTime || '', to: params.endTraderTime || '' },
      submitTime: { from: params.beginTime || '', to: params.endTime || '' },
    },
  });

  if (!form.getValues('serverId') && serverList.length && !serverListLoading) {
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
    setParams({
      startTraderTime: formatDate(data.tradingTime.from),
      endTraderTime: formatDate(data.tradingTime.to),
      beginTime: formatDate(data.submitTime.from),
      endTime: formatDate(data.submitTime.to),
    });
    setOtherParams({
      serverId: selectedServer.id,
      serverGroupList: data.serverGroupList.join(','),
      serverGroup: data.serverGroupList.join(','),
      mtOrder: data.tradingOrderNumber,
      trderAccount: data.tradeAccount,
      taderType: data.tradeType,
      rebateStatus: data.rebateStatus,
      id: data.orderNumber,
      accountGroupList: data.accountGroupList.join(','),
      rebateTraderId: data.rule,
      verifyUserName: data.verifyUserName || '',
      conditionName: data.rebateUser || '',
    });
  };
  const onReset = () => {
    reset();
    form.reset({
      serverId: '',
      serverGroupList: [],
      tradingOrderNumber: '',
      tradeAccount: '',
      tradeType: '',
      rebateStatus: '',
      rebateUser: '',
      orderNumber: '',
      rule: '',
      verifyUserName: '',
      accountGroupList: [],
      tradingTime: { from: '', to: '' },
      submitTime: { from: '', to: '' },
    });
  };

  return (
    <FormProvider form={form}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
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
            name="tradingOrderNumber"
            label={t('table.tradingOrderNumber')}
            placeholder={t('common.pleaseInput', { field: t('table.tradingOrderNumber') })}
          />
          <FormInput
            verticalLabel
            name="tradeAccount"
            label={t('table.symbol')}
            placeholder={t('common.pleaseInput', { field: t('table.symbol') })}
          />
          <FormInput
            verticalLabel
            name="tradeType"
            label={t('trading.taderType')}
            placeholder={t('common.pleaseInput', { field: t('trading.taderType') })}
          />
          <FormSelect
            verticalLabel
            name="rebateStatus"
            label={t('table.status')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={[
              { label: t('table.pending'), value: '2' },
              { label: t('table.reviewing'), value: '3' },
              { label: t('table.pass'), value: '1' },
              { label: t('table.refuse'), value: '0' },
            ]}
          />
          <FormField
            name="tradingTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">
                  {selectedServer?.serviceType === 1 ? t('table.tradingTime') : t('table.openTime')}
                </FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="tradingTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormInput
            verticalLabel
            name="rebateUser"
            label={t('table.rebateUser')}
            placeholder={t('common.pleaseInput', { field: t('table.rebateUser') })}
          />
          <FormInput
            verticalLabel
            name="orderNumber"
            label={t('table.orderNumber')}
            placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
          />

          <FormField
            name="submitTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('table.submitTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="submitTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormSelect
            verticalLabel
            name="rule"
            label={t('table.targetRule')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={rebateRuleList.map(item => ({
              label: item.ruleName,
              value: item.id,
            }))}
          />
          <FormInput
            verticalLabel
            name="verifyUserName"
            label={t('table.currentAuditor')}
            placeholder={t('common.pleaseInput', { field: t('table.currentAuditor') })}
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
