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
import { useGetDealAccountGroupList, useGetGroupByServer } from '@/api/hooks/system/system';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import { serverMap } from '@/lib/constant';
import { Dispatch, SetStateAction } from 'react';
import { RebateCommissionListParams, RebateCommissionRuleItem } from '@/api/hooks/review/types';

type FormData = {
  serverId: string;
  serverGroupList: string[];
  tradingOrderNumber: string;
  tradeAccount: string;
  tradeType: string;
  rebateStatus: string;
  tradingTime: { from: string; to: string };
  rebateUser: string;
  orderNumber: string;
  submitTime: { from: string; to: string };
  rule: string;
  verifyUserName: string;
  accountGroupList: string[];
};

export const ReviewFeeRebateForm = ({
  setOtherParams,
  setParams,
  serverList,
  serverListLoading,
  rebateRuleList,
  loading,
}: {
  serverList: ServerItem[];
  serverListLoading: boolean;
  setOtherParams: Dispatch<
    SetStateAction<Omit<RebateCommissionListParams & { taderType?: string }, 'params'>>
  >;
  setParams: Dispatch<SetStateAction<RebateCommissionListParams['params']>>;
  rebateRuleList: RebateCommissionRuleItem[];
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
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
    const selectedServer = serverList.find(item => item.id === data.serverId);
    if (!selectedServer) return;
    setParams({
      startTraderTime: data.tradingTime.from,
      endTraderTime: data.tradingTime.to,
      beginTime: data.submitTime.from,
      endTime: data.submitTime.to,
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
    form.reset();
    setParams({
      startTraderTime: '',
      endTraderTime: '',
      beginTime: '',
      endTime: '',
    });
    setOtherParams({
      serverId: selectedServer?.id || '',
      serverGroupList: '',
      mtOrder: '',
      trderAccount: '',
      taderType: '',
      rebateStatus: '',
      id: '',
      rebateTraderId: '',
      accountGroupList: '',
      verifyUserName: '',
      conditionName: '',
    });
  };

  return (
    <FormProvider form={form}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
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
            label={t('table.tradeType')}
            placeholder={t('common.pleaseInput', { field: t('table.tradeType') })}
          />
          <FormSelect
            verticalLabel
            name="rebateStatus"
            label={t('table.status')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={[
              { label: t('table.pending'), value: '0' },
              { label: t('table.reviewing'), value: '-1' },
              { label: t('table.pass'), value: '1' },
              { label: t('table.refuse'), value: '2' },
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
