import { RrhButton } from '@/components/common/RrhButton';
import { FormInput } from '@/components/form/FormInput';

import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useForm } from 'react-hook-form';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { BasicParams } from '@/api/types';
import { MamSymbolListParams } from '@/api/hooks/copyTrading/type';
import { FormSelect } from '@/components/form/FormSelect';
import { useDictType } from '@/api/hooks/system';
import { RrhForm } from '@/components/form/RrhForm';

type FormData = {
  symbolCategory: string;
  symbol: string;
};

export const VarietyManagementForm = ({
  setOtherParams,
  reset,
  loading,
  otherParams,
}: {
  setOtherParams: Dispatch<SetStateAction<Omit<MamSymbolListParams, keyof BasicParams>>>;
  reset: () => void;
  loading: boolean;
  otherParams: Omit<MamSymbolListParams, keyof BasicParams>;
}) => {
  const { data: symbolCategoryDataRes } = useDictType('mam_symbol_category');
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      symbolCategory: otherParams.symbolCategory || '',
      symbol: otherParams.symbol || '',
    },
  });
  const onSubmit = (data: FormData) => {
    reset();
    setOtherParams(pre => ({
      ...pre,
      symbolCategory: data.symbolCategory,
      symbol: data.symbol,
    }));
  };
  const onReset = () => {
    reset();
    form.reset({
      symbolCategory: '',
      symbol: '',
    });
  };

  const symbolCategoryData = useMemo(() => {
    console.log('symbolCategoryDataRes', symbolCategoryDataRes);
    return symbolCategoryDataRes || [];
  }, [symbolCategoryDataRes]);

  return (
    <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              if (e.target instanceof HTMLTextAreaElement) return;

              e.preventDefault();
              form.handleSubmit(onSubmit)();
            }
          }}
          className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20 md:px-12 md:pt-12"
        >
          <FormSelect
            verticalLabel
            name="symbolCategory"
            label={t('varietyManagement.symbolCategory')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={symbolCategoryData.map(i => ({ label: i.dictLabel, value: i.dictValue }))}
          />

          <FormInput
            verticalLabel
            name="symbol"
            label={t('varietyManagement.symbol')}
            placeholder={t('common.pleaseInput', {
              field: t('varietyManagement.symbol'),
            })}
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
