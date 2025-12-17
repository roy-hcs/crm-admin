import { useEffect, useRef, useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { TradingItem, TradingParams, useRebateList } from '@/api/hooks/report';
import { TradingForm } from './TradingForm';
import { Funnel, Search, RefreshCcw } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { useServerList, useGroupList, useGetCrmRebateTraders } from '@/api/hooks/system/system';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/types';
export function TradingPage() {
  const { t } = useTranslation();
  const [serverId, setServerId] = useState('');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [params, setParams] = useState<TradingParams['params']>({
    startTraderTime: '',
    endTraderTime: '',
    beginVerifyTime: '',
    endVerifyTime: '',
    accounts: '',
  });
  const [commonParams, setCommonParams] = useState<
    Omit<TradingParams, 'params' | keyof BasicParams>
  >({
    trderAccount: '',
    mtOrder: '',
    taderType: '',
    conditionName: '',
    rebateTraderId: '',
    serverGroup: '',
  });
  const { data: server, isLoading: serverLoading } = useServerList();
  const { data: RebateTraders, isLoading: RebateTradersLoading } = useGetCrmRebateTraders('1');
  useEffect(() => {
    // 自动选择第一台服务器
    if (!serverId && server?.code === 0 && server?.rows?.length) {
      // 只在还没选中时设置，避免无限循环
      setServerId(server.rows[0].id);
    }
  }, [server, serverId]);
  // 获取组别列表（queryKey 含 serverId，变化会自动重新获取）
  const { data: groupList, isLoading: groupLoading } = useGroupList(serverId, {
    enabled: !!serverId, // 没有 serverId 不请求
  });

  // 记录是否已完成首次自动初始化，避免首次设定 serverId 时就清空用户筛选
  const firstServerSetRef = useRef(false);
  useEffect(() => {
    if (!serverId) return;
    if (!firstServerSetRef.current) {
      firstServerSetRef.current = true;
      return; // 首次（自动）设定不重置
    }
    // 手动切换服务器：重置组别，重置分页
    setCommonParams(prev => ({
      ...prev,
      serverGroup: '',
    }));
    setPageNum(0);
  }, [serverId]);
  const { data: AgencyClientTracking, isLoading: AgencyClientTrackingLoading } = useRebateList(
    {
      params,
      serverId,
      pageSize,
      ...commonParams,
      pageNum: pageNum + 1,
      // 接口要求传入两个相同的参数但是名称不同
      serverGroupList: commonParams.serverGroup,
      rebateTraderIdList: commonParams.rebateTraderId,
      isAsc: 'asc',
      orderByColumn: '',
      rebateType: '1',
    },
    { enabled: !!serverId },
  );

  const reset = () => {
    setParams({
      startTraderTime: '',
      endTraderTime: '',
      beginVerifyTime: '',
      endVerifyTime: '',
      accounts: '',
    });
    setKeyword('');
    setPageNum(0);
    setPageSize(10);
  };
  const allColumns: CRMColumnDef<TradingItem, unknown>[] = [
    {
      id: 'No.',
      header: t('ib.overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'serverName',
      header: t('commission.trading.serverName'),
      accessorFn: row => row.serverName,
    },
    {
      id: 'mtOrder',
      header: t('commission.trading.mtOrder'),
      accessorFn: row => row.mtOrder,
    },
    {
      id: 'login',
      header: t('commission.trading.login'),
      accessorFn: row => row.login,
    },
    {
      id: 'symbol',
      accessorKey: 'symbol',
      header: t('commission.trading.symbol'),
      accessorFn: row => row.symbol,
    },
    {
      id: 'volume',
      accessorKey: 'volume',
      header: t('commission.trading.volume'),
      accessorFn: row => row.volume,
    },
    {
      id: 'traderTime',
      accessorKey: 'traderTime',
      header: t('commission.trading.traderTime'),
      accessorFn: row => row.traderTime,
    },
    {
      id: 'userName',
      accessorKey: 'userName',
      header: t('commission.trading.userName'),
      cell: ({ row }) => (
        <div>
          <div>{row.original.userName}</div>
          <div>{row.original.showId}</div>
        </div>
      ),
    },
    {
      id: 'rebateTotalAmt',
      accessorKey: 'rebateTotalAmt',
      header: t('commission.trading.rebateTotalAmt'),
      cell: ({ row }) => (
        <div>
          <div>{(row.original.rebateTotalAmt || '') + (row.original.currency || '')}</div>
          <div>
            {(row.original.rebateFixedAmt || '') + '+' + (row.original.rebatePointsAmt || '')}
          </div>
        </div>
      ),
    },
    {
      id: 'rebateAccountName',
      accessorKey: 'rebateAccountName',
      header: t('commission.trading.rebateAccountName'),
      accessorFn: row => row.rebateAccountName,
    },
    {
      id: 'rebateTime',
      accessorKey: 'rebateTime',
      header: t('commission.trading.rebateTime'),
      accessorFn: row => row.rebateTime,
    },
    {
      id: 'rebateTraderName',
      accessorKey: 'rebateTraderName',
      header: t('commission.trading.rebateTraderName'),
      accessorFn: row => row.rebateTraderName,
    },
  ];
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('commission-trading-reports-table', allColumns);

  return (
    <div>
      <PageInfo title={t('commission.trading.title')} />
      <div className="mt-3.5 mb-3.5 flex justify-between">
        <div className="w-67 max-w-sm">
          <RrhInputWithIcon
            placeholder={t('common.pleaseInput', { field: t('commission.trading.mtOrder') })}
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            className="h-9"
            rightIcon={<Search className="size-4" />}
            onRightIconClick={e => {
              // 触发查询逻辑, 这里简单调用一次刷新
              setPageNum(0);
              setCommonParams(prev => ({
                ...prev,
                mtOrder: e,
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
            <TradingForm
              reset={reset}
              params={params}
              commonParams={commonParams}
              setParams={setParams}
              setServerId={setServerId}
              setCommonParams={setCommonParams}
              serverOptions={server?.rows || []}
              groupOptions={groupList || []}
              RebateTradersOptions={RebateTraders || []}
              initialServerId={serverId}
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
        data={AgencyClientTracking?.rows || []}
        pageCount={Math.ceil(+(AgencyClientTracking?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={
          AgencyClientTrackingLoading || serverLoading || groupLoading || RebateTradersLoading
        }
      />
    </div>
  );
}
