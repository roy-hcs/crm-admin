import { MsgListItem } from '@/api/hooks/message';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhTag } from '@/components/common/RrhTag';
import { ToolTip } from '@/components/common/ToolTip';
import { DataTable } from '@/components/table/DataTable';
import { infoTypesMap } from '@/lib/constant';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

export const MessageManagementTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  data: MsgListItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const msgListColumns: ColumnDef<MsgListItem>[] = [
    {
      id: 'No.',
      header: t('CRMAccountPage.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'title',
      header: t('table.title'),
      accessorFn: row => row.title,
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
            <RrhButton variant="ghost">{t('common.View')}</RrhButton>
            <RrhButton variant="ghost">{t('table.sendAgain')}</RrhButton>
            <RrhButton variant="ghost">{t('common.delete')}</RrhButton>
          </div>
        );
      },
    },
  ];
  return (
    <DataTable
      columns={msgListColumns}
      data={data}
      pageCount={pageCount}
      pageSize={pageSize}
      pageIndex={pageIndex}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      loading={loading}
      tdCls="text-center"
      thCls="text-center"
    />
  );
};
