import { RrhButton } from '@/components/common/RrhButton';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { Form } from '@/components/ui/form';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FormProvider } from '@/contexts/form';
import { useForm } from 'react-hook-form';
import { BasicParams } from '@/api/hooks/review/types';
import { Dispatch, SetStateAction } from 'react';
import { DictTypeItem } from '@/api/hooks/system/types';
import { PammProtocolListParams } from '@/api/hooks/pamm/type';

type FormData = {
  projectId: string;
  name: string;
  applicableScenarios: string;
};

export const AgreementsForm = ({
  setOtherParams,
  loading,
  scenariosType,
  productList,
  reset,
  otherParams,
}: {
  setOtherParams: Dispatch<SetStateAction<Omit<PammProtocolListParams, keyof BasicParams>>>;
  loading: boolean;
  scenariosType: DictTypeItem[];
  productList: { label: string; value: string }[];
  reset?: () => void;
  otherParams?: Omit<PammProtocolListParams, keyof BasicParams>;
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      projectId: otherParams?.projectId || '',
      name: otherParams?.name || '',
      applicableScenarios: otherParams?.applicableScenarios || '',
    },
  });
  const onSubmit = (data: FormData) => {
    setOtherParams({
      name: data.name,
      projectId: data.projectId,
      applicableScenarios: data.applicableScenarios,
    });
  };
  const onReset = () => {
    if (reset) {
      reset();
    }
    form.reset({
      projectId: '',
      name: '',
      applicableScenarios: '',
    });
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
          className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20"
        >
          <FormInput
            verticalLabel
            name="name"
            label={t('table.protocolName')}
            placeholder={t('common.pleaseInput', { field: t('table.protocolName') })}
          />
          <FormSelect
            verticalLabel
            name="projectId"
            label={t('table.relatedProduct')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={productList}
          />
          <FormSelect
            verticalLabel
            name="applicableScenarios"
            label={t('table.applicableScenario')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={scenariosType.map(item => {
              return { label: item.dictLabel, value: item.dictValue };
            })}
          />

          <div className="bg-background absolute inset-x-0 bottom-0 flex gap-4 p-4">
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
