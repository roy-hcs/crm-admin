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
import { Funnel, Search, RefreshCcw, FileOutput } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/types';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { RrhDialog } from '@/components/common/RrhDialog';
import { LabelItem } from '@/components/common/LabelItem';
import { useWalletTransactionListExport } from '@/api/hooks/report/report';
import { toast } from 'sonner';
import { downloadFile } from '@/lib/utils';

const OperationTypeMap: Record<number, string> = {
  1: 'table.Deposit',
  2: 'table.Withdrawal',
  3: 'table.transfer',
  4: 'table.rebate',
};

const OperationMethodMap: Record<number, string> = {
  1: 'table.internationalTransfer',
  2: 'table.bankTransfer',
  3: 'table.withdrawOnDrawdown',
  4: 'table.SystemDeposit',
  5: 'table.SystemWithdrawal',
  6: 'table.internalTransfer',
  7: 'table.internalTransferOut',
  8: 'table.RebateDeposit',
  13: 'table.payID',
  14: 'table.pointsProductReturn',
  15: 'table.pointsProductExchange',
  16: 'table.thirdPayment',
};

const DetailInfo = ({ itemInfo }: { itemInfo: WalletTransactionItem }) => {
  const { t } = useTranslation();
  let outflowAccount = '';
  if (itemInfo.operationType === 2 || itemInfo.operationMethod === 7) {
    outflowAccount = `${t('table.myWallet')}(${itemInfo.currency})`;
  }
  if (itemInfo.operationType === 3 && itemInfo.operationMethod === 6) {
    outflowAccount = itemInfo?.params?.['serverName'] || '';
  }
  let inflowAccount = '';
  if (
    (itemInfo.operationType && [1, 4].includes(itemInfo.operationType)) ||
    (itemInfo.operationType === 3 && itemInfo.operationMethod === 6)
  ) {
    inflowAccount = `${t('table.myWallet')}(${itemInfo.currency})`;
  }
  if (itemInfo.operationType === 3 && itemInfo.operationMethod === 7) {
    inflowAccount = itemInfo?.params?.['serverName'] || '';
  }

  const accountInfo = [
    {
      label: t('financial.walletTransactions.lastName'),
      value: `${itemInfo.lastName || ''} ${itemInfo.name || ''}`,
    },
    {
      label: t('table.userShowId'),
      value: itemInfo.showId || '',
    },
  ];
  const flowInfo = [
    {
      label: t('table.operationType'),
      value: itemInfo.operationType ? t(OperationTypeMap[itemInfo.operationType]) : '',
    },
    {
      label: t('table.inMethod'),
      value: itemInfo.operationMethod ? t(OperationMethodMap[itemInfo.operationMethod]) : '',
    },
    {
      label: t('financial.walletTransactions.preAmount'),
      value: `${itemInfo.preAmount || ''} ${itemInfo.currency}`,
    },
    {
      label: t('financial.walletTransactions.amount'),
      value: `${itemInfo.amount || ''} ${itemInfo.currency}`,
    },
    {
      label: t('financial.walletTransactions.postAmount'),
      value: `${itemInfo.postAmount || ''} ${itemInfo.currency}`,
    },
    {
      label: t('financial.walletTransactions.operationTimeTable'),
      value: itemInfo.operationTime || '',
    },
    {
      label: t('financial.walletTransactions.serialNumTable'),
      value: itemInfo.serialNum || '',
    },
    {
      label: t('table.remarks'),
      value: itemInfo.remark || '',
    },
    {
      label: t('table.outflowAccount'),
      value: outflowAccount,
    },
    {
      label: t('table.inflowAccount'),
      value: inflowAccount,
    },
    {
      label: t('financial.walletTransactions.mtOrder'),
      value: itemInfo.mtOrder || '',
    },
  ];
  return (
    <div>
      <div className="mb-3">
        <h3 className="text-card-foreground font-semibold">{t('table.accountInformation')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {accountInfo.map(item => (
            <LabelItem key={item.label} label={item.label} ContentDom={<div>{item.value}</div>} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-card-foreground font-semibold">{t('table.flowInfo')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {flowInfo.map(item => (
            <LabelItem key={item.label} label={item.label} ContentDom={<div>{item.value}</div>} />
          ))}
        </div>
      </div>
    </div>
  );
};
export function WalletTransactionsPage() {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
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
  const [exportOpen, setExportOpen] = useState(false);
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
    setCommonParams({
      operationType: '',
      serialNum: '',
      accounts: '',
      mtOrder: '',
    });
    setPageNum(0);
    setKeyword('');
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
      header: t('table.operationType'),
      accessorFn: row => (row.operationType ? t(OperationTypeMap[row.operationType]) : ''),
    },
    {
      id: 'operationMethod',
      header: t('table.inMethod'),
      accessorFn: row => (row.operationMethod ? t(OperationMethodMap[row.operationMethod]) : ''),
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
      cell: ({ row }) => (
        <RrhDialog
          title={t('common.detail', { field: t('financial.walletTransactions.title') })}
          trigger={
            <RrhButton variant="ghost" type="button">
              {t('common.View')}
            </RrhButton>
          }
          confirmShow={false}
          variant="large"
        >
          <DetailInfo itemInfo={row.original} />
        </RrhDialog>
      ),
      fixed: 'right',
      size: 50,
    },
  ];
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('wallet-transactions-table', allColumns);
  const {
    mutateAsync: exportWalletTransactions,
    error: exportError,
    isPending: exportLoading,
  } = useWalletTransactionListExport();
  useEffect(() => {
    if (exportError) {
      toast.error(t('common.exportFailed'), { duration: 5000 });
    }
  }, [exportError, t]);

  const handleExport = async () => {
    try {
      const result = await exportWalletTransactions({
        params,
        ...commonParams,
      });

      if (result?.code !== 0 && result?.msg) {
        toast.error(result.msg, { duration: 5000 });
      } else if (result?.code === 0 && result?.msg) {
        downloadFile(result.msg);
        setExportOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(t('common.exportFailed'), { duration: 5000 });
    }
  };
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
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onLeftIconClick={() => {
                // 触发查询逻辑, 这里简单调用一次刷新
                setParams(prev => ({ ...prev, account: keyword }));
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
            <RrhDialog
              title={t('common.SystemPrompt')}
              open={exportOpen}
              onOpenChange={setExportOpen}
              formLoading={exportLoading}
              trigger={
                <RrhButton variant="outline">
                  <FileOutput />
                  {t('table.export')}
                </RrhButton>
              }
              variant="small"
              footerShow={false}
            >
              <div>
                <div>
                  {t('table.exportAllDataTip', { field: t('financial.walletTransactions.title') })}
                </div>
                <div className="mt-4 flex justify-end gap-4 pb-4 md:pb-0">
                  <RrhButton variant="outline" onClick={() => setExportOpen(false)}>
                    {t('common.Cancel')}
                  </RrhButton>
                  <RrhButton variant="default" onClick={handleExport}>
                    {t('common.Confirm')}
                  </RrhButton>
                </div>
              </div>
            </RrhDialog>
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
