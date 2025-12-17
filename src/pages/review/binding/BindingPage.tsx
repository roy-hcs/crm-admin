import { useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { BindingForm } from './BindingForm';
import { Funnel, Search, RefreshCcw } from 'lucide-react';
import { BindingTable } from './BindingTable';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { useBindVerifyList, CrmNewLoginVerifyListParams } from '@/api/hooks/review';
import { RrhButton } from '@/components/common/RrhButton';
export function BindingPage() {
  const { t } = useTranslation();
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('');
  const [orderByColumn, setOrderByColumn] = useState<string>('status desc,subTime desc');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [params, setParams] = useState<CrmNewLoginVerifyListParams['params']>({
    server: '',
    serverProperty: '',
    beginTime: '',
    endTime: '',
  });
  const [commonParams, setCommonParams] = useState({
    userId: '',
    status: '',
    login: '',
    verifyUserName: '',
  });
  const { data: data, isLoading: loading } = useBindVerifyList({
    params,
    pageSize,
    ...commonParams,
    pageNum: pageNum + 1,
    isAsc: isAsc,
    orderByColumn: orderByColumn,
  });
  const reset = () => {
    setParams(pre => ({ ...pre, beginTime: '', endTime: '' }));
    setCommonParams({
      userId: '',
      status: '',
      login: '',
      verifyUserName: '',
    });
    setPageNum(0);
  };
  return (
    <div>
      <h1 className="text-title"> {t('review.binding.title')}</h1>
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('review.information.verifyUserName') })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setCommonParams(prev => ({ ...prev, verifyUserName: e }));
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
            <BindingForm setParams={setParams} setCommonParams={setCommonParams} />
          </RrhDrawer>
        </div>
      </div>
      <BindingTable
        data={data?.rows || []}
        pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        isAsc={isAsc}
        setIsAsc={setIsAsc}
        orderByColumn={orderByColumn}
        setOrderByColumn={setOrderByColumn}
        loading={loading}
      />
    </div>
  );
}
