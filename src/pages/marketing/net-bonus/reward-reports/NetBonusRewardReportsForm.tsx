import { RrhButton } from '@/components/common/RrhButton';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { FormInput } from '@/components/form/FormInput';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useForm } from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';
import { NetBonusRewardReportsListParams } from '@/api/hooks/marketing';
import { formatDate } from '@/lib/utils';
import { RrhForm } from '@/components/form/RrhForm';
import { BasicParams } from '@/api/types';

type FormData = {
  orderNo: string;
  rewardTarget: string;
  rewardTime: { from: string; to: string };
  disbursedTime: { from: string; to: string };
};

export const NetBonusRewardReportsForm = ({
  setOtherParams,
  otherParams,
  setParams,
  reset,
  params,
  loading,
}: {
  setOtherParams: Dispatch<
    SetStateAction<Omit<NetBonusRewardReportsListParams, 'params' | keyof BasicParams>>
  >;
  setParams: Dispatch<SetStateAction<NetBonusRewardReportsListParams['params']>>;
  reset: () => void;
  params: NetBonusRewardReportsListParams['params'];
  otherParams: Omit<NetBonusRewardReportsListParams, 'params' | keyof BasicParams>;
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      orderNo: otherParams.orderNo || '',
      rewardTarget: otherParams.bonusUser || '',
      rewardTime: {
        from: params.beginBonusTime || '',
        to: params.endBonusTime || '',
      },
      disbursedTime: {
        from: params.beginTime || '',
        to: params.endTime || '',
      },
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setOtherParams({
      orderNo: data.orderNo,
      bonusUser: data.rewardTarget,
    });
    setParams(pre => ({
      ...pre,
      beginBonusTime: formatDate(data.rewardTime.from),
      endBonusTime: formatDate(data.rewardTime.to),
      beginTime: formatDate(data.disbursedTime.from),
      endTime: formatDate(data.disbursedTime.to),
    }));
  };

  const onReset = () => {
    reset();
    form.reset({
      orderNo: '',
      rewardTarget: '',
      rewardTime: { from: '', to: '' },
      disbursedTime: { from: '', to: '' },
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
        name="orderNo"
        label={t('table.orderNo')}
        placeholder={t('common.pleaseInput', { field: t('table.orderNo') })}
      />
      <FormInput
        name="rewardTarget"
        label={t('rewardRecords.rewardTarget')}
        placeholder={t('common.pleaseInput', { field: t('rewardRecords.rewardTarget') })}
      />
      <FormField
        name="rewardTime"
        render={() => (
          <FormItem className="flex flex-col gap-2 text-sm">
            <FormLabel className="basis-3/12">{t('table.rewardTime')}</FormLabel>
            <FormControl className="basis-9/12">
              <FormDateRangeInput name="rewardTime" control={form.control} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="disbursedTime"
        render={() => (
          <FormItem className="flex flex-col gap-2 text-sm">
            <FormLabel className="basis-3/12">{t('table.disbursedTime')}</FormLabel>
            <FormControl className="basis-9/12">
              <FormDateRangeInput name="disbursedTime" control={form.control} />
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
