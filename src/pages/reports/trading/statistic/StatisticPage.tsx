import {
  useAccountStaticsSum,
  useAccountStatisticList,
  AccountStatisticListParams,
  AccountStatisticListItem,
} from '@/api/hooks/report';
import { useServerList } from '@/api/hooks/system/system';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatisticForm } from './StatisticForm';
import { TableCell } from '@/components/ui/table';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { useAccountStatisticExport } from '@/api/hooks/report/report';
import { ExportButton } from '@/components/common/ExportButton';

const formatVolume = (serverType: number | undefined, volume: number) => {
  if (serverType == 1) {
    //MT5
    return (volume / 10000).toFixed(2);
  } else if (serverType == 2) {
    return (volume / 100).toFixed(2);
  } else {
    return volume.toFixed(2);
  }
};

export const StatisticPage = () => {
  const [params, setParams] = useState<AccountStatisticListParams['params']>({
    serverGroupList: '',
    fuzzyAccount: '',
    fuzzyName: '',
    statisticStartTime: '',
    statisticEndTime: '',
  });
  const [otherParams, setOtherParams] = useState<Omit<AccountStatisticListParams, 'params'>>({
    server: '',
    accountGroupList: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [resetKey, setResetKey] = useState(0);
  const { t } = useTranslation();
  const { data: serverList, isLoading: serverListLoading } = useServerList();
  useEffect(() => {
    if (serverList && serverList.rows && serverList.rows.length > 0) {
      setOtherParams(prev => ({
        ...prev,
        server: serverList.rows[0].id,
      }));
    }
  }, [serverList]);
  const selectedServer = useMemo(() => {
    return serverList?.rows?.find(item => otherParams.server === item.id);
  }, [otherParams.server, serverList?.rows]);
  const { data: accountStatisticData, isLoading: accountStatisticDataLoading } =
    useAccountStatisticList(
      {
        pageSize,
        pageNum: pageNum + 1,
        orderByColumn: '',
        isAsc: 'asc',
        ...otherParams,
        params: {
          ...params,
        },
      },
      { enabled: otherParams.server !== '' },
    );
  const { mutate: getStatisticData, data: sumData, isPending } = useAccountStaticsSum();
  const [sumShow, setSumShow] = useState(false);
  const getSumData = () => {
    setSumShow(true);
    getStatisticData({
      ...otherParams,
      params: {
        ...params,
      },
    });
  };
  useEffect(() => {
    setSumShow(false);
  }, [accountStatisticData]);

  const reset = () => {
    setOtherParams({
      server: serverList?.rows[0].id,
      accountGroupList: '',
    });
    setParams({
      serverGroupList: '',
      fuzzyAccount: '',
      fuzzyName: '',
      statisticStartTime: '',
      statisticEndTime: '',
    });
    setResetKey(k => k + 1);
    setPageNum(0);
    setSumShow(false);
  };
  const serviceType = selectedServer?.serviceType;

  const allColumns: CRMColumnDef<AccountStatisticListItem, unknown>[] = [
    {
      id: 'No.',
      header: t('CRMAccountPage.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'userName',
      header: t('CRMAccountPage.UserName'),
      accessorFn: row => row.name,
    },
    {
      id: 'login',
      header: t('table.tradingAccount'),
      accessorFn: row => row.login,
    },
    {
      id: 'totalOrders',
      header: t('table.tradingOrdersTotal'),
      accessorFn: row => row.countOrder,
    },
    {
      id: 'closeLots',
      header: t('table.closeLots'),
      cell: ({ row }) => {
        const rowData = row.original;
        return rowData.historyVolume ? (
          <div>{formatVolume(serviceType, rowData.historyVolume)} </div>
        ) : (
          <div>-</div>
        );
      },
    },
    {
      id: 'openLots',
      header: t('table.openLots'),
      cell: ({ row }) => {
        const rowData = row.original;
        return rowData.positionVolume ? (
          <div>{formatVolume(serviceType, rowData.positionVolume)} </div>
        ) : (
          <div>-</div>
        );
      },
    },
    {
      id: 'commission',
      header: t('table.commission'),
      cell: ({ row }) => {
        return <div>{(row.original.countCommission || 0).toFixed(2)}</div>;
      },
    },
    {
      id: 'swap',
      header: t('table.swap'),
      cell: ({ row }) => {
        return <div>{(row.original.countSwaps || 0).toFixed(2)}</div>;
      },
    },
    {
      id: 'closedPosition',
      header: t('table.closedPosition'),
      cell: ({ row }) => {
        return <div>{(row.original.countProfit || 0).toFixed(2)}</div>;
      },
    },
    {
      id: 'currentBalance',
      header: t('table.currentBalance'),
      cell: ({ row }) => {
        return (
          <div>
            {(row.original.balance || 0).toFixed(2)} {row.original.currency}
          </div>
        );
      },
    },
  ];
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('trading-account-statistic-history-table', allColumns);

  const { mutateAsync: exportAccountStatistic, isPending: exportLoading } =
    useAccountStatisticExport();

  return (
    <div>
      <h1 className="text-title">{t('accountStatisticPage.accountStatistic')}</h1>
      <TableContentWrapper>
        <div className="mb-3 flex items-center justify-between">
          <RrhInputWithIcon
            key={resetKey}
            placeholder={t('common.pleaseInput', { field: t('table.fullName') })}
            className="h-9"
            leftIcon={<Search className="size-4 cursor-pointer" />}
            onLeftIconClick={e => {
              setParams(prev => ({ ...prev, fuzzyName: e }));
              setPageNum(0);
            }}
          />
          <div className="flex justify-end gap-2">
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
              <StatisticForm
                params={params}
                otherParams={otherParams}
                reset={reset}
                serverListLoading={serverListLoading}
                serverList={serverList?.rows || []}
                setParams={setParams}
                setOtherParams={setOtherParams}
                loading={accountStatisticDataLoading}
              />
            </RrhDrawer>
            <ColumnVisibilityButton
              columnMeta={columnMeta}
              visibleColumns={visibleColumns}
              onToggle={toggleColumn}
              onBatchReorder={batchUpdateColumns}
              columns={columns}
            />
            <ExportButton<AccountStatisticListParams>
              title={t('accountStatisticPage.accountStatistic')}
              exportFunction={exportAccountStatistic}
              params={{ params, ...otherParams }}
              exportLoading={exportLoading}
            />
          </div>
        </div>
        <DataTable
          columns={tableColumns}
          data={accountStatisticData?.rows || []}
          pageCount={Math.ceil(+(accountStatisticData?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={accountStatisticDataLoading}
          CustomRow={
            <>
              <TableCell colSpan={3}>{t('table.total')}</TableCell>
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
                    <TableCell>
                      {sumData?.data.reduce((pre, cur) => pre + (cur?.countOrderTotal || 0), 0)}
                    </TableCell>
                    <TableCell>
                      {sumData?.data
                        .reduce((pre, cur) => pre + (cur?.historyVolumeTotal || 0), 0)
                        .toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {sumData?.data
                        .reduce((pre, cur) => pre + (cur?.positionVolumeTotal || 0), 0)
                        .toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {sumData?.data.map(item => {
                        return item.countCommissionTotal ? (
                          <div key={item.currency}>
                            {item.countCommissionTotal} {item.currency}
                          </div>
                        ) : null;
                      })}
                    </TableCell>
                    <TableCell>
                      {sumData?.data.map(item => {
                        return item.countSwapsTotal ? (
                          <div key={item.currency}>
                            {item.countSwapsTotal} {item.currency}
                          </div>
                        ) : null;
                      })}
                    </TableCell>
                    <TableCell>
                      {sumData?.data.map(item => {
                        return item.countProfitTotal ? (
                          <div key={item.currency}>
                            {item.countProfitTotal} {item.currency}
                          </div>
                        ) : null;
                      })}
                    </TableCell>
                    <TableCell>
                      {sumData?.data.map(item => {
                        return (
                          <div key={item.currency}>
                            {(item.balanceTotal || 0).toFixed(2)} {item.currency}
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
