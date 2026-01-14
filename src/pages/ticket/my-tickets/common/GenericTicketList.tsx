import React, { useState, useCallback, useMemo, Dispatch, SetStateAction } from 'react';
import { useMyTicketAllList } from '@/api/hooks/ticket/ticket';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Button } from '@/components/ui/button';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { useTranslation } from 'react-i18next';
import { CrmTicketParams, TicketTabsParams, CrmTicketItem } from '@/api/hooks/ticket/types';
import { BasicParams } from '@/api/types';
import { Funnel, RefreshCcw, Search, Ellipsis } from 'lucide-react';
import { MyTicketsForm } from '../MyTicketsForm';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { ToolTip } from '@/components/common/ToolTip';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { useTicketFollow } from '@/api/hooks/ticket/ticket';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { useState as useHookState } from 'react';
import { Alert } from '@/components/common/Alert';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

const FollowCell = ({ row }: { row: { original: CrmTicketItem } }) => {
  const [isOpen, setIsOpen] = useHookState(false);
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
      <Ellipsis
        onClick={handleClick}
        className={cn(row.original.isFollow === 1 ? 'text-yellow-400' : '')}
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

type Props = {
  mode: TicketTabsParams;
  setOtherParams: Dispatch<SetStateAction<Omit<CrmTicketParams, keyof BasicParams>>>;
  otherParams: Omit<CrmTicketParams, keyof BasicParams>;
  onReset: () => void;
};

export const GenericTicketList: React.FC<Props> = ({
  mode,
  otherParams,
  setOtherParams,
  onReset,
}) => {
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState('');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const params = useMemo(
    () => ({
      pageSize,
      pageNum: pageNum + 1,
      orderByColumn: '',
      isAsc: 'asc',
      ...otherParams,
    }),
    [pageNum, pageSize, otherParams],
  );

  const { data, isLoading: loading } = useMyTicketAllList(params, mode);

  const reset = useCallback(() => {
    onReset();
    setKeyword('');
    setPageNum(0);
    setPageSize(10);
  }, [onReset]);

  const showStatus = useMemo(() => {
    switch (mode) {
      case 'all':
        return true;
      case 'unprocessed':
        return false;
      case 'processing':
        return false;
      case 'concerned':
        return true;
      case 'ccme':
        return true;
      case 'created':
        return true;
    }
  }, [mode]);

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
    ...(showStatus
      ? [
          {
            id: 'status',
            header: t('common.status'),
            cell: ({ row }: { row: { original: CrmTicketItem } }) => {
              if ([0, 1, 2].includes(row.original.status)) {
                return <div>{t(`ticketList.statusOptions.${row.original.status}`)}</div>;
              }
              return '-';
            },
          },
        ]
      : []),
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
    useColumnVisibility(`my-tickets-${mode}-table`, allColumns);

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
            <MyTicketsForm
              params={otherParams}
              reset={reset}
              setParams={setOtherParams}
              showStatus={showStatus}
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
        data={data?.rows || []}
        pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={loading}
      />
    </TableContentWrapper>
  );
};
