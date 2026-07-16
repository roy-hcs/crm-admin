import { RrhDialog } from '@/components/common/RrhDialog';
import { RrhButton } from '@/components/common/RrhButton';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInternalTransferDealTicketList } from '@/api/hooks/review/review';
import { DataTable } from '@/components/table/DataTable';
import { InternalTransferDealTicketItem } from '@/api/hooks/review';
import { ColumnDef } from '@tanstack/react-table';

export const OrderDialog = ({
  title,
  trigger,
  onConfirm,
  selectedUser,
  setSelectedUser,
}: {
  title: string;
  trigger: React.ReactNode;
  selectedUser: InternalTransferDealTicketItem | null;
  setSelectedUser: (user: InternalTransferDealTicketItem | null) => void;
  onConfirm: (val: string) => void;
}) => {
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [params, setParams] = useState({
    threeCons: '',
    fiveCons: '',
    regEndTime: '',
    regStartTime: '',
    fuzzyMobile: '',
    fuzzyEmail: '',
    inviter: '',
    accounts: '',
  });
  const { t } = useTranslation();
  const { data: data, isLoading: loading } = useInternalTransferDealTicketList({
    id: '',
    params: { pageSize, pageNum: pageNum + 1, orderByColumn: '', isAsc: 'asc', ticket: '' },
  });
  const handleRowSelect = (user: InternalTransferDealTicketItem) => {
    setSelectedUser(user);
  };
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setParams({
      ...params,
      fiveCons: search,
    });
  };

  const crmColumns = useMemo<ColumnDef<InternalTransferDealTicketItem>[]>(
    () => [
      {
        id: 'select',
        header: () => <div></div>,
        cell: ({ row, table }) => (
          <input
            type="radio"
            name="tableRowSelection"
            checked={row.getIsSelected()}
            onChange={() => {
              table.getRowModel().rows.forEach(r => {
                r.toggleSelected(false);
              });
              row.toggleSelected(true);
              handleRowSelect?.(row.original);
            }}
            className="h-4 w-4 cursor-pointer accent-[#1E1E1E]"
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [handleRowSelect],
  );

  return (
    <RrhDialog
      title={title}
      className="min-w-1/2"
      trigger={trigger}
      cancelText={t('common.Cancel')}
      confirmText={t('common.Confirm')}
      onConfirm={() => onConfirm(selectedUser?.id || '')}
    >
      <div className="grid gap-2">
        <form className="flex items-center gap-4 text-sm" onSubmit={onSubmit}>
          <div>{t('table.orderNumber')}:</div>
          <div className="flex-1">
            <Input
              type="text"
              value={search}
              className="h-9 border px-2"
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div>
            <RrhButton type="submit">
              <Search className="size-4" />
              <span>{t('common.Search')}</span>
            </RrhButton>
          </div>
        </form>
        <DataTable
          columns={crmColumns}
          data={data?.rows || []}
          pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={loading}
        />
      </div>
    </RrhDialog>
  );
};
