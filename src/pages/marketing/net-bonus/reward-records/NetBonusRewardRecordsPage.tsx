import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Ellipsis, Funnel, RefreshCcw, Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable, DataTableRef } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import {
  RewardRecordsItem,
  NetBonusRewardRecordsListParams,
  useExportNetBonusRewardRecords,
  useGetNetBonusRewardRecords,
  useGetNetBonusRewardRecordsTotal,
  useRemoveRecord,
} from '@/api/hooks/marketing';
import { BasicParams } from '@/api/types';
import { ExportButton } from '@/components/common/ExportButton';
import { TableCell } from '@/components/ui/table';
import { NetBonusRewardRecordsForm } from './NetBonusRewardRecordsForm';
import { RrhSorter } from '@/components/common/RrhSorter';
import { RrhTag } from '@/components/common/RrhTag';
import { reviewStatusMap } from '@/lib/constant';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { useTabActions } from '@/hooks/useTabActions';
import { BatchReviewDialog } from './components/BatchReviewDialog';
import { BatchDeleteDialog } from './components/BatchDeleteDialog';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';

export const NetBonusRewardRecordsPage = () => {
  const tableRef = useRef<DataTableRef>(null);
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('asc');
  const [orderByColumn, setOrderByColumn] = useState<string>('');

  const [resetKey, setResetKey] = useState(0);
  const [params, setParams] = useState<NetBonusRewardRecordsListParams['params']>({
    drirectFlag: 'a',
    agentUserId: '',
    beginTime: '',
    endTime: '',
    beginReviewTime: '',
    endReviewTime: '',
    beginBonusTime: '',
    endBonusTime: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<NetBonusRewardRecordsListParams, 'params' | keyof BasicParams>
  >({
    bonusUser: '',
    bonusMonth: '',
    status: '',
    orderNo: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const {
    mutate: getNetBonusRewardRecordsTotal,
    data: sumData,
    isPending,
  } = useGetNetBonusRewardRecordsTotal();
  const [sumShow, setSumShow] = useState(false);
  const {
    data: data,
    isLoading: loading,
    refetch,
  } = useGetNetBonusRewardRecords({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: orderByColumn,
    isAsc: isAsc,
    ...otherParams,
    params: {
      ...params,
    },
  });

  const getSumData = () => {
    setSumShow(true);
    getNetBonusRewardRecordsTotal({
      ...otherParams,
      params,
    });
  };
  useEffect(() => {
    setSumShow(false);
  }, [data]);

  const reset = () => {
    setParams(pre => ({
      ...pre,
      agentUserId: '',
      drirectFlag: 'a',
      beginTime: '',
      endTime: '',
      beginReviewTime: '',
      endReviewTime: '',
      beginBonusTime: '',
      endBonusTime: '',
    }));
    setOtherParams({
      bonusUser: '',
      bonusMonth: '',
      status: '',
      orderNo: '',
    });
    setResetKey(k => k + 1);
    setPageNum(0);
  };

  const { openTab } = useTabActions();

  const goToDetail = useCallback(
    (row: RewardRecordsItem) => {
      const type = Number(row.status) === 2 ? 'audit' : 'detail';
      const url = `/marketing/net-bonus/reward-records/detail?type=${type}&id=${row.id}`;
      openTab({
        key: url,
        title: t('netBonusRewardRecords.detail'),
        path: url,
      });
    },
    [openTab, t],
  );

  type DialogKey = 'batchAudit' | 'batchDelete' | null;
  const [openDialog, setOpenDialog] = useState<DialogKey>(null);

  const onSuccess = () => {
    setIds([]);
    tableRef.current?.selectionClear?.();
    refetch();
  };

  const allColumns: CRMColumnDef<RewardRecordsItem, unknown>[] = [
    {
      id: 'select',
      label: t('table.select'),
      header: ({ table }) => (
        <Checkbox
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
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'orderNo',
      header: t('table.orderNumber'),
      accessorFn: row => row.orderNo,
    },
    {
      id: 'bonusUserName',
      header: t('rewardRecords.rewardTarget'),
      cell: ({ row }) => {
        return (
          <div>
            <div>{row?.original?.bonusUserName || '-'}</div>
            <div>({row?.original?.bonusUserShowId || '-'})</div>
          </div>
        );
      },
    },
    {
      id: 'month',
      header: t('customerTracking.statisticMonthStr'),
      cell: ({ row }) => <div>{row.original.bonusMonthStr}</div>,
    },
    {
      id: 'rewardAmount',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.rewardAmount')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="bonusAmount"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        return <div>{row?.original?.bonusAmount.toFixed(2) || '-'}USD</div>;
      },
    },
    {
      id: 'actualAmount',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.actualDisbursedAmount')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="actualAmount"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        return <div>{row?.original?.actualAmount.toFixed(2) || '-'}USD</div>;
      },
    },
    {
      id: 'paymentAccount',
      header: t('table.paymentAccount'),
      cell: ({ row }) => {
        return <div>{row?.original?.accountName || '-'}</div>;
      },
    },
    {
      id: 'status',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.status')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="status"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      label: t('table.status'),
      cell: ({ row }) => {
        const typeMap: Record<number, 'error' | 'success' | 'warning' | 'info'> = {
          0: 'error',
          1: 'success',
          2: 'warning',
          3: 'info',
        };
        return (
          <RrhTag type={typeMap[row.original.status]}>
            {t(`table.${reviewStatusMap[row.original.status]}`)}
          </RrhTag>
        );
      },
    },
    {
      id: 'createTime',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('common.createTime')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="createTime"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        return <div>{row?.original?.createTime || '-'}</div>;
      },
    },
    {
      id: 'operator',
      header: t('table.operator'),
      cell: ({ row }) => {
        return <div>{row?.original?.createBy || '-'}</div>;
      },
    },
    {
      id: 'updateTime',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.verifyTime')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="createTime"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        return <div>{row?.original?.updateTime || '-'}</div>;
      },
    },
    {
      id: 'distributionTime',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.disbursedTime')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="distributionTime"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        return <div>{row?.original?.distributionTime || '-'}</div>;
      },
    },
    {
      id: 'operation',
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      label: t('common.Operation'),
      cell: ({ row }) => (
        <RrhDropdown
          Trigger={<Ellipsis className="size-4" />}
          dropdownList={[
            {
              label: Number(row?.original?.status) === 2 ? t('table.audit') : t('common.View'),
              value: 'review',
            },
            { label: t('common.delete'), value: 'delete' },
          ]}
          callToAction={action => {
            if (action === 'review') {
              goToDetail(row.original);
            } else {
              setId(row.original.id);
              setDeleteAlert(true);
            }
          }}
        />
      ),
      fixed: 'right',
      size: 50,
    },
  ];

  const [deleteAlert, setDeleteAlert] = useState(false);
  const { mutateAsync: removeRecord } = useRemoveRecord();

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('marketing-net-bonus-reward-records-table', allColumns);
  const { mutateAsync: exportNetBonusRewardRecords, isPending: exportLoading } =
    useExportNetBonusRewardRecords();
  const [id, setId] = useState('');
  const [ids, setIds] = useState<string[]>([]);

  const onSelectionChange = (its: RewardRecordsItem[]) => {
    const ids = its.filter(i => i.id).map(j => j.id || '');
    setIds(ids);
  };

  return (
    <div>
      <PageInfo title={t('netBonusRewardRecords.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              key={resetKey}
              placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
              className="h-9"
              leftIcon={<Search className="size-4 cursor-pointer" />}
              onLeftIconClick={e => {
                setOtherParams(prev => ({ ...prev, orderNo: e }));
                setPageNum(0);
              }}
            />
          </div>
          <div className="flex items-center gap-2">
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
              <NetBonusRewardRecordsForm
                otherParams={otherParams}
                setParams={setParams}
                setOtherParams={setOtherParams}
                loading={loading}
                reset={reset}
                params={params}
              />
            </RrhDrawer>
            <ColumnVisibilityButton
              columnMeta={columnMeta}
              visibleColumns={visibleColumns}
              onToggle={toggleColumn}
              onBatchReorder={batchUpdateColumns}
              columns={columns}
            />
            <RrhDropdown
              Trigger={<Ellipsis className="size-4" />}
              dropdownList={[
                { label: t('table.batchAudit'), value: 'batchAudit' },
                { label: t('table.batchDelete'), value: 'batchDelete' },
              ]}
              callToAction={action => {
                console.log(action);
                if (ids && ids?.length === 0) {
                  toast.error(t('tradingAccountTransactions.atLeastOneAccount'));
                  return;
                }
                switch (action) {
                  case 'batchAudit':
                    // 只能批量审核未审核的记录
                    if (data?.rows.filter(i => ids.includes(i.id) && i.status !== 2).length) {
                      toast.error(t('netBonusRewardRecords.containsReviewedRecords'));
                      return;
                    }
                    setOpenDialog('batchAudit');
                    break;
                  case 'batchDelete':
                    setOpenDialog('batchDelete');
                    break;
                  default:
                    break;
                }
              }}
            />
            <ExportButton<NetBonusRewardRecordsListParams>
              exportFunction={exportNetBonusRewardRecords}
              params={{
                params,
                ...otherParams,
              }}
              exportLoading={exportLoading}
              title={t('netBonusRewardRecords.title')}
            />
          </div>
        </div>
        <DataTable
          ref={tableRef}
          columns={tableColumns}
          data={data?.rows || []}
          pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={loading}
          onSelectionChange={onSelectionChange}
          CustomRow={
            <>
              <TableCell colSpan={4}>{t('table.total')}</TableCell>
              {!sumShow && (
                <TableCell colSpan={7}>
                  <RrhButton variant="ghost" onClick={getSumData}>
                    {t('table.clickToGetSum')}
                  </RrhButton>
                </TableCell>
              )}
              {sumShow ? (
                isPending ? (
                  <TableCell>{t('common.loading')}</TableCell>
                ) : (
                  <>
                    <TableCell>{(sumData?.data?.[0]?.bonusAmount || 0).toFixed(2)}USD</TableCell>
                    <TableCell>{(sumData?.data?.[0]?.actualAmount || 0).toFixed(2)}USD</TableCell>
                  </>
                )
              ) : null}
            </>
          }
        />
        <BatchReviewDialog
          open={openDialog === 'batchAudit'}
          ids={ids}
          setOpen={val => (val ? setOpenDialog('batchAudit') : setOpenDialog(null))}
          onSuccess={onSuccess}
        />
        <BatchDeleteDialog
          open={openDialog === 'batchDelete'}
          setOpen={val => (val ? setOpenDialog('batchDelete') : setOpenDialog(null))}
          ids={ids}
          onSuccess={onSuccess}
        />
        <RrhDeleteAlert<{
          ids: string;
        }>
          open={deleteAlert}
          setOpen={setDeleteAlert}
          onSuccess={onSuccess}
          confirmFunction={removeRecord}
          params={{ ids: id || '' }}
          tipsText={t('netBonusRewardRecords.deleteConfirm')}
        />
      </TableContentWrapper>
    </div>
  );
};
