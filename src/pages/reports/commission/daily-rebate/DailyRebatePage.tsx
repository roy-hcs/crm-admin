import { useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { DailyRebateItem, DailyRebateParams, useDailyRebateList } from '@/api/hooks/report';
import { Funnel, Search, RefreshCcw } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/types';
import { RebateTypeOptions, RebateStatusOptions } from '@/lib/const';
import { DailyRebateForm } from './DailyRebateForm';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { useRebateSettleExport } from '@/api/hooks/report/report';
import { ExportButton } from '@/components/common/ExportButton';

export function DailyRebatePage() {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [params, setParams] = useState<DailyRebateParams['params']>({
    beginTime: '',
    endTime: '',
    account: '',
  });
  const [commonParams, setCommonParams] = useState<
    Omit<DailyRebateParams, 'params' | keyof BasicParams>
  >({
    settleStyle: '1',
    rebateType: '',
    rebateStatus: '',
    id: '',
  });

  const { data: data, isLoading: loading } = useDailyRebateList({
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
      account: '',
    });
    setKeyword('');
    setPageNum(0);
    setPageSize(10);
  };

  const allColumns: CRMColumnDef<DailyRebateItem, unknown>[] = [
    {
      id: 'No.',
      header: t('overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'settleTime',
      header: t('commission.daily-rebate.settleTime'),
      accessorFn: row => row.settleTime,
    },
    {
      id: 'lastName',
      header: t('commission.daily-rebate.userName'),
      cell: ({ row }) => (
        <div>
          <div>{(row.original.lastName || '') + (row.original.name || '')}</div>
          <div>{row.original.showId || ''}</div>
        </div>
      ),
    },
    {
      id: 'rebateType',
      header: t('commission.daily-rebate.rebateType'),
      accessorFn: row => row.rebateType,
      cell: ({ row }) => {
        const find = RebateTypeOptions.find(item => item.value === row.original.rebateType);
        if (find) {
          return t(find.label);
        }
        return '--';
      },
    },
    {
      id: 'account',
      accessorKey: 'account',
      header: t('commission.daily-rebate.account'),
      cell: ({ row }) => {
        if (row.original.account) {
          return row.original.account;
        }
        return '--';
      },
    },
    {
      id: 'volume',
      accessorKey: 'volume',
      header: t('commission.daily-rebate.volume'),
      accessorFn: row => row.volume,
    },
    {
      id: 'rebateTotalAmt',
      accessorKey: 'rebateTotalAmt',
      header: t('commission.daily-rebate.rebateTotalAmt'),
    },
    {
      id: 'rebateStatus',
      accessorKey: 'rebateStatus',
      header: t('commission.daily-rebate.rebateStatus'),
      cell: ({ row }) => {
        const find = RebateStatusOptions.find(
          item => String(item.value) === String(row.original.rebateStatus),
        );
        if (find) {
          return t(find.label);
        }
        return '--';
      },
    },
    {
      id: 'updateTime',
      accessorKey: 'updateTime',
      header: t('commission.daily-rebate.updateTime'),
      cell: ({ row }) => {
        if (row.original.updateTime) {
          return row.original.updateTime;
        }
        return '--';
      },
    },
    {
      id: 'relatedCount',
      accessorKey: 'relatedCount',
      header: t('commission.daily-rebate.relatedCount'),
      accessorFn: row => row.relatedCount,
    },
    {
      id: 'id',
      accessorKey: 'id',
      header: t('commission.daily-rebate.id'),
      accessorFn: row => row.id,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('commission-daily-rebate-reports-table', allColumns);

  const { mutateAsync: exportRebate, isPending: exportLoading } = useRebateSettleExport();

  return (
    <div>
      <PageInfo title={t('commission.daily-rebate.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              placeholder={t('common.pleaseInput', { field: t('commission.daily-rebate.account') })}
              className="h-9"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={() => {
                setParams(prev => ({ ...prev, account: keyword }));
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
              <DailyRebateForm
                params={params}
                commonParams={commonParams}
                reset={reset}
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
            <ExportButton<DailyRebateParams>
              exportFunction={exportRebate}
              params={{
                params,
                ...commonParams,
              }}
              exportLoading={exportLoading}
              title={t('commission.daily-rebate.title')}
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
