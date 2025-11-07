import { useChangeGoodsClassificationStatus } from '@/api/hooks/pointsMall';
import { GoodsClassificationItem } from '@/api/hooks/pointsMall';
import { Alert } from '@/components/common/Alert';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { DataTable } from '@/components/table/DataTable';
import { Switch } from '@/components/ui/switch';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

const StatusCell = ({ row }: { row: Row<GoodsClassificationItem> }) => {
  const [isOpen, setIsOpen] = useState(false);
  const changeStatusMutation = useChangeGoodsClassificationStatus();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const onConfirm = useCallback(async () => {
    const res = await changeStatusMutation.mutateAsync({
      id: String(row.original.id),
      status: row.original.status === 1 ? 0 : 1,
    });
    if (res.code === 0) {
      queryClient.invalidateQueries({ queryKey: ['goodsClassification'] });
    }
  }, [changeStatusMutation, queryClient, row.original.id, row.original.status]);

  return (
    <>
      <Switch
        className="cursor-pointer bg-white data-[state=checked]:bg-slate-700"
        checked={row.original.status === 1}
        onClick={() => setIsOpen(true)}
      />
      <Alert
        trigger={null}
        open={isOpen}
        onOpenChange={setIsOpen}
        cancelText={t('common.Cancel')}
        confirmText={t('common.Confirm')}
        title={t('common.SystemPrompt')}
        content={
          row.original.status === 1
            ? t('productCategories.confirm.stop')
            : t('productCategories.confirm.open')
        }
        onConfirm={onConfirm}
      />
    </>
  );
};

export const ProductCategoriesTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: GoodsClassificationItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const columns: ColumnDef<GoodsClassificationItem>[] = [
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'classificationName',
      header: t('productCategories.classificationName'),
      cell: ({ row }) => row?.original?.classificationName || '-',
    },
    {
      id: 'parentClassificationName',
      header: t('productCategories.parentClassificationName'),
      cell: ({ row }) => row?.original?.parentClassificationName || '-',
    },
    {
      id: 'sort',
      header: t('table.sort'),
      cell: ({ row }) => row?.original?.sort || '-',
    },
    {
      id: 'status',
      header: t('table.status'),
      cell: ({ row }) => {
        return <StatusCell row={row} />;
      },
    },
    {
      id: 'updateBy',
      header: t('table.operator'),
      cell: ({ row }) => row?.original?.updateBy || '-',
    },
    {
      id: 'updateTime',
      header: t('table.updateTime'),
      cell: ({ row }) => row?.original?.updateTime || '-',
    },
    {
      id: 'operation',
      header: t('common.Operation'),
      cell: () => (
        <div>
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[{ label: t('common.View'), value: 'view' }]}
            callToAction={() => {}}
          />
        </div>
      ),
    },
  ];

  return (
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
  );
};
