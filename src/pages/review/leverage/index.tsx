import { useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { LeverageForm } from './LeverageForm';
import { Funnel, Search, RefreshCcw } from 'lucide-react';
import { LeverageTable } from './LeverageTable';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { useLeverageVerifyList } from '@/api/hooks/review/review';
import { RrhButton } from '@/components/common/RrhButton';
import { CrmNewLoginVerifyListParams } from '@/api/hooks/review/types';
export function LeveragePage() {
  const { t } = useTranslation();
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('');
  const [orderByColumn, setOrderByColumn] = useState<
    | 'status desc,subTime desc'
    | 'currentLever'
    | 'targetLever'
    | 'status'
    | 'subTime'
    | 'verifyTime'
  >('status desc,subTime desc');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [params, setParams] = useState<CrmNewLoginVerifyListParams['params']>({
    server: '',
    beginTime: '',
    endTime: '',
  });
  const [commonParams, setCommonParams] = useState({
    userId: '',
    login: '',
    status: '',
    verifyUserName: '',
  });
  const { data: data, isLoading: loading } = useLeverageVerifyList({
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
      login: '',
      status: '',
      verifyUserName: '',
    });
    setPageNum(0);
  };
  return (
    <div>
      <h1 className="text-title"> {t('review.leverage.title')}</h1>
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
            <LeverageForm setParams={setParams} setCommonParams={setCommonParams} />
          </RrhDrawer>
        </div>
      </div>
      <LeverageTable
        data={data?.rows || []}
        pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        isAsc={isAsc}
        setIsAsc={setIsAsc}
        setOrderByColumn={setOrderByColumn}
        loading={loading}
      />
    </div>
  );
}
