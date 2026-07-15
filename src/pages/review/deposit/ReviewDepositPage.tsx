import { useState, useEffect, useCallback, useMemo } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { ReviewDepositForm } from './ReviewDepositForm';
import { Funnel, Search, RefreshCcw } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import {
  DepositListParams,
  useDepositList,
  useDepositListSum,
  useThirdPaymentList,
} from '@/api/hooks/review';
import { TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { DepositListItem } from '@/api/hooks/review';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhTag } from '@/components/common/RrhTag';
import { depositMethodsMap, withdrawalReviewStatusMap } from '@/lib/constant';
import { useCurrencyList } from '@/api/hooks/system/system';
import { RrhSorter } from '@/components/common/RrhSorter';
import { useTabActions } from '@/hooks/useTabActions';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

export const ReviewDepositPage = () => {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [resetKey, setResetKey] = useState(0);
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('desc');
  const [orderByColumn, setOrderByColumn] = useState('');
  const [params, setParams] = useState<DepositListParams['params']>({
    beginTime: '',
    endTime: '',
    inMoneyAccount: '',
    accounts: '',
  });
  const [otherParams, setOtherParams] = useState<Omit<DepositListParams, 'params'>>({
    userId: '',
    status: '',
    verifyUserName: '',
    dealTicket: '',
    method: '',
    login: '',
    orderNum: '',
    orderId: '',
    channelId: '',
    depositCurrency: '',
    accounts: '',
  });
  const { data: thirdPaymentList } = useThirdPaymentList();
  const { data: currencyList } = useCurrencyList();

  const { data: depositList, isLoading: depositListLoading } = useDepositList(
    {
      pageSize,
      pageNum: pageNum + 1,
      orderByColumn,
      isAsc,
      ...otherParams,
      params: {
        ...params,
      },
    },
    { enabled: true },
  );

  const { mutate: getDepositSum, data: sumData, isPending } = useDepositListSum();
  const [sumShow, setSumShow] = useState(false);
  const getSumData = () => {
    setSumShow(true);
    getDepositSum({
      ...otherParams,
      params: {
        ...params,
      },
    });
  };
  useEffect(() => {
    setSumShow(false);
  }, [depositList]);
  const reset = () => {
    setParams({
      beginTime: '',
      endTime: '',
      inMoneyAccount: '',
      accounts: '',
    });
    setOtherParams({
      userId: '',
      status: '',
      verifyUserName: '',
      dealTicket: '',
      method: '',
      login: '',
      orderNum: '',
      orderId: '',
      channelId: '',
      depositCurrency: '',
      accounts: '',
    });
    setResetKey(k => k + 1);
    setPageNum(0);
    setSumShow(false);
  };

  // 获取导航操作
  const { openTab } = useTabActions();

  const goToDetail = useCallback(
    (row: DepositListItem) => {
      const type = ![-1, 2].includes(row.status) ? 'detail' : 'audit';
      const url = `/review/deposit/detail?type=${type}&id=${row.id}`;
      openTab({
        key: url,
        title: t('depositReview.depositReviewDetail'),
        path: url,
      });
    },
    [openTab, t],
  );

  const allColumns = useMemo<CRMColumnDef<DepositListItem, unknown>[]>(
    () => [
      {
        id: 'No.',
        header: t('CRMAccountPage.Index'),
        cell: ({ row }) => <div>{row.index + 1}</div>,
      },
      {
        id: 'orderNumber',
        header: t('table.orderNumber'),
        label: t('table.orderNumber'),
        accessorKey: 'orderNum',
        cell: ({ row }) => row.original.orderNum || '-',
      },
      {
        id: 'userName',
        header: t('CRMAccountPage.UserName'),
        label: t('CRMAccountPage.UserName'),
        cell: ({ row }) => {
          if (row?.original?.userLastName || row?.original?.userShowId || row?.original?.userName) {
            return (
              <div className="flex flex-col justify-center">
                <div>
                  {(row?.original?.userLastName || '') + ' ' + (row?.original?.userName || '')}
                </div>
                <div>{row?.original?.userShowId}</div>
              </div>
            );
          } else {
            return <div className="text-center">-</div>;
          }
        },
      },
      {
        id: 'depositMethods',
        label: t('table.depositMethods'),
        header: () => {
          return (
            <div className="flex items-center justify-between gap-2">
              <div>{t('table.depositMethods')}</div>
              <RrhSorter
                orderByColumn={orderByColumn}
                isAsc={isAsc}
                column="method"
                setOrderByColumn={setOrderByColumn}
                setIsAsc={setIsAsc}
              />
            </div>
          );
        },
        cell: ({ row }) => {
          const method = row.original.method;
          return method ? t(`table.${depositMethodsMap[method]}`) : '-';
        },
      },
      {
        id: 'channel',
        header: t('table.paymentChannel'),
        label: t('table.paymentChannel'),
        cell: ({ row }) => {
          if (row.original.method === 5) {
            return (
              thirdPaymentList?.rows?.find(channel => `${channel.id}` === row.original.channelId)
                ?.channelName || '-'
            );
          }
          return '-';
        },
      },
      {
        id: 'depositAccount',
        header: t('table.depositAccount'),
        label: t('table.depositAccount'),
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
          return <div>-</div>;
        },
      },
      {
        id: 'reviewStatus',
        header: () => {
          return (
            <div className="flex items-center justify-between gap-2">
              <div>{t('table.reviewStatus')}</div>
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
        label: t('table.reviewStatus'),
        accessorKey: 'status',
        cell: ({ row }) => {
          const typeMap: Record<number, 'error' | 'success' | 'warning' | 'info' | 'default'> = {
            0: 'error',
            1: 'success',
            2: 'warning',
            '-1': 'info',
            '-2': 'default',
          };
          return (
            <RrhTag type={typeMap[row.original.status]}>
              {t(`table.${withdrawalReviewStatusMap[row.original.status]}`)}
            </RrhTag>
          );
        },
      },
      {
        id: 'payAmount',
        header: t('table.payAmount'),
        label: t('table.payAmount'),
        cell: ({ row }) => (
          <div>
            {row.original.deposit} {row.original.depositCurrency}
          </div>
        ),
      },
      {
        id: 'depositAmount',
        header: t('table.depositAmount'),
        label: t('table.depositAmount'),
        cell: ({ row }) => (
          <div>
            {row.original.factDeposit} {row.original.feeCurrency}
          </div>
        ),
      },
      {
        id: 'commission',
        header: t('table.commission'),
        label: t('table.commission'),
        cell: ({ row }) => (
          <div>
            {row.original.fee} {row.original.feeCurrency}
          </div>
        ),
      },
      {
        id: 'amountOfReceipt',
        header: t('table.amountOfReceipt'),
        label: t('table.amountOfReceipt'),
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
        label: t('common.exchangeRate'),
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
        id: 'directAgent',
        header: t('table.directAgent'),
        label: t('table.directAgent'),
        accessorKey: 'directBroker',
        cell: ({ row }) => row.original.directBroker || '-',
      },
      {
        id: 'role',
        header: t('table.role'),
        label: t('table.role'),
        accessorKey: 'roleName',
        cell: ({ row }) => row.original.roleName || '-',
      },
      {
        id: 'submitTime',
        header: () => {
          return (
            <div className="flex items-center justify-between gap-2">
              <div>{t('table.submitTime')}</div>
              <RrhSorter
                orderByColumn={orderByColumn}
                isAsc={isAsc}
                column="subTime"
                setOrderByColumn={setOrderByColumn}
                setIsAsc={setIsAsc}
              />
            </div>
          );
        },
        label: t('table.submitTime'),
        accessorKey: 'subTime',
        cell: ({ row }) => row.original.subTime || '-',
      },
      {
        id: 'currentAuditor',
        header: t('table.currentAuditor'),
        label: t('table.currentAuditor'),
        cell: ({ row }) => {
          if (row.original.status !== 2) {
            if (row.original.vUserLastName) {
              return (
                <div>
                  {row.original.vUserLastName} {row.original.vUserName}
                </div>
              );
            } else {
              return <div>{t('common.system')}</div>;
            }
          } else {
            return <div>-</div>;
          }
        },
      },
      {
        id: 'finishTime',
        header: () => {
          return (
            <div className="flex items-center justify-between gap-2">
              <div>{t('table.finishTime')}</div>
              <RrhSorter
                orderByColumn={orderByColumn}
                isAsc={isAsc}
                column="verifyTime"
                setOrderByColumn={setOrderByColumn}
                setIsAsc={setIsAsc}
              />
            </div>
          );
        },
        label: t('table.finishTime'),
        accessorKey: 'verifyTime',
        cell: ({ row }) => row.original.verifyTime || '-',
      },
      {
        id: 'tradeServerOrderNumber',
        header: t('table.tradeServerOrderNumber'),
        label: t('table.tradeServerOrderNumber'),
        accessorKey: 'dealTicket',
        cell: ({ row }) => row.original.dealTicket || '-',
      },
      {
        id: 'paymentOrderNumber',
        header: t('table.paymentOrderNumber'),
        label: t('table.paymentOrderNumber'),
        cell: ({ row }) => {
          if (row.original.method === 5) {
            return row.original.orderId || '-';
          } else {
            return '-';
          }
        },
      },
      {
        id: 'operation',
        header: () => {
          return <div className="flex justify-center">{t('common.Operation')}</div>;
        },
        label: t('common.Operation'),
        cell: ({ row }) => (
          <RrhButton variant="ghost" onClick={() => goToDetail(row.original)}>
            {row.original.status !== 2 ? t('common.View') : t('table.audit')}
          </RrhButton>
        ),
        fixed: 'right',
        size: 50,
      },
    ],
    [t, isAsc, orderByColumn, setOrderByColumn, setIsAsc, goToDetail, thirdPaymentList],
  );

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('review-deposit-table', allColumns);

  return (
    <div>
      <PageInfo title={t('depositReview.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              key={resetKey}
              placeholder={t('common.pleaseInput', { field: t('table.nameOrLastNameOrId') })}
              className="h-9"
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={value => {
                setOtherParams(prev => ({ ...prev, userId: value }));
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
              <ReviewDepositForm
                params={params}
                otherParams={otherParams}
                reset={reset}
                setParams={setParams}
                setOtherParams={setOtherParams}
                loading={depositListLoading}
                currencyList={currencyList?.rows || []}
                thirdPaymentList={thirdPaymentList?.rows || []}
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
          data={depositList?.rows || []}
          pageCount={Math.ceil(+(depositList?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={depositListLoading}
          CustomRow={
            <>
              <TableCell colSpan={5} className="text-center">
                {t('table.total')}
              </TableCell>
              {!sumShow && (
                <TableCell colSpan={5}>
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
                    <TableCell colSpan={5}></TableCell>
                    <TableCell colSpan={1} className="text-center">
                      {sumData?.data
                        .filter(item => item.type === '1')
                        .map(item => {
                          return item.sumDeposit ? (
                            <div key={item.currency}>
                              {item.sumDeposit} {item.currency}
                            </div>
                          ) : null;
                        })}
                    </TableCell>
                    <TableCell colSpan={1} className="text-center">
                      {sumData?.data
                        .filter(item => item.type === '2')
                        .map(item => {
                          return item.sumDeposit ? (
                            <div key={item.currency}>
                              {item.sumDeposit} {item.currency}
                            </div>
                          ) : null;
                        })}
                    </TableCell>
                    <TableCell colSpan={1} className="text-center">
                      {sumData?.data
                        .filter(item => item.type === '2')
                        .map(item => {
                          return item.sumFee ? (
                            <div key={item.currency}>
                              {item.sumFee} {item.currency}
                            </div>
                          ) : null;
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
};
