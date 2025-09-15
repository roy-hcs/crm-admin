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
import { SelectAccountsPopup } from '@/pages/account/CRMAccounts/components/CRMAccountsForm';
import { CrmRebateTradersItem, ServerItem } from '@/api/hooks/system/types';

type FormData = {
  // 交易时间
  tradingTime: { from: string; to: string };
  // 返佣时间
  rebateTime: { from: string; to: string };
  // 账户范围
  accounts: string;
  // 服务器
  serverId: string;
  // 组别
  serverGroup: string;
  // 交易订单号
  mtOrder: string;
  // 交易账号
  trderAccount: string;
  // 交易品种
  taderType: string;
  // 返佣对象
  conditionName: string;
  // 命中规则
  rebateTraderId: string;
};

export interface FormRef {
  onReset: () => void;
}
export const MyForm = forwardRef<
  FormRef,
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
        accounts: data.accounts,
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
      form.reset({
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
            <FormSelect
              verticalLabel
              name="serverId"
              label={t('ib.overview.serverId')}
              placeholder={t('common.pleaseSelect')}
              options={serverOptions.map(item => ({ label: item.serverName, value: item.id }))}
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
                return <SelectAccountsPopup verticalLabel field={field} />;
              }}
            />
            <div className="flex justify-end gap-4">
              <RrhButton
                type="reset"
                className="flex h-9 items-center gap-2 border border-[#1E1E1E] bg-white !px-6 text-sm text-[#1E1E1E]"
              >
                <RefreshCcw className="size-3.5" />
                <span>{t('common.Reset')}</span>
              </RrhButton>
              <RrhButton
                type="submit"
                className="flex h-9 items-center gap-2 border-[#1E1E1E] bg-[#1E1E1E] !px-6 text-sm text-white"
              >
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
