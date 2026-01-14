import { useEffect, useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { TableCell } from '@/components/ui/table';
import { RrhButton } from '@/components/common/RrhButton';
import {
  CrmUserDealDetailParams,
  useWalletTransactionList,
  useWalletTransactionSum,
  WalletTransactionItem,
} from '@/api/hooks/report';
import { WalletTransactionsForm } from './WalletTransactionsForm';
import { Funnel, Search, RefreshCcw } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/types';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
export function WalletTransactionsPage() {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [params, setParams] = useState<CrmUserDealDetailParams['params']>({
    account: '',
    selectOther: '',
    inMethod: '',
    currencyId: '',
    operationStart: '',
    operationEnd: '',
    accounts: '',
  });
  const [commonParams, setCommonParams] = useState<
    Omit<CrmUserDealDetailParams, 'params' | keyof BasicParams>
  >({
    operationType: '',
    serialNum: '',
    accounts: '',
    mtOrder: '',
  });
  const { data: data, isLoading: loading } = useWalletTransactionList({
    params,
    pageSize,
    ...commonParams,
    pageNum: pageNum + 1,
    isAsc: 'asc',
    orderByColumn: '',
  });

  const { mutate: getSum, data: sumData, isPending } = useWalletTransactionSum();
  const [sumShow, setSumShow] = useState(false);
  const getSumData = () => {
    setSumShow(true);
    getSum({
      ...commonParams,
      params: {
        ...params,
      },
    });
  };
  useEffect(() => {
    setSumShow(false);
  }, [data]);

  const reset = () => {
    setParams({
      account: '',
      selectOther: '',
      inMethod: '',
      currencyId: '',
      operationStart: '',
      operationEnd: '',
      accounts: '',
    });
    setPageNum(0);
    setPageSize(10);
  };

  const allColumns: CRMColumnDef<WalletTransactionItem, unknown>[] = [
    {
      fixed: true,
      id: 'No.',
      header: t('ib.overview.Index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
      size: 50,
    },
    {
      id: 'lastName',
      header: t('financial.walletTransactions.lastName'),
      cell: ({ row }) => (
        <div>
          <div>{(row.original.lastName ?? '') + (row.original.name ?? '')}</div>
          <div>{row.original.showId}</div>
        </div>
      ),
    },
    {
      id: 'operationType',
      header: t('financial.walletTransactions.operationType'),
      accessorFn: row => row.operationType,
    },
    {
      id: 'operationMethod',
      header: t('financial.walletTransactions.inMethod'),
      accessorFn: row => row.operationMethod,
    },
    {
      id: 'currency',
      accessorKey: 'currency',
      header: t('financial.walletTransactions.wallet'),
      accessorFn: row => row.currency,
    },
    {
      id: 'preAmount',
      accessorKey: 'preAmount',
      header: t('financial.walletTransactions.preAmount'),
      accessorFn: row => row.preAmount,
    },
    {
      id: 'amount',
      accessorKey: 'amount',
      header: t('financial.walletTransactions.amount'),
      accessorFn: row => row.amount,
    },
    {
      id: 'postAmount',
      accessorKey: 'postAmount',
      header: t('financial.walletTransactions.postAmount'),
      accessorFn: row => row.postAmount,
    },
    {
      id: 'operationTime',
      accessorKey: 'operationTime',
      header: t('financial.walletTransactions.operationTimeTable'),
      accessorFn: row => row.operationTime,
    },
    {
      id: 'serialNum',
      accessorKey: 'serialNum',
      header: t('financial.walletTransactions.serialNumTable'),
      accessorFn: row => row.serialNum,
    },
    {
      id: 'mtOrder',
      accessorKey: 'mtOrder',
      header: t('financial.walletTransactions.mtOrder'),
      accessorFn: row => row.mtOrder || '--',
    },
    {
      id: 'remark',
      accessorKey: 'remark',
      header: t('table.remarks'),
      accessorFn: row => row.remark || '--',
    },
    {
      id: 'operation',
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      cell: () => (
        <RrhButton variant="ghost" type="button">
          {t('common.View')}
        </RrhButton>
      ),
      fixed: 'right',
      size: 50,
    },
  ];
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('wallet-transactions-table', allColumns);
  return (
    <div>
      <PageInfo title={t('financial.walletTransactions.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              placeholder={t('table.nameOrEmail')}
              className="h-9"
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={() => {
                // 触发查询逻辑, 这里简单调用一次刷新
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
              <WalletTransactionsForm
                reset={reset}
                params={params}
                commonParams={commonParams}
                setParams={setParams}
                setCommonParams={setCommonParams}
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
          CustomRow={
            <>
              <TableCell colSpan={6}>{t('table.total')}</TableCell>
              {!sumShow && (
                <TableCell colSpan={6}>
                  <RrhButton variant="ghost" onClick={getSumData}>
                    {t('table.clickToGetSum')}
                  </RrhButton>
                </TableCell>
              )}
              {sumShow ? (
                isPending ? (
                  <TableCell>{t('common.loading')}</TableCell>
                ) : (
                  <>
                    <TableCell>
                      {sumData?.data?.map((i, index) => {
                        return (
                          <div key={index}>
                            {(Number(i.totalAmount) || 0).toFixed(2)} {i.currency}
                          </div>
                        );
                      })}
                    </TableCell>
                  </>
                )
              ) : null}
            </>
          }
        />
      </TableContentWrapper>
    </div>
  );
}
