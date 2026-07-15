import { useDeleteUserWallet, useGetUserWalletList } from '@/api/hooks/agent/agent';
import { WalletItem } from '@/api/hooks/system';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { useTabActions } from '@/hooks/useTabActions';
import { formatMoneyNumber } from '@/lib/utils';
import { Ellipsis, Plus, RefreshCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CrmAddWalletDialog } from '../components/CrmAddWalletDialog';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';

export const CrmUserWalletListPage = ({ userId }: { userId: string }) => {
  const { t } = useTranslation();
  const { openTab } = useTabActions();
  const [info, setInfo] = useState<WalletItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { mutateAsync: removeUserWallet } = useDeleteUserWallet();
  const { data, isPending, refetch } = useGetUserWalletList(userId, {
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
  });
  const allColumns = useMemo<CRMColumnDef<WalletItem, unknown>[]>(
    () => [
      {
        id: 'No.',
        size: 50,
        header: t('overview.Index'),
        cell: ({ row }) => <div>{row.index + 1}</div>,
      },
      {
        id: 'name',
        header: t('tradingAccountTransactions.name'),
        cell: ({ row }) => {
          const rowInfo = row.original;
          return <div>{`${rowInfo.crmUserName}(${rowInfo.crmUserShowId})`}</div>;
        },
      },
      {
        id: 'currency',
        header: t('table.currency'),
        accessorFn: row => (row.currency ? formatMoneyNumber(row.currency || 0) : '-'),
      },
      {
        id: 'balance',
        header: t('table.balance'),
        accessorFn: row => (row.balance ? formatMoneyNumber(row.balance || 0) : '-'),
      },
      {
        id: 'allIn',
        header: t('tradingAccountDataStats.positiveBalance'),
        accessorFn: row => (row.allIn ? formatMoneyNumber(row.allIn || 0) : '-'),
      },
      {
        id: 'allOut',
        header: t('tradingAccountDataStats.negativeBalance'),
        accessorFn: row => (row.allOut ? formatMoneyNumber(row.allOut || 0) : '-'),
      },
      {
        id: 'operation',
        header: () => {
          return <div className="flex justify-center">{t('common.Operation')}</div>;
        },
        cell: ({ row }) => (
          <div>
            <RrhDropdown
              Trigger={<Ellipsis className="size-4" />}
              dropdownList={[
                { label: t('common.View'), value: 'view' },
                { label: t('common.delete'), value: 'delete' },
              ]}
              callToAction={action => {
                switch (action) {
                  case 'view': {
                    const url = `/account/crm-accounts/wallets/detail?id=${row.original.id}`;
                    openTab({
                      key: url,
                      title: `${row.original.crmUserName}(${row.original.currency})`,
                      path: url,
                    });
                    break;
                  }
                  case 'delete':
                    setInfo(row.original);
                    setIsDeleteDialogOpen(true);
                    break;
                  default:
                    break;
                }
              }}
            />
          </div>
        ),
        fixed: 'right',
        size: 50,
      },
    ],
    [t, openTab, setInfo, setIsDeleteDialogOpen],
  );
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, columnMeta, tableColumns } =
    useColumnVisibility('crm-user-wallet-list', allColumns);
  const reset = () => {
    setPageNum(0);
    setPageSize(10);
    refetch();
  };
  return (
    <TableContentWrapper>
      <div className="mb-3 flex items-center justify-end">
        <div className="flex items-center gap-2">
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
          <RrhButton onClick={() => setIsAddDialogOpen(true)}>
            <Plus />
            {t('common.add')}
          </RrhButton>
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
        loading={isPending}
      />
      <CrmAddWalletDialog
        userId={userId}
        open={isAddDialogOpen}
        setOpen={setIsAddDialogOpen}
        onSuccess={refetch}
      />
      <RrhDeleteAlert<{ ids: string }>
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        onSuccess={refetch}
        confirmFunction={removeUserWallet}
        params={{ ids: info?.id || '' }}
        tipsText={t('common.deleteFieldConfirm', { field: t('walletAccountsPage.title') })}
      />
    </TableContentWrapper>
  );
};
