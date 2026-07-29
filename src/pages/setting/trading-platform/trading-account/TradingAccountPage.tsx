import { RrhButton } from '@/components/common/RrhButton';
import { Ellipsis, RefreshCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { useTradingAccountList, useRemoveTradingAccount } from '@/api/hooks/setting/setting';
import { TradingAccountItem } from '@/api/hooks/setting/types';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { useDictType } from '@/api/hooks/system';
import { AddEditAccountDialog } from './AddEditAccountDialog';
import { serverMap } from '@/lib/constant';

export const TradingAccountPage = () => {
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();

  const { data: languageList } = useDictType('sys_language');

  const { data, isLoading, refetch } = useTradingAccountList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
  });

  const { mutateAsync: removeTradingAccount } = useRemoveTradingAccount();

  const [item, setItem] = useState<TradingAccountItem | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);

  const allColumns = useMemo<CRMColumnDef<TradingAccountItem, unknown>[]>(
    () => [
      {
        id: 'No',
        header: t('table.index'),
        cell: ({ row }) => row?.index + 1,
      },
      {
        id: 'serverType',
        header: t('table.transactionPlatform'),
        cell: ({ row }) => serverMap[Number(row?.original?.serverType)] ?? '-',
      },
      {
        id: 'accountType',
        header: t('common.accountType'),
        cell: ({ row }) => row?.original?.accountType || '-',
      },
      {
        id: 'associateServerCount',
        header: t('tradingAccountPage.associateServerCount'),
        cell: ({ row }) => row?.original?.associateServerCount || '0',
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
    [t],
  );
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('setting-trading-account-table', allColumns);

  const languageOptions = useMemo(
    () =>
      languageList?.map(i => ({
        label: i.dictLabel,
        value: i.dictValue,
      })) || [],
    [languageList],
  );

  const reset = () => {
    setPageNum(0);
    setPageSize(10);
  };

  return (
    <div>
      <PageInfo title={t('tradingAccountPage.title')} />
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
          <AddEditAccountDialog mode="add" languageOptions={languageOptions} onSuccess={refetch} />
        </div>
        <DataTable
          columns={tableColumns}
          data={data?.rows || []}
          pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={isLoading}
        />
        <AddEditAccountDialog
          open={open}
          setOpen={setOpen}
          mode="edit"
          item={item}
          languageOptions={languageOptions}
          onSuccess={refetch}
        />

        <RrhDeleteAlert<{
          ids: string;
        }>
          open={deleteAlert}
          setOpen={setDeleteAlert}
          onSuccess={refetch}
          confirmFunction={removeTradingAccount}
          params={{ ids: item?.id || '' }}
          tipsText={t('common.deleteConfirm', { field: t('tradingAccountPage.title') })}
        />
      </TableContentWrapper>
    </div>
  );
};
