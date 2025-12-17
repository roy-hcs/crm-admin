import { useChangeMamSignalSource } from '@/api/hooks/copyTrading';
import { MamSignalSourceItem } from '@/api/hooks/copyTrading/type';
import { Alert } from '@/components/common/Alert';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { RrhSorter } from '@/components/common/RrhSorter';
import { DataTable } from '@/components/table/DataTable';
import { Switch } from '@/components/ui/switch';
import { SignalStatusOptions } from '@/lib/const';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
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
  setIsAsc: Dispatch<SetStateAction<'asc' | 'desc' | ''>>;
  orderByColumn: string;
  setOrderByColumn: Dispatch<SetStateAction<string>>;
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
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="totalProfit"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
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
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="totalProfitRate"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
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
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="subscribeFee"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
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
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="subscribeNum"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
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
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="status"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
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
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="createTime"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
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
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="updateTime"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      cell: ({ row }) => row?.original?.updateTime || '-',
    },
    {
      id: 'operation',
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
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
