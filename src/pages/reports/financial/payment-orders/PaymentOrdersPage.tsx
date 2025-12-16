import { useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { PaymentOrderItem, PaymentOrderListParams, usePaymentOrderList } from '@/api/hooks/report';
import { PaymentOrdersForm } from './PaymentOrdersForm';
import { Funnel, Search, RefreshCcw, Ellipsis } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { CRMColumnDef, DataTable } from '@/components/table';
import { RrhOrderStatusTag } from '@/components/common/RrhOrderStatusTag';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { PageInfo } from '@/components/common/PageInfo';
import { BasicParams } from '@/api/types';
export function PaymentOrdersPage() {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [params, setParams] = useState<PaymentOrderListParams['params']>({
    userName: '',
    account: '',
    accounts: '',
    operationStart: '',
    operationEnd: '',
  });
  const [commonParams, setCommonParams] = useState<
    Omit<PaymentOrderListParams, 'params' | keyof BasicParams>
  >({
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
    setKeyword('');
    setPageNum(0);
    setPageSize(10);
  };
  const allColumns: CRMColumnDef<PaymentOrderItem, unknown>[] = [
    {
      fixed: true,
      size: 50,
      id: 'No.',
      header: t('ib.overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'userName',
      header: t('financial.paymentOrders.userName'),
      cell: ({ row }) => {
        const name = row?.original?.userName?.split('<br/>') ?? [];
        if (name.length === 0) {
          return '--';
        }
        return (
          <div>
            <div>{name[0]}</div>
            <div>{name[1]}</div>
          </div>
        );
      },
    },
    {
      id: 'account',
      header: t('financial.paymentOrders.account'),
      accessorFn: row => row.account,
    },
    {
      id: 'payAmount',
      header: t('financial.paymentOrders.payAmount'),
      accessorFn: row => row.payAmount,
    },
    {
      id: 'receiptAmount',
      header: t('financial.paymentOrders.receiptAmount'),
      accessorFn: row => row.receiptAmount || '--',
    },
    {
      id: 'orderStatus',
      header: t('financial.paymentOrders.orderStatus'),
      cell: ({ row }) => <RrhOrderStatusTag status={String(row.original.orderStatus)} />,
    },
    {
      id: 'channelName',
      header: t('financial.paymentOrders.channelName'),
      accessorFn: row => row.channelName || '--',
    },
    {
      id: 'createTime',
      header: t('financial.paymentOrders.createTime'),
      accessorFn: row => row.createTime || '--',
    },
    {
      id: 'orderId',
      header: t('financial.paymentOrders.orderId'),
      accessorFn: row => row.orderId || '--',
    },
    {
      id: 'operation',
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      cell: () => (
        <div>
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('common.View'), value: 'view' },
              { label: t('common.Edit'), value: 'edit' },
            ]}
            callToAction={action => {
              if (action === 'edit') {
                // Handle edit action
              } else if (action === 'view') {
                // Handle view action
              }
            }}
          />
        </div>
      ),
    },
  ];
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('payment-orders-table', allColumns);
  return (
    <div>
      <PageInfo title={t('financial.paymentOrders.title')} />
      <div className="mt-3.5 mb-3.5 flex justify-between">
        <div className="w-67 max-w-sm">
          <RrhInputWithIcon
            placeholder={t('common.pleaseInput', {
              field: t('financial.paymentOrders.userName'),
            })}
            className="h-9"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            rightIcon={<Search className="size-4" />}
            onRightIconClick={e => {
              // 触发查询逻辑, 这里简单调用一次刷新
              setPageNum(0);
              setParams(prev => ({
                ...prev,
                userName: e,
              }));
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
            <RefreshCcw className="size-3.5" />
          </Button>
          <RrhDrawer
            asChild
            Trigger={
              <Button variant="ghost" className="size-8 cursor-pointer">
                <Funnel className="size-4" />
              </Button>
            }
            title="Filter"
            responsiveDirection={{
              mobile: 'bottom',
              desktop: 'right',
            }}
            footerShow={false}
          >
            <PaymentOrdersForm
              reset={reset}
              params={params}
              commonParams={commonParams}
              setParams={setParams}
              setCommonParams={setCommonParams}
            />
          </RrhDrawer>
          <ColumnVisibilityButton
            columnMeta={columnMeta}
            visibleColumns={visibleColumns}
            onToggle={toggleColumn}
            onBatchReorder={batchUpdateColumns}
            columns={columns}
          />
        </div>
      </div>
      <DataTable
        columns={tableColumns}
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
