import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Funnel, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserOrderLogList } from '@/api/hooks/system/system';
import { UserOrderLogListParams } from '@/api/hooks/system/types';
import { BasicParams } from '@/api/hooks/review/types';
import { PaymentLogsForm } from './PaymentLogsForm';
import { PaymentLogsTable } from './PaymentLogsTable';
import { useThirdPaymentList } from '@/api/hooks/review/review';

export const PaymentLogsPage = () => {
  const [params, setParams] = useState<UserOrderLogListParams['params']>({
    operationEnd: '',
    operationStart: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<UserOrderLogListParams, 'params' | keyof BasicParams>
  >({
    orderId: '',
    channelName: '',
    payResult: '',
  });

  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();

  const { data, isLoading } = useUserOrderLogList({
    orderByColumn: '',
    isAsc: 'asc',
    pageNum: pageNum + 1,
    pageSize,
    ...otherParams,
    params: {
      ...params,
    },
  });

  const { data: thirdPaymentList } = useThirdPaymentList();
  const reset = () => {
    setParams({
      operationEnd: '',
      operationStart: '',
      userName: '',
    });
    setOtherParams({
      orderId: '',
      channelName: '',
      payResult: '',
    });
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('paymentLogsPage.title')}</h1>
      <div className="my-3.5 flex items-center justify-end gap-2">
        <RrhButton variant="outline">{t('table.export')}</RrhButton>
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
          <PaymentLogsForm
            setParams={setParams}
            setOtherParams={setOtherParams}
            loading={isLoading}
            paymentMethods={thirdPaymentList?.rows || []}
          />
        </RrhDrawer>
      </div>

      <PaymentLogsTable
        data={data?.rows || []}
        pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={isLoading}
      />
    </div>
  );
};
