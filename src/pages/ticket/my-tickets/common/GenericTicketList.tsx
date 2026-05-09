import React, { useState, useCallback, useMemo, Dispatch, SetStateAction, useRef } from 'react';
import { useMyTicketAllList, useTicketRemove } from '@/api/hooks/ticket/ticket';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Button } from '@/components/ui/button';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { useTranslation } from 'react-i18next';
import { CrmTicketParams, TicketTabsParams, CrmTicketItem } from '@/api/hooks/ticket/types';
import { BasicParams } from '@/api/types';
import { Funnel, RefreshCcw, Search, Ellipsis } from 'lucide-react';
import { MyTicketsForm } from '../MyTicketsForm';
import { CRMColumnDef, DataTable, DataTableRef } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { ToolTip } from '@/components/common/ToolTip';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { useTicketFollow } from '@/api/hooks/ticket/ticket';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { RrhFollowAlert } from '@/components/common/RrhFollowAlert';
import { AddTicketDialog } from '../../ticket-list/components/AddTicketDialog';
import { useRoleList, useUserList } from '@/api/hooks/system';
import { toast } from 'sonner';
import { CloseOrderDialog } from '../../ticket-list/components/CloseOrderDialog';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { useTabActions } from '@/hooks/useTabActions';

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
  const [resetKey, setResetKey] = useState(0);
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const listParams = useMemo(
    () => ({
      pageSize,
      pageNum: pageNum + 1,
      orderByColumn: '',
      isAsc: 'asc',
      ...otherParams,
    }),
    [pageNum, pageSize, otherParams],
  );

  const { data, isLoading: loading, refetch } = useMyTicketAllList(listParams, mode);
  const { mutateAsync: modifyStatus } = useTicketFollow();

  const { data: userData, isLoading: userDataLoading } = useUserList();
  const { data: roleData, isLoading: roleDataLoading } = useRoleList();

  const reset = useCallback(() => {
    onReset();
    setResetKey(k => k + 1);
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
    useColumnVisibility(`my-tickets-${mode}-table`, allColumns);

  const tableRef = useRef<DataTableRef>(null);
  const [ids, setIds] = useState<string[]>([]);
  type DialogKey = 'CloseOrder' | null;
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
    <TableContentWrapper>
      <div className="mb-3 flex flex-wrap justify-between gap-2">
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
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
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
        data={data?.rows || []}
        pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={loading || userDataLoading || roleDataLoading}
        onSelectionChange={onSelectionChange}
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
