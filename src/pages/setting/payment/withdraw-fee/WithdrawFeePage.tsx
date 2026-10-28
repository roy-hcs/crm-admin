import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { RrhStatusAlert } from '@/components/common/RrhStatusAlert';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { Ellipsis, RefreshCcw } from 'lucide-react';
import {
  useRemoveWithdrawFee,
  useUpdateWithdrawFeeStatus,
  useWithdrawFeeList,
} from '@/api/hooks/setting/payment';
import { WithdrawFeeItem } from '@/api/hooks/setting/types';
import { WithdrawFeeDialog } from './components/WithdrawFeeDialog';

export const WithdrawFeePage = () => {
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const {
    data: feeList,
    isLoading: feeListLoading,
    refetch,
  } = useWithdrawFeeList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
  });

  const { mutateAsync: updateFeeStatus } = useUpdateWithdrawFeeStatus();
  const { mutateAsync: removeFee } = useRemoveWithdrawFee();

  const [item, setItem] = useState<WithdrawFeeItem | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);

  const methodOptionsMap: Record<number, string> = {
    1: t('withdrawFeePage.methodInternationalWire'),
    2: t('withdrawFeePage.methodBankTransfer'),
    3: t('withdrawFeePage.methodSystem'),
    4: t('withdrawFeePage.methodQuick'),
    5: t('withdrawFeePage.methodThirdParty'),
    13: t('withdrawFeePage.methodPayId'),
  };

  const schemeOptionsMap: Record<number, string> = {
    1: t('withdrawFeePage.schemeNormal'),
    2: t('withdrawFeePage.schemeLadder'),
    3: t('withdrawFeePage.schemeFree'),
  };

  const renderFeeDesc = (row: WithdrawFeeItem) => {
    if (row.scheme === 3) {
      return '-';
    }
    if (row.scheme === 2) {
      return t('withdrawFeePage.schemeLadder');
    }
    if (row.model === 1) {
      return `${t('receiveAccountsPage.commissionByRateValue', { rate: row.withdrawFeeScale ?? '-' })} (${row.minWithdrawFee ?? '-'} ~ ${row.maxWithdrawFee ?? '-'})`;
    }
    return t('receiveAccountsPage.commissionFixedValue', { amount: row.withdrawFeeFixed ?? '-' });
  };

  const allColumns = useMemo<CRMColumnDef<WithdrawFeeItem, unknown>[]>(
    () => [
      {
        id: 'No',
        header: t('table.index'),
        cell: ({ row }) => row?.index + 1,
      },
      {
        id: 'name',
        header: t('withdrawFeePage.ruleName'),
        cell: ({ row }) => row?.original?.name || '-',
      },
      {
        id: 'method',
        header: t('withdrawFeePage.method'),
        cell: ({ row }) => methodOptionsMap[row?.original?.method] || row?.original?.method || '-',
      },
      {
        id: 'currencys',
        header: t('withdrawFeePage.currencys'),
        cell: ({ row }) => row?.original?.currencys || '-',
      },
      {
        id: 'model',
        header: t('receiveAccountsPage.commissionMode'),
        cell: ({ row }) =>
          row?.original?.model === 2
            ? t('receiveAccountsPage.commissionFixed')
            : t('receiveAccountsPage.commissionByRate'),
      },
      {
        id: 'scheme',
        header: t('withdrawFeePage.scheme'),
        cell: ({ row }) => schemeOptionsMap[row?.original?.scheme] || row?.original?.scheme || '-',
      },
      {
        id: 'feeDesc',
        header: t('withdrawFeePage.feeDesc'),
        cell: ({ row }) => renderFeeDesc(row.original),
      },
      {
        id: 'defaultFlag',
        header: t('withdrawFeePage.defaultRule'),
        cell: ({ row }) =>
          row?.original?.defaultFlag === 1 ? (
            <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700">
              {t('common.yes')}
            </span>
          ) : (
            '-'
          ),
      },
      {
        id: 'status',
        header: t('table.status'),
        accessorFn: row => row.status,
        cell: ({ row }) => {
          return (
            <RrhStatusAlert<{
              id: number;
              status: number;
            }>
              params={{
                id: row.original.id,
                status: row.original.status === 1 ? 0 : 1,
              }}
              tipsText={
                row.original.status === 1
                  ? t('receiveAccountsPage.statusConfirm.disable')
                  : t('receiveAccountsPage.statusConfirm.enable')
              }
              checked={row.original.status === 1}
              confirmFunction={updateFeeStatus}
              onSuccess={refetch}
            />
          );
        },
      },
      {
        id: 'updateTime',
        header: t('table.updateTime'),
        cell: ({ row }) => row?.original?.updateTime || '-',
      },
      {
        id: 'operate',
        header: () => t('common.Operation'),
        cell: ({ row }) => (
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('common.Edit'), value: 'edit' },
              { label: t('common.delete'), value: 'delete' },
            ]}
            callToAction={action => {
              setItem(row.original);
              switch (action) {
                case 'edit':
                  setOpen(true);
                  break;
                case 'delete':
                  setDeleteAlert(true);
                  break;
                default:
                  break;
              }
            }}
          />
        ),
        fixed: 'right',
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateFeeStatus, refetch, t],
  );
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('setting-payment-withdraw-fee-table', allColumns);

  const reset = () => {
    setPageNum(0);
    setPageSize(10);
  };

  return (
    <div>
      <PageInfo title={t('withdrawFeePage.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex items-center justify-end gap-2">
          <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
            <RefreshCcw className="size-3.5" />
          </RrhButton>
          <ColumnVisibilityButton
            columnMeta={columnMeta}
            visibleColumns={visibleColumns}
            onToggle={toggleColumn}
            onBatchReorder={batchUpdateColumns}
            columns={columns}
          />
          <WithdrawFeeDialog mode="add" trigger />
          <WithdrawFeeDialog open={open} setOpen={setOpen} mode="edit" item={item} />
        </div>
        <DataTable
          columns={tableColumns}
          data={feeList?.rows || []}
          pageCount={Math.ceil(+(feeList?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={feeListLoading}
        />

        <RrhDeleteAlert<{
          ids: string;
        }>
          open={deleteAlert}
          setOpen={setDeleteAlert}
          onSuccess={refetch}
          confirmFunction={removeFee}
          params={{ ids: String(item?.id || '') }}
          tipsText={t('withdrawFeePage.deleteConfirm')}
        />
      </TableContentWrapper>
    </div>
  );
};
