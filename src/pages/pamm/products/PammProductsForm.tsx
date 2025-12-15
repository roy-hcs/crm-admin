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
import { PammProductListParams } from '@/api/hooks/pamm/type';

type FormData = {
  projectName: string;
  model: string;
  serverType: string;
  status: string;
};

export const PammProductsForm = ({
  setOtherParams,
  loading,
  serverTypes,
}: {
  setOtherParams: Dispatch<SetStateAction<Omit<PammProductListParams, keyof BasicParams>>>;
  loading: boolean;
  serverTypes: DictTypeItem[];
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      projectName: '',
      model: '',
      serverType: '',
      status: '',
    },
  });
  const onSubmit = (data: FormData) => {
    setOtherParams({
      profitType: '1',
      model: data.model,
      projectName: data.projectName,
      serverType: data.serverType,
      status: data.status === 'all' ? '' : data.status,
    });
  };
  const onReset = () => {
    setOtherParams({
      profitType: '',
      model: '',
      projectName: '',
      serverType: '',
      status: '',
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
          className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20"
        >
          <FormInput
            verticalLabel
            name="projectName"
            label={t('table.projectName')}
            placeholder={t('common.pleaseInput', { field: t('table.projectName') })}
          />
          <FormSelect
            verticalLabel
            name="model"
            label={t('productReview.model')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={[
              {
                label: t('table.all'),
                value: 'all',
              },
              {
                label: t('PammProduct.typeOne'),
                value: '1',
              },
              {
                label: t('PammProduct.typeTwo'),
                value: '2',
              },
            ]}
          />
          <FormSelect
            verticalLabel
            name="serverType"
            label={t('table.server')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={serverTypes.map(item => {
              return { label: item.dictLabel, value: item.dictValue };
            })}
          />
          <FormSelect
            verticalLabel
            name="status"
            label={t('common.status')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={[
              {
                label: t('table.all'),
                value: 'all',
              },
              {
                label: t('common.enable'),
                value: '1',
              },
              {
                label: t('common.disable'),
                value: '0',
              },
            ]}
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
