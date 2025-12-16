import { useTicketFollow } from '@/api/hooks/ticket/ticket';
import { CrmTicketItem } from '@/api/hooks/ticket/types';
import { Alert } from '@/components/common/Alert';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { DataTable } from '@/components/table/DataTable';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Ellipsis, Star } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

const FollowCell = ({ row }: { row: Row<CrmTicketItem> }) => {
  const [isOpen, setIsOpen] = useState(false);
  const changeStatusMutation = useTicketFollow();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const onConfirm = useCallback(async () => {
    const res = await changeStatusMutation.mutateAsync({
      id: String(row.original.id),
      follow: row.original.isFollow === 1 ? 0 : 1,
    });
    if (res.code === 0) {
      queryClient.invalidateQueries({ queryKey: ['MyTicketAllList'] });
    }
  }, [changeStatusMutation, queryClient, row.original.id, row.original.isFollow]);

  const handleClick = () => {
    /**
     * 如果是取关弹出二次确认
     * 否则直接关注
     */
    if (row.original.isFollow === 1) {
      setIsOpen(true);
    } else {
      onConfirm();
    }
  };

  return (
    <>
      <Star
        onClick={handleClick}
        className={cn(row.original.isFollow === 1 ? 'text-yellow-500' : '')}
      />
      <Alert
        trigger={null}
        open={isOpen}
        onOpenChange={setIsOpen}
        cancelText={t('common.Cancel')}
        confirmText={t('common.Confirm')}
        title={t('common.SystemPrompt')}
        content={t('ticketList.confirm.stop')}
        onConfirm={onConfirm}
      />
    </>
  );
};

export const MyTicketsTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: CrmTicketItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();

  const columns: ColumnDef<CrmTicketItem>[] = [
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'isFollow',
      header: t('ticketList.isFollow'),
      cell: ({ row }) => {
        return <FollowCell row={row} />;
      },
    },
    {
      id: 'orderId',
      header: t('ticketList.orderId'),
      cell: ({ row }) => row?.original?.orderId,
    },
    {
      id: 'content',
      header: t('ticketList.content'),
      cell: ({ row }) => {
        if (row?.original?.content) {
          return (
            <Tooltip>
              <TooltipTrigger>
                <div className="w-30 truncate text-left">{row?.original?.content}</div>
              </TooltipTrigger>
              <TooltipContent>{row?.original?.content}</TooltipContent>
            </Tooltip>
          );
        }
        return '-';
      },
    },
    {
      id: 'belongUser',
      header: t('ticketList.belongUser'),
      cell: ({ row }) => {
        if (row?.original?.belongUser) {
          const textArr = row.original.belongUser.split('</br>');
          if (textArr.length === 2) {
            return (
              <div>
                <div>{textArr[0]}</div>
                <div>{textArr[1]}</div>
              </div>
            );
          }
          return <div>{textArr[0]}</div>;
        }
        return '-';
      },
    },
    {
      id: 'priority',
      header: t('ticketList.priority'),
      cell: ({ row }) => {
        if ([0, 1, 2].includes(row?.original?.priority)) {
          return <div>{t(`ticketList.priorityOptions.${row?.original?.priority}`)}</div>;
        }
        return '-';
      },
    },
    {
      id: 'receiver',
      header: t('ticketList.receiverId'),
      cell: ({ row }) => row?.original?.receiver || '-',
    },
    {
      id: 'status',
      header: t('common.status'),
      cell: ({ row }) => {
        if ([0, 1, 2].includes(row?.original?.status)) {
          return <div>{t(`ticketList.statusOptions.${row?.original?.status}`)}</div>;
        }
        return '-';
      },
    },
    {
      id: 'recentReplyTime',
      header: t('ticketList.recentReplyTime'),
      cell: ({ row }) => row?.original?.recentReplyTime || '-',
    },
    {
      id: 'createTime',
      header: t('common.createTime'),
      cell: ({ row }) => row?.original?.createTime || '-',
    },
    {
      id: 'operation',
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
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
