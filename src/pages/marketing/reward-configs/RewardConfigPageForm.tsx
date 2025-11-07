import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { RefreshCcw, Search } from 'lucide-react';
import { FormInput } from '@/components/form/FormInput';
import { FormProvider } from '@/contexts/form';
import { RrhButton } from '@/components/common/RrhButton';
import { useTranslation } from 'react-i18next';
import { DictTypeItem } from '@/api/hooks/system/types';
import { BonusSettingListParams } from '@/api/hooks/marketing';
import { Dispatch, SetStateAction } from 'react';
import { BasicParams } from '@/api/hooks/review/types';
import { FormSelect } from '@/components/form/FormSelect';

type FormData = {
  rewardTitle: string;
  businessType: string;
};

export const RewardConfigForm = ({
  setOtherParams,
  setParams,
  loading,
  businessTypes = [],
}: {
  setOtherParams: Dispatch<
    SetStateAction<Omit<BonusSettingListParams, 'params' | keyof BasicParams>>
  >;
  setParams: Dispatch<SetStateAction<BonusSettingListParams['params']>>;
  loading: boolean;
  businessTypes?: DictTypeItem[];
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      rewardTitle: '',
      businessType: '',
    },
  });

  const onSubmit = (data: FormData) => {
    setParams(pre => ({
      ...pre,
      rewardTitle: data.rewardTitle,
    }));
    setOtherParams(pre => ({
      ...pre,
      businessType: data.businessType,
    }));
  };
  const onReset = () => {
    form.reset();
    setParams({
      rewardTitle: '',
    });
    setOtherParams({
      businessType: '',
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
            name="rewardTitle"
            label={t('table.activityName')}
            placeholder={t('common.pleaseInput', { field: t('table.activityName') })}
          />
          <FormSelect
            verticalLabel
            name="businessType"
            label={t('table.triggerBusiness')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={businessTypes.map(item => ({ label: item.dictLabel, value: item.dictValue }))}
          />

          <div className="flex justify-end gap-4">
            <RrhButton type="reset" variant="outline" onClick={onReset}>
              <RefreshCcw className="size-3.5" />
              <span>{t('common.Reset')}</span>
            </RrhButton>
            <RrhButton type="submit" loading={loading}>
              <Search className="size-3.5" />
              <span>{t('common.Search')}</span>
            </RrhButton>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};
