import { useState, useCallback } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { useTicketList } from '@/api/hooks/ticket/ticket';
import { TicketAllListForm } from './TicketAllListForm';
import { Funnel, Search, RefreshCcw, Ellipsis, Star } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { useUserList } from '@/api/hooks/system';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/types';
import { CrmTicketParams, CrmTicketItem } from '@/api/hooks/ticket/types';
import { ToolTip } from '@/components/common/ToolTip';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { useTicketFollow } from '@/api/hooks/ticket/ticket';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { RrhAlert } from '@/components/common/RrhAlert';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

const FollowCell = ({ row }: { row: { original: CrmTicketItem } }) => {
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
      queryClient.invalidateQueries({ queryKey: ['TicketList'] });
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
        className={cn(row.original.isFollow === 1 ? 'text-yellow-400' : '')}
      />
      <RrhAlert
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

export const TicketAllList = () => {
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState('');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [otherParams, setOtherParams] = useState<Omit<CrmTicketParams, keyof BasicParams>>({
    isAll: '1',
    orderId: '',
    content: '',
    priority: '-1',
    startDate: '',
    endDate: '',
    status: '-1',
    receiverId: '',
    belongUser: '',
  });

  const { data: userData, isLoading: userDataLoading } = useUserList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    userName: '',
    roleId: '',
    status: '',
    phonenumber: '',
    email: '',
    onlineStatus: '',
    params: {
      beginTime: '',
      endTime: '',
    },
  });

  const { data: ticketData, isLoading: ticketLoading } = useTicketList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
  });

  const reset = () => {
    setOtherParams({
      isAll: '1',
      orderId: '',
      content: '',
      priority: '-1',
      startDate: '',
      endDate: '',
      status: '-1',
      receiverId: '',
      belongUser: '',
    });
    setKeyword('');
    setPageNum(0);
    setPageSize(10);
  };

  const allColumns: CRMColumnDef<CrmTicketItem, unknown>[] = [
    {
      id: 'No.',
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
      accessorFn: row => row.orderId || '-',
    },
    {
      id: 'content',
      header: t('ticketList.content'),
      cell: ({ row }) => {
        if (row.original.content) {
          return (
            <ToolTip
              maxWidth="800px"
              content={<div className="break-all">{row.original.content}</div>}
            >
              <div className="w-30 truncate text-left">{row.original.content}</div>
            </ToolTip>
          );
        }
        return '-';
      },
    },
    {
      id: 'belongUser',
      header: t('ticketList.belongUser'),
      cell: ({ row }) => {
        if (row.original.belongUser) {
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
        if ([0, 1, 2].includes(row.original.priority)) {
          return <div>{t(`ticketList.priorityOptions.${row.original.priority}`)}</div>;
        }
        return '-';
      },
    },
    {
      id: 'receiver',
      header: t('ticketList.receiverId'),
      accessorFn: row => row.receiver || '-',
    },
    {
      id: 'status',
      header: t('common.status'),
      cell: ({ row }) => {
        if ([0, 1, 2].includes(row.original.status)) {
          return <div>{t(`ticketList.statusOptions.${row.original.status}`)}</div>;
        }
        return '-';
      },
    },
    {
      id: 'recentReplyTime',
      header: t('ticketList.recentReplyTime'),
      accessorFn: row => row.recentReplyTime || '-',
    },
    {
      id: 'createTime',
      header: t('common.createTime'),
      accessorFn: row => row.createTime || '-',
    },
    {
      id: 'operation',
      header: () => <div className="text-center">{t('common.Operation')}</div>,
      label: t('common.Operation'),
      fixed: 'right',
      size: 50,
      cell: () => (
        <RrhDropdown
          Trigger={<Ellipsis className="size-4" />}
          dropdownList={[
            { label: t('common.View'), value: 'view' },
            { label: t('common.Edit'), value: 'edit' },
          ]}
          callToAction={() => {}}
        />
      ),
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('ticket-all-list-table', allColumns);

  return (
    <TableContentWrapper>
      <div className="mb-3 flex flex-wrap justify-between gap-2">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('ticketList.orderId') })}
          className="h-9"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          leftIcon={<Search className="size-4" />}
          onLeftIconClick={() => {
            setOtherParams(prev => ({ ...prev, orderId: keyword }));
            setPageNum(0);
          }}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline">{t('common.add')}</Button>
          <Button variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
            <RefreshCcw className="size-3.5" />
          </Button>
          <RrhDrawer
            asChild
            Trigger={
              <Button variant="ghost" className="size-8 cursor-pointer">
                <Funnel className="size-4" />
              </Button>
            }
            title="Filter"
            responsiveDirection={{
              mobile: 'bottom',
              desktop: 'right',
            }}
            footerShow={false}
          >
            <TicketAllListForm
              params={otherParams}
              reset={reset}
              setParams={setOtherParams}
              userData={userData?.rows || []}
            />
          </RrhDrawer>
          <ColumnVisibilityButton
            columnMeta={columnMeta}
            visibleColumns={visibleColumns}
            onToggle={toggleColumn}
            onBatchReorder={batchUpdateColumns}
            columns={columns}
          />
        </div>
      </div>
      <DataTable
        columns={tableColumns}
        data={ticketData?.rows || []}
        pageCount={Math.ceil(+(ticketData?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={ticketLoading || userDataLoading}
      />
    </TableContentWrapper>
  );
};
