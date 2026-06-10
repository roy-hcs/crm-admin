import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/FormInput';
import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import { RrhForm } from '@/components/form/RrhForm';

type FormData = {
  name: string;
  email: string;
};

export const CustomerCommissioForm = ({
  setCommonParams,
  reset,
  commonParams,
}: {
  setCommonParams: Dispatch<SetStateAction<{ name: string; email: string }>>;
  reset: () => void;
  commonParams: { name: string; email: string };
}) => {
  const { t } = useTranslation();

  const form = useForm({
    defaultValues: {
      name: commonParams.name || '',
      email: commonParams.email || '',
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setCommonParams({
      name: data.name,
      email: data.email,
    });
  };

  const onReset = () => {
    reset();
    form.reset({
      name: '',
      email: '',
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
        label={t('table.userName')}
        placeholder={t('common.pleaseInput', {
          field: t('table.userName'),
        })}
      />
      <FormInput
        name="email"
        label={t('table.email')}
        placeholder={t('common.pleaseInput', {
          field: t('table.email'),
        })}
      />
      <div className="bg-background absolute inset-x-0 bottom-0 flex justify-end gap-4 p-4">
        <RrhButton type="reset" variant={'outline'} onClick={onReset}>
          <RefreshCcw className="size-3.5" />
          <span>{t('common.Reset')}</span>
        </RrhButton>
        <RrhButton type="submit">
          <Search className="size-3.5" />
          <span>{t('common.Search')}</span>
        </RrhButton>
      </div>
    </RrhForm>
  );
};
