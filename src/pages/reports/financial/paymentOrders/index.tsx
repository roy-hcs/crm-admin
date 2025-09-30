import { useRef, useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { usePaymentOrderList } from '@/api/hooks/report/report';
import { PaymentOrdersForm, PaymentOrdersFormRef } from './components/PaymentOrdersForm';
import { Funnel, Search, RefreshCcw, Ellipsis } from 'lucide-react';
import { PaymentOrdersTable } from './components/PaymentOrdersTable';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
export function PaymentOrdersPage() {
  const { t } = useTranslation();
  const formRef = useRef<PaymentOrdersFormRef>(null);
  // 分页
  const [pageNum, setPageNum] = useState(0);
  // 每页条数
  const [pageSize, setPageSize] = useState(10);
  // 特殊参数
  const [params, setParams] = useState({
    userName: '',
    account: '',
    accounts: '',
    operationStart: '',
    operationEnd: '',
  });
  // 普通参数
  const [commonParams, setCommonParams] = useState({
    channelId: '',
    orderStatus: '',
    orderId: '',
    accounts: '',
  });

  const { data: data, isLoading: loading } = usePaymentOrderList({
    params,
    pageSize,
    ...commonParams,
    pageNum: pageNum + 1,
    // 下面是固定参数
    isAsc: 'asc',
    orderByColumn: '',
  });
  const reset = () => {
    setParams({
      userName: '',
      account: '',
      accounts: '',
      operationStart: '',
      operationEnd: '',
    });
    setCommonParams({
      channelId: '',
      orderStatus: '',
      orderId: '',
      accounts: '',
    });
    setPageNum(0);
    setPageSize(10);
  };
  return (
    <div>
      <div className="text-xl leading-8 font-semibold text-neutral-950">
        {t('financial.paymentOrders.title')}
      </div>
      <div className="mt-3.5 mb-3.5 flex justify-between">
        <div className="w-67 max-w-sm">
          <RrhInputWithIcon
            placeholder="Last Name/First Name/Email"
            className="h-9"
            rightIcon={<Search className="size-4" />}
            onRightIconClick={() => {
              // 触发查询逻辑, 这里简单调用一次刷新
              setPageNum(0);
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
            <RefreshCcw className="size-3.5" />
          </Button>
          <Button variant="ghost" className="size-8 cursor-pointer">
            <Ellipsis />
          </Button>
          <RrhDrawer
            asChild
            Trigger={
              <Button variant="ghost" className="size-8 cursor-pointer">
                <Funnel className="size-4" />
              </Button>
            }
            title="Filter"
            direction="right"
            footerShow={false}
          >
            <PaymentOrdersForm
              ref={formRef}
              setParams={setParams}
              setCommonParams={setCommonParams}
            />
          </RrhDrawer>
        </div>
      </div>
      <PaymentOrdersTable
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
}
