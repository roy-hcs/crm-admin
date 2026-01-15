import { useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { PammReportSettlementItem, PammReportSettlementListParams } from '@/api/hooks/pamm/type';
import { usePammReportSettlementList } from '@/api/hooks/pamm';
import { AccrualReportForm } from './AccrualReportForm';
import { Funnel, Search, RefreshCcw } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/hooks/review/types';
import { useServerList } from '@/api/hooks/system/system';
import { TableCell } from '@/components/ui/table';
import { RrhSorter } from '@/components/common/RrhSorter';
import { RrhButton } from '@/components/common/RrhButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

function getServerTypeName(serverType: number) {
  switch (serverType) {
    case 1:
      return 'MT5';
    case 2:
      return 'MT4';
    case 3:
      return 'Sirix';
    case 4:
      return 'XForce';
    case 5:
      return 'XOH';
    default:
      return '-';
  }
}

export const AccrualReportPage = () => {
  const [otherParams, setOtherParams] = useState<
    Omit<PammReportSettlementListParams, 'params' | keyof BasicParams>
  >({
    serverId: '',
    projectName: '',
    userName: '',
    orderNo: '',
    managerName: '',
    settlementType: '',
    startTime: '',
    endTime: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('asc');
  const [orderByColumn, setOrderByColumn] = useState<string>('');
  const [keyword, setKeyword] = useState('');
  const { t } = useTranslation();
  const { data: server, isLoading: serverLoading } = useServerList();

  const { data: pammInvestReports, isLoading: pammInvestReportsLoading } =
    usePammReportSettlementList({
      pageSize,
      pageNum: pageNum + 1,
      orderByColumn,
      isAsc,
      ...otherParams,
    });

  const reset = () => {
    setOtherParams({
      serverId: '',
      projectName: '',
      userName: '',
      orderNo: '',
      managerName: '',
      settlementType: '',
      startTime: '',
      endTime: '',
    });
    setKeyword('');
    setPageNum(0);
  };

  const allColumns: CRMColumnDef<PammReportSettlementItem, unknown>[] = [
    {
      id: 'No.',
      header: t('ib.overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'serverName',
      header: t('table.serverName'),
      cell: ({ row }) => {
        const serverTypeName = getServerTypeName(Number(row.original.serverType));
        return row.original.serverName + (serverTypeName ? ` | (${serverTypeName})` : '');
      },
    },
    {
      id: 'projectName',
      header: t('table.projectName'),
      accessorFn: row => row.projectName || '-',
    },
    {
      id: 'managerName',
      header: t('productReview.investmentManager'),
      accessorFn: row => row.managerName || '-',
    },
    {
      id: 'investor',
      header: t('table.customerName'),
      cell: ({ row }) => {
        const rowInfo = row.original;
        let userName = '';
        if (rowInfo.lastName) {
          userName += rowInfo.lastName;
        }
        if (rowInfo.name) {
          userName += ' ' + rowInfo.name;
        }
        const showId = rowInfo.showId || '';
        if (!userName) {
          return '-';
        }
        return (
          <div>
            <div>{userName}</div>
            {showId && <div>{showId}</div>}
          </div>
        );
      },
    },
    {
      id: 'role',
      header: t('table.investRole'),
      accessorFn: row => row.role || '-',
    },
    {
      id: 'investUpper',
      header: t('table.investorUpper'),
      cell: ({ row }) => {
        return <div dangerouslySetInnerHTML={{ __html: row.original.inviter || '-' }}></div>;
      },
    },
    {
      id: 'orderNo',
      header: t('table.orderNumber'),
      accessorFn: row => row.orderNo || '-',
    },
    {
      id: 'amount',
      header: t('profitSharingReview.businessAmount'),
      cell: ({ row }) => {
        const currency = row.original.currency || '';
        return row.original.businessAmount ? (
          <div>
            {(row.original.businessAmount || 0).toFixed(2)} {currency}
          </div>
        ) : (
          <div>-</div>
        );
      },
    },
    {
      id: 'rewardAmount',
      header: t('profitSharingReview.rewardAmount'),
      cell: ({ row }) => {
        const currency = row.original.currency || '';
        return row.original.rewardAmount ? (
          <div>
            {(row.original.rewardAmount || 0).toFixed(2)} {currency}
          </div>
        ) : (
          <div>-</div>
        );
      },
    },
    {
      id: 'commission',
      header: t('profitSharingReview.commission'),
      cell: ({ row }) => {
        const currency = row.original.currency || '';
        return row.original.commission ? (
          <div>
            {(row.original.commission || 0).toFixed(2)} {currency}
          </div>
        ) : (
          <div>-</div>
        );
      },
    },
    {
      id: 'settlementTime',
      label: t('table.settlementTime'),
      header: () => {
        return (
          <div className="flex items-center gap-2">
            <div>{t('table.settlementTime')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="businessTime"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      accessorFn: row => row.businessTime ?? '-',
    },
    {
      id: 'operation',
      label: t('common.Operation'),
      fixed: 'right',
      size: 50,
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      cell: () => <RrhButton variant="ghost">{t('common.View')}</RrhButton>,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('accrual-report-table', allColumns);

  return (
    <div>
      <PageInfo title={t('PammSettlementReport.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              placeholder={t('common.pleaseInput', { field: t('table.projectName') })}
              className="h-9"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={() => {
                setOtherParams(prev => ({ ...prev, projectName: keyword }));
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
              <AccrualReportForm
                serverOptions={server?.rows || []}
                setOtherParams={setOtherParams}
                reset={reset}
                loading={pammInvestReportsLoading || serverLoading}
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
          data={pammInvestReports?.rows || []}
          pageCount={Math.ceil(+(pammInvestReports?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={pammInvestReportsLoading}
          CustomRow={
            <>
              <TableCell colSpan={8}>{t('table.total')}</TableCell>
              <TableCell colSpan={1}>
                {pammInvestReports?.totalList?.map(item => {
                  return (
                    <div key={`${item.currency} + ${item.currency}`}>
                      {item.businessAmountTotal ? (
                        <div>
                          {item.businessAmountTotal.toFixed(2)} {item.currency}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </TableCell>
              <TableCell colSpan={1}>
                {pammInvestReports?.totalList?.map(item => {
                  return (
                    <div key={`${item.currency} + ${item.currency}`}>
                      {item.commissionTotal ? (
                        <div>
                          {item.commissionTotal.toFixed(2)} {item.currency}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </TableCell>
              <TableCell colSpan={1}>
                {pammInvestReports?.totalList?.map(item => {
                  return (
                    <div key={`${item.currency} + ${item.currency}`}>
                      {item.rewardAmountTotal ? (
                        <div>
                          {item.rewardAmountTotal.toFixed(2)} {item.currency}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </TableCell>
            </>
          }
        />
      </TableContentWrapper>
    </div>
  );
};
