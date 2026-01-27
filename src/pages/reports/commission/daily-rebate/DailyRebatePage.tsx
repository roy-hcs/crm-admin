import { useEffect, useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { DailyRebateItem, DailyRebateParams, useDailyRebateList } from '@/api/hooks/report';
import { Funnel, Search, RefreshCcw, FileOutput } from 'lucide-react';
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
import { RrhDialog } from '@/components/common/RrhDialog';
import { useRebateSettleExport } from '@/api/hooks/report/report';
import { toast } from 'sonner';
import { downloadFile } from '@/lib/utils';
import { RrhButton } from '@/components/common/RrhButton';

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
      header: t('ib.overview.Index'),
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

  const [exportOpen, setExportOpen] = useState(false);
  const {
    mutateAsync: exportRebate,
    error: exportError,
    isPending: exportLoading,
  } = useRebateSettleExport();
  useEffect(() => {
    if (exportError) {
      toast.error(t('common.exportFailed'), { duration: 5000 });
    }
  }, [exportError, t]);

  const handleExport = async () => {
    try {
      const result = await exportRebate({
        params,
        ...commonParams,
      });

      if (result?.code !== 0 && result?.msg) {
        toast.error(result.msg, { duration: 5000 });
      } else if (result?.code === 0 && result?.msg) {
        downloadFile(result.msg);
        setExportOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(t('common.exportFailed'), { duration: 5000 });
    }
  };

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
            <RrhDialog
              title={t('common.SystemPrompt')}
              open={exportOpen}
              onOpenChange={setExportOpen}
              formLoading={exportLoading}
              trigger={
                <RrhButton variant="outline">
                  <FileOutput />
                  {t('table.export')}
                </RrhButton>
              }
              variant="small"
              footerShow={false}
            >
              <div>
                <div>
                  {t('table.exportAllDataTip', {
                    field: t('commission.daily-rebate.title'),
                  })}
                </div>
                <div className="mt-4 flex justify-end gap-4 pb-4 md:pb-0">
                  <RrhButton variant="outline" onClick={() => setExportOpen(false)}>
                    {t('common.Cancel')}
                  </RrhButton>
                  <RrhButton variant="default" onClick={handleExport}>
                    {t('common.Confirm')}
                  </RrhButton>
                </div>
              </div>
            </RrhDialog>
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
