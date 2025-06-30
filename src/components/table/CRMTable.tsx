import { ColumnDef, Row } from '@tanstack/react-table';
import { DataTable } from './DataTable';
import { CrmUserItem } from '@/api/hooks/system/types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '../ui/switch';
import { Alert } from '../common/Alert';
import { useCallback, useState } from 'react';
import { useChangeUserStatus } from '@/api/hooks/system/system';
import { useQueryClient } from '@tanstack/react-query';
import { Checkbox } from '@/components/ui/checkbox';

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
        className="cursor-pointer bg-white data-[state=checked]:bg-blue-500"
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
  const crmColumns: ColumnDef<CrmUserItem>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          className="data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500"
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
          className="data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500"
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'userName',
      header: 'userName',
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
      header: 'Status',
      cell: ({ row }) => <StatusCell row={row} />,
    },
    {
      id: 'mobile',
      header: 'Mobile',
      cell: ({ row }) => (
        <div className="max-w-25 whitespace-pre-wrap">
          <span>{row.original.mzone ? `+${row.original.mzone} ` : ''}</span>
          <span>{row.original.mobile}</span>
        </div>
      ),
    },
    {
      accessorKey: 'accountTypeStr',
      header: 'CRM Account Type',
    },
    {
      accessorKey: 'role',
      header: 'Role',
    },
    {
      accessorKey: 'crmRebateLevel',
      header: 'Level',
    },
    {
      id: 'tags',
      header: 'Tags Name',
      accessorFn: row => row.tags,
      cell: ({ row }) => {
        const tagsString = row.original.tags || '';
        // Only split if we have non-empty string
        const tags = tagsString.trim() ? tagsString.split(',') : [];
        const length = tags.length;
        if (length === 0) return <div>-</div>;
        return (
          <div className="flex max-w-50 flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="rounded-md bg-blue-500 p-1 text-white">
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
            <div>latestFollowupTime</div>
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
      header: 'Register Time',
      cell: ({ row }) => {
        return <div className="max-w-25 whitespace-pre-wrap">{row.original.createTime}</div>;
      },
    },
    {
      id: 'upper',
      header: 'Upper',
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
      header: 'Upper Email',
    },
    {
      accessorKey: 'mtone',
      header: 'Real Account',
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
      header: 'Demo Account',
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
      header: 'Operation',
      cell: () => (
        <div>
          <button className="btn btn-primary">Edit</button>
          <button className="btn btn-secondary">View</button>
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
  ); // Replace with actual data
};
