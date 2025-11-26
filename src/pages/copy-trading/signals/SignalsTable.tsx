import { useChangeMamSignalSource } from '@/api/hooks/copyTrading';
import { MamSignalSourceItem, OrderByColumn } from '@/api/hooks/copyTrading/type';
import { Alert } from '@/components/common/Alert';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { DataTable } from '@/components/table/DataTable';
import { Switch } from '@/components/ui/switch';
import { SignalStatusOptions } from '@/lib/const';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef, Row } from '@tanstack/react-table';
import { ChevronDown, ChevronUp, Ellipsis } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

const StatusCell = ({ row }: { row: Row<MamSignalSourceItem> }) => {
  const [isOpen, setIsOpen] = useState(false);
  const changeMamSignalSource = useChangeMamSignalSource();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const onConfirm = useCallback(async () => {
    const res = await changeMamSignalSource.mutateAsync({
      id: row.original.id,
      publicShow: row.original.publicShow === 1 ? 0 : 1,
    });
    if (res.code === 0) {
      queryClient.invalidateQueries({ queryKey: ['mamSignalSourceList'] });
    }
  }, [changeMamSignalSource, queryClient, row.original.id, row.original.publicShow]);

  return (
    <>
      <Switch
        className="cursor-pointer bg-white data-[state=checked]:bg-slate-700"
        checked={row.original.publicShow === 1}
        onClick={() => setIsOpen(true)}
      />
      <Alert
        trigger={null}
        open={isOpen}
        onOpenChange={setIsOpen}
        cancelText={t('common.Cancel')}
        confirmText={t('common.Confirm')}
        title={t('common.SystemPrompt')}
        content={
          row.original.publicShow === 1 ? t('signals.confirm.stop') : t('signals.confirm.open')
        }
        onConfirm={onConfirm}
      />
    </>
  );
};

