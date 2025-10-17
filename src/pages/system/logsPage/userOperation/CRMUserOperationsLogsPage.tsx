import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Funnel, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserOperationsLogsParams } from '@/api/hooks/monitor/type';
import { useUserOperationLogs } from '@/api/hooks/monitor/monitor';
import { useDictType } from '@/api/hooks/system/system';
import { UserOperationsLogsTable } from './UserOperationsLogsTable';
import { UserOperationsLogsForm } from './UserOperationsLogsForm';

export const CRMUserOperationsLogsPage = () => {
  const [params, setParams] = useState<UserOperationsLogsParams['params']>({
    beginTime: '',
    endTime: '',
  });
  const [otherParams, setOtherParams] = useState<Omit<UserOperationsLogsParams, 'params'>>({
    title: '',
    operName: '',
    status: '',
    businessTypes: '',
  });

  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const { data: operationTypes } = useDictType('crm_oper_type');
  console.log('operationTypes', operationTypes);

  const { data, isLoading } = useUserOperationLogs({
    orderByColumn: '',
    isAsc: 'asc',
    pageNum: pageNum + 1,
    pageSize,
    ...otherParams,
    params: {
      ...params,
    },
  });
  const reset = () => {
    setParams({
      beginTime: '',
      endTime: '',
    });
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
      <h1 className="text-title">{t('tradingHistoryPage.tradingHistory')}</h1>
      <div className="my-3.5 flex items-center justify-end gap-2">
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
          <UserOperationsLogsForm
            operationType={operationTypes}
            setParams={setParams}
            setOtherParams={setOtherParams}
            loading={isLoading}
          />
        </RrhDrawer>
      </div>

      <UserOperationsLogsTable
        data={data?.rows || []}
        pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={isLoading}
        operationsType={operationTypes}
      />
    </div>
  );
};
