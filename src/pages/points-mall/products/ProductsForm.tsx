import { Dispatch, SetStateAction } from 'react';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { FormProvider } from '@/contexts/form';
import { FormInput } from '@/components/form/FormInput';
import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CrmDealGoodsListParams } from '@/api/hooks/pointsMall';

type FormData = {
  goodsName: string;
};

export const ProductsForm = ({
  setParams,
  params,
  reset,
}: {
  setParams: Dispatch<SetStateAction<CrmDealGoodsListParams['params']>>;
  params: CrmDealGoodsListParams['params'];
  reset: () => void;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      goodsName: params.goodsName || '',
    },
  });

  const onSubmit = (data: FormData) => {
    setParams({
      goodsName: data.goodsName,
    });
  };

  const onReset = () => {
    reset();
    form.reset({
      goodsName: '',
    });
  };

  return (
    <FormProvider form={form}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
          className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20"
        >
          <FormInput
            verticalLabel
            name="goodsName"
            label={t('products.goodsName')}
            placeholder={t('common.pleaseInput', {
              field: t('products.goodsName'),
            })}
          />
          <div className="bg-background absolute inset-x-0 bottom-0 flex gap-4 p-4">
            <RrhButton type="reset" variant={'outline'} onClick={onReset}>
              <RefreshCcw className="size-3.5" />
              <span>{t('common.Reset')}</span>
            </RrhButton>
            <RrhButton type="submit">
              <Search className="size-3.5" />
              <span>{t('common.Search')}</span>
            </RrhButton>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};
