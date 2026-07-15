import {
  DepositListParams,
  useDepositList,
  useDepositListSum,
  DepositListItem,
} from '@/api/hooks/review';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SumItems } from './SumItems';
import { RrhSelect } from '@/components/common/RrhSelect';
import { RrhRangeInput } from '@/components/common/RrhRangeInput';
import { formatDate } from '@/lib/utils';
import { depositMethodsMap } from '@/lib/constant';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/types';

export const DepositRecordPage = ({ userId }: { userId: string }) => {
  const { t } = useTranslation();
  const [params, setParams] = useState<DepositListParams['params']>({
    finishBeginTime: '',
    finishEndTime: '',
    userId,
  });
  const [otherParams, setOtherParams] = useState<
    Omit<DepositListParams, 'params' | keyof BasicParams>
  >({
    status: '1',
    method: '',
  });
  const [orderByColumn, setOrderByColumn] = useState('verifyTime desc');
  const [isAsc, setIsAsc] = useState('');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [depositMethod, setDepositMethod] = useState('');
  const [finishTimeRange, setFinishTimeRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const { data: depositList, isLoading: depositListLoading } = useDepositList(
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

  const { mutate: getDepositSum } = useDepositListSum();
  useEffect(() => {
    getDepositSum({
      params,
      ...otherParams,
    });
  }, [getDepositSum, otherParams, params]);

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
    setOrderByColumn('verifyTime desc');
    setIsAsc('');
    setPageNum(0);
    setFinishTimeRange({
      from: undefined,
      to: undefined,
    });
    setDepositMethod('');
  };

  const onSubmit = () => {
    setParams({
      finishBeginTime: formatDate(finishTimeRange.from),
      finishEndTime: formatDate(finishTimeRange.to),
      userId,
    });
    setOtherParams({
      status: '1',
      method: depositMethod,
    });
    setPageNum(0);
  };

  const allColumns = useMemo<CRMColumnDef<DepositListItem, unknown>[]>(
    () => [
      {
        id: 'orderNumber',
        header: t('table.orderNumber'),
        accessorFn: row => row.orderNum,
      },
      {
        id: 'depositMethods',
        header: t('table.depositMethods'),
        cell: ({ row }) => {
          const method = row.original.method;
          return method ? t(`table.${depositMethodsMap[method]}`) : '-';
        },
      },
      {
        id: 'depositAccount',
        header: t('table.depositAccount'),
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
        id: 'payAmount',
        header: t('table.payAmount'),
        cell: ({ row }) => (
          <div>
            {row.original.deposit} {row.original.depositCurrency}
          </div>
        ),
      },
      {
        id: 'depositAmount',
        header: t('table.depositAmount'),
        cell: ({ row }) => (
          <div>
            {row.original.factDeposit} {row.original.feeCurrency}
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
          row.original.receiptAmount ? (
            <div>
              {row.original.receiptAmount} {row.original.receiptCurrency}
            </div>
          ) : (
            <div>-</div>
          ),
      },
      {
        id: 'exchangeRate',
        header: t('common.exchangeRate'),
        cell: ({ row }) =>
          row.original.rate ? (
            <div>
              <div>{row.original.rate.toFixed(5)}</div>
              <div>{row.original.currencyPair}</div>
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
    ],
    [t],
  );

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('deposit-record-table', allColumns);
  // TODO: 需要后端提供一个新的接口用来展示不同货币的数据
  const sumMockData = [
    { currency: 'USD', amount: '100.00', orderCount: '2' },
    { currency: 'AUD', amount: '200.00', orderCount: '3' },
    { currency: 'VND', amount: '100.00', orderCount: '2' },
    { currency: 'USD', amount: '100.00', orderCount: '2' },
    { currency: 'AUD', amount: '200.00', orderCount: '3' },
    { currency: 'VND', amount: '100.00', orderCount: '2' },
    { currency: 'USD', amount: '100.00', orderCount: '2' },
    { currency: 'AUD', amount: '200.00', orderCount: '3' },
    { currency: 'VND', amount: '10000000000000.00', orderCount: '2' },
    { currency: 'USD', amount: '100.00', orderCount: '2' },
    { currency: 'AUD', amount: '200.00', orderCount: '3' },
    { currency: 'VND', amount: '100.00', orderCount: '2' },
  ];
  return (
    <div>
      <SumItems sumInfos={sumMockData} />
      <div className="bg-card rounded-lg px-3 py-6">
        <div className="mb-3 flex gap-3">
          <RrhSelect
            placeholder={t('common.pleaseSelect') + t('table.depositMethods')}
            value={depositMethod}
            onValueChange={value => setDepositMethod(value)}
            options={[
              { label: t('table.internationalTransfer'), value: '1' },
              { label: t('table.bankTransfer'), value: '2' },
              { label: t('table.thirdPayment'), value: '5' },
              { label: t('table.cryptocurrency'), value: '6' },
              { label: t('table.quickPayment'), value: '7' },
              { label: t('table.payID'), value: '13' },
            ]}
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
              className="size-8"
              onClick={e => {
                e.stopPropagation();
                reset();
              }}
            >
              <RefreshCcw className="size-3.5" />
            </Button>
            <Button type="button" onClick={() => onSubmit()} size="sm">
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
          data={depositList?.rows || []}
          pageCount={Math.ceil(+(depositList?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={depositListLoading}
          tableWrapperCls="border-none"
        />
      </div>
    </div>
  );
};
