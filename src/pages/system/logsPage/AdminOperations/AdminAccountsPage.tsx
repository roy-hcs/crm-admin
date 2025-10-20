import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminOperationsTable } from './AdminOperationsTable';
import { AdminOperationsForm } from './AdminOperationsForm';
import { useAdminOperLogList, useDictType } from '@/api/hooks/system/system';
import { AdminOperLogParams } from '@/api/hooks/system/types';

export const AdminOperationsPage = () => {
  const [params, setParams] = useState<AdminOperLogParams['params']>({
    beginTime: '',
    endTime: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<AdminOperLogParams, 'params' | 'pageSize' | 'pageNum' | 'orderByColumn' | 'isAsc'>
  >({
    title: '',
    operName: '',
    status: '',
    businessTypes: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const { data: operTypeList } = useDictType('sys_oper_type');
  const { data: walletBalanceList, isLoading: walletBalanceListLoading } = useAdminOperLogList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
    params: {
      ...params,
    },
  });

  const reset = () => {
    setParams(pre => ({
      ...pre,
      beginTime: '',
      endTime: '',
    }));
    setOtherParams({
      title: '',
      operName: '',
      status: '',
      businessTypes: '',
    });
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('system.adminOperations.title')}</h1>
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('common.operName') })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setOtherParams(prev => ({ ...prev, operName: e }));
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
            <AdminOperationsForm
              setParams={setParams}
              setOtherParams={setOtherParams}
              loading={walletBalanceListLoading}
              operTypeList={operTypeList || []}
            />
          </RrhDrawer>
        </div>
      </div>
      <AdminOperationsTable
        data={walletBalanceList?.rows || []}
        pageCount={Math.ceil(+(walletBalanceList?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={walletBalanceListLoading}
        operTypeList={operTypeList || []}
      />
    </div>
  );
};
