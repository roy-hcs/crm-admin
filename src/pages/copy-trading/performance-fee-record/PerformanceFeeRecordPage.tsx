import { useMemo, useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { PerformanceFeeItem, PerformanceFeeListParams } from '@/api/hooks/copyTrading/type';
import { usePerformanceFeeList } from '@/api/hooks/copyTrading';
import { PerformanceFeeRecordForm } from './PerformanceFeeRecordForm';
import { Funnel, Search, RefreshCcw } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/types';
import { PerformanceFeePayStatusOptions } from '@/lib/const';
import { RrhSorter } from '@/components/common/RrhSorter';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { PerformanceFeeRecordDetailDialog } from './components/PerformanceFeeRecordDetailDialog';
import { RrhButton } from '@/components/common/RrhButton';

export const PerformanceFeeRecordPage = () => {
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('');
  const [orderByColumn, setOrderByColumn] = useState<string>('');
  const [params, setParams] = useState<PerformanceFeeListParams['params']>({
    signalSourceOwner: '',
    follower: '',
    beginTime: '',
    endTime: '',
    beginPayTime: '',
    endPayTime: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<PerformanceFeeListParams, 'params' | keyof BasicParams>
  >({
    signalSourceName: '',
    traderServerId: '',
    trader: '',
    client: '',
    payStatus: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [resetKey, setResetKey] = useState(0);

  const [id, setId] = useState<string>();
  const [detailOpen, setDetailOpen] = useState(false);
  const { t } = useTranslation();

  const { data: data, isLoading: loading } = usePerformanceFeeList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: orderByColumn,
    isAsc: isAsc,
    ...otherParams,
    params,
  });

  const reset = () => {
    setParams(pre => ({
      ...pre,
      signalSourceOwner: '',
      follower: '',
      beginTime: '',
      endTime: '',
      beginPayTime: '',
      endPayTime: '',
    }));
    setOtherParams(pre => ({
      ...pre,
      signalSourceName: '',
      traderServerId: '',
      trader: '',
      client: '',
      payStatus: '',
    }));
    setResetKey(k => k + 1);
    setPageNum(0);
  };

  const allColumns = useMemo<CRMColumnDef<PerformanceFeeItem, unknown>[]>(
    () => [
      {
        id: 'orderNo',
        header: t('table.orderNumber'),
        cell: ({ row }) => row?.original?.orderNo || '-',
      },
      {
        id: 'signalSourceName',
        header: t('signals.name'),
        cell: ({ row }) => {
          return (
            <div>
              <span>{row?.original?.signalSourceName}</span>
              <span>{row?.original?.traderServer}</span>
            </div>
          );
        },
      },
      {
        id: 'clientName',
        header: t('performanceFeeRecord.clientName'),
        cell: ({ row }) => {
          return (
            <div>
              <span>{row?.original?.clientName}</span>
              <span>{row?.original?.clientEmail}</span>
            </div>
          );
        },
      },
      {
        id: 'payAccountName',
        header: t('table.subscriberAccount'),
        cell: ({ row }) => row?.original?.payAccountName || '-',
      },
      {
        id: 'performanceFee',
        header: t('performanceFeeRecord.performanceFee'),
        cell: ({ row }) => row?.original?.performanceFee || '-',
      },
      {
        id: 'managementFee',
        header: t('performanceFeeRecord.managementFee'),
        cell: ({ row }) => row?.original?.managementFee || '-',
      },
      {
        id: 'createTime',
        header: t('common.createTime'),
        cell: ({ row }) => row?.original?.createTime || '-',
      },
      {
        id: 'payStatus',
        header: t('table.payResult'),
        cell: ({ row }) => {
          const text = PerformanceFeePayStatusOptions.find(
            i => i.value === String(row?.original?.payStatus),
          );
          return <span>{text ? t(text.label) : '-'}</span>;
        },
      },
      {
        id: 'payTime',
        label: t('performanceFeeRecord.payTime'),
        header: () => {
          return (
            <div className="flex items-center justify-between gap-2">
              <div>{t('performanceFeeRecord.payTime')}</div>
              <RrhSorter
                orderByColumn={orderByColumn}
                isAsc={isAsc}
                column="payTime"
                setOrderByColumn={setOrderByColumn}
                setIsAsc={setIsAsc}
              />
            </div>
          );
        },
        cell: ({ row }) => row?.original?.payTime || '-',
      },
      {
        id: 'operation',
        label: t('common.Operation'),
        header: () => {
          return <div className="flex justify-center">{t('common.Operation')}</div>;
        },
        cell: ({ row }) => (
          <RrhButton
            variant="ghost"
            onClick={() => {
              setId(row?.original?.id || '');
              setDetailOpen(true);
            }}
          >
            {t('common.View')}
          </RrhButton>
        ),
        fixed: 'right',
        size: 50,
      },
    ],
    [t, orderByColumn, isAsc, setOrderByColumn, setIsAsc, setId, setDetailOpen],
  );

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('performance-fee-record-table', allColumns);

  return (
    <div>
      <PageInfo title={t('performanceFeeRecord.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              key={resetKey}
              placeholder={t('common.pleaseInput', { field: t('signals.name') })}
              className="h-9"
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={value => {
                setOtherParams(prev => ({ ...prev, signalSourceName: value }));
                setPageNum(0);
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
              <PerformanceFeeRecordForm
                setParams={setParams}
                setOtherParams={setOtherParams}
                reset={reset}
                loading={loading}
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
          loading={loading}
        />
      </TableContentWrapper>
      <PerformanceFeeRecordDetailDialog open={detailOpen} setOpen={setDetailOpen} id={id || ''} />
    </div>
  );
};
