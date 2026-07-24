import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEmailFailList } from '@/api/hooks/system';
import { EmailFailListItem } from '@/api/hooks/system/types';
import { RrhDialog } from '@/components/common/RrhDialog';
import { CRMColumnDef, DataTable } from '@/components/table';

export const FailedRecordDialog = ({
  open,
  setOpen,
  userMsgId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  userMsgId: string;
}) => {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);

  const { data, isLoading } = useEmailFailList(
    userMsgId,
    {
      enabled: !!userMsgId && open,
    },
    {
      pageNum: pageNum + 1,
      orderByColumn: '',
      isAsc: 'asc',
    },
  );

  const columns = useMemo<CRMColumnDef<EmailFailListItem, unknown>[]>(
    () => [
      {
        id: 'index',
        header: t('CRMAccountPage.Index'),
        cell: ({ row }) => row.index + 1,
      },
      {
        id: 'sendEmail',
        header: t('table.sendEmailAddress'),
        accessorFn: row => row.sendEmail,
      },
      {
        id: 'sendTime',
        header: t('table.sendTime'),
        accessorFn: row => row.createTime,
      },
      {
        id: 'reason',
        header: t('table.reason'),
        accessorFn: row => row.result,
      },
    ],
    [t],
  );

  return (
    <RrhDialog
      title={t('table.failedRecord')}
      open={open}
      onOpenChange={setOpen}
      onCancel={() => {
        setOpen(false);
      }}
      variant="large"
      type="view"
      confirmShow={false}
      formLoading={isLoading}
    >
      <DataTable
        columns={columns}
        data={data?.rows || []}
        pageCount={Math.max(1, Math.ceil(+(data?.total || 0) / 10))}
        pageIndex={pageNum}
        pageSize={10}
        onPageChange={setPageNum}
        loading={isLoading}
      />
    </RrhDialog>
  );
};
