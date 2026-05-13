import { RrhButton } from '@/components/common/RrhButton';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { FormInput } from '@/components/form/FormInput';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useForm } from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';
import { NetBonusRewardRecordsListParams } from '@/api/hooks/marketing';
import { formatDate } from '@/lib/utils';
import { RrhForm } from '@/components/form/RrhForm';
import { BasicParams } from '@/api/types';
import FormMonthPicker from '@/components/form/FormMonthPicker';
import { SelectUpperDropdown } from '@/components/common/SelectUpperDropdown';
import { FormSelect } from '@/components/form/FormSelect';
import { VerifyStatusOptions } from '@/lib/const';

type FormData = {
  drirectFlag: string;
  agentUserId: string;
  bonusUser: string;
  bonusMonth: string;
  status: string;
  orderNo: string;
  Time: { from: string; to: string };
  ReviewTime: { from: string; to: string };
  BonusTime: { from: string; to: string };
};

export const NetBonusRewardRecordsForm = ({
  setOtherParams,
  otherParams,
  setParams,
  reset,
  params,
  loading,
}: {
  setOtherParams: Dispatch<
    SetStateAction<Omit<NetBonusRewardRecordsListParams, 'params' | keyof BasicParams>>
  >;
  setParams: Dispatch<SetStateAction<NetBonusRewardRecordsListParams['params']>>;
  reset: () => void;
  params: NetBonusRewardRecordsListParams['params'];
  otherParams: Omit<NetBonusRewardRecordsListParams, 'params' | keyof BasicParams>;
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      bonusUser: otherParams.bonusUser || '',
      bonusMonth: otherParams.bonusMonth || '',
      status: otherParams.status || '',
      orderNo: otherParams.orderNo || '',
      drirectFlag: params.drirectFlag || '',
      agentUserId: params.agentUserId || '',
      Time: {
        from: params.beginTime || '',
        to: params.endTime || '',
      },
      ReviewTime: {
        from: params.beginReviewTime || '',
        to: params.endReviewTime || '',
      },
      BonusTime: {
        from: params.beginBonusTime || '',
        to: params.endBonusTime || '',
      },
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setOtherParams({
      bonusUser: data.bonusUser || '',
      bonusMonth: data.bonusMonth || '',
      status: data.status || '',
      orderNo: data.orderNo || '',
    });
    setParams(pre => ({
      ...pre,
      beginBonusTime: formatDate(data.BonusTime.from),
      endBonusTime: formatDate(data.BonusTime.to),
      beginTime: formatDate(data.Time.from),
      endTime: formatDate(data.Time.to),
      beginReviewTime: formatDate(data.ReviewTime.from),
      endReviewTime: formatDate(data.ReviewTime.to),
      drirectFlag: data.drirectFlag,
      agentUserId: data.agentUserId,
    }));
  };

  const onReset = () => {
    reset();
    form.reset({
      bonusUser: '',
      bonusMonth: '',
      status: '',
      orderNo: '',
      drirectFlag: '',
      agentUserId: '',
      Time: { from: '', to: '' },
      ReviewTime: { from: '', to: '' },
      BonusTime: { from: '', to: '' },
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
        verticalLabel
        name="bonusUser"
        label={t('rewardRecords.rewardTarget')}
        placeholder={t('common.pleaseInput', { field: t('rewardRecords.rewardTarget') })}
      />
      <FormMonthPicker
        name="bonusMonth"
        control={form.control}
        label={t('customerTracking.statisticMonthStr')}
        placeholder={t('common.pleaseSelect')}
      />
      <FormSelect
        verticalLabel
        name="status"
        label={t('table.reviewStatus')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={VerifyStatusOptions.map(i => ({ label: t(i.label), value: i.value }))}
      />
      <div className="flex flex-col gap-2">
        <label>{t('CRMAccountPage.AccountRange')}</label>
        <div className="flex w-full gap-1">
          <SelectUpperDropdown name="agentUserId" className="w-full flex-1" labelShow={false} />
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
      <FormInput
        verticalLabel
        name="orderNo"
        label={t('table.orderNumber')}
        placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
      />
      <FormField
        name="Time"
        render={() => (
          <FormItem className="flex flex-col gap-2 text-sm">
            <FormLabel className="basis-3/12">{t('common.createTime')}</FormLabel>
            <FormControl className="basis-9/12">
              <FormDateRangeInput name="Time" control={form.control} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="ReviewTime"
        render={() => (
          <FormItem className="flex flex-col gap-2 text-sm">
            <FormLabel className="basis-3/12">{t('table.verifyTime')}</FormLabel>
            <FormControl className="basis-9/12">
              <FormDateRangeInput name="ReviewTime" control={form.control} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="BonusTime"
        render={() => (
          <FormItem className="flex flex-col gap-2 text-sm">
            <FormLabel className="basis-3/12">{t('table.disbursedTime')}</FormLabel>
            <FormControl className="basis-9/12">
              <FormDateRangeInput name="BonusTime" control={form.control} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
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
