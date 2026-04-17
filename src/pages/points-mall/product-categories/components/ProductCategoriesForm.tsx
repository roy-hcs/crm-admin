import { Dispatch, SetStateAction } from 'react';

import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/FormInput';
import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GoodsClassificationParams } from '@/api/hooks/pointsMall';
import { BasicParams } from '@/api/types';
import { RrhForm } from '@/components/form/RrhForm';

type FormData = {
  searchName: string;
};

export const ProductCategoriesForm = ({
  setOtherParams,
  loading,
  otherParams,
  reset,
}: {
  setOtherParams: Dispatch<SetStateAction<Omit<GoodsClassificationParams, keyof BasicParams>>>;
  loading: boolean;
  otherParams?: Omit<GoodsClassificationParams, keyof BasicParams>;
  reset?: () => void;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      searchName: otherParams?.searchName || '',
    },
  });

  const onSubmit = (data: FormData) => {
    reset?.();
    setOtherParams({
      searchName: data.searchName,
    });
  };

  const onReset = () => {
    setOtherParams({
      searchName: '',
    });
    form.reset({
      searchName: '',
    });
    reset?.();
  };

  return (
    <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
          className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20 md:px-12 md:pt-12"
        >
          <FormInput
            verticalLabel
            name="searchName"
            label={t('products.goodsName')}
            placeholder={t('common.pleaseInput', {
              field: t('products.goodsName'),
            })}
          />
          <div className="bg-background absolute inset-x-0 bottom-0 flex justify-end gap-4 p-4">
            <RrhButton type="reset" variant={'outline'} onClick={onReset}>
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
