import { useState, useEffect, useCallback, useMemo } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { ReviewWithdrawalForm } from './ReviewWithdrawalForm';
import { Funnel, Search, RefreshCcw } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import {
  WithdrawListParams,
  useOutMoneyMethodList,
  useWithdrawList,
  useWithdrawListSum,
} from '@/api/hooks/review';
import { TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { WithdrawItem } from '@/api/hooks/review';
import { Checkbox } from '@/components/ui/checkbox';
import { RrhTag } from '@/components/common/RrhTag';
import { withdrawalReviewStatusMap } from '@/lib/constant';
import { useTabActions } from '@/hooks/useTabActions';
import { RrhSorter } from '@/components/common/RrhSorter';
import { RrhButton } from '@/components/common/RrhButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

export const ReviewWithdrawalPage = () => {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [resetKey, setResetKey] = useState(0);
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('desc');
  const [orderByColumn, setOrderByColumn] = useState('');
  const [params, setParams] = useState<WithdrawListParams['params']>({
    beginTime: '',
    endTime: '',
    outMoneyAccount: '',
    accounts: '',
    finishBeginTime: '',
    finishEndTime: '',
  });
  const [otherParams, setOtherParams] = useState<Omit<WithdrawListParams, 'params'>>({
    userId: '',
    status: '',
    verifyUserName: '',
    dealTicket: '',
    method: '',
    login: '',
    orderNum: '',
    exceptionFlag: '',
    accounts: '',
  });

  const { data: outMoneyMethodList } = useOutMoneyMethodList();

  const { data: withdrawList, isLoading: withdrawListLoading } = useWithdrawList(
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

  const { mutate: getWithdrawSum, data: sumData, isPending } = useWithdrawListSum();
  const [sumShow, setSumShow] = useState(false);
  const getSumData = () => {
    setSumShow(true);
    getWithdrawSum({
      ...otherParams,
      params: {
        ...params,
      },
    });
  };
  useEffect(() => {
    setSumShow(false);
  }, [withdrawList]);
  const reset = () => {
    setParams({
      beginTime: '',
      endTime: '',
      outMoneyAccount: '',
      accounts: '',
      finishBeginTime: '',
      finishEndTime: '',
    });
    setOtherParams({
      userId: '',
      status: '',
      verifyUserName: '',
      dealTicket: '',
      method: '',
      login: '',
      orderNum: '',
      exceptionFlag: '',
      accounts: '',
    });
    setResetKey(k => k + 1);
    setPageNum(0);
    setSumShow(false);
  };

  // 获取导航操作
  const { openTab } = useTabActions();

  const goToDetail = useCallback(
    (row: WithdrawItem) => {
      const type = ![-1, 2].includes(row.status) ? 'detail' : 'audit';
      const url = `/review/withdrawal/detail?type=${type}&id=${row.id}`;
      openTab({
        key: url,
        title: t('withdrawalReview.withdrawalReviewDetail'),
        path: url,
      });
    },
    [openTab, t],
  );

  // 创建表格列定义
  const allColumns = useMemo<CRMColumnDef<WithdrawItem, unknown>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            className="data-[state=checked]:border-slate-700"
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            className="data-[state=checked]:border-slate-700"
            checked={row.getIsSelected()}
            onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: 'No.',
        header: t('CRMAccountPage.Index'),
        cell: ({ row }) => <div>{row.index + 1}</div>,
      },
      {
        id: 'orderNumber',
        header: t('table.orderNumber'),
        accessorFn: row => row.orderNum,
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
                column="exceptionFlag"
                setOrderByColumn={setOrderByColumn}
                setIsAsc={setIsAsc}
              />
            </div>
          );
        },
        label: t('table.status'),
        accessorFn: row => row.status,
        cell: ({ row }) => {
          const status = row.original.exceptionFlag;
          return (
            <RrhTag type={Number(status) === 1 ? 'error' : 'success'}>
              {Number(status) === 1 ? t('common.abnormal') : t('common.normal')}
            </RrhTag>
          );
        },
      },
      {
        id: 'userName',
        header: t('CRMAccountPage.UserName'),
        cell: ({ row }) => (
          <div className="flex flex-col justify-center">
            <div>
              {row.original.userLastName} {row.original.userName}
            </div>
            <div>{row.original.userShowId}</div>
          </div>
        ),
      },
      {
        id: 'email',
        header: t('table.email'),
        accessorFn: row => row.userEmail,
      },
      {
        id: 'withdrawMethods',
        label: t('table.withdrawMethods'),
        header: () => {
          return (
            <div className="flex items-center justify-between gap-2">
              <div>{t('table.withdrawMethods')}</div>
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
          return method
            ? outMoneyMethodList?.data?.find(item => item.id === method.toString())?.name
            : '-';
        },
      },
      {
        id: 'withdrawAccount',
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
        id: 'reviewStatus',
        label: t('table.reviewStatus'),
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
        accessorFn: row => row.status,
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
        id: 'role',
        header: t('table.role'),
        accessorFn: row => row.roleName,
      },
      {
        id: 'submitAuditTime',
        label: t('table.submitAuditTime'),
        header: () => {
          return (
            <div className="flex items-center justify-between gap-2">
              <div>{t('table.submitAuditTime')}</div>
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
        accessorFn: row => row.subTime,
      },
      {
        id: 'currentAuditor',
        header: t('table.currentAuditor'),
        cell: ({ row }) => {
          if (row.original.vUserLastName && row.original.status !== 2) {
            return (
              <div>
                {row.original.vUserLastName} {row.original.vUserName}
              </div>
            );
          } else {
            return <div>-</div>;
          }
        },
      },
      {
        id: 'finishTime',
        label: t('table.finishTime'),
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
        accessorFn: row => row.verifyTime,
        cell: ({ row }) => <div>{row.original.verifyTime || '-'}</div>,
      },
      {
        id: 'tradeServerOrderNumber',
        header: t('table.tradeServerOrderNumber'),
        accessorFn: row => row.dealTicket,
      },
      {
        fixed: 'right',
        id: 'operate',
        size: 50,
        label: t('common.Operation'),
        header: () => {
          return <div className="flex justify-center">{t('common.Operation')}</div>;
        },
        cell: ({ row }) => (
          <>
            <RrhButton variant="ghost" onClick={() => goToDetail(row.original)}>
              {row.original.status !== 2 ? t('common.View') : t('table.audit')}
            </RrhButton>
            {row.original.status === 1 && (
              <RrhButton variant="ghost">{t('table.cancelWithdrawal')}</RrhButton>
            )}
          </>
        ),
      },
    ],
    [t, orderByColumn, isAsc, setOrderByColumn, setIsAsc, outMoneyMethodList, goToDetail],
  );

  // 列可见性管理
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('withdrawal-review-table', allColumns, ['select']);

  return (
    <div>
      <PageInfo title={t('withdrawalReview.title')} />
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
            <RrhButton onClick={reset}>{t('table.batchAudit')}</RrhButton>
            <RrhButton variant="outline">{t('table.export')}</RrhButton>
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
              <ReviewWithdrawalForm
                params={params}
                otherParams={otherParams}
                reset={reset}
                setParams={setParams}
                setOtherParams={setOtherParams}
                loading={withdrawListLoading}
                withdrawMethodList={outMoneyMethodList?.data || []}
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
          data={withdrawList?.rows || []}
          pageCount={Math.ceil(+(withdrawList?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={withdrawListLoading}
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
                      {sumData?.data.map(item => {
                        return item.sumWithdraw ? (
                          <div key={item.currency}>
                            {item.sumWithdraw} {item.currency}
                          </div>
                        ) : null;
                      })}
                    </TableCell>
                    <TableCell colSpan={1} className="text-center">
                      {sumData?.data.map(item => {
                        return item.sumFee ? (
                          <div key={item.currency}>
                            {item.sumFee} {item.currency}
                          </div>
                        ) : null;
                      })}
                    </TableCell>
                    <TableCell colSpan={1} className="text-center">
                      {sumData?.data.map(item => {
                        return item.sumFactWithdraw ? (
                          <div key={item.currency}>
                            {item.sumFactWithdraw} {item.currency}
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
