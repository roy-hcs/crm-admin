import { ColumnDef, Row } from '@tanstack/react-table';
import { DataTable } from './DataTable';
import { CrmUserItem } from '@/api/hooks/system/types';
import { ChevronDown, ChevronUp, Ellipsis } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '../ui/switch';
import { Alert } from '../common/Alert';
import { useCallback, useState } from 'react';
import { useChangeUserStatus } from '@/api/hooks/system/system';
import { useQueryClient } from '@tanstack/react-query';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from 'react-i18next';
import { RrhDropdown } from '../common/RrhDropdown';

const StatusCell = ({ row }: { row: Row<CrmUserItem> }) => {
  const [isOpen, setIsOpen] = useState(false);
  const changeStatusMutation = useChangeUserStatus();
  const queryClient = useQueryClient();

  const onConfirm = useCallback(async () => {
    const res = await changeStatusMutation.mutateAsync({
      id: row.original.id,
      status: row.original.status === 1 ? 0 : 1, // Toggle status
    });
    if (res.code === 0) {
      // get table list with current filters
      queryClient.invalidateQueries({ queryKey: ['crmUser'] });
    }
  }, [changeStatusMutation, queryClient, row.original.id, row.original.status]);

  return (
    <>
      <Switch
        className="cursor-pointer bg-white data-[state=checked]:bg-[#1E1E1E]"
        checked={row.original.status === 1}
        onClick={() => setIsOpen(true)}
      />
      <Alert
        trigger={null}
        open={isOpen}
        onOpenChange={setIsOpen}
        cancelText="取消"
        confirmText={'确认'}
        title={'系统提示'}
        content={row.original.status === 1 ? '确认要停用该账户吗？' : '确认要启用该账户吗？'}
        onConfirm={onConfirm}
      />
    </>
  );
};

export const CRMTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  isAsc,
  setIsAsc,
}: {
  data: CrmUserItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  isAsc: 'asc' | 'desc';
  setIsAsc: (isAsc: 'asc' | 'desc') => void;
}) => {
  const { t } = useTranslation();
  const crmColumns: ColumnDef<CrmUserItem>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          className="data-[state=checked]:border-blue-500 data-[state=checked]:bg-[#1E1E1E]"
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
          className="data-[state=checked]:border-blue-500 data-[state=checked]:bg-[#1E1E1E]"
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
      header: t('Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'userName',
      header: t('User Name'),
      accessorFn: row => row.userName,
      cell: ({ row }) => (
        <div>
          <div>{row.original.userName}</div>
          <div>{row.original.showId}</div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: t('Status'),
      cell: ({ row }) => <StatusCell row={row} />,
    },
    {
      id: 'mobile',
      header: t('Mobile'),
      cell: ({ row }) => (
        <div className="max-w-25 whitespace-pre-wrap">
          <span>{row.original.mzone ? `+${row.original.mzone} ` : ''}</span>
          <span>{row.original.mobile}</span>
        </div>
      ),
    },
    {
      accessorKey: 'accountTypeStr',
      header: t('CRM Account Type'),
    },
    {
      accessorKey: 'role',
      header: t('Role'),
    },
    {
      accessorKey: 'crmRebateLevel',
      header: t('Level'),
    },
    {
      id: 'tags',
      header: t('Tags Name'),
      accessorFn: row => row.tags,
      cell: ({ row }) => {
        const tagsString = row.original.tags || '';
        // Only split if we have non-empty string
        const tags = tagsString.trim() ? tagsString.split(',') : [];
        const length = tags.length;
        if (length === 0) return <div>-</div>;
        return (
          <div className="flex max-w-50 flex-wrap items-center gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="border-[#E2E8F0 rounded-md border p-1 text-[#1E1E1E]">
                {tag}
              </span>
            ))}
            <span>{length > 3 ? `+${length - 3}` : ''}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'latestFollowupTime',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('Latest Followup Time')}</div>
            <button
              className="gap-.5 flex cursor-pointer flex-col"
              onClick={() => setIsAsc(isAsc === 'asc' ? 'desc' : 'asc')}
            >
              <ChevronUp className={cn('h-3 w-3', isAsc === 'asc' ? '' : 'opacity-50')} />
              <ChevronDown className={cn('h-3 w-3', isAsc === 'asc' ? 'opacity-50' : '')} />
            </button>
          </div>
        );
      },
      cell: ({ row }) => {
        const latestFollowupTime = row.original.latestFollowupTime || '-';
        return (
          <div className="max-w-25 whitespace-pre-wrap">
            <div>{latestFollowupTime}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'createTime',
      header: t('Register Time'),
      cell: ({ row }) => {
        return <div className="max-w-25 whitespace-pre-wrap">{row.original.createTime}</div>;
      },
    },
    {
      id: 'upper',
      header: t('Upper'),
      accessorFn: row => row.nameOne + row.nameTwo,
      cell: ({ row }) => {
        if (!row.original.nameOne && !row.original.nameTwo) return <div>-</div>;
        return (
          <div>
            <div>{row.original.nameOne}</div>
            <div>{row.original.nameTwo}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'inviterEmail',
      header: t('Upper Email'),
    },
    {
      accessorKey: 'mtone',
      header: t('Real Account'),
      cell: ({ row }) => {
        const account = row.original.mtone || '-';
        return (
          <div className="line-clamp-1 w-22.5 text-ellipsis" title={account}>
            {account}
          </div>
        );
      },
    },
    {
      accessorKey: 'mttwo',
      header: t('Demo Account'),
      cell: ({ row }) => {
        const account = row.original.mttwo || '-';
        return (
          <div className="line-clamp-1 w-22.5 text-ellipsis" title={account}>
            {account}
          </div>
        );
      },
    },
    {
      id: 'operation',
      header: t('Operation'),
      cell: () => (
        <div>
          <RrhDropdown
            Trigger={<Ellipsis />}
            dropdownList={[
              { label: t('Edit'), value: 'edit' },
              { label: t('View'), value: 'view' },
            ]}
            callToAction={action => {
              if (action === 'edit') {
                // Handle edit action
              } else if (action === 'view') {
                // Handle view action
              }
            }}
          />
        </div>
      ),
    },
  ];
  return (
    <DataTable
      columns={crmColumns}
      data={data}
      pageCount={pageCount}
      pageIndex={pageIndex}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      loading={loading}
      thCls="text-center text-[13px]"
      tdCls="text-center text-xs"
    />
  );
};
