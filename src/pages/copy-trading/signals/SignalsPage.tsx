import { useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { MamSignalSourceItem, MamSignalSourceListParams } from '@/api/hooks/copyTrading/type';
import { useMamSignalSourceList } from '@/api/hooks/copyTrading';
import { SignalsForm } from './SignalsForm';
import { Funnel, Search, RefreshCcw } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/types';
import { RrhSorter } from '@/components/common/RrhSorter';
import { Switch } from '@/components/ui/switch';
import { Alert } from '@/components/common/Alert';
import { useChangeMamSignalSource } from '@/api/hooks/copyTrading';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { Ellipsis } from 'lucide-react';
import { SignalStatusOptions } from '@/lib/const';
import { Row } from '@tanstack/react-table';

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

export const SignalsPage = () => {
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('');
  const [orderByColumn, setOrderByColumn] = useState<string>('');
  const [params, setParams] = useState<MamSignalSourceListParams['params']>({
    beginTime: '',
    endTime: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<MamSignalSourceListParams, 'params' | keyof BasicParams>
  >({
    name: '',
    userName: '',
    serverId: '',
    account: '',
    status: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const { t } = useTranslation();

  const { data: data, isLoading: loading } = useMamSignalSourceList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn,
    isAsc,
    ...otherParams,
    params,
  });

  const reset = () => {
    setParams(pre => ({
      ...pre,
      beginTime: '',
      endTime: '',
    }));
    setOtherParams(pre => ({
      ...pre,
      name: '',
      userName: '',
      serverId: '',
      account: '',
      status: '',
    }));
    setKeyword('');
    setPageNum(0);
  };

  const allColumns: CRMColumnDef<MamSignalSourceItem, unknown>[] = [
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
      id: 'account',
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
      label: t('signals.totalProfit'),
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
      label: t('signals.totalProfitRate'),
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
      label: t('signals.subscribeFee'),
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
      label: t('signals.subscribeNum'),
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
      label: t('table.status'),
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
      label: t('common.createTime'),
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
      label: t('table.updateTime'),
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
      label: t('common.Operation'),
      fixed: 'right',
      size: 50,
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

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('signals-reports-table', allColumns);

  return (
    <div>
      <PageInfo title={t('signals.title')} />
      <div className="mb-3 flex justify-between">
        <div className="w-67 max-w-sm">
          <RrhInputWithIcon
            placeholder={t('common.pleaseInput', { field: t('signals.name') })}
            className="h-9"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            leftIcon={<Search className="size-4" />}
            onLeftIconClick={() => {
              setOtherParams(prev => ({ ...prev, name: keyword }));
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
            <SignalsForm
              setParams={setParams}
              setOtherParams={setOtherParams}
              reset={reset}
              loading={loading}
              otherParams={otherParams}
              params={params}
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
        loading={loading}
      />
    </div>
  );
};
