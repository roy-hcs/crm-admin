import { CrmDealAccountItem } from '@/api/hooks/account';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { CRMColumnDef, DataTable } from '@/components/table/DataTable';
import { Ellipsis } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { AccountGroupDialog } from './AccountGroupDialog';
// import { DeleteGroupDialog } from './DeleteGroupDialog';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { useRemoveAccountGroup } from '@/api/hooks/account';

export const AccountGroupsTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  onRefresh,
}: {
  data: CrmDealAccountItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  onRefresh: () => void;
}) => {
  const { t } = useTranslation();
  const [editingItem, setEditingItem] = useState<CrmDealAccountItem | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const { mutateAsync: removeAccountGroup } = useRemoveAccountGroup();

  const columns = useMemo<CRMColumnDef<CrmDealAccountItem, unknown>[]>(
    () => [
      {
        id: 'No',
        header: t('table.index'),
        cell: ({ row }) => <div>{row.index + 1}</div>,
      },
      {
        id: 'sort',
        header: t('table.sort'),
        cell: ({ row }) => row?.original?.sort || '-',
      },
      {
        id: 'name',
        header: t('accountGroups.name'),
        cell: ({ row }) => row?.original?.name || '-',
      },
      {
        id: 'num',
        header: t('accountGroups.num'),
        cell: ({ row }) => row?.original?.num || '-',
      },
      {
        id: 'relatedRebateRuleCount',
        header: t('accountGroups.relatedRebateRuleCount'),
        cell: ({ row }) => row?.original?.relatedRebateRuleCount || '-',
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
                { label: t('common.Edit'), value: 'edit' },
                { label: t('common.delete'), value: 'delete' },
              ]}
              callToAction={action => {
                if (action === 'edit') {
                  setEditingItem(row.original);
                  setOpen(true);
                } else if (action === 'delete') {
                  setEditingItem(row.original);
                  setDeleteAlert(true);
                }
              }}
            />
          </div>
        ),
        fixed: 'right',
        size: 50,
      },
    ],
    [t, setEditingItem, setOpen, setDeleteAlert],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        pageCount={pageCount}
        pageSize={pageSize}
        pageIndex={pageIndex}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        loading={loading}
      />
      {editingItem && (
        <AccountGroupDialog
          mode="edit"
          open={open}
          onOpenChange={v => {
            if (!v) setEditingItem(null);
            setOpen(v);
          }}
          initialValues={{
            id: editingItem.id || '',
            name: editingItem.name || '',
            sort: String(editingItem.sort) || '',
          }}
          onSuccess={() => {
            setEditingItem(null);
            onRefresh?.();
          }}
        />
      )}
      <RrhDeleteAlert<{
        ids: string;
      }>
        open={deleteAlert}
        setOpen={setDeleteAlert}
        onSuccess={onRefresh}
        confirmFunction={removeAccountGroup}
        params={{ ids: editingItem?.id || '' }}
        tipsText={t('accountGroups.deleteTips', { name: editingItem?.name })}
      />
    </>
  );
};
