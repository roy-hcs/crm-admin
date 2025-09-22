import { forwardRef, useImperativeHandle } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { useForm } from 'react-hook-form';
import { FormProvider } from '@/contexts/form';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CrmRebateTradersItem, ServerItem } from '@/api/hooks/system/types';
import { RrhSelectAccountsPopup } from '@/components/common/RrhSelectAccountPopup';
import { serverMap } from '@/lib/constant';
import { BaseOption } from '@/components/common/RrhSelect';
type FormData = {
  tradingTime: { from: string; to: string };
  rebateTime: { from: string; to: string };
  accounts: string;
  serverId: string;
  serverGroup: string;
  mtOrder: string;
  trderAccount: string;
  taderType: string;
  conditionName: string;
  rebateTraderId: string;
};

export interface ClientTrackingFormRef {
  onReset: () => void;
}
export const MyForm = forwardRef<
  ClientTrackingFormRef,
  {
    setParams: (params: {
      startTraderTime: string;
      endTraderTime: string;
      beginVerifyTime: string;
      endVerifyTime: string;
      accounts: string;
    }) => void;
    setCommonParams: (params: {
      trderAccount: string;
      mtOrder: string;
      taderType: string;
      conditionName: string;
      rebateTraderId: string;
      serverGroup: string;
    }) => void;
    setServerId: (id: string) => void;
    serverOptions: ServerItem[];
    groupOptions: string[];
    RebateTradersOptions: CrmRebateTradersItem[];
    initialServerId?: string;
  }
>(
  (
    {
      setParams,
      serverOptions,
      initialServerId,
      setServerId,
      setCommonParams,
      groupOptions,
      RebateTradersOptions,
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const form = useForm({
      defaultValues: {
        serverId: initialServerId || '',
        tradingTime: { from: '', to: '' },
        rebateTime: { from: '', to: '' },
        accounts: '',
        serverGroup: '',
        mtOrder: '',
        trderAccount: '',
        taderType: '',
        conditionName: '',
        rebateTraderId: '',
      },
    });

    // 当父级提供初始 serverId 或服务器列表加载完成后自动填充
    if (!form.getValues('serverId') && (initialServerId || serverOptions[0])) {
      const auto = initialServerId || serverOptions[0]?.id || '';
      if (auto) form.setValue('serverId', auto, { shouldDirty: false, shouldTouch: false });
    }
    useImperativeHandle(ref, () => ({
      onReset: () => {
        form.reset();
      },
    }));

    const onSubmit = (data: FormData) => {
      setParams({
        startTraderTime: data.tradingTime.from,
        endTraderTime: data.tradingTime.to,
        beginVerifyTime: data.rebateTime.from,
        endVerifyTime: data.rebateTime.to,
        accounts: JSON.parse(data.accounts || '{"id": "", "label": ""}').id || '',
      });
      setCommonParams({
        trderAccount: data.trderAccount,
        taderType: data.taderType,
        mtOrder: data.mtOrder,
        conditionName: data.conditionName,
        rebateTraderId: data.rebateTraderId,
        serverGroup: data.serverGroup,
      });
      setServerId(data.serverId);
    };
    const onReset = () => {
      setServerId(initialServerId || '');
      setParams({
        startTraderTime: '',
        endTraderTime: '',
        beginVerifyTime: '',
        endVerifyTime: '',
        accounts: '',
      });
      setCommonParams({
        trderAccount: '',
        mtOrder: '',
        taderType: '',
        conditionName: '',
        rebateTraderId: '',
        serverGroup: '',
      });
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
              options={serverOptions.map(item => ({
                label: item.serverName,
                value: item.id,
                serviceProperty: item.serviceProperty,
                serviceType: item.serviceType,
              }))}
              renderItem={option => {
                return (
                  <div>
                    {/* TODO: 优化样式 */}
                    <span>
                      {option.serviceProperty === 1 ? t('common.live') : t('common.demo')}
                    </span>
                    {option.serviceType && <span> {serverMap[option.serviceType]} | </span>}
                    <span>{option.label}</span>
                  </div>
                );
              }}
            />
            <FormSelect
              verticalLabel
              name="serverGroup"
              label={t('commission.trading.serverGroup')}
              placeholder={t('common.pleaseSelect')}
              options={groupOptions.map((it: string, index) => ({
                label: it + index,
                value: it + index,
              }))}
            />
            <FormInput
              verticalLabel
              name="mtOrder"
              label={t('commission.trading.mtOrder')}
              placeholder={t('common.pleaseInput', { field: t('commission.trading.mtOrder') })}
            />
            <FormInput
              verticalLabel
              name="trderAccount"
              label={t('commission.trading.trderAccount')}
              placeholder={t('common.pleaseInput', { field: t('commission.trading.trderAccount') })}
            />
            <FormInput
              verticalLabel
              name="taderType"
              label={t('commission.trading.taderType')}
              placeholder={t('common.pleaseInput', { field: t('commission.trading.taderType') })}
            />
            <FormField
              name="tradingTime"
              render={() => (
                <FormItem className="flex flex-col gap-2 text-sm">
                  <FormLabel className="basis-3/12 text-[#757F8D]">
                    {t('commission.trading.traderTime')}
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
              name="conditionName"
              label={t('commission.trading.conditionName')}
              placeholder={t('common.pleaseInput', {
                field: t('commission.trading.conditionName'),
              })}
            />
            <FormField
              name="rebateTime"
              render={() => (
                <FormItem className="flex flex-col gap-2 text-sm">
                  <FormLabel className="basis-3/12 text-[#757F8D]">
                    {t('commission.trading.rebateTime')}
                  </FormLabel>
                  <FormControl className="basis-9/12">
                    <FormDateRangeInput name="rebateTime" control={form.control} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormSelect
              verticalLabel
              name="rebateTraderId"
              label={t('commission.trading.rebateTraderId')}
              placeholder={t('common.pleaseSelect')}
              options={RebateTradersOptions.map((it: CrmRebateTradersItem) => ({
                label: it.ruleName,
                value: it.id,
              }))}
            />
            <FormField
              name="accounts"
              render={({ field }) => {
                return <RrhSelectAccountsPopup verticalLabel field={field} />;
              }}
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
  },
);
