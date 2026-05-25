import {
  TwoCommissionGroupItem,
  useLevelList,
  useRemoveRebateGroup,
  useTwoCommissionGroupList,
} from '@/api/hooks/rebate';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { CRMColumnDef, DataTable } from '@/components/table';
import { Button } from '@/components/ui/button';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { Ellipsis, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { AddEditCommissionGroupDialog } from './components/AddEditCommissionGroupDialog';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';

export function CommissionSettingPage() {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const rebateTraderId = searchParams.get('id');
  const [id, setId] = useState('');
  const [open, setOpen] = useState(false);
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [commonParams, setCommonParams] = useState({
    settleUnit: '',
    model: '',
  });

  const [deleteAlert, setDeleteAlert] = useState(false);
  const { mutateAsync: removeRebate } = useRemoveRebateGroup();

  const { data: levelRes, isLoading: levelResLoading } = useLevelList(
    {
      rebateTraderId: rebateTraderId || '',
      type: '1',
    },
    {
      enabled: !!rebateTraderId,
    },
  );

  const {
    data: data,
    isLoading: loading,
    refetch,
  } = useTwoCommissionGroupList(
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
      settleUnit: '',
      model: '',
    });
    setPageNum(0);
  };

  const allColumns: CRMColumnDef<TwoCommissionGroupItem, unknown>[] = [
    {
      id: 'No.',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'aliasName',
      header: t('table.commissionGroupName'),
      cell: ({ row }) => row?.original.name || '-',
    },
    {
      id: 'price1',
      header: t('commissionRebateSettings.chiefSteward'),
      cell: ({ row }) => row?.original?.agency?.[0]?.price || '-',
    },
    {
      id: 'price2',
      header: t('commissionRebateSettings.superAgent'),
      cell: ({ row }) => row?.original?.agency?.[1]?.price || '-',
    },
    {
      id: 'price3',
      header: t('commissionRebateSettings.firstAgent'),
      cell: ({ row }) => row?.original?.agency?.[2]?.price || '-',
    },
    {
      id: 'leverTotalRebate',
      header: t('commissionRebateSettings.leverTotalRebate'),
      cell: ({ row }) => {
        const agency = row?.original?.agency || [];
        const totalRebate = agency.reduce((sum, item) => sum + (item.price || 0), 0);
        return (totalRebate || 0).toFixed(2);
      },
    },
    {
      id: 'linkAccountNum',
      header: t('table.relatedAccountCount'),
      cell: ({ row }) => row?.original.linkAccountNum || '-',
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
              label: t('common.Edit'),
              value: 'edit',
            },
            { label: t('common.delete'), value: 'delete' },
          ]}
          callToAction={action => {
            setId(row.original.id);
            if (action === 'edit') {
              setOpen(true);
            } else {
              setDeleteAlert(true);
            }
          }}
        />
      ),
      fixed: 'right',
      size: 50,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('rebate-commisssion-setting-table', allColumns);

  return (
    <div>
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="size-8 cursor-pointer"
              onClick={() => {
                reset();
                refetch();
              }}
            >
              <RefreshCcw className="size-3.5" />
            </Button>
            <ColumnVisibilityButton
              columnMeta={columnMeta}
              visibleColumns={visibleColumns}
              onToggle={toggleColumn}
              onBatchReorder={batchUpdateColumns}
              columns={columns}
            />
          </div>
          <AddEditCommissionGroupDialog
            mode="add"
            rebateTraderId={rebateTraderId || ''}
            onSuccess={refetch}
            leverOptions={levelRes?.data || []}
          />
        </div>
        <DataTable
          columns={tableColumns}
          data={data?.rows || []}
          pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={loading || levelResLoading}
        />
      </TableContentWrapper>
      <AddEditCommissionGroupDialog
        open={open}
        onOpenChange={setOpen}
        mode="edit"
        id={id}
        rebateTraderId={rebateTraderId || ''}
        leverOptions={levelRes?.data || []}
        onSuccess={refetch}
      />
      <RrhDeleteAlert<{
        ids: string;
      }>
        open={deleteAlert}
        setOpen={setDeleteAlert}
        onSuccess={refetch}
        confirmFunction={removeRebate}
        params={{ ids: id || '' }}
        tipsText={t('commissionRebateSettings.confirmDeleteRebate')}
      />
    </div>
  );
}
