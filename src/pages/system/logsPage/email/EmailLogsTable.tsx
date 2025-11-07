import { EmailListItem } from '@/api/hooks/system';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhTag } from '@/components/common/RrhTag';
import { ToolTip } from '@/components/common/ToolTip';
import { DataTable } from '@/components/table/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

export const EmailLogsTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: EmailListItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const tradingHistoryColumns: ColumnDef<EmailListItem>[] = [
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
      header: t('common.Operation'),
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
    },
  ];
  return (
    <DataTable
      columns={tradingHistoryColumns}
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
