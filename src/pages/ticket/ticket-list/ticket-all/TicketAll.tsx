import { useState, useRef, useCallback } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { useTicketList, useTicketRemove } from '@/api/hooks/ticket/ticket';
import { TicketAllListForm } from './TicketAllListForm';
import { Funnel, Search, RefreshCcw, Ellipsis } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { useRoleList, useUserList } from '@/api/hooks/system';
import { CRMColumnDef, DataTable, DataTableRef } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/types';
import { CrmTicketParams, CrmTicketItem } from '@/api/hooks/ticket/types';
import { ToolTip } from '@/components/common/ToolTip';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { useTicketFollow } from '@/api/hooks/ticket/ticket';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { toast } from 'sonner';
import { AssignOrderDialog } from '../components/AssignOrderDialog';
import { Checkbox } from '@/components/ui/checkbox';
import { CancelOrderDialog } from '../components/CancelOrderDialog';
import { CloseOrderDialog } from '../components/CloseOrderDialog';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { AddTicketDialog } from '../components/AddTicketDialog';
import { RrhFollowAlert } from '@/components/common/RrhFollowAlert';
import { useTabActions } from '@/hooks/useTabActions';

export const TicketAll = () => {
  const { t } = useTranslation();
  const [resetKey, setResetKey] = useState(0);
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
  const { mutateAsync: modifyStatus } = useTicketFollow();

  const {
    data: ticketData,
    isLoading: ticketLoading,
    refetch,
  } = useTicketList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
  });
  const { data: userData, isLoading: userDataLoading } = useUserList();
  const { data: roleData, isLoading: roleDataLoading } = useRoleList();

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
    setResetKey(k => k + 1);
    setPageNum(0);
    setPageSize(10);
  };

  const { openTab } = useTabActions();

  const goToDetail = useCallback(
    (row: CrmTicketItem) => {
      const url = `/ticket/detail?id=${row.id}`;
      openTab({
        key: url,
        title: t('ticketList.ticketDetail'),
        path: url,
      });
    },
    [openTab, t],
  );

  const allColumns: CRMColumnDef<CrmTicketItem, unknown>[] = [
    {
      id: 'select',
      label: t('table.select'),
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'No.',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'isFollow',
      header: t('ticketList.isFollow'),
      cell: ({ row }) => {
        return (
          <RrhFollowAlert<{
            id: string;
            follow: number;
          }>
            params={{
              id: String(row.original.id),
              follow: row.original.isFollow === 1 ? 0 : 1,
            }}
            tipsText={row.original.isFollow === 1 ? t('ticketList.confirm.stop') : ''}
            checked={row.original.isFollow === 1}
            confirmFunction={modifyStatus}
            onSuccess={refetch}
          />
        );
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
      header: t('table.status'),
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
      cell: ({ row }) => (
        <RrhDropdown
          Trigger={<Ellipsis className="size-4" />}
          dropdownList={[
            { label: t('common.View'), value: 'view' },
            { label: t('common.delete'), value: 'delete' },
          ]}
          callToAction={action => {
            if (action === 'view') {
              goToDetail(row.original);
            } else if (action === 'delete') {
              setParams({ ids: row.original.id ? String(row.original.id) : '' });
              setTipsText(t('ticketList.deleteTips'));
              setDeleteAlert(true);
            }
          }}
        />
      ),
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('ticket-all-list-table', allColumns);

  const tableRef = useRef<DataTableRef>(null);
  const [ids, setIds] = useState<string[]>([]);
  type DialogKey = 'AssignOrder' | 'CancelOrder' | 'CloseOrder' | null;
  const [openDialog, setOpenDialog] = useState<DialogKey>(null);

  const onSelectionChange = (its: CrmTicketItem[]) => {
    const ids = its.filter(i => i.id).map(j => j.id || '');
    setIds(ids);
  };

  const onSuccess = () => {
    setIds([]);
    tableRef.current?.selectionClear?.();
    refetch();
  };

  const [params, setParams] = useState<{ ids: string }>({ ids: '' });
  const [tipsText, setTipsText] = useState('');
  const [deleteAlert, setDeleteAlert] = useState(false);
  const { mutateAsync: removeTicket } = useTicketRemove();

  return (
    <TableContentWrapper className="grid gap-3">
      <div className="flex flex-wrap justify-between gap-2">
        <RrhInputWithIcon
          key={resetKey}
          placeholder={t('common.pleaseInput', { field: t('ticketList.orderId') })}
          className="h-9"
          leftIcon={<Search className="size-4" />}
          onLeftIconClick={value => {
            setOtherParams(prev => ({ ...prev, orderId: value }));
            setPageNum(0);
          }}
        />
        <div className="flex flex-wrap items-center gap-2">
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
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('ticketList.assignTicket'), value: 'AssignOrder' },
              { label: t('ticketList.cancelAssign'), value: 'CancelOrder' },
              { label: t('ticketList.closeTicket'), value: 'CloseOrder' },
              { label: t('common.delete'), value: 'delete' },
            ]}
            callToAction={action => {
              if (ids && ids?.length === 0) {
                toast.error(t('ticketList.atLeastOneTicket'));
                return;
              }
              if (action === 'delete') {
                setTipsText(t('ticketList.deleteSelectedTips', { count: ids.length }));
                setParams({ ids: ids.join(',') });
                setDeleteAlert(true);
                return;
              }
              setOpenDialog(action as DialogKey);
            }}
          />
          <ColumnVisibilityButton
            columnMeta={columnMeta}
            visibleColumns={visibleColumns}
            onToggle={toggleColumn}
            onBatchReorder={batchUpdateColumns}
            columns={columns}
          />
          <AddTicketDialog
            onSuccess={refetch}
            roleOptions={(roleData?.rows || []).map(i => ({ label: i.roleName, value: i.roleId }))}
            userOptions={(userData?.rows || []).map(i => ({
              label: `${i.userLastName || ''} ${i.userName || ''}`,
              value: i.userId,
            }))}
          />
        </div>
      </div>
      <DataTable
        ref={tableRef}
        columns={tableColumns}
        data={ticketData?.rows || []}
        pageCount={Math.ceil(+(ticketData?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={ticketLoading || userDataLoading || roleDataLoading}
        onSelectionChange={onSelectionChange}
      />
      <AssignOrderDialog
        onSuccess={onSuccess}
        ids={ids}
        open={openDialog === 'AssignOrder'}
        setOpen={val => (val ? setOpenDialog('AssignOrder') : setOpenDialog(null))}
        roleOptions={(roleData?.rows || []).map(i => ({ label: i.roleName, value: i.roleId }))}
      />
      <CancelOrderDialog
        onSuccess={onSuccess}
        ids={ids}
        open={openDialog === 'CancelOrder'}
        setOpen={val => (val ? setOpenDialog('CancelOrder') : setOpenDialog(null))}
      />
      <CloseOrderDialog
        onSuccess={onSuccess}
        ids={ids}
        open={openDialog === 'CloseOrder'}
        setOpen={val => (val ? setOpenDialog('CloseOrder') : setOpenDialog(null))}
      />
      <RrhDeleteAlert<{
        ids: string;
      }>
        open={deleteAlert}
        setOpen={setDeleteAlert}
        onSuccess={onSuccess}
        confirmFunction={removeTicket}
        params={params}
        tipsText={tipsText}
      />
    </TableContentWrapper>
  );
};
