import { useMemo, useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { MsgListItem, GetMsgListParams, useGetMsgList, useRemoveMsg } from '@/api/hooks/message';
import { Funnel, Search, RefreshCcw, Ellipsis, ReceiptText, Plus } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhTag } from '@/components/common/RrhTag';
import { ToolTip } from '@/components/common/ToolTip';
import { infoTypesMap } from '@/lib/constant';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { MessageManagementForm } from './components/MessageManagementForm';
import { useDictType } from '@/api/hooks/system';
import { AddEditNewMessageDialog } from './components/AddEditNewMessageDialog';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { NewMessageDetailDialog } from './components/NewMessageDetailDialog';
import { useNavigate } from 'react-router-dom';

export function MessageManagementPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [resetKey, setResetKey] = useState(0);
  const [params, setParams] = useState<GetMsgListParams['params']>({
    fuzzyName: '',
    fuzzyTitle: '',
    sendEndTime: '',
    sendStartTime: '',
  });
  const [otherParams, setOtherParams] = useState<Omit<GetMsgListParams, 'params'>>({
    type: '',
  });
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [id, setId] = useState('');
  const { data: languageList, isLoading: languageLoading } = useDictType('sys_language');
  const {
    data: msgList,
    isLoading: msgListLoading,
    refetch,
  } = useGetMsgList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: '',
    ...otherParams,
    params: {
      ...params,
    },
  });

  const reset = () => {
    setParams({
      fuzzyName: '',
      fuzzyTitle: '',
      sendEndTime: '',
      sendStartTime: '',
    });
    setOtherParams({
      type: '',
    });
    setResetKey(k => k + 1);
    setPageNum(0);
    setPageSize(10);
  };

  const [deleteAlert, setDeleteAlert] = useState(false);
  const { mutateAsync: removeMsg } = useRemoveMsg();

  const allColumns: CRMColumnDef<MsgListItem, unknown>[] = [
    {
      id: 'No.',
      header: t('CRMAccountPage.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'title',
      header: t('table.title'),
      accessorFn: row => row.title,
      cell: ({ row }) => {
        return <div className="max-w-100 text-wrap">{row?.original?.title || '-'}</div>;
      },
    },
    {
      id: 'type',
      header: t('table.infoType'),
      cell: ({ row }) => {
        const key = infoTypesMap[row.original.type as keyof typeof infoTypesMap];
        return <div>{t(`messageManagement.${key}`)}</div>;
      },
    },
    {
      id: 'status',
      header: t('common.status'),
      cell: ({ row }) => {
        switch (row.original.status) {
          case -1:
            return <RrhTag type="error">{t('common.failedToSend')}</RrhTag>;
          case 0:
            return <RrhTag type="warning">{t('common.toBeSent')}</RrhTag>;
          case 1:
            return <RrhTag type="success">{t('common.hasBeenSent')}</RrhTag>;
          case 2:
            return <RrhTag type="info">{t('common.sending')}</RrhTag>;
        }
      },
    },
    {
      id: 'receiver',
      header: t('table.receiver'),
      cell: ({ row }) => {
        if (row.original.receive_type === 1) {
          return <div>{t('common.allCRMUsers')}</div>;
        } else {
          if (!row.original.allUser) {
            return <div>-</div>;
          }
          const isTooLong = row.original.allUser.length > 19;
          const content = isTooLong
            ? row.original.allUser.slice(0, 19) + '...'
            : row.original.allUser;
          return isTooLong ? (
            <ToolTip content={row.original.allUser}>
              <div>{content}</div>
            </ToolTip>
          ) : (
            <div>{content}</div>
          );
        }
      },
    },
    {
      id: 'sendTime',
      header: t('table.sendTime'),
      accessorFn: row => row.send_time,
      cell: ({ row }) => row?.original?.send_time || '-',
    },
    {
      id: 'submitter',
      header: t('table.submitter'),
      cell: ({ row }) => {
        return <div>{row.original.user_last_name + ' ' + row.original.user_name}</div>;
      },
    },
    {
      id: 'operate',
      header: t('common.Operation'),
      cell: ({ row }) => {
        return (
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('common.View'), value: 'view' },
              { label: t('table.sendAgain'), value: 'sendAgain' },
              { label: t('common.delete'), value: 'delete' },
            ]}
            callToAction={action => {
              setId(row.original.id || '');
              switch (action) {
                case 'view':
                  setDetailOpen(true);
                  break;
                case 'sendAgain':
                  setEditOpen(true);
                  break;
                case 'delete':
                  setDeleteAlert(true);
                  break;
              }
            }}
          />
        );
      },
      fixed: 'right',
      size: 50,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('message-management-table', allColumns);

  const languageOptions = useMemo(
    () =>
      languageList?.map(i => ({
        label: i.dictLabel,
        value: i.dictValue,
      })) || [],
    [languageList],
  );

  return (
    <div>
      <PageInfo title={t('messageManagement.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              key={resetKey}
              placeholder={t('common.pleaseInput', { field: t('table.title') })}
              className="h-9"
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={value => {
                setParams(prev => ({ ...prev, fuzzyTitle: value }));
                setPageNum(0);
              }}
            />
          </div>
          <div className="flex items-center gap-2">
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
              <MessageManagementForm
                reset={reset}
                params={params}
                otherParams={otherParams}
                setParams={setParams}
                setOtherParams={setOtherParams}
                loading={msgListLoading}
              />
            </RrhDrawer>
            <ColumnVisibilityButton
              columnMeta={columnMeta}
              visibleColumns={visibleColumns}
              onToggle={toggleColumn}
              onBatchReorder={batchUpdateColumns}
              columns={columns}
            />
            <AddEditNewMessageDialog
              trigger={
                <RrhButton type="button" Icon={<Plus className="size-3.5" />}>
                  {t('common.add')}
                </RrhButton>
              }
              mode="add"
              title={t('messageManagement.addMsg')}
              onSuccess={refetch}
              languageOptions={languageOptions}
            />
            <RrhButton
              type="button"
              Icon={<ReceiptText className="size-3.5" />}
              onClick={() => {
                navigate('/message/msgTemplate');
              }}
            >
              {t('messageManagement.messageTemplate')}
            </RrhButton>
          </div>
        </div>
        <DataTable
          columns={tableColumns}
          data={msgList?.rows || []}
          pageCount={Math.ceil(+(msgList?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={msgListLoading || languageLoading}
        />
        <AddEditNewMessageDialog
          mode="edit"
          title={t('messageManagement.resend')}
          open={editOpen}
          onOpenChange={v => {
            if (!v) setId('');
            setEditOpen(v);
          }}
          id={id}
          onSuccess={refetch}
          languageOptions={languageOptions}
        />
        <RrhDeleteAlert<{
          ids: string;
        }>
          open={deleteAlert}
          setOpen={setDeleteAlert}
          onSuccess={refetch}
          confirmFunction={removeMsg}
          params={{ ids: id || '' }}
          tipsText={t('messageManagement.deleteMsg')}
        />
        <NewMessageDetailDialog open={detailOpen} setOpen={setDetailOpen} id={id || ''} />
      </TableContentWrapper>
    </div>
  );
}
