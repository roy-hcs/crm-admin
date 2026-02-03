import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  usePointsHistoryList,
  PointsHistoryListParams,
  PointsHistoryItem,
} from '@/api/hooks/pointsMall';
import { PageInfo } from '@/components/common/PageInfo';
import { Button } from '@/components/ui/button';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { RrhTag } from '@/components/common/RrhTag';
import { withdrawalReviewStatusMap } from '@/lib/constant';
import { Ellipsis } from 'lucide-react';
import { RrhSorter } from '@/components/common/RrhSorter';
import { BasicParams } from '@/api/types';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { RedemptionRecordsForm } from './components/RedemptionRecordsForm';
import { CheckDialog } from './components/CheckDialog';
import { ViewDialog } from './components/ViewDialog';

export const RedemptionRecordsPage = () => {
  const { t } = useTranslation();
  const [params, setParams] = useState<PointsHistoryListParams['params']>({
    fuzzyName: '',
    fuzzyEmail: '',
    fuzzyGoods: '',
    verifyStatus: '',
    exchangeTimeStart: '',
    exchangeTimeEnd: '',
    updateTimeStart: '',
    updateTimeEnd: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<PointsHistoryListParams, 'params' | keyof BasicParams>
  >({
    payType: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('asc');
  const [orderByColumn, setOrderByColumn] = useState('');

  const [row, setRow] = useState<PointsHistoryItem>();
  const [isCheckDialogOpen, setIsCheckDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const {
    data: data,
    isLoading: loading,
    refetch,
  } = usePointsHistoryList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn,
    isAsc: isAsc || 'asc',
    ...otherParams,
    params,
  });

  const reset = () => {
    setParams({
      fuzzyName: '',
      fuzzyEmail: '',
      fuzzyGoods: '',
      verifyStatus: '',
      exchangeTimeStart: '',
      exchangeTimeEnd: '',
      updateTimeStart: '',
      updateTimeEnd: '',
    });
    setOtherParams({
      payType: '',
    });
    setKeyword('');
    setPageNum(0);
    setPageSize(10);
    setIsAsc('asc');
    setOrderByColumn('');
  };

  const allColumns: CRMColumnDef<PointsHistoryItem, unknown>[] = [
    {
      id: 'No.',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'orderNo',
      header: t('redemptionRecords.orderNo'),
      accessorFn: row => row.orderNo,
      cell: ({ row }) => <div>{row?.original?.orderNo}</div>,
    },
    {
      id: 'userName',
      header: t('table.CRMAccount'),
      accessorFn: row => row.userName,
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.userName || '-'}</div>
            <div>({row?.original?.showId})</div>
          </div>
        );
      },
    },
    {
      id: 'goodsId',
      header: t('redemptionRecords.goodsId'),
      accessorFn: row => row.goodsId,
      cell: ({ row }) => <div>{row?.original?.goodsId || '-'}</div>,
    },
    {
      id: 'goodsName',
      header: t('redemptionRecords.goodsName'),
      accessorFn: row => row.goodsName || '-',
      // cell: ({ row }) => <div>{row?.original?.goodsId || '-'}</div>,
    },
    {
      id: 'payType',
      header: t('redemptionRecords.payType'),
      accessorFn: row => row.payType,
      cell: ({ row }) => (
        <div>
          {String(row?.original?.payType) === '1'
            ? t('redemptionRecords.pointsPayment')
            : t('redemptionRecords.combinedPayment')}
        </div>
      ),
    },
    {
      id: 'exchangePoints',
      label: t('redemptionRecords.exchangePoints'),
      header: () => (
        <div className="flex items-center gap-1">
          {t('redemptionRecords.exchangePoints')}
          <RrhSorter
            setIsAsc={setIsAsc}
            isAsc={isAsc}
            orderByColumn={orderByColumn}
            setOrderByColumn={setOrderByColumn}
            column="exchangePoints"
          />
        </div>
      ),
      accessorFn: row => row.exchangePoints,
      cell: ({ row }) => <div>-{row?.original?.exchangePoints}</div>,
    },
    {
      id: 'paymentAmount',
      label: t('redemptionRecords.paymentAmount'),
      header: () => (
        <div className="flex items-center gap-1">
          {t('redemptionRecords.paymentAmount')}
          <RrhSorter
            setIsAsc={setIsAsc}
            isAsc={isAsc}
            orderByColumn={orderByColumn}
            setOrderByColumn={setOrderByColumn}
            column="paymentAmount"
          />
        </div>
      ),
      accessorFn: row => row.paymentAmount,
      cell: ({ row }) => {
        if (row?.original?.paymentAmount) {
          return <div>{row?.original?.paymentAmount}USD</div>;
        }
        return '-';
      },
    },
    {
      id: 'exchangeTime',
      label: t('redemptionRecords.exchangeTime'),
      header: () => (
        <div className="flex items-center gap-1">
          {t('redemptionRecords.exchangeTime')}
          <RrhSorter
            setIsAsc={setIsAsc}
            isAsc={isAsc}
            orderByColumn={orderByColumn}
            setOrderByColumn={setOrderByColumn}
            column="exchangeTime"
          />
        </div>
      ),
      accessorFn: row => row.exchangeTime,
      cell: ({ row }) => <div>{row?.original?.exchangeTime || '-'}</div>,
    },
    {
      id: 'verifyStatus',
      header: t('table.status'),
      accessorFn: row => row.verifyStatus,
      cell: ({ row }) => {
        const typeMap: Record<number, 'error' | 'success' | 'warning' | 'info' | 'default'> = {
          0: 'error',
          1: 'success',
          2: 'warning',
          '-1': 'info',
          '-2': 'default',
        };
        return (
          <RrhTag type={typeMap[row.original.verifyStatus]}>
            {t(`table.${withdrawalReviewStatusMap[row.original.verifyStatus]}`)}
          </RrhTag>
        );
      },
    },
    {
      id: 'updateBy',
      header: t('products.updateBy'),
      accessorFn: row => row.updateBy,
      cell: ({ row }) => <div>{row?.original?.updateBy || '-'}</div>,
    },
    {
      id: 'updateTime',
      label: t('table.updateTime'),
      header: () => (
        <div className="flex items-center gap-1">
          {t('table.updateTime')}
          <RrhSorter
            setIsAsc={setIsAsc}
            isAsc={isAsc}
            orderByColumn={orderByColumn}
            setOrderByColumn={setOrderByColumn}
            column="updateTime"
          />
        </div>
      ),
      accessorFn: row => row.updateTime,
      cell: ({ row }) => <div>{row?.original?.updateTime || '-'}</div>,
    },
    {
      id: 'operation',
      label: t('common.Operation'),
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      cell: ({ row }) => (
        <div>
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('table.audit'), value: 'edit' },
              { label: t('common.View'), value: 'view' },
            ]}
            callToAction={action => {
              if (action === 'edit') {
                setRow(row.original);
                setIsCheckDialogOpen(true);
              } else if (action === 'view') {
                setRow(row.original);
                setIsViewDialogOpen(true);
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
    useColumnVisibility('points-mall-redemption-records-table', allColumns);

  return (
    <div>
      <PageInfo title={t('redemptionRecords.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              placeholder={t('common.pleaseInput', { field: t('table.nameOrId') })}
              className="h-9"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={() => {
                setParams(prev => ({ ...prev, fuzzyName: keyword }));
                setPageNum(0);
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
              <RefreshCcw className="size-3.5" />
            </Button>
            <RrhDrawer
              headerShow={false}
              asChild
              responsiveDirection={{
                mobile: 'bottom',
                desktop: 'right',
              }}
              footerShow={false}
              Trigger={
                <Button variant="ghost" className="size-8">
                  <Funnel />
                </Button>
              }
            >
              <RedemptionRecordsForm
                setParams={setParams}
                setOtherParams={setOtherParams}
                loading={loading}
                params={params}
                otherParams={otherParams}
                reset={reset}
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
        <CheckDialog
          id={row?.id || ''}
          open={isCheckDialogOpen}
          setOpen={setIsCheckDialogOpen}
          onSuccess={refetch}
        />
        <ViewDialog id={row?.id || ''} open={isViewDialogOpen} setOpen={setIsViewDialogOpen} />
      </TableContentWrapper>
    </div>
  );
};
