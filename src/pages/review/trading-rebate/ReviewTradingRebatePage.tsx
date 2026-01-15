import { useState, useEffect } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { ReviewTradingRebateForm } from './ReviewTradingRebateForm';
import { Funnel, Search, RefreshCcw, Ellipsis } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import {
  RebateCommissionListParams,
  useRebateCommissionList,
  useRebateCommissionListSum,
  useRebateCommissionRuleList,
} from '@/api/hooks/review';
import { useServerList } from '@/api/hooks/system/system';
import { TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { RebateCommissionItem } from '@/api/hooks/review';
import { RrhTag } from '@/components/common/RrhTag';
import { transactionRebateStatusMap } from '@/lib/constant';
import { RrhButton } from '@/components/common/RrhButton';
import { Checkbox } from '@/components/ui/checkbox';
import { RrhSorter } from '@/components/common/RrhSorter';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

export const ReviewTradingRebatePage = () => {
  const [params, setParams] = useState<RebateCommissionListParams['params']>({
    startTraderTime: '',
    endTraderTime: '',
    beginTime: '',
    endTime: '',
  });
  const [otherParams, setOtherParams] = useState<Omit<RebateCommissionListParams, 'params'>>({
    serverId: '',
    serverGroupList: '',
    mtOrder: '',
    trderAccount: '',
    taderType: '',
    rebateStatus: '',
    id: '',
    rebateTraderId: '',
    accountGroupList: '',
    verifyUserName: '',
    conditionName: '',
  });

  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('asc');
  const [orderByColumn, setOrderByColumn] = useState('rebateStatusDef');

  const { data: serverList, isLoading: serverListLoading } = useServerList();
  const { data: rebateRuleList } = useRebateCommissionRuleList(2);

  useEffect(() => {
    if (serverList && serverList.rows && serverList.rows.length > 0) {
      setOtherParams(prev => ({
        ...prev,
        serverId: serverList.rows[0].id,
        serverType: serverList.rows[0].serviceType.toString(),
      }));
    }
  }, [serverList]);
  useEffect(() => {
    if (otherParams.serverId) {
      setEnabled(true);
    }
  }, [otherParams.serverId]);
  const { data, isLoading } = useRebateCommissionList(
    {
      orderByColumn,
      isAsc,
      pageNum: pageNum + 1,
      pageSize,
      ...otherParams,
      rebateType: 1,
      params: {
        ...params,
      },
    },
    {
      enabled,
    },
  );
  const { mutate: getRebateSum, data: sumData, isPending } = useRebateCommissionListSum();
  const [sumShow, setSumShow] = useState(false);
  const getSumData = () => {
    setSumShow(true);
    getRebateSum({
      ...otherParams,
      rebateType: 1,
      params: {
        ...params,
      },
    });
  };
  useEffect(() => {
    setSumShow(false);
  }, [data]);
  const reset = () => {
    setParams({
      startTraderTime: '',
      endTraderTime: '',
      beginTime: '',
      endTime: '',
    });
    setOtherParams({
      serverId: serverList?.rows[0]?.id || '',
      serverGroupList: '',
      mtOrder: '',
      trderAccount: '',
      taderType: '',
      rebateStatus: '',
      id: '',
      rebateTraderId: '',
      accountGroupList: '',
      verifyUserName: '',
      conditionName: '',
    });
    setKeyword('');
    setPageNum(0);
  };

  const allColumns: CRMColumnDef<RebateCommissionItem, unknown>[] = [
    {
      id: 'select',
      label: t('common.select'),
      header: ({ table }) => (
        <Checkbox
          className="data-[state=checked]:border-slate-700"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="data-[state=checked]:border-slate-700"
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'No.',
      header: t('CRMAccountPage.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'serverName',
      header: t('table.server'),
      label: t('table.server'),
      accessorKey: 'serverName',
      cell: ({ row }) => row.original.serverName || '-',
    },
    {
      id: 'mtOrder',
      header: t('table.tradingOrderNumber'),
      label: t('table.tradingOrderNumber'),
      accessorKey: 'mtOrder',
      cell: ({ row }) => row.original.mtOrder || '-',
    },
    {
      id: 'login',
      header: t('table.tradingAccount'),
      label: t('table.tradingAccount'),
      accessorKey: 'login',
      cell: ({ row }) => row.original.login || '-',
    },
    {
      id: 'symbol',
      header: t('table.symbol'),
      label: t('table.symbol'),
      accessorKey: 'symbol',
      cell: ({ row }) => row.original.symbol || '-',
    },
    {
      id: 'volume',
      header: t('table.volume'),
      label: t('table.volume'),
      accessorKey: 'volume',
      cell: ({ row }) => parseFloat(row.original.volume || '0').toFixed(2),
    },
    {
      id: 'traderTime',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.submitAuditTime')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="traderTimeStr"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      label: t('table.tradingTime'),
      accessorKey: 'traderTimeStr',
      cell: ({ row }) => (
        <div>
          {row.original.traderTimeStr?.split(' ').map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>
      ),
    },
    {
      id: 'rebateUser',
      header: t('table.rebateUser'),
      cell: ({ row }) => (
        <div>
          <div>{row.original.userName}</div>
          <div>({row.original.showId})</div>
        </div>
      ),
    },
    {
      id: 'rebateTotalAmt',
      header: t('table.rebateAmount'),
      cell: ({ row }) => {
        const currency = ` ${row.original.amtUnit}`;
        return (
          <div>
            <div>
              {row.original.rebateFixedAmt}
              {currency}
            </div>
            <div>
              {`${row.original.rebateFixedAmt + currency} + ${row.original.rebatePointsAmt + currency}`}
            </div>
          </div>
        );
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
              column="rebateStatus"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      label: t('table.status'),
      accessorKey: 'rebateStatus',
      cell: ({ row }) => {
        const typeMap: Record<number | string, 'error' | 'success' | 'warning' | 'info'> = {
          '3': 'warning',
          '1': 'success',
          '2': 'info',
          '0': 'error',
        };
        return (
          <RrhTag type={typeMap[row.original.rebateStatus]}>
            {t(`table.${transactionRebateStatusMap[row.original.rebateStatus]}`)}
          </RrhTag>
        );
      },
    },
    {
      id: 'rule',
      header: t('table.targetRule'),
      accessorKey: 'rebateTraderName',
      cell: ({ row }) => row.original.rebateTraderName || '-',
    },
    {
      id: 'rebateTime',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.submitTime')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="rebateTime"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      label: t('table.submitTime'),
      accessorKey: 'rebateTime',
      cell: ({ row }) => row.original.rebateTime || '-',
    },
    {
      id: 'verifyUserName',
      header: t('table.currentAuditor'),
      accessorKey: 'verifyUserName',
      cell: ({ row }) => row.original.verifyUserName || '-',
    },
    {
      id: 'verifyTime',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.finishTime')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="verifyTime"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      label: t('table.finishTime'),
      accessorKey: 'verifyTime',
      cell: ({ row }) => row.original.verifyTime || '-',
    },
    {
      id: 'orderNumber',
      header: t('table.orderNumber'),
      accessorKey: 'id',
      cell: ({ row }) => row.original.id || '-',
    },
    {
      id: 'operate',
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      label: t('common.Operation'),
      cell: () => (
        <RrhDropdown
          Trigger={<Ellipsis className="size-4" />}
          dropdownList={[
            { label: t('table.audit'), value: 'audit' },
            { label: t('common.delete'), value: 'delete' },
          ]}
          callToAction={() => {}}
        />
      ),
      fixed: 'right',
      size: 50,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('review-trading-rebate-table', allColumns);

  return (
    <div>
      <PageInfo title={t('tradingRebateReview.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              placeholder={t('common.pleaseInput', { field: t('table.rebateUser') })}
              className="h-9"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={() => {
                setOtherParams(prev => ({ ...prev, rebateTraderId: keyword }));
                setPageNum(0);
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <RrhButton variant="outline">{t('table.export')}</RrhButton>
            <RrhButton variant="outline">{t('table.batchDelete')}</RrhButton>
            <RrhButton variant="outline">{t('table.batchAudit')}</RrhButton>
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
              <ReviewTradingRebateForm
                params={params}
                otherParams={otherParams}
                reset={reset}
                setParams={setParams}
                setOtherParams={setOtherParams}
                serverListLoading={serverListLoading}
                serverList={serverList?.rows || []}
                rebateRuleList={rebateRuleList || []}
                loading={isLoading}
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
          CustomRow={
            <>
              <TableCell colSpan={6} className="text-center">
                {t('table.total')}
              </TableCell>
              {!sumShow && (
                <TableCell colSpan={5}>
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
                    <TableCell colSpan={1} className="text-center">
                      {sumData?.data[0]?.totalVolume}
                    </TableCell>
                    <TableCell colSpan={2}></TableCell>
                    <TableCell colSpan={1} className="text-center">
                      {sumData?.data[0]?.totalList.map(item => {
                        return (
                          <div key={item.amtUnit}>
                            {item.rebateFixedAmt} {item.amtUnit}
                          </div>
                        );
                      })}
                    </TableCell>
                  </>
                )
              ) : null}
            </>
          }
        />
      </TableContentWrapper>
    </div>
  );
};
