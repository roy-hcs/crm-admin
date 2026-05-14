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
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { PaymentOrderDetailDialog } from './PaymentOrderDetailDialog';
import { usePaymentOrderDepositDetail, usePaymentOrderExport } from '@/api/hooks/report/report';
import { PaymentOrderEditDialog } from './PaymentOrderEditDialog';
import { ExportButton } from '@/components/common/ExportButton';
export function PaymentOrdersPage() {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [resetKey, setResetKey] = useState(0);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailId, setDetailId] = useState<string>('');
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

  const {
    data: data,
    isLoading: loading,
    refetch,
  } = usePaymentOrderList({
    params,
    pageSize,
    ...commonParams,
    pageNum: pageNum + 1,
    isAsc: 'asc',
    orderByColumn: '',
  });
  const { data: depositDetail, isLoading: depositDetailLoading } = usePaymentOrderDepositDetail(
    detailId,
    (detailDialogOpen || editDialogOpen) && !!detailId,
  );
  const openDepositDetail = (id: string) => {
    setDetailId(id);
    setDetailDialogOpen(true);
  };
  const openDepositEdit = (id: string) => {
    setDetailId(id);
    setEditDialogOpen(true);
  };
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
    setResetKey(k => k + 1);
    setPageNum(0);
    setPageSize(10);
  };
  const allColumns: CRMColumnDef<PaymentOrderItem, unknown>[] = [
    {
      fixed: true,
      size: 50,
      id: 'No.',
      header: t('overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'userName',
      header: t('paymentOrders.userName'),
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
      header: t('paymentOrders.account'),
      accessorFn: row => row.account,
    },
    {
      id: 'payAmount',
      header: t('paymentOrders.payAmount'),
      accessorFn: row => row.payAmount,
    },
    {
      id: 'receiptAmount',
      header: t('paymentOrders.receiptAmount'),
      accessorFn: row => row.receiptAmount || '--',
    },
    {
      id: 'orderStatus',
      header: t('paymentOrders.orderStatus'),
      cell: ({ row }) => <RrhOrderStatusTag status={String(row.original.orderStatus)} />,
    },
    {
      id: 'channelName',
      header: t('paymentOrders.channelName'),
      accessorFn: row => row.channelName || '--',
    },
    {
      id: 'createTime',
      header: t('paymentOrders.createTime'),
      accessorFn: row => row.createTime || '--',
    },
    {
      id: 'orderId',
      header: t('table.orderNumber'),
      accessorFn: row => row.orderId || '--',
    },
    {
      id: 'operation',
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      cell: ({ row }) => (
        <div>
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('common.View'), value: 'view' },
              { label: t('common.Edit'), value: 'edit' },
            ]}
            callToAction={async action => {
              if (action === 'edit') {
                if (row.original.id) {
                  await openDepositEdit(row.original.id);
                }
              } else if (action === 'view') {
                if (row.original.id) {
                  await openDepositDetail(row.original.id);
                }
              }
            }}
          />
        </div>
      ),
    },
  ];
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('payment-orders-table', allColumns);

  const { mutateAsync: exportPaymentOrders, isPending: exportLoading } = usePaymentOrderExport();
  return (
    <div>
      <PageInfo title={t('paymentOrders.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              key={resetKey}
              placeholder={t('common.pleaseInput', {
                field: t('paymentOrders.userName'),
              })}
              className="h-9"
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={e => {
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
            <ExportButton<PaymentOrderListParams>
              title={t('paymentOrders.title')}
              exportFunction={exportPaymentOrders}
              params={{ params, ...commonParams }}
              exportLoading={exportLoading}
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
      </TableContentWrapper>
      {depositDetail?.data && (
        <PaymentOrderDetailDialog
          isLoading={depositDetailLoading}
          paymentOrderItem={depositDetail.data}
          open={detailDialogOpen}
          setOpen={setDetailDialogOpen}
        />
      )}
      {depositDetail?.data && (
        <PaymentOrderEditDialog
          isLoading={depositDetailLoading}
          paymentOrderItem={depositDetail.data}
          open={editDialogOpen}
          setOpen={setEditDialogOpen}
          onStatusChange={refetch}
        />
      )}
    </div>
  );
}
