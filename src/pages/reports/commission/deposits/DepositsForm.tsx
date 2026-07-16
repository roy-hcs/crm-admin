import { Dispatch, SetStateAction } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CrmRebateTradersItem, ServerItem } from '@/api/hooks/system/types';
import { RrhServerSelector } from '@/components/common/RrhServerSelector';
import { formatDate } from '@/lib/utils';
import { TradingParams } from '@/api/hooks/report';
import { BasicParams } from '@/api/types';
import { useGroupFetcher } from '@/hooks/useGroupFetcher';
import { useServerIdAutoFill } from '@/hooks/useServerIdAutoFill';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import { SelectUpperDropdown } from '@/components/common/SelectUpperDropdown';
import { RrhForm } from '@/components/form/RrhForm';

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

export const DepositsForm = ({
  setParams,
  serverOptions,
  initialServerId,
  setServerId,
  setCommonParams,
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

  const serverId = form.watch('serverId');

  useServerIdAutoFill(form, initialServerId, serverOptions);

  const onSubmit = (data: FormData) => {
    reset();
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
    form.reset();
  };

  const { groupList, groupLoading } = useGroupFetcher({
    serverId,
    form,
    fieldToClear: 'serverGroup',
  });

  return (
    <RrhForm
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
      onReset={onReset}
      className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20 md:px-12 md:pt-12"
    >
      <RrhServerSelector serverOptions={serverOptions} />
      <FormMultiSelect
        name="serverGroup"
        label={t('table.groups')}
        placeholder={t('common.pleaseSelect')}
        options={groupList}
        loading={groupLoading}
      />
      <FormInput
        name="mtOrder"
        label={t('trading.mtOrder')}
        placeholder={t('common.pleaseInput', { field: t('trading.mtOrder') })}
      />
      <FormInput
        name="trderAccount"
        label={t('trading.trderAccount')}
        placeholder={t('common.pleaseInput', { field: t('trading.trderAccount') })}
      />
      <FormInput
        name="taderType"
        label={t('trading.taderType')}
        placeholder={t('common.pleaseInput', { field: t('trading.taderType') })}
      />
      <FormField
        name="tradingTime"
        render={() => (
          <FormItem className="flex flex-col gap-2 text-sm">
            <FormLabel className="basis-3/12">{t('trading.traderTime')}</FormLabel>
            <FormControl className="basis-9/12">
              <FormDateRangeInput name="tradingTime" control={form.control} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormInput
        name="conditionName"
        label={t('trading.conditionName')}
        placeholder={t('common.pleaseInput', {
          field: t('trading.conditionName'),
        })}
      />
      <FormField
        name="rebateTime"
        render={() => (
          <FormItem className="flex flex-col gap-2 text-sm">
            <FormLabel className="basis-3/12">{t('trading.rebateTime')}</FormLabel>
            <FormControl className="basis-9/12">
              <FormDateRangeInput name="rebateTime" control={form.control} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormSelect
        name="rebateTraderId"
        label={t('trading.rebateTraderId')}
        placeholder={t('common.pleaseSelect')}
        options={RebateTradersOptions.map((it: CrmRebateTradersItem) => ({
          label: it.ruleName,
          value: it.id,
        }))}
      />
      <SelectUpperDropdown />
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
