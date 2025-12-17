import { useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { MsgListItem, GetMsgListParams, useGetMsgList } from '@/api/hooks/message';
import { MessageManagementForm } from './MessageManagementForm';
import { Funnel, Search, RefreshCcw, Ellipsis } from 'lucide-react';
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

export function MessageManagementPage() {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [params, setParams] = useState<GetMsgListParams['params']>({
    fuzzyName: '',
    fuzzyTitle: '',
    sendEndTime: '',
    sendStartTime: '',
  });
  const [otherParams, setOtherParams] = useState<Omit<GetMsgListParams, 'params'>>({
    type: '',
  });

  const { data: msgList, isLoading: msgListLoading } = useGetMsgList({
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
    setKeyword('');
    setPageNum(0);
    setPageSize(10);
  };

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
      cell: () => {
        // TODO: need to add view detail page later
        return (
          <div>
            <RrhDropdown
              Trigger={<Ellipsis className="size-4" />}
              dropdownList={[
                { label: t('common.View'), value: 'view' },
                { label: t('table.sendAgain'), value: 'sendAgain' },
                { label: t('common.delete'), value: 'delete' },
              ]}
              callToAction={() => {}}
            />
          </div>
        );
      },
      fixed: 'right',
      size: 50,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('message-management-table', allColumns);

  return (
    <div>
      <PageInfo title={t('messageManagement.title')} />
      <div className="mt-3.5 mb-3.5 flex justify-between">
        <div className="w-67 max-w-sm">
          <RrhInputWithIcon
            placeholder={t('common.pleaseInput', { field: t('table.title') })}
            className="h-9"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            rightIcon={<Search className="size-4" />}
            onRightIconClick={() => {
              setParams(prev => ({ ...prev, fuzzyTitle: keyword }));
              setPageNum(0);
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <RrhButton onClick={reset}>{t('common.add')}</RrhButton>
          <RrhButton variant="outline">{t('messageManagement.messageTempate')}</RrhButton>
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
        loading={msgListLoading}
        tdCls="text-center"
        thCls="text-center"
      />
    </div>
  );
}
