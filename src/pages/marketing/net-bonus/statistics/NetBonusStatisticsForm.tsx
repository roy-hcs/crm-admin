import { RrhButton } from '@/components/common/RrhButton';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { FormInput } from '@/components/form/FormInput';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useForm } from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';
import { NetBonusRewardStatisticsListParams } from '@/api/hooks/marketing';
import { formatDate } from '@/lib/utils';
import { RrhForm } from '@/components/form/RrhForm';
import { BasicParams } from '@/api/types';
import { SelectUpperDropdown } from '@/components/common/SelectUpperDropdown';
import { FormSelect } from '@/components/form/FormSelect';
import { crmAccountTypeOptions } from '@/lib/const';
import { FormMonthPicker } from '@/components/form/FormMonthPicker';
import dayjs from 'dayjs';

type FormData = {
  userName: string;
  accountType: string;
  bonusMonth: string;
  time: { from: string; to: string };
  accounts: string;
  directFlag: string;
};

export const NetBonusStatisticsForm = ({
  setOtherParams,
  otherParams,
  setParams,
  reset,
  params,
  loading,
}: {
  setOtherParams: Dispatch<
    SetStateAction<Omit<NetBonusRewardStatisticsListParams, 'params' | keyof BasicParams>>
  >;
  setParams: Dispatch<SetStateAction<NetBonusRewardStatisticsListParams['params']>>;
  reset: () => void;
  params: NetBonusRewardStatisticsListParams['params'];
  otherParams: Omit<NetBonusRewardStatisticsListParams, 'params' | keyof BasicParams>;
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      userName: otherParams.userName || '',
      accountType: otherParams.accountType || '',
      bonusMonth: otherParams.bonusMonth || '',
      time: {
        from: params.beginTime || '',
        to: params.endTime || '',
      },
      accounts: params.agentUserId || '',
      directFlag: params.drirectFlag || 'a',
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setOtherParams({
      userName: data.userName,
      accountType: data.accountType,
      bonusMonth: dayjs(data.bonusMonth).format('YYYYMM'),
    });
    setParams(pre => ({
      ...pre,
      beginTime: formatDate(data.time.from),
      endTime: formatDate(data.time.to),
      agentUserId: data.accounts,
      directFlag: data.directFlag,
    }));
  };

  const onReset = () => {
    reset();
    form.reset({
      userName: '',
      accountType: '',
      bonusMonth: '',
      time: { from: '', to: '' },
      accounts: '',
      directFlag: 'a',
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
        name="userName"
        label={t('common.account.type.user')}
        placeholder={t('common.pleaseInput', { field: t('common.account.type.user') })}
      />
      <FormSelect
        verticalLabel
        name="accountType"
        showRowValue={false}
        label={t('table.rewardType')}
        placeholder={t('common.pleaseSelect')}
        options={crmAccountTypeOptions.map(item => ({
          label: t(item.label),
          value: item.value,
        }))}
      />
      <FormMonthPicker
        name="bonusMonth"
        control={form.control}
        label={t('customerTracking.statisticMonthStr')}
        placeholder={t('common.pleaseSelect')}
      />
      <FormField
        name="time"
        render={() => (
          <FormItem className="flex flex-col gap-2 text-sm">
            <FormLabel className="basis-3/12">{t('table.statisticTime')}</FormLabel>
            <FormControl className="basis-9/12">
              <FormDateRangeInput name="time" control={form.control} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex flex-col gap-2">
        <label>{t('CRMAccountPage.AccountRange')}</label>
        <div className="flex w-full gap-1">
          <SelectUpperDropdown className="w-full flex-1" labelShow={false} />
          <FormSelect
            verticalLabel
            name="directFlag"
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={[
              { label: t('table.underTheUmbrella'), value: 'a' },
              { label: t('customerTracking.directBroker'), value: 'd' },
            ]}
          />
        </div>
      </div>
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
