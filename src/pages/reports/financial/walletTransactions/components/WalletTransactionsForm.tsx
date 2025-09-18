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
import { RrhSelectAccountsPopup } from '@/components/common/RrhSelectAccountPopup';
import { CurrencyItem, DictTypeItem } from '@/api/hooks/system/types';
import { useDictType } from '@/api/hooks/system/system';

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
    currencyList: CurrencyItem[];
  }
>(({ setParams, setCommonParams, currencyList }, ref) => {
  // 获取操作类型 操作方式
  const { data: operationTypeResp } = useDictType('crm_wallet_opr_type');
  // 统一归一化为数组
  const operationTypeItems: DictTypeItem[] = Array.isArray(operationTypeResp)
    ? operationTypeResp
    : [];
  const operationTypeOptions = operationTypeItems.map(i => ({
    label: i.dictLabel,
    value: i.dictValue,
  }));
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

  useImperativeHandle(ref, () => ({
    onReset: () => {
      form.reset();
    },
  }));

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
    form.reset({
      account: '',
      selectOther: '',
      inMethod: '',
      currencyId: '',
      operationTime: { from: '', to: '' },
      accounts: '',
      operationType: '',
      serialNum: '',
      mtOrder: '',
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
            options={operationTypeOptions}
          />
          <FormInput
            verticalLabel
            name="inMethod"
            label={t('financial.walletTransactions.inMethod')}
            placeholder={t('common.pleaseInput', {
              field: t('financial.walletTransactions.inMethod'),
            })}
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
            options={currencyList.map(item => ({ label: item.currencyAbbr, value: item.id }))}
          />
          <FormField
            name="operationTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12 text-[#757F8D]">
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
