import { SystemFundOperationRecordListParams } from '@/api/hooks/report';
import { RrhButton } from '@/components/common/RrhButton';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useForm } from 'react-hook-form';
import { formatDate } from '@/lib/utils';
import { BasicParams } from '@/api/types';
import { DictTypeItem } from '@/api/hooks/system';
import { crmAccountTypeOptions } from '@/lib/const';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import { useCallback, useMemo } from 'react';
import { useCrmUsers } from '@/api/hooks/system/system';
import { FormSearchMultiSelect } from '@/components/form/FormSearchMultiSelect';
import { SelectUpperDropdown } from '@/components/common/SelectUpperDropdown';
import { RrhForm } from '@/components/form/RrhForm';

type FormData = {
  type: number | string;
  name: string;
  login: string;
  serverOrder: string;
  operationTime: { from: string; to: string };
  operator: string;
  opTypes: string[];
  accountTypes: string[];
  accounts: string;
  inviters: string[];
};

export const SystemFundOperationsForm = ({
  setOtherParams,
  setParams,
  loading,
  reset,
  params,
  otherParams,
  financeType,
  adjustInType,
  adjustOutType,
}: {
  setParams: (params: SystemFundOperationRecordListParams['params']) => void;
  setOtherParams: (params: { type?: number | string }) => void;
  loading: boolean;
  reset: () => void;
  params: SystemFundOperationRecordListParams['params'];
  otherParams: Omit<SystemFundOperationRecordListParams, 'params' | keyof BasicParams>;
  financeType: DictTypeItem[];
  adjustInType: DictTypeItem[];
  adjustOutType: DictTypeItem[];
}) => {
  const { t } = useTranslation();
  const { mutateAsync: getCrmUsers } = useCrmUsers();
  const fetchCrmUserOptions = useCallback(
    async (params: { pageNum: number; pageSize: number; keyword: string }) => {
      const res = await getCrmUsers({
        origin: '0',
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        params: {
          threeCons: params.keyword,
        },
      });

      const rows = res.rows || [];
      const total = Number(res.total || 0);

      return {
        list: rows
          .filter(user => user.id || user.showId)
          .map(user => ({
            value: user.id || user.showId || '',
            label: `${user.name} ${user.lastName} (${user.showId})`,
          })),
        total,
        hasMore: params.pageNum * params.pageSize < total,
      };
    },
    [getCrmUsers],
  );
  const form = useForm<FormData>({
    defaultValues: {
      type: otherParams.type || '',
      name: params.name || '',
      login: params.login || '',
      serverOrder: params.ticket || '',
      operationTime: { from: params.operationStart || '', to: params.operationEnd || '' },
      operator: params.operName || '',
      opTypes: params.opTypes?.split(','),
      accountTypes: params.accountTypes?.split(','),
      accounts: params.accounts,
      inviters: params.inviters?.split(','),
    },
  });
  const currentType = form.watch('type');
  const opTypeOptions = useMemo(() => {
    if (currentType === '3') {
      return adjustInType.map(item => ({
        label: item.dictLabel,
        value: item.dictValue,
      }));
    } else if (currentType === '4') {
      return adjustOutType.map(item => ({
        label: item.dictLabel,
        value: item.dictValue,
      }));
    }
    return [];
  }, [adjustInType, adjustOutType, currentType]);

  const onSubmit = (data: FormData) => {
    reset();
    const selectedAccounts = JSON.parse(data.accounts || '{"id": "", "label": ""}') as {
      id: string;
      label: string;
    };
    setOtherParams({
      type: data.type,
    });
    setParams({
      name: data.name,
      login: data.login,
      ticket: data.serverOrder,
      operationStart: formatDate(data.operationTime.from),
      operationEnd: formatDate(data.operationTime.to),
      operName: data.operator,
      opTypes: data.opTypes?.join(','),
      accountTypes: data.accountTypes?.join(','),
      accounts: selectedAccounts.id,
      inviters: data.inviters?.join(','),
    });
  };
  const onReset = () => {
    reset();
    form.reset({
      type: '',
      name: '',
      login: '',
      serverOrder: '',
      operationTime: { from: '', to: '' },
      operator: '',
      opTypes: undefined,
      accountTypes: undefined,
      accounts: undefined,
      inviters: undefined,
    });
  };
  return (
    <RrhForm
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
      onReset={onReset}
      className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20 md:px-12 md:pt-12"
    >
      <FormInput
        name="name"
        label={t('table.nameOrId')}
        placeholder={t('common.pleaseInput', { field: t('table.nameOrId') })}
      />

      <FormSelect
        name="type"
        label={t('table.inMethod')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={financeType
          .filter(item => ['3', '4', '5', '6'].includes(item.dictValue)) // 根据现在的后台代码写死的筛选条件，不安全，但目前没有更好的办法，后续可以优化
          .map(item => ({
            label: item.dictLabel,
            value: item.dictValue,
          }))}
      />
      <FormMultiSelect
        verticalLabel
        name="opTypes"
        label={t('table.depositWay')}
        placeholder={t('common.pleaseSelect')}
        options={opTypeOptions}
      />
      <FormInput
        name="login"
        label={t('table.tradingAccount')}
        placeholder={t('common.pleaseInput', { field: t('table.tradingAccount') })}
      />
      <FormMultiSelect
        name="accountTypes"
        label={`${t('CRMAccountPage.CRMAccountType')}`}
        verticalLabel
        placeholder={t('common.pleaseSelect')}
        options={crmAccountTypeOptions.map(i => ({ label: t(i.label), value: i.value }))}
      />

      <FormField
        name="operationTime"
        render={() => (
          <FormItem className="flex flex-col gap-2 text-sm">
            <FormLabel className="basis-3/12">{t('table.operationTime')}</FormLabel>
            <FormControl className="basis-9/12">
              <FormDateRangeInput name="operationTime" control={form.control} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormInput
        name="operator"
        label={t('table.operationPerson')}
        placeholder={t('common.pleaseInput', { field: t('table.operationPerson') })}
      />
      <SelectUpperDropdown />

      <FormInput
        name="serverOrder"
        label={t('table.tradingServerOrderNumber')}
        placeholder={t('common.pleaseInput', { field: t('table.tradingServerOrderNumber') })}
      />
      <FormSearchMultiSelect
        verticalLabel
        name="inviters"
        label={t('table.inviters')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={true}
        fetchOptions={fetchCrmUserOptions}
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
    </RrhForm>
  );
};
