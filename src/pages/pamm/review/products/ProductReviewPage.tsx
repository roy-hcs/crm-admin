import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductReviewTable } from './ProductReviewTable';
import { ProductReviewForm } from './ProductReviewForm';
import { ProductReviewListParams } from '@/api/hooks/pamm/type';
import { useProductReviewList } from '@/api/hooks/pamm';

export const ProductReviewPage = () => {
  const [otherParams, setOtherParams] = useState<Omit<ProductReviewListParams, 'BasicParams'>>({
    investmentManager: '',
    projectName: '',
    submitStartTime: '',
    submitEndTime: '',
    verifyStartTime: '',
    verifyEndTime: '',
    login: '',
    applyStatus: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();

  const { data: data, isLoading: loading } = useProductReviewList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
  });

  const reset = () => {
    setOtherParams(pre => ({
      ...pre,
      investmentManager: '',
      projectName: '',
      submitStartTime: '',
      submitEndTime: '',
      verifyStartTime: '',
      verifyEndTime: '',
      login: '',
      applyStatus: '',
    }));
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('productReview.title')}</h1>
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('table.projectName') })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setOtherParams(prev => ({ ...prev, projectName: e }));
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
            <ProductReviewForm setOtherParams={setOtherParams} loading={loading} />
          </RrhDrawer>
        </div>
      </div>
      <ProductReviewTable
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
