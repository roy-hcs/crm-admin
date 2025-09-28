import { useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { InFormationForm } from './InFormationForm';
import { Funnel, Search, RefreshCcw } from 'lucide-react';
import { InFormationTable } from './InFormationTable';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { useCrmInfoVerifyList } from '@/api/hooks/review/review';
import { RrhButton } from '@/components/common/RrhButton';
import { CrmInfoVerifyListParams } from '@/api/hooks/review/types';
import { useInfoTypeList } from '@/api/hooks/system/system';
import { InfoTypeItem } from '@/api/hooks/system/types';
export function InFormationPage() {
  const { t } = useTranslation();
  const { data: useInfoTyperesponse, isLoading: useInfoTypeloading } = useInfoTypeList();
  const infoTypeList: InfoTypeItem[] = Array.isArray(useInfoTyperesponse)
    ? useInfoTyperesponse
    : [];
  const [isAsc, setIsAsc] = useState<'asc' | 'desc'>('asc');
  const [orderByColumn, setOrderByColumn] = useState<
    'infoType' | 'status' | 'subTime' | 'verifyTime'
  >('status');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [params, setParams] = useState<CrmInfoVerifyListParams['params']>({
    beginTime: '',
    endTime: '',
  });
  const [commonParams, setCommonParams] = useState({
    userId: '',
    infoType: '',
    status: '',
    verifyUserName: '',
  });
  const { data: data, isLoading: loading } = useCrmInfoVerifyList({
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
      infoType: '',
      status: '',
      verifyUserName: '',
    });
    setPageNum(0);
  };
  return (
    <div>
      <h1 className="text-title"> {t('review.information.title')}</h1>
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('review.information.verifyUserName') })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setCommonParams(prev => ({ ...prev, verifyUserName: e }));
            setPageNum(1);
          }}
        />
        <div className="flex justify-end gap-2">
          <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
            <RefreshCcw className="size-3.5" />
          </RrhButton>
          <RrhDrawer
            headerShow={false}
            asChild
            direction="right"
            footerShow={false}
            Trigger={
              <RrhButton variant="ghost" className="size-8">
                <Funnel />
              </RrhButton>
            }
          >
            <InFormationForm
              setParams={setParams}
              setCommonParams={setCommonParams}
              infoTypeList={infoTypeList}
            />
          </RrhDrawer>
        </div>
      </div>
      <InFormationTable
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
        infoTypeList={infoTypeList}
        loading={loading || useInfoTypeloading}
      />
    </div>
  );
}
