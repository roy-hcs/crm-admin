import { GoodsListItem } from '@/api/hooks/pointsMall';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { DataTable } from '@/components/table/DataTable';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCallback, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Alert } from '@/components/common/Alert';
import { useQueryClient } from '@tanstack/react-query';
import { useChangeGoodsStatus } from '@/api/hooks/pointsMall';

const StatusCell = ({ row }: { row: Row<GoodsListItem> }) => {
  const [isOpen, setIsOpen] = useState(false);
  const changeStatusMutation = useChangeGoodsStatus();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const onConfirm = useCallback(async () => {
    const res = await changeStatusMutation.mutateAsync({
      id: row.original.id,
      status: row.original.status === 1 ? 0 : 1,
    });
    if (res.code === 0) {
      queryClient.invalidateQueries({ queryKey: ['crmDealGoodsList'] });
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
          row.original.status === 1 ? t('products.confirm.stop') : t('products.confirm.open')
        }
        onConfirm={onConfirm}
      />
    </>
  );
};

export const AdminOperationsTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: GoodsListItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const columns: ColumnDef<GoodsListItem>[] = [
    {
      id: 'id',
      header: t('products.goodId'),
      cell: ({ row }) => <div>{row?.original?.id}</div>,
    },
    {
      id: 'goodsName',
      header: t('products.name'),
      cell: ({ row }) => {
        return <div>{row?.original?.goodsName || '-'}</div>;
      },
    },
    {
      id: 'exchangePoints',
      header: t('products.exchangePoints'),
      cell: ({ row }) => {
        return <div>{row?.original?.exchangePoints || '-'}</div>;
      },
    },
    {
      id: 'combinationPaymentList',
      header: t('products.exchangeAmount'),
      cell: ({ row }) => {
        if (
          row?.original?.combinationPaymentList?.[0]?.exchangeAmount &&
          row?.original?.combinationPaymentList?.[0]?.exchangePoint
        ) {
          return (
            <Tooltip>
              <TooltipTrigger>
                {row?.original?.combinationPaymentList?.[0]?.exchangeAmount}USD
              </TooltipTrigger>
              <TooltipContent>
                {row?.original?.combinationPaymentList?.[0]?.exchangePoint +
                  `+${row?.original?.combinationPaymentList?.[0]?.exchangeAmount}USD`}
              </TooltipContent>
            </Tooltip>
          );
        }
        return '-';
      },
    },
    {
      id: 'goodsType',
      header: t('products.goodsType'),
      cell: ({ row }) => {
        return (
          <div>
            {String(row?.original?.goodsType) === '2'
              ? t('products.physicalGoods')
              : t('products.virtualGoods')}
          </div>
        );
      },
    },
    {
      id: 'status',
      header: t('table.status'),
      cell: ({ row }) => {
        return <StatusCell row={row} />;
      },
    },
    {
      id: 'viewCount',
      header: t('products.viewCount'),
      cell: ({ row }) => {
        return <div>{row?.original?.viewCount || '-'}</div>;
      },
    },
    {
      id: 'exchangeCount',
      header: t('products.exchangeCount'),
      cell: ({ row }) => {
        return <div>{row?.original?.exchangeCount}</div>;
      },
    },
    {
      id: 'updateBy',
      header: t('products.updateBy'),
      cell: ({ row }) => {
        return <div>{row?.original?.updateBy || '-'}</div>;
      },
    },
    {
      id: 'updateTime',
      header: t('table.updateTime'),
      cell: ({ row }) => {
        return <div>{row?.original?.updateTime || '-'}</div>;
      },
    },
    {
      id: 'operation',
      header: t('common.Operation'),
      cell: () => (
        <div>
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('common.View'), value: 'view' },
              { label: t('common.Edit'), value: 'edit' },
            ]}
            callToAction={action => {
              if (action === 'edit') {
                // Handle edit action
              } else if (action === 'view') {
                // Handle view action
              }
            }}
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
