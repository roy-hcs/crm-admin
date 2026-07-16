import { CustomerCommissionItem, useCustomerCommissionList } from '@/api/hooks/rebate';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { CRMColumnDef, DataTable } from '@/components/table';
import { Button } from '@/components/ui/button';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { Funnel, RefreshCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { CustomerCommissioForm } from './components/CustomerCommissioForm';
import { CommissionPreferenceDialog } from './components/CommissionPreferenceDialog';
import { EditCommissionParamsDialog } from './components/EditCommissionParamsDialog';

export function CustomerCommissionPage() {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const rebateTraderId = searchParams.get('id');
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<CustomerCommissionItem>();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [commonParams, setCommonParams] = useState({
    name: '',
    email: '',
  });
  const { data: data, isLoading: loading } = useCustomerCommissionList(
    {
      pageSize,
      ...commonParams,
      rebateTraderId: rebateTraderId || '',
      pageNum: pageNum + 1,
      isAsc: 'asc',
      orderByColumn: '',
    },
    {
      enabled: !!rebateTraderId,
    },
  );

  const reset = () => {
    setCommonParams({
      name: '',
      email: '',
    });
    setPageNum(0);
  };

  const allColumns = useMemo<CRMColumnDef<CustomerCommissionItem, unknown>[]>(
    () => [
      {
        id: 'No.',
        header: t('table.index'),
        cell: ({ row }) => <div>{row.index + 1}</div>,
      },
      {
        id: 'aliasName',
        header: t('table.userName'),
        cell: ({ row }) => {
          return (
            <div>
              <div className="max-w-40 truncate">{row.original.fullName || '-'}</div>
              <div>{row.original.showId || '-'}</div>
            </div>
          );
        },
      },
      {
        id: 'email',
        header: t('table.email'),
        cell: ({ row }) => row?.original.email || '-',
      },
      {
        id: 'totalRebate',
        header: t('commissionRebateSettings.totalRebate'),
        cell: ({ row }) => row?.original.totalRebate || '-',
      },
      {
        id: 'rebateValue',
        header: t('commissionRebateSettings.rebateValue'),
        cell: ({ row }) => row?.original.rebateValue || '-',
      },
      {
        id: 'rebateLevel',
        header: t('table.rebateLevel'),
        cell: ({ row }) => row?.original.rebateLevel || '-',
      },
      {
        id: 'operation',
        header: () => {
          return <div className="flex justify-center">{t('common.Operation')}</div>;
        },
        label: t('common.Operation'),
        cell: ({ row }) => (
          <RrhButton
            variant="ghost"
            onClick={() => {
              setCurrentItem(row.original);
              setOpen(true);
            }}
          >
            {t('common.Edit')}
          </RrhButton>
        ),
        fixed: 'right',
        size: 50,
      },
    ],
    [t, setCurrentItem, setOpen],
  );

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('rebate-customer-commission-table', allColumns);

  return (
    <div>
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
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
              <CustomerCommissioForm
                commonParams={commonParams}
                reset={reset}
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
          </div>
          <CommissionPreferenceDialog />
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
      <EditCommissionParamsDialog
        open={open}
        onOpenChange={setOpen}
        rebateTraderId={currentItem?.rebateTraderId || ''}
        userId={currentItem?.userId || ''}
        onSuccess={() => {}}
      />
    </div>
  );
}
