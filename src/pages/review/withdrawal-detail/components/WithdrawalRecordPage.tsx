import {
  useOutMoneyMethodList,
  useWithdrawList,
  useWithdrawListSum,
  WithdrawListParams,
  WithdrawItem,
} from '@/api/hooks/review';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/lib/utils';
import { RrhSelect } from '@/components/common/RrhSelect';
import { RrhRangeInput } from '@/components/common/RrhRangeInput';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/types';

export const WithdrawalRecordPage = ({ userId }: { userId: string }) => {
  const { t } = useTranslation();
  const [params, setParams] = useState<WithdrawListParams['params']>({
    finishBeginTime: '',
    finishEndTime: '',
    userId,
  });
  const [otherParams, setOtherParams] = useState<
    Omit<WithdrawListParams, 'params' | keyof BasicParams>
  >({
    status: '1',
    method: '',
  });
  const [orderByColumn, setOrderByColumn] = useState('');
  const [isAsc, setIsAsc] = useState('');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [withdrawalMethod, setWithdrawalMethod] = useState('');
  const [finishTimeRange, setFinishTimeRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const { data: withdrawalList, isLoading: withdrawalListLoading } = useWithdrawList(
    {
      pageSize,
      pageNum: pageNum + 1,
      ...otherParams,
      orderByColumn,
      isAsc,
      params: {
        ...params,
      },
    },
    { enabled: true },
  );
  const { data: outMoneyMethodList } = useOutMoneyMethodList();

  const { mutate: getWithdrawSum, data: sumData } = useWithdrawListSum();
  useEffect(() => {
    getWithdrawSum({
      params,
      ...otherParams,
    });
  }, [getWithdrawSum, otherParams, params]);
  console.log('sumData----', sumData);

  const reset = () => {
    setParams({
      finishBeginTime: '',
      finishEndTime: '',
      userId,
    });
    setOtherParams({
      status: '1',
      method: '',
    });
    setOrderByColumn('');
    setIsAsc('');
    setPageNum(0);
    setFinishTimeRange({
      from: undefined,
      to: undefined,
    });
    setWithdrawalMethod('');
  };

  const onSubmit = () => {
    setParams({
      finishBeginTime: formatDate(finishTimeRange.from),
      finishEndTime: formatDate(finishTimeRange.to),
      userId,
    });
    setOtherParams({
      status: '1',
      method: withdrawalMethod,
    });
    setPageNum(0);
  };

  const allColumns: CRMColumnDef<WithdrawItem, unknown>[] = [
    {
      id: 'orderNumber',
      header: t('table.orderNumber'),
      accessorFn: row => row.orderNum,
    },
    {
      id: 'withdrawalMethods',
      header: t('table.withdrawMethods'),
      cell: ({ row }) => {
        const method = row.original.method;
        return method
          ? outMoneyMethodList?.data?.find(item => item.id === method.toString())?.name || '-'
          : '-';
      },
    },
    {
      id: 'withdrawalAccount',
      header: t('table.withdrawAccount'),
      cell: ({ row }) => {
        if (row.original.login) {
          return row.original.aliasName ? (
            <div className="flex flex-col">
              <div>{row.original.aliasName}</div>
              <div>{row.original.login}</div>
            </div>
          ) : (
            <div>{row.original.login}</div>
          );
        } else if (row.original.walletId) {
          return (
            <div>
              {t('table.wallet')} ({row.original.walletCurrency})
            </div>
          );
        }
      },
    },
    {
      id: 'balance',
      header: t('table.balance'),
      cell: ({ row }) => (
        <div>
          {row.original.balance} {row.original.withdrawCurrency}
        </div>
      ),
    },
    {
      id: 'withdrawAmount',
      header: t('table.withdrawAmount'),
      cell: ({ row }) => (
        <div>
          {row.original.withdraw} {row.original.withdrawCurrency}
        </div>
      ),
    },
    {
      id: 'commission',
      header: t('table.commission'),
      cell: ({ row }) => (
        <div>
          {row.original.fee} {row.original.feeCurrency}
        </div>
      ),
    },
    {
      id: 'amountOfReceipt',
      header: t('table.amountOfReceipt'),
      cell: ({ row }) =>
        row.original.factWithdraw ? (
          <div>
            {row.original.factWithdraw} {row.original.targetCurrency}
          </div>
        ) : (
          <div>-</div>
        ),
    },
    {
      id: 'finishTime',
      header: t('table.finishTime'),
      accessorFn: row => row.verifyTime,
      cell: ({ row }) => <div>{row.original.verifyTime || '-'}</div>,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('withdrawal-record-table', allColumns);

  return (
    <div className="bg-card rounded-lg px-3 py-6">
      <div className="mb-3 flex gap-3">
        <RrhSelect
          placeholder={t('common.pleaseSelect') + t('table.withdrawMethods')}
          value={withdrawalMethod}
          onValueChange={value => setWithdrawalMethod(value)}
          options={(outMoneyMethodList?.data || []).map(item => ({
            label: item.name,
            value: item.id,
          }))}
          showRowValue={false}
          className="min-w-40"
        />
        <RrhRangeInput
          name="finishTime"
          from={finishTimeRange.from}
          to={finishTimeRange.to}
          onChange={({ from, to }) => setFinishTimeRange({ from, to })}
          className="w-auto min-w-55"
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
            }}
          >
            <RefreshCcw className="size-3.5" />
            <span>{t('common.Reset')}</span>
          </Button>
          <Button type="button" onClick={() => onSubmit()}>
            <Search className="size-3.5" />
            <span>{t('common.Search')}</span>
          </Button>
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
        data={withdrawalList?.rows || []}
        pageCount={Math.ceil(+(withdrawalList?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={withdrawalListLoading}
        tableWrapperCls="border-none"
      />
    </div>
  );
};
