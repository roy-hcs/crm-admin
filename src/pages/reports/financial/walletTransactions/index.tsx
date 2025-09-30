import { useEffect, useRef, useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { TableCell } from '@/components/ui/table';
import { RrhButton } from '@/components/common/RrhButton';
import { useWalletTransactionList, useWalletTransactionSum } from '@/api/hooks/report/report';
import {
  WalletTransactionsForm,
  WalletTransactionsFormRef,
} from './components/WalletTransactionsForm';
import { Funnel, Search, RefreshCcw, Ellipsis } from 'lucide-react';
import { WalletTransactionsTable } from './components/WalletTransactionsTable';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
export function WalletTransactionsPage() {
  const { t } = useTranslation();
  const formRef = useRef<WalletTransactionsFormRef>(null);
  // 分页
  const [pageNum, setPageNum] = useState(0);
  // 每页条数
  const [pageSize, setPageSize] = useState(10);
  // 特殊参数
  const [params, setParams] = useState({
    account: '',
    selectOther: '',
    inMethod: '',
    currencyId: '',
    operationStart: '',
    operationEnd: '',
    accounts: '',
  });
  // 普通参数
  const [commonParams, setCommonParams] = useState({
    operationType: '',
    serialNum: '',
    accounts: '',
    mtOrder: '',
  });
  // 获取钱包流水列表
  const { data: data, isLoading: loading } = useWalletTransactionList({
    params,
    pageSize,
    ...commonParams,
    pageNum: pageNum + 1,
    // 下面是固定参数
    isAsc: 'asc',
    orderByColumn: '',
  });

  // 获取合计数据接口
  const { mutate: getSum, data: sumData, isPending } = useWalletTransactionSum();
  // 合计状态
  const [sumShow, setSumShow] = useState(false);
  // 点击获取合计数
  const getSumData = () => {
    setSumShow(true);
    getSum({
      ...commonParams,
      params: {
        ...params,
      },
    });
  };
  // 列表数据变化重置合计状态
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
  return (
    <div>
      <div className="text-xl leading-8 font-semibold text-neutral-950">
        {t('financial.walletTransactions.title')}
      </div>
      <div className="mt-3.5 mb-3.5 flex justify-between">
        <div className="w-67 max-w-sm">
          <RrhInputWithIcon
            placeholder="Last Name/First Name/Email"
            className="h-9"
            rightIcon={<Search className="size-4" />}
            onRightIconClick={() => {
              // 触发查询逻辑, 这里简单调用一次刷新
              setPageNum(0);
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
            <RefreshCcw className="size-3.5" />
          </Button>
          <Button variant="ghost" className="size-8 cursor-pointer">
            <Ellipsis />
          </Button>
          <RrhDrawer
            asChild
            Trigger={
              <Button variant="ghost" className="size-8 cursor-pointer">
                <Funnel className="size-4" />
              </Button>
            }
            title="Filter"
            direction="right"
            footerShow={false}
          >
            <WalletTransactionsForm
              ref={formRef}
              setParams={setParams}
              setCommonParams={setCommonParams}
            />
          </RrhDrawer>
        </div>
      </div>
      <WalletTransactionsTable
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
    </div>
  );
}
