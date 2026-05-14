import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserOrderLogList, UserOrderLogListParams, UserOrderLogItem } from '@/api/hooks/system';
import { BasicParams } from '@/api/hooks/review/types';
import { PaymentLogsForm } from './PaymentLogsForm';
import { useThirdPaymentList } from '@/api/hooks/review/review';
import { CRMColumnDef, DataTable } from '@/components/table';
import { Checkbox } from '@/components/ui/checkbox';
import { OrderStatusOptions } from '@/lib/const';
import { ToolTip } from '@/components/common/ToolTip';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { PageInfo } from '@/components/common/PageInfo';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

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
  const [resetKey, setResetKey] = useState(0);
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
    setResetKey(k => k + 1);
    setPageNum(0);
  };
  const allColumns: CRMColumnDef<UserOrderLogItem, unknown>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          className="data-[state=checked]:border-slate-700"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="data-[state=checked]:border-slate-700"
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'No.',
      header: t('CRMAccountPage.Index'),
      cell: ({ row }) => row.index + 1,
    },
    {
      id: 'orderNumber',
      header: t('table.orderNumber'),
      accessorFn: row => row.orderId,
    },
    {
      id: 'orderTime',
      header: t('table.orderTime'),
      accessorFn: row => row.logTime,
    },
    {
      id: 'nameOrId',
      header: t('table.nameOrId'),
      cell: ({ row }) => {
        return (
          <div>
            <div>{row.original.userName}</div>
            <div>{row.original.showId}</div>
          </div>
        );
      },
    },
    {
      id: 'channelName',
      header: t('table.paymentChannel'),
      accessorFn: row => row.channelName,
    },
    {
      id: 'orderStatus',
      header: t('paymentOrders.orderStatus'),
      cell: ({ row }) => {
        const status = OrderStatusOptions.find(
          item => item.value === row.original.orderStatus.toString(),
        );
        return status?.label ? t(status.label) : '-';
      },
    },
    {
      id: 'payResult',
      header: t('table.payResult'),
      cell: ({ row }) => {
        switch (row.original.payResult) {
          case 1:
            return t('table.paySuccess');
          case 0:
            return t('table.payFailed');
          default:
            return '-';
        }
      },
    },
    {
      id: 'reason',
      header: t('table.reason'),
      cell: ({ row }) => {
        const exceedLength = row.original.msg && row.original.msg.length > 40;
        const reasonText = exceedLength ? row.original.msg?.slice(0, 40) + '...' : row.original.msg;
        return exceedLength ? (
          <ToolTip content={<div className="break-all">{row.original.msg}</div>}>
            <div>{reasonText}</div>
          </ToolTip>
        ) : (
          <div>{reasonText}</div>
        );
      },
    },
  ];
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('payment-logs-table', allColumns);

  return (
    <div>
      <PageInfo title={t('paymentLogsPage.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex items-center justify-between gap-2">
          <RrhInputWithIcon
            key={resetKey}
            placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
            className="h-9"
            leftIcon={<Search className="size-4 cursor-pointer" />}
            onLeftIconClick={e => {
              setOtherParams(prev => ({ ...prev, orderId: e }));
              setPageNum(0);
            }}
          />
          <div className="flex items-center gap-2">
            <RrhButton type="button">{t('table.export')}</RrhButton>
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
              <PaymentLogsForm
                setParams={setParams}
                setOtherParams={setOtherParams}
                loading={isLoading}
                paymentMethods={thirdPaymentList?.rows || []}
                reset={reset}
                params={params}
                otherParams={otherParams}
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
          loading={isLoading}
        />
      </TableContentWrapper>
    </div>
  );
};
