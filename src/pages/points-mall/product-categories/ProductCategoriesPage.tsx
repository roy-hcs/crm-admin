import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductCategoriesTable } from './ProductCategoriesTable';
import { ProductCategoriesForm } from './ProductCategoriesForm';
import { useGoodsClassification, GoodsClassificationParams } from '@/api/hooks/pointsMall';

export const ProductCategoriesPage = () => {
  const { t } = useTranslation();
  const [otherParams, setOtherParams] = useState<
    Omit<GoodsClassificationParams, 'pageSize' | 'pageNum' | 'orderByColumn' | 'isAsc'>
  >({
    searchName: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { data: data, isLoading: loading } = useGoodsClassification({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
  });

  const reset = () => {
    setOtherParams(pre => ({
      ...pre,
      searchName: '',
    }));
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('productCategories.title')}</h1>
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('products.goodsName') })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setOtherParams(prev => ({ ...prev, searchName: e }));
            setPageNum(0);
          }}
        />
        <div className="flex justify-end gap-2">
          <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
            <RefreshCcw className="size-3.5" />
          </RrhButton>
          <RrhDrawer
            headerShow={false}
            asChild
            responsiveDirection={{
              mobile: 'bottom',
              desktop: 'right',
            }}
            footerShow={false}
            Trigger={
              <RrhButton variant="ghost" className="size-8">
                <Funnel />
              </RrhButton>
            }
          >
            <ProductCategoriesForm setOtherParams={setOtherParams} loading={loading} />
          </RrhDrawer>
        </div>
      </div>
      <ProductCategoriesTable
        data={data?.rows || []}
        pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={loading}
      />
    </div>
  );
};
