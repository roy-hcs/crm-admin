import { useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import {
  RefundFailLogItem,
  RefundFailLogListParams,
  useRefundFailLogList,
} from '@/api/hooks/report';
import { RefundFailureLogsForm } from './PaymentOrdersForm';
import { Funnel, Search, RefreshCcw, Ellipsis } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { BasicParams } from '@/api/types';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { RrhOrderStatusTag } from '@/components/common/RrhOrderStatusTag';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
export function RefundFailureLogsPage() {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [params, setParams] = useState<RefundFailLogListParams['params']>({
    beginTime: '',
    endTime: '',
  });
  const [commonParams, setCommonParams] = useState<
    Omit<RefundFailLogListParams, 'params' | keyof BasicParams>
  >({
    userId: '',
    status: '',
    refundAccount: '',
  });
  const { data: data, isLoading: loading } = useRefundFailLogList({
    params,
    pageSize,
    ...commonParams,
    pageNum: pageNum + 1,
    isAsc: 'asc',
    orderByColumn: '',
  });
  const reset = () => {
    setParams({
      beginTime: '',
      endTime: '',
    });
    setCommonParams({
      userId: '',
      status: '',
      refundAccount: '',
    });
    setKeyword('');
    setPageNum(0);
    setPageSize(10);
  };
  const allColumns: CRMColumnDef<RefundFailLogItem, unknown>[] = [
    {
      id: 'No.',
      header: t('ib.overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'userName',
      header: t('financial.paymentOrders.userName'),
      cell: ({ row }) => {
        if (row.original.lastName || row.original.name || row.original.showId) {
          return (
            <div>
              <div>{(row.original.lastName ?? '') + (row.original.name ?? '')}</div>
              <div>{row.original.showId ?? ''}</div>
            </div>
          );
        }
        return '--';
      },
    },
    {
      id: 'operType',
      header: t('common.operType'),
      accessorFn: row => row.operType,
    },
    {
      id: 'operTime',
      header: t('common.operationTime'),
      accessorFn: row => row.operTime,
    },
    {
      id: 'refundAmount',
      header: t('financial.refundFailLog.refundAmount'),
      accessorFn: row => row.refundAmount,
    },
    {
      id: 'refundAccount',
      header: t('financial.refundFailLog.refundAccount'),
      cell: ({ row }) => {
        const name = row?.original?.refundAccount?.split('</br>') ?? [];
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
      id: 'status',
      header: t('common.status'),
      cell: ({ row }) => <RrhOrderStatusTag status={String(row.original.status)} />,
    },
    {
      id: 'operation',
      label: t('common.Operation'),
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
      fixed: 'right',
      size: 50,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('refund-failure-logs-table', allColumns);

  return (
    <div>
      <PageInfo title={t('financial.refundFailLog.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              placeholder={t('common.pleaseInput', {
                field: t('financial.paymentOrders.userName'),
              })}
              className="h-9"
              leftIcon={<Search className="size-4" />}
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onLeftIconClick={e => {
                // 触发查询逻辑, 这里简单调用一次刷新
                setPageNum(0);
                setCommonParams(prev => ({
                  ...prev,
                  userId: e,
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
              title="<Response>
【已提交】文件已成功修改并保存。
</Response>Filter"
              responsiveDirection={{
                mobile: 'bottom',
                desktop: 'right',
              }}
              footerShow={false}
            >
              <RefundFailureLogsForm
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
      </TableContentWrapper>
    </div>
  );
}
