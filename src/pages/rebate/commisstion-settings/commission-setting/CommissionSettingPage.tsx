import {
  TwoCommissionGroupItem,
  useLevelList,
  useRemoveRebateGroup,
  useTwoCommissionGroupList,
} from '@/api/hooks/rebate';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { CRMColumnDef } from '@/components/table';
import { Ellipsis } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { AddEditCommissionGroupDialog } from './components/AddEditCommissionGroupDialog';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { CommissionSettingTableSection } from './components/CommissionSettingTableSection';

export function CommissionSettingPage({ type }: { type: 'trading' | 'fee' | 'deposit' }) {
  const typeId = type === 'trading' ? '1' : type === 'fee' ? '2' : '3';
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
      type: typeId,
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
      type: typeId,
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

  const allColumns = useMemo<CRMColumnDef<TwoCommissionGroupItem, unknown>[]>(() => {
    return [
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
      ...(levelRes?.data || []).map<CRMColumnDef<TwoCommissionGroupItem, unknown>>(level => ({
        id: `price-${level.id}`,
        header: level.levelName || '-',
        cell: ({ row }) => {
          const matchedAgency = row?.original?.agency?.find(
            item => String(item.levelId) === String(level.id),
          );
          return matchedAgency?.price ?? '-';
        },
      })),
      {
        id: 'leverTotalRebate',
        header: t('commissionRebateSettings.leverTotalRebate'),
        cell: ({ row }) => {
          const agency = row?.original?.agency || [];
          const totalRebate = agency.reduce((sum, item) => sum + (item.price || 0), 0);
          return `${(totalRebate || 0).toFixed(2)} %`;
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
  }, [t, levelRes?.data]);

  const isColumnReady = !rebateTraderId || !levelResLoading;
  const tableId = `rebate-commisssion-setting-table-${typeId}-${rebateTraderId || 'default'}`;

  return (
    <div>
      <CommissionSettingTableSection
        isColumnReady={isColumnReady}
        onRefresh={() => {
          reset();
          refetch();
        }}
        addAction={
          <AddEditCommissionGroupDialog
            mode="add"
            rebateTraderId={rebateTraderId || ''}
            onSuccess={refetch}
            leverOptions={levelRes?.data || []}
          />
        }
        tableId={tableId}
        allColumns={allColumns}
        data={data?.rows || []}
        pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        loading={loading || levelResLoading}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
      />
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