export const SignalsTable = ({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  isAsc,
  setIsAsc,
  orderByColumn,
  setOrderByColumn,
}: {
  data: MamSignalSourceItem[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  isAsc: 'asc' | 'desc' | '';
  setIsAsc: (isAsc: 'asc' | 'desc' | '') => void;
  orderByColumn: OrderByColumn;
  setOrderByColumn: (orderByColumn: OrderByColumn) => void;
}) => {
  const { t } = useTranslation();
  const columns: ColumnDef<MamSignalSourceItem>[] = [
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'name',
      header: t('signals.name'),
      cell: ({ row }) => row?.original?.name || '-',
    },
    {
      id: 'userName',
      header: t('signals.signalSourceAuthor'),
      cell: ({ row }) => {
        return (
          <div>
            <div>
              <span>{row?.original?.userLastName}</span>
              <span>{row?.original?.userName}</span>
            </div>
            <span> {row?.original?.email}</span>
          </div>
        );
      },
    },
    {
      id: 'userName',
      header: t('table.tradingAccount'),
      cell: ({ row }) => {
        return (
          <div>
            <div>
              <span>{row?.original?.account}</span>
            </div>
            <span> {row?.original?.server}</span>
          </div>
        );
      },
    },
    {
      id: 'totalProfit',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('signals.totalProfit')}</div>
            <button
              className="gap-.5 flex cursor-pointer flex-col"
              onClick={() => {
                setIsAsc(isAsc === 'asc' ? 'desc' : 'asc');
                setOrderByColumn('totalProfit');
              }}
            >
              {orderByColumn === 'totalProfit' ? (
                <>
                  <ChevronUp className={cn('h-3 w-3', isAsc === 'asc' ? '' : 'opacity-50')} />
                  <ChevronDown className={cn('h-3 w-3', isAsc === 'asc' ? 'opacity-50' : '')} />
                </>
              ) : (
                <>
                  <ChevronUp className="h-3 w-3" />
                  <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          </div>
        );
      },
      cell: ({ row }) => row?.original?.totalProfit || '-',
    },
    {
      id: 'totalProfitRate',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('signals.totalProfitRate')}</div>
            <button
              className="gap-.5 flex cursor-pointer flex-col"
              onClick={() => {
                setIsAsc(isAsc === 'asc' ? 'desc' : 'asc');
                setOrderByColumn('totalProfitRate');
              }}
            >
              {orderByColumn === 'totalProfitRate' ? (
                <>
                  <ChevronUp className={cn('h-3 w-3', isAsc === 'asc' ? '' : 'opacity-50')} />
                  <ChevronDown className={cn('h-3 w-3', isAsc === 'asc' ? 'opacity-50' : '')} />
                </>
              ) : (
                <>
                  <ChevronUp className="h-3 w-3" />
                  <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          </div>
        );
      },
      cell: ({ row }) => row?.original?.totalProfitRate || '-',
    },
    {
      id: 'subscribeFee',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('signals.subscribeFee')}</div>
            <button
              className="gap-.5 flex cursor-pointer flex-col"
              onClick={() => {
                setIsAsc(isAsc === 'asc' ? 'desc' : 'asc');
                setOrderByColumn('subscribeFee');
              }}
            >
              {orderByColumn === 'subscribeFee' ? (
                <>
                  <ChevronUp className={cn('h-3 w-3', isAsc === 'asc' ? '' : 'opacity-50')} />
                  <ChevronDown className={cn('h-3 w-3', isAsc === 'asc' ? 'opacity-50' : '')} />
                </>
              ) : (
                <>
                  <ChevronUp className="h-3 w-3" />
                  <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          </div>
        );
      },
      cell: ({ row }) => row?.original?.subscribeFee || '-',
    },
    {
      id: 'subscribeNum',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('signals.subscribeNum')}</div>
            <button
              className="gap-.5 flex cursor-pointer flex-col"
              onClick={() => {
                setIsAsc(isAsc === 'asc' ? 'desc' : 'asc');
                setOrderByColumn('subscribeNum');
              }}
            >
              {orderByColumn === 'subscribeNum' ? (
                <>
                  <ChevronUp className={cn('h-3 w-3', isAsc === 'asc' ? '' : 'opacity-50')} />
                  <ChevronDown className={cn('h-3 w-3', isAsc === 'asc' ? 'opacity-50' : '')} />
                </>
              ) : (
                <>
                  <ChevronUp className="h-3 w-3" />
                  <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          </div>
        );
      },
      cell: ({ row }) => row?.original?.subscribeNum || '-',
    },
    {
      id: 'publicShow',
      header: t('signals.publicShow'),
      cell: ({ row }) => <StatusCell row={row} />,
    },
    {
      id: 'status',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.status')}</div>
            <button
              className="gap-.5 flex cursor-pointer flex-col"
              onClick={() => {
                setIsAsc(isAsc === 'asc' ? 'desc' : 'asc');
                setOrderByColumn('status');
              }}
            >
              {orderByColumn === 'status' ? (
                <>
                  <ChevronUp className={cn('h-3 w-3', isAsc === 'asc' ? '' : 'opacity-50')} />
                  <ChevronDown className={cn('h-3 w-3', isAsc === 'asc' ? 'opacity-50' : '')} />
                </>
              ) : (
                <>
                  <ChevronUp className="h-3 w-3" />
                  <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          </div>
        );
      },
      cell: ({ row }) => {
        const text = SignalStatusOptions.find(i => Number(i.value) === row.original.status);
        return text ? t(text?.label) : '-';
      },
    },
    {
      id: 'createBy',
      header: t('common.operName'),
      cell: ({ row }) => row?.original?.createBy || '-',
    },
    {
      id: 'createTime',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('common.createTime')}</div>
            <button
              className="gap-.5 flex cursor-pointer flex-col"
              onClick={() => {
                setIsAsc(isAsc === 'asc' ? 'desc' : 'asc');
                setOrderByColumn('createTime');
              }}
            >
              {orderByColumn === 'createTime' ? (
                <>
                  <ChevronUp className={cn('h-3 w-3', isAsc === 'asc' ? '' : 'opacity-50')} />
                  <ChevronDown className={cn('h-3 w-3', isAsc === 'asc' ? 'opacity-50' : '')} />
                </>
              ) : (
                <>
                  <ChevronUp className="h-3 w-3" />
                  <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          </div>
        );
      },
      cell: ({ row }) => row?.original?.createTime || '-',
    },
    {
      id: 'updateTime',
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('table.updateTime')}</div>
            <button
              className="gap-.5 flex cursor-pointer flex-col"
              onClick={() => {
                setIsAsc(isAsc === 'asc' ? 'desc' : 'asc');
                setOrderByColumn('updateTime');
              }}
            >
              {orderByColumn === 'updateTime' ? (
                <>
                  <ChevronUp className={cn('h-3 w-3', isAsc === 'asc' ? '' : 'opacity-50')} />
                  <ChevronDown className={cn('h-3 w-3', isAsc === 'asc' ? 'opacity-50' : '')} />
                </>
              ) : (
                <>
                  <ChevronUp className="h-3 w-3" />
                  <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          </div>
        );
      },
      cell: ({ row }) => row?.original?.updateTime || '-',
    },
    {
      id: 'operation',
      header: t('common.Operation'),
      cell: () => (
        <div>
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[{ label: t('table.audit'), value: 'edit' }]}
            callToAction={() => {}}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
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
