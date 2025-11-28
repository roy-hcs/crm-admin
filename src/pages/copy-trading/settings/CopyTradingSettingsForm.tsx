import { RrhButton } from '@/components/common/RrhButton';
import { FormInput } from '@/components/form/FormInput';
import { Form } from '@/components/ui/form';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FormProvider } from '@/contexts/form';
import { useForm } from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';
import { FormSelect } from '@/components/form/FormSelect';
import { BasicParams } from '@/api/types';
import { MamProtocolListParams } from '@/api/hooks/copyTrading/type';
import { DictTypeItem } from '@/api/hooks/system';

type FormData = {
  protocolName: string;
  applicableScenarios: string;
};

export const CopyTradingSettingsForm = ({
  setOtherParams,
  loading,
  scenarioTypes = [],
}: {
  setOtherParams: Dispatch<
    SetStateAction<Omit<MamProtocolListParams, 'params' | keyof BasicParams>>
  >;
  loading: boolean;
  scenarioTypes?: DictTypeItem[];
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      protocolName: '',
      applicableScenarios: '',
    },
  });
  const onSubmit = (data: FormData) => {
    setOtherParams({
      name: data.protocolName,
      applicableScenarios: data.applicableScenarios,
    });
  };
  const onReset = () => {
    setOtherParams({
      name: '',
      applicableScenarios: '',
    });
    form.reset();
  };
  return (
    <FormProvider form={form}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              if (e.target instanceof HTMLTextAreaElement) return;

              e.preventDefault();
              form.handleSubmit(onSubmit)();
            }
          }}
          className="flex flex-col gap-4 overflow-auto p-4"
        >
          <FormInput
            verticalLabel
            name="protocolName"
            label={t('table.protocolName')}
            placeholder={t('common.pleaseInput', {
              field: t('table.protocolName'),
            })}
          />
          <FormSelect
            verticalLabel
            name="applicableScenarios"
            label={t('table.applicableScenario')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={scenarioTypes.map(item => ({ label: item.dictLabel, value: item.dictValue }))}
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
