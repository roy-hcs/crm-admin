import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Funnel, RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DepositListParams } from '@/api/hooks/review/types';
import { useDepositList, useDepositListSum, useThirdPaymentList } from '@/api/hooks/review/review';
import { TableCell } from '@/components/ui/table';
import { ReviewDepositForm } from './ReviewDepositForm';
import { ReviewDepositTable } from './ReviewDepositTable';
import { useCurrencyList } from '@/api/hooks/system/system';

export const ReviewDepositPage = () => {
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
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const { data: thirdPaymentList } = useThirdPaymentList();
  const { data: currencyList } = useCurrencyList();

  const { data: depositList, isLoading: depositListLoading } = useDepositList(
    {
      pageSize,
      pageNum: pageNum + 1,
      orderByColumn: 'status desc,subTime desc',
      isAsc: '',
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
    setPageNum(0);
    setSumShow(false);
  };

  return (
    <div>
      <h1 className="text-title">{t('depositReview.title')}</h1>
      <div className="my-3.5 flex justify-end gap-2">
        <RrhButton variant="outline">{t('table.export')}</RrhButton>
        <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
          <RefreshCcw className="size-3.5" />
        </RrhButton>
        <RrhDrawer
          headerShow={false}
          asChild
          direction="right"
          footerShow={false}
          Trigger={
            <RrhButton variant="ghost" className="size-8">
              <Funnel />
            </RrhButton>
          }
        >
          <ReviewDepositForm
            setParams={setParams}
            setOtherParams={setOtherParams}
            loading={depositListLoading}
            currencyList={currencyList?.rows || []}
            thirdPaymentList={thirdPaymentList?.rows || []}
          />
        </RrhDrawer>
      </div>
      <ReviewDepositTable
        data={depositList?.rows || []}
        pageCount={Math.ceil(+(depositList?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={depositListLoading}
        channelList={thirdPaymentList?.rows || []}
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
    </div>
  );
};
