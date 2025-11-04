import { RrhButton } from '@/components/common/RrhButton';
import { FormInput } from '@/components/form/FormInput';
import { Form } from '@/components/ui/form';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FormProvider } from '@/contexts/form';
import { useForm } from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';
import { GoodsClassificationParams } from '@/api/hooks/pointsMall/types';

type FormData = {
  searchName: string;
};

export const ProductCategoriesForm = ({
  setOtherParams,
  loading,
}: {
  setOtherParams: Dispatch<
    SetStateAction<
      Omit<GoodsClassificationParams, 'pageSize' | 'pageNum' | 'orderByColumn' | 'isAsc'>
    >
  >;
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      searchName: '',
    },
  });
  const onSubmit = (data: FormData) => {
    setOtherParams(pre => ({
      ...pre,
      searchName: data.searchName,
    }));
  };
  const onReset = () => {
    setOtherParams(pre => ({
      ...pre,
      searchName: '',
    }));
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
            name="searchName"
            label={t('products.goodsName')}
            placeholder={t('common.pleaseInput', {
              field: t('products.goodsName'),
            })}
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
