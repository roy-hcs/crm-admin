import { useEffect, useRef, useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import {
  useAgencyPreforOverviewList,
  useAgencyPreforOverviewTreeChildren,
  useAgencyPreforOverviewTreeList,
  useDictType,
  useRebateLevelList,
} from '@/api/hooks/system/system';
import { Funnel, RefreshCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { useInitServerId } from '@/hooks/useInitServerId';
import { OverviewForm } from './components/OverviewForm';
import { PreferDialog } from './components/PreferDialog';
import { AgencyPreforOverviewItem, AgencyPreforOverviewParams } from '@/api/hooks/system/types';
import { BasicParams, BasicRes } from '@/api/types';
import { ExpandedState } from '@tanstack/react-table';

type TreeAgencyPreforOverviewItem = AgencyPreforOverviewItem & {
  children?: TreeAgencyPreforOverviewItem[];
};

const buildTreeNode = (item: AgencyPreforOverviewItem): TreeAgencyPreforOverviewItem => ({
  ...item,
  children: (item as TreeAgencyPreforOverviewItem).children?.map(buildTreeNode) || [],
});

const normalizeChildren = (response: unknown): AgencyPreforOverviewItem[] => {
  if (Array.isArray(response)) {
    return response as AgencyPreforOverviewItem[];
  }

  if (
    response &&
    typeof response === 'object' &&
    Array.isArray((response as BasicRes<AgencyPreforOverviewItem>).rows)
  ) {
    return (response as BasicRes<AgencyPreforOverviewItem>).rows;
  }

  if (response && typeof response === 'object') {
    return [response as AgencyPreforOverviewItem];
  }

  return [];
};

const findTreeNode = (
  rows: TreeAgencyPreforOverviewItem[],
  rowId: string,
): TreeAgencyPreforOverviewItem | null => {
  for (const row of rows) {
    if (row.userId === rowId) {
      return row;
    }

    if (row.children?.length) {
      const childResult = findTreeNode(row.children, rowId);
      if (childResult) {
        return childResult;
      }
    }
  }

  return null;
};

const updateTreeChildren = (
  rows: TreeAgencyPreforOverviewItem[],
  parentId: string,
  children: TreeAgencyPreforOverviewItem[],
): TreeAgencyPreforOverviewItem[] => {
  return rows.map(row => {
    if (row.userId === parentId) {
      return {
        ...row,
        children,
      };
    }

    if (!row.children?.length) {
      return row;
    }

    return {
      ...row,
      children: updateTreeChildren(row.children, parentId, children),
    };
  });
};

export function PerformanceOverviewPage() {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isTreeMode, setIsTreeMode] = useState(false);
  const [treeRows, setTreeRows] = useState<TreeAgencyPreforOverviewItem[]>([]);
  const [treeExpandedRows, setTreeExpandedRows] = useState<ExpandedState>({});
  const [commonParams, setCommonParams] = useState<
    Omit<AgencyPreforOverviewParams, 'serverId' | 'serverType' | keyof BasicParams>
  >({
    beginTime: '',
    endTime: '',
    userId: '',
    rebateLevelId: '',
  });

  const { data: adjustInType } = useDictType('crm_adjust_in_type', { enabled: true });
  const { data: adjustOutType } = useDictType('crm_adjust_out_type', { enabled: true });

  const { data: rebateLevel } = useRebateLevelList();
  const { serverId, setServerId, server, serverLoading } = useInitServerId();

  const serverType = `${server?.rows?.find(item => item.id === serverId)?.serviceType || ''}`;

  const {
    data: agencyPreforOverview,
    isLoading: listLoading,
    refetch: refetchList,
  } = useAgencyPreforOverviewList(
    {
      pageSize,
      pageNum: pageNum + 1,
      serverId: serverId || '',
      serverType,
      ...commonParams,
      isAsc: 'asc',
    },
    { enabled: !!serverId && !isTreeMode },
  );

  const {
    data: agencyPreforOverviewTree,
    isLoading: treeLoading,
    refetch: refetchTree,
  } = useAgencyPreforOverviewTreeList(
    {
      pageSize,
      pageNum: pageNum + 1,
      serverId: serverId || '',
      serverType,
      parentId: '',
    },
    { enabled: !!serverId && isTreeMode },
  );

  const { mutateAsync: fetchTreeChildren } = useAgencyPreforOverviewTreeChildren();
  const loadedNodeIdsRef = useRef<Set<string>>(new Set());
  const loadingNodeIdsRef = useRef<Set<string>>(new Set());
  const treeRowsRef = useRef<TreeAgencyPreforOverviewItem[]>([]);
  const treeExpandedRowsRef = useRef<ExpandedState>({});

  useEffect(() => {
    treeRowsRef.current = treeRows;
  }, [treeRows]);

  useEffect(() => {
    if (!isTreeMode) {
      return;
    }

    const rows = (agencyPreforOverviewTree?.rows || []).map(buildTreeNode);
    setTreeRows(rows);
    setTreeExpandedRows({});
    treeExpandedRowsRef.current = {};
    loadedNodeIdsRef.current = new Set();
    loadingNodeIdsRef.current = new Set();
  }, [agencyPreforOverviewTree, isTreeMode]);

  const reset = () => {
    setCommonParams({
      beginTime: '',
      endTime: '',
      userId: '',
      rebateLevelId: '',
    });
    setPageNum(0);
    setPageSize(10);
  };

  const formatUsd = (value: number) => `${value} USD`;

  const handleTreeExpandedChange = async (expanded: ExpandedState) => {
    const prevExpandedRows = treeExpandedRowsRef.current as Record<string, boolean>;
    const currentExpandedRows = expanded as Record<string, boolean>;

    setTreeExpandedRows(expanded);
    treeExpandedRowsRef.current = expanded;

    const newExpandedIds = Object.keys(currentExpandedRows).filter(
      id => currentExpandedRows[id] && !prevExpandedRows[id],
    );

    if (!newExpandedIds.length) {
      return;
    }

    await Promise.all(
      newExpandedIds.map(async rowId => {
        if (loadedNodeIdsRef.current.has(rowId) || loadingNodeIdsRef.current.has(rowId)) {
          return;
        }

        const targetNode = findTreeNode(treeRowsRef.current, rowId);
        if (!targetNode || Number(targetNode.isTreeLeaf) !== 1) {
          return;
        }

        loadingNodeIdsRef.current.add(rowId);

        try {
          const childrenResult = await fetchTreeChildren({
            serverId: serverId || '',
            serverType,
            parentId: rowId,
          });

          const children = normalizeChildren(childrenResult).map(buildTreeNode);

          setTreeRows(prev => updateTreeChildren(prev, rowId, children));
          loadedNodeIdsRef.current.add(rowId);
        } finally {
          loadingNodeIdsRef.current.delete(rowId);
        }
      }),
    );
  };

  const allColumns: CRMColumnDef<TreeAgencyPreforOverviewItem, unknown>[] = [
    {
      id: 'No.',
      header: t('overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'agentInfo',
      header: t('overview.agentInfo'),
      cell: ({ row }) => (
        <div>
          <div className="max-w-40 truncate">{row.original.username || '-'}</div>
          <div className="text-muted-foreground text-xs">{row.original.showId || '-'}</div>
        </div>
      ),
    },
    {
      id: 'rebateLevel',
      header: t('overview.rebateLevelId'),
      accessorFn: row => row.rebateLevel,
    },
    {
      id: 'country',
      header: t('overview.countryRegion'),
      accessorFn: row => row.country || '-',
    },
    {
      id: 'balanceWallet',
      header: t('overview.balanceWallet'),
      accessorFn: row => row.balanceWallet,
    },
    {
      id: 'balanceTa',
      header: t('overview.balanceTa'),
      accessorFn: row => formatUsd(row.balanceTa),
    },
    {
      id: 'depositAmount',
      accessorKey: 'depositAmount',
      header: t('overview.depositAmount'),
      accessorFn: row => formatUsd(row.depositAmount),
    },
    {
      id: 'withdrawAmount',
      accessorKey: 'withdrawAmount',
      header: t('overview.withdrawAmount'),
      accessorFn: row => formatUsd(row.withdrawAmount),
    },
    {
      id: 'netDeposit',
      accessorKey: 'netDeposit',
      header: t('overview.netDeposit'),
      accessorFn: row => formatUsd(row.netDeposit),
    },
    {
      id: 'clients',
      header: t('overview.clients'),
      accessorFn: row => row.clients,
    },
    {
      id: 'directClients',
      header: t('overview.directClients'),
      accessorFn: row => row.directClients,
    },
    {
      id: 'referClients',
      header: t('overview.referClients'),
      accessorFn: row => row.referClients,
    },
    {
      id: 'referDirectClients',
      header: t('overview.referDirectClients'),
      accessorFn: row => row.referDirectClients,
    },
    {
      id: 'accountNumber',
      accessorKey: 'accountNumber',
      header: t('overview.accountNumber'),
      accessorFn: row => row.accountNumber,
    },
    {
      id: 'volume',
      accessorKey: 'volume',
      header: t('overview.volume'),
      accessorFn: row => row.volume,
    },
    {
      id: 'profitAndLoss',
      accessorKey: 'profitAndLoss',
      header: t('overview.profitAndLoss'),
      accessorFn: row => formatUsd(row.profitAndLoss),
    },
    {
      id: 'personalRebate',
      header: t('overview.personalRebate'),
      accessorFn: row => formatUsd(row.personalRebate),
    },
    {
      id: 'overallRebate',
      header: t('overview.overallRebate'),
      accessorFn: row => formatUsd(row.overallRebate),
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('ib-overview-reports-table', allColumns);

  return (
    <div>
      <PageInfo title={t('performanceOverview.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-end">
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
              <OverviewForm
                setCommonParams={setCommonParams}
                serverOptions={server?.rows || []}
                rebateLevelOptions={rebateLevel?.rows || []}
                setServerId={setServerId}
                initialServerId={serverId}
                reset={reset}
                commonParams={commonParams}
              />
            </RrhDrawer>
            <ColumnVisibilityButton
              columnMeta={columnMeta}
              visibleColumns={visibleColumns}
              onToggle={toggleColumn}
              onBatchReorder={batchUpdateColumns}
              columns={columns}
            />
            <PreferDialog
              onSuccess={() => {
                if (isTreeMode) {
                  void refetchTree();
                  return;
                }

                void refetchList();
              }}
              adjustInTypeOptions={adjustInType || []}
              adjustOutTypeOptions={adjustOutType || []}
            />
            <Button
              variant="ghost"
              className="h-8 cursor-pointer px-3"
              onClick={() => {
                setIsTreeMode(prev => !prev);
                setPageNum(0);
              }}
            >
              {isTreeMode
                ? t('performanceOverview.switchToList')
                : t('performanceOverview.switchToTree')}
            </Button>
          </div>
        </div>
        <DataTable
          columns={tableColumns}
          data={isTreeMode ? treeRows : (agencyPreforOverview?.rows || []).map(buildTreeNode)}
          pageCount={Math.ceil(
            +((isTreeMode ? agencyPreforOverviewTree?.total : agencyPreforOverview?.total) || 0) /
              pageSize,
          )}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={(isTreeMode ? treeLoading : listLoading) || serverLoading}
          treeConfig={
            isTreeMode
              ? {
                  enabled: true,
                  getRowId: row => row.userId,
                  getRowCanExpand: row => Number(row.isTreeLeaf) === 1,
                  getChildren: row => row.children || [],
                  defaultExpandedRows: treeExpandedRows as Record<string, boolean>,
                  onExpandedChange: expanded => {
                    void handleTreeExpandedChange(expanded);
                  },
                }
              : undefined
          }
        />
      </TableContentWrapper>
    </div>
  );
}
