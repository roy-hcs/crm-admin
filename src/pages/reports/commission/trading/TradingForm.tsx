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
import { RrhServerSelector } from '@/components/common/RrhServerSelector';
import { formatDate } from '@/lib/utils';
import { Dispatch, SetStateAction } from 'react';
import { TradingParams } from '@/api/hooks/report';
import { BasicParams } from '@/api/types';
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
export const TradingForm = ({
  setParams,
  serverOptions,
  initialServerId,
  setServerId,
  setCommonParams,
  groupOptions,
  RebateTradersOptions,
  reset,
  params,
  commonParams,
}: {
  setParams: Dispatch<SetStateAction<TradingParams['params']>>;
  setCommonParams: Dispatch<SetStateAction<Omit<TradingParams, 'params' | keyof BasicParams>>>;
  reset: () => void;
  params: TradingParams['params'];
  commonParams: Omit<TradingParams, 'params' | keyof BasicParams>;
  setServerId: (id: string) => void;
  serverOptions: ServerItem[];
  groupOptions: string[];
  RebateTradersOptions: CrmRebateTradersItem[];
  initialServerId?: string;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      serverId: initialServerId || '',
      tradingTime: { from: params.startTraderTime || '', to: params.endTraderTime || '' },
      rebateTime: { from: params.beginVerifyTime || '', to: params.endVerifyTime || '' },
      accounts: params.accounts || '',
      serverGroup: commonParams.serverGroup || '',
      mtOrder: commonParams.mtOrder || '',
      trderAccount: commonParams.trderAccount || '',
      taderType: commonParams.taderType || '',
      conditionName: commonParams.conditionName || '',
      rebateTraderId: commonParams.rebateTraderId || '',
    },
  });

  // 当父级提供初始 serverId 或服务器列表加载完成后自动填充
  if (!form.getValues('serverId') && (initialServerId || serverOptions[0])) {
    const auto = initialServerId || serverOptions[0]?.id || '';
    if (auto) form.setValue('serverId', auto, { shouldDirty: false, shouldTouch: false });
  }

  const onSubmit = (data: FormData) => {
    setParams({
      startTraderTime: formatDate(data.tradingTime.from),
      endTraderTime: formatDate(data.tradingTime.to),
      beginVerifyTime: formatDate(data.rebateTime.from),
      endVerifyTime: formatDate(data.rebateTime.to),
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
    reset();
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
          className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20"
        >
          <RrhServerSelector serverOptions={serverOptions} />
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
                <FormLabel className="basis-3/12">{t('commission.trading.traderTime')}</FormLabel>
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
                <FormLabel className="basis-3/12">{t('commission.trading.rebateTime')}</FormLabel>
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
          <div className="bg-background absolute inset-x-0 bottom-0 flex gap-4 p-4">
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
