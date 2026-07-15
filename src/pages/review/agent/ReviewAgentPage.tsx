import { useCallback, useMemo, useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { ReviewAgentForm } from './ReviewAgentForm';
import { Funnel, Search, RefreshCcw } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { AgentApplyListParams, useAgentApplyList } from '@/api/hooks/review';
import { Button } from '@/components/ui/button';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { AgentApplyItem } from '@/api/hooks/review';
import { RrhTag } from '@/components/common/RrhTag';
import { applySourceMap, reviewStatusMap } from '@/lib/constant';
import { RrhButton } from '@/components/common/RrhButton';
import { Checkbox } from '@/components/ui/checkbox';
import { RrhSorter } from '@/components/common/RrhSorter';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { useTabActions } from '@/hooks/useTabActions';

export const ReviewAgentPage = () => {
  const [params, setParams] = useState<AgentApplyListParams['params']>({
    beginTime: '',
    endTime: '',
  });
  const [otherParams, setOtherParams] = useState<Omit<AgentApplyListParams, 'params'>>({
    name: '',
    mobile: '',
    email: '',
    verifyStatus: '',
    applySource: '',
    verifyUserName: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const [resetKey, setResetKey] = useState(0);
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('asc');
  const [orderByColumn, setOrderByColumn] = useState('');

  const { data: agentApplyList, isLoading: agentApplyListLoading } = useAgentApplyList(
    {
      pageSize,
      pageNum: pageNum + 1,
      orderByColumn,
      isAsc,
      ...otherParams,
      params: {
        ...params,
      },
    },
    { enabled: true },
  );
  const reset = () => {
    setParams({
      beginTime: '',
      endTime: '',
    });
    setOtherParams({
      name: '',
      mobile: '',
      email: '',
      verifyStatus: '',
      applySource: '',
      verifyUserName: '',
    });
    setResetKey(k => k + 1);
    setPageNum(0);
  };

  const { openTab } = useTabActions();

  const goToDetail = useCallback(
    (row: AgentApplyItem) => {
      // status: 2:待审核 -1:审核中
      const type = [-1, 2].includes(Number(row.verifyStatus)) ? 'audit' : 'detail';
      const url = `/review/agent/detail?type=${type}&id=${row.id}`;
      openTab({
        key: url,
        title: t('reviewAgent.reviewAgentDetail'),
        path: url,
      });
    },
    [openTab, t],
  );

  const allColumns = useMemo<CRMColumnDef<AgentApplyItem, unknown>[]>(
    () => [
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
        id: 'userName',
        header: t('CRMAccountPage.UserName'),
        label: t('CRMAccountPage.UserName'),
        accessorKey: 'userName',
        cell: ({ row }) => (
          <div>
            {row.original.lastName} {row.original.name}
          </div>
        ),
      },
      {
        id: 'mobile',
        header: t('table.mobile'),
        cell: ({ row }) => `+${row.original.mzone} ${row.original.mobile || ''}`,
      },
      {
        id: 'email',
        header: t('table.email'),
        label: t('table.email'),
        accessorKey: 'email',
        cell: ({ row }) => row.original.email || '-',
      },
      {
        id: 'applySource',
        header: t('table.applySource'),
        label: t('table.applySource'),
        accessorKey: 'applySource',
        cell: ({ row }) => {
          const mapValue = applySourceMap[row.original.applySource as keyof typeof applySourceMap];

          return mapValue ? t(`table.${mapValue}`) : row.original.applySource || '-';
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
                column="verifyStatus"
                setOrderByColumn={setOrderByColumn}
                setIsAsc={setIsAsc}
              />
            </div>
          );
        },
        label: t('table.status'),
        accessorKey: 'verifyStatus',
        cell: ({ row }) => {
          const typeMap: Record<number, 'error' | 'success' | 'warning' | 'info'> = {
            0: 'error',
            1: 'success',
            2: 'warning',
            3: 'info',
          };
          return (
            <RrhTag type={typeMap[row.original.verifyStatus]}>
              {t(`table.${reviewStatusMap[row.original.verifyStatus]}`)}
            </RrhTag>
          );
        },
      },
      {
        id: 'submitTime',
        header: () => {
          return (
            <div className="flex items-center justify-between gap-2">
              <div>{t('table.submitTime')}</div>
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
        label: t('table.submitTime'),
        accessorKey: 'createTime',
        cell: ({ row }) => row.original.createTime || '-',
      },
      {
        id: 'currentAuditor',
        header: t('table.currentAuditor'),
        label: t('table.currentAuditor'),
        accessorKey: 'verifyUserName',
        cell: ({ row }) => row.original.verifyUserName || '-',
      },
      {
        id: 'finishTime',
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
        id: 'operate',
        header: () => {
          return <div className="flex justify-center">{t('common.Operation')}</div>;
        },
        label: t('common.Operation'),
        cell: ({ row }) => (
          <RrhButton variant="ghost" onClick={() => goToDetail(row.original)}>
            {[-1, 2].includes(Number(row?.original?.verifyStatus))
              ? t('table.audit')
              : t('common.View')}
          </RrhButton>
        ),
        fixed: 'right',
        size: 50,
      },
    ],
    [t, isAsc, orderByColumn, setOrderByColumn, setIsAsc, goToDetail],
  );

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('review-agent-table', allColumns);

  return (
    <div>
      <PageInfo title={t('reviewAgent.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              key={resetKey}
              placeholder={t('common.pleaseInput', { field: t('table.fullName') })}
              className="h-9"
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={value => {
                setOtherParams(prev => ({ ...prev, name: value }));
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
              <ReviewAgentForm
                params={params}
                otherParams={otherParams}
                reset={reset}
                setParams={setParams}
                setOtherParams={setOtherParams}
                loading={agentApplyListLoading}
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
          data={agentApplyList?.rows || []}
          pageCount={Math.ceil(+(agentApplyList?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={agentApplyListLoading}
        />
      </TableContentWrapper>
    </div>
  );
};
