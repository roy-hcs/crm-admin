import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
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
import { RrhSelectAccountsPopup } from '@/components/common/RrhSelectAccountPopup';
import { CurrencyItem, DictTypeItem } from '@/api/hooks/system/types';
import { useDictType } from '@/api/hooks/system/system';
import { useCurrencyList } from '@/api/hooks/system/system';

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

export interface WalletTransactionsFormRef {
  onReset: () => void;
}
// 选择操作类型返回的数据枚举用来取操作方式
const inMethodMap: Record<string, string> = {
  '1': 'crm_wallet_in_method',
  '2': 'crm_wallet_out_method',
  '3': 'crm_wallet_trans_method',
  '4': 'crm_wallet_remaid_method',
};
export const WalletTransactionsForm = forwardRef<
  WalletTransactionsFormRef,
  {
    setParams: (params: {
      account: string;
      selectOther: string;
      inMethod: string;
      currencyId: string;
      operationStart: string;
      operationEnd: string;
      accounts: string;
    }) => void;
    setCommonParams: (params: {
      operationType: string;
      serialNum: string;
      accounts: string;
      mtOrder: string;
    }) => void;
  }
>(({ setParams, setCommonParams }, ref) => {
  const [inMethodOptions, setInMethodOptions] = useState<{ label: string; value: string }[]>([]);
  const { data: currencyListResp } = useCurrencyList();
  const { data: operationTypeResp } = useDictType('crm_wallet_opr_type');
  // 统一归一化为数组
  const operationTypeOptions: DictTypeItem[] = Array.isArray(operationTypeResp)
    ? operationTypeResp
    : [];
  const currencyOptions: CurrencyItem[] = Array.isArray(currencyListResp) ? currencyListResp : [];

  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      account: '',
      selectOther: '',
      inMethod: '',
      currencyId: '',
      operationTime: { from: '', to: '' },
      accounts: '',
      operationType: '',
      serialNum: '',
      mtOrder: '',
    },
  });
  const selectedOperationType = form.watch('operationType');
  const inMethodDictKey = selectedOperationType ? inMethodMap[selectedOperationType] : '';
  const { data: inMethodResp } = useDictType(inMethodDictKey || 'placeholder', {
    enabled: !!inMethodDictKey,
  });
  useImperativeHandle(ref, () => ({
    onReset: () => {
      form.reset();
    },
  }));
  useEffect(() => {
    // 切换操作类型时清空已选方式
    form.setValue('inMethod', '');
    // 未选择时直接清空选项
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
    setParams({
      account: data.account,
      selectOther: data.selectOther,
      inMethod: data.inMethod,
      currencyId: data.currencyId,
      operationStart: data.operationTime.from,
      operationEnd: data.operationTime.to,
      accounts: data.accounts,
    });
    setCommonParams({
      operationType: data.operationType,
      serialNum: data.serialNum,
      accounts: data.accounts,
      mtOrder: data.mtOrder,
    });
  };
  const onReset = () => {
    setParams({
      account: '',
      selectOther: '',
      inMethod: '',
      currencyId: '',
      operationStart: '',
      operationEnd: '',
      accounts: '',
    });
    setCommonParams({
      operationType: '',
      serialNum: '',
      accounts: '',
      mtOrder: '',
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
          <FormInput
            verticalLabel
            name="account"
            label={t('financial.walletTransactions.account')}
            placeholder={t('common.pleaseInput', {
              field: t('financial.walletTransactions.account'),
            })}
          />
          <FormSelect
            verticalLabel
            name="operationType"
            label={t('financial.walletTransactions.operationType')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={operationTypeOptions.map(i => ({
              label: i.dictLabel,
              value: i.dictValue,
            }))}
          />
          <FormSelect
            verticalLabel
            name="inMethod"
            label={t('financial.walletTransactions.inMethod')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={inMethodOptions}
          />
          <FormInput
            verticalLabel
            name="serialNum"
            label={t('financial.walletTransactions.serialNum')}
            placeholder={t('common.pleaseInput', {
              field: t('financial.walletTransactions.serialNum'),
            })}
          />
          <FormSelect
            verticalLabel
            name="serverId"
            label={t('financial.walletTransactions.wallet')}
            placeholder={t('common.pleaseSelect')}
            options={currencyOptions?.map(i => ({ label: i.currencyAbbr, value: i.id })) || []}
          />
          <FormField
            name="operationTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">
                  {t('financial.walletTransactions.operationTime')}
                </FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="operationTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="accounts"
            render={({ field }) => {
              return <RrhSelectAccountsPopup verticalLabel field={field} />;
            }}
          />
          <FormInput
            verticalLabel
            name="mtOrder"
            label={t('financial.walletTransactions.mtOrder')}
            placeholder={t('common.pleaseInput', {
              field: t('financial.walletTransactions.mtOrder'),
            })}
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
});
