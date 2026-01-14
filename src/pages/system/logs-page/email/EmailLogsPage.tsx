import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEmailList, EmailListParams, EmailListItem } from '@/api/hooks/system';
import { BasicParams } from '@/api/hooks/review/types';
import { EmailLogsForm } from './EmailLogsForm';
import dayjs from 'dayjs';
import { PageInfo } from '@/components/common/PageInfo';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { CRMColumnDef, DataTable } from '@/components/table';
import { RrhTag } from '@/components/common/RrhTag';
import { ToolTip } from '@/components/common/ToolTip';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

export const EmailLogsPage = () => {
  const [params, setParams] = useState<EmailListParams['params']>({
    sendEndTime: '',
    sendStartTime: dayjs(new Date()).format('YYYY-MM-DD'),
  });
  const [otherParams, setOtherParams] = useState<
    Omit<EmailListParams, 'params' | keyof BasicParams>
  >({
    title: '',
    acceptEmail: '',
    status: '',
  });

  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const { t } = useTranslation();

  const { data, isLoading } = useEmailList({
    orderByColumn: '',
    isAsc: 'asc',
    pageNum: pageNum + 1,
    pageSize,
    ...otherParams,
    params: {
      ...params,
    },
  });
  const reset = () => {
    setParams({
      sendEndTime: '',
      sendStartTime: '',
    });
    setOtherParams({
      title: '',
      acceptEmail: '',
      status: '',
    });
    setKeyword('');
    setPageNum(0);
  };
  const allColumns: CRMColumnDef<EmailListItem, unknown>[] = [
    {
      id: 'No.',
      header: t('CRMAccountPage.Index'),
      cell: ({ row }) => row.index + 1,
    },
    {
      id: 'acceptEmail',
      header: t('table.acceptEmail'),
      accessorFn: row => row.acceptEmailStr,
    },
    {
      id: 'title',
      header: t('table.title'),
      accessorFn: row => row.title,
    },
    {
      id: 'sendEmailAddress',
      header: t('table.sendEmailAddress'),
      accessorFn: row => row.sendEmailStr,
    },
    {
      id: 'status',
      header: t('common.status'), // 0: buy, 1: sell
      cell: ({ row }) => {
        switch (row.original.status) {
          case 1:
            return <RrhTag type="success">{t('common.success')}</RrhTag>;
          case -1:
            return <RrhTag type="error">{t('common.fail')}</RrhTag>;
          case 0:
            return <RrhTag type="warning">{t('table.notSend')}</RrhTag>;
        }
      },
    },
    {
      id: 'sendTime',
      header: t('table.sendTime'),
      accessorFn: row => row.sendTime,
    },
    {
      id: 'reason',
      header: t('table.reason'),
      cell: ({ row }) => {
        const exceedLength = row.original.remark && row.original.remark.length > 40;
        const reasonText = exceedLength
          ? row.original.remark?.slice(0, 40) + '...'
          : row.original.remark;
        return exceedLength ? (
          <ToolTip content={<div className="break-all">{row.original.remark}</div>}>
            <div>{reasonText}</div>
          </ToolTip>
        ) : (
          <div>{reasonText}</div>
        );
      },
    },
    {
      id: 'operate',
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      cell: ({ row }) => {
        const onClick = (data: EmailListItem) => {
          console.log('Operate on row:', data);
        };
        return (
          <div className="flex items-center gap-2">
            <RrhButton variant="ghost" onClick={() => onClick(row.original)}>
              {t('common.View')}
            </RrhButton>
            <RrhButton variant="ghost" onClick={() => onClick(row.original)}>
              {t('table.failedRecord')}
            </RrhButton>
            <RrhButton variant="ghost" onClick={() => onClick(row.original)}>
              {t('table.reSend')}
            </RrhButton>
          </div>
        );
      },
      fixed: 'right',
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('crm-user-login-table', allColumns);

  return (
    <div>
      <PageInfo title={t('emailLogsPage.title')} />
      <TableContentWrapper>
        <div className="my-3.5 flex items-center justify-between gap-2">
          <RrhInputWithIcon
            placeholder={t('common.pleaseInput', { field: t('table.acceptEmail') })}
            className="h-9"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            leftIcon={<Search className="size-4 cursor-pointer" />}
            onLeftIconClick={e => {
              setOtherParams(prev => ({ ...prev, acceptEmail: e }));
              setPageNum(0);
            }}
          />
          <div className="flex items-center gap-2">
            <RrhButton type="button">{t('emailLogsPage.reSendFailedEmailConfig')}</RrhButton>
            <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
              <RefreshCcw className="size-3.5" />
            </RrhButton>
            <RrhDrawer
              headerShow={false}
              asChild
              responsiveDirection={{
                mobile: 'bottom',
                desktop: 'right',
              }}
              footerShow={false}
              Trigger={
                <RrhButton variant="ghost" className="size-8">
                  <Funnel />
                </RrhButton>
              }
            >
              <EmailLogsForm
                setParams={setParams}
                setOtherParams={setOtherParams}
                loading={isLoading}
                reset={reset}
                params={params}
                otherParams={otherParams}
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
          loading={isLoading}
        />
      </TableContentWrapper>
    </div>
  );
};
