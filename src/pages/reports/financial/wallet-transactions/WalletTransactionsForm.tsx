import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DictTypeItem } from '@/api/hooks/system/types';
import { useDictType } from '@/api/hooks/system/system';
import { useCurrencyList } from '@/api/hooks/system/system';
import { formatDate } from '@/lib/utils';
import { CrmUserDealDetailParams } from '@/api/hooks/report';
import { BasicParams } from '@/api/types';
import { SelectUpperDropdown } from '@/components/common/SelectUpperDropdown';
import { RrhForm } from '@/components/form/RrhForm';

type FormData = {
  account: string;
  operationType: string;
  inMethod: string;
  serialNum: string;
  currencyId: string;
  operationTime: { from: string; to: string };
  accounts: string;
  mtOrder: string;
  selectOther: string;
};
// 选择操作类型返回的数据枚举用来取操作方式
const inMethodMap: Record<string, string> = {
  '1': 'crm_wallet_in_method',
  '2': 'crm_wallet_out_method',
  '3': 'crm_wallet_trans_method',
  '4': 'crm_wallet_remaid_method',
};
export const WalletTransactionsForm = ({
  setParams,
  setCommonParams,
  reset,
  params,
  commonParams,
}: {
  setParams: Dispatch<SetStateAction<CrmUserDealDetailParams['params']>>;
  setCommonParams: Dispatch<
    SetStateAction<Omit<CrmUserDealDetailParams, 'params' | keyof BasicParams>>
  >;
  reset: () => void;
  params: CrmUserDealDetailParams['params'];
  commonParams: Omit<CrmUserDealDetailParams, 'params' | keyof BasicParams>;
}) => {
  const [inMethodOptions, setInMethodOptions] = useState<{ label: string; value: string }[]>([]);
  const { data: currencyListRes } = useCurrencyList();
  const { data: operationTypeRes } = useDictType('crm_wallet_opr_type');

  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      account: params.account || '',
      selectOther: params.selectOther || '',
      inMethod: params.inMethod || '',
      currencyId: params.currencyId || '',
      operationTime: { from: params.operationStart || '', to: params.operationEnd || '' },
      accounts: params.accounts || '',
      operationType: commonParams.operationType || '',
      serialNum: commonParams.serialNum || '',
      mtOrder: commonParams.mtOrder || '',
    },
  });
  const selectedOperationType = form.watch('operationType');
  const inMethodDictKey = selectedOperationType ? inMethodMap[selectedOperationType] : '';
  const { data: inMethodResp } = useDictType(inMethodDictKey || 'placeholder', {
    enabled: !!inMethodDictKey,
  });
  useEffect(() => {
    form.setValue('inMethod', '');
    if (!inMethodDictKey) {
      setInMethodOptions([]);
      return;
    }
  }, [inMethodDictKey, form]);
  useEffect(() => {
    if (!inMethodDictKey) return;
    const items: DictTypeItem[] = Array.isArray(inMethodResp) ? inMethodResp : [];
    setInMethodOptions(items.map(i => ({ label: i.dictLabel, value: i.dictValue })));
  }, [inMethodResp, inMethodDictKey]);

  const onSubmit = (data: FormData) => {
    reset();
    const selectedAccounts = JSON.parse(data.accounts || '{"id": "", "label": ""}') as {
      id: string;
      label: string;
    };
    setParams({
      account: data.account,
      selectOther: data.selectOther,
      inMethod: data.inMethod,
      currencyId: data.currencyId,
      operationStart: formatDate(data.operationTime.from),
      operationEnd: formatDate(data.operationTime.to),
      accounts: selectedAccounts.label,
    });
    setCommonParams({
      operationType: data.operationType,
      serialNum: data.serialNum,
      accounts: selectedAccounts.id,
      mtOrder: data.mtOrder,
    });
  };
  const onReset = () => {
    reset();
    form.reset();
  };

  return (
    <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
          className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20 md:px-12 md:pt-12"
        >
          <FormInput
            verticalLabel
            name="account"
            label={t('walletTransactions.account')}
            placeholder={t('common.pleaseInput', {
              field: t('walletTransactions.account'),
            })}
          />
          <FormSelect
            verticalLabel
            name="operationType"
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
          <FormSelect
            verticalLabel
            name="inMethod"
            label={t('table.inMethod')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={inMethodOptions}
          />
          <FormInput
            verticalLabel
            name="serialNum"
            label={t('walletTransactions.serialNum')}
            placeholder={t('common.pleaseInput', {
              field: t('walletTransactions.serialNum'),
            })}
          />
          <FormSelect
            verticalLabel
            name="serverId"
            label={t('walletTransactions.wallet')}
            placeholder={t('common.pleaseSelect')}
            options={
              currencyListRes?.rows
                ?.filter(item => item)
                .map(item => ({
                  label: item.currencyAbbr,
                  value: item.id,
                })) || []
            }
          />
          <FormField
            name="operationTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">
                  {t('walletTransactions.operationTime')}
                </FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="operationTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SelectUpperDropdown />
          <FormInput
            verticalLabel
            name="mtOrder"
            label={t('walletTransactions.mtOrder')}
            placeholder={t('common.pleaseInput', {
              field: t('walletTransactions.mtOrder'),
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
