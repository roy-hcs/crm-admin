import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Funnel, RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WithdrawListParams } from '@/api/hooks/review/types';
import { useWithdrawList, useWithdrawListSum } from '@/api/hooks/review/review';
import { TableCell } from '@/components/ui/table';
import { ReviewWithdrawalForm } from './ReviewWithdrawalForm';
import { ReviewWithdrawalTable } from './ReviewWithdrawalTable';

export const ReviewWithdrawalPage = () => {
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
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();

  const { data: withdrawList, isLoading: withdrawListLoading } = useWithdrawList(
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
    setPageNum(0);
    setSumShow(false);
  };

  return (
    <div>
      <h1 className="text-title">{t('withdrawalReview.title')}</h1>
      <div className="my-3.5 flex justify-end gap-2">
        <RrhButton onClick={reset}>{t('table.batchAudit')}</RrhButton>
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
          <ReviewWithdrawalForm
            setParams={setParams}
            setOtherParams={setOtherParams}
            loading={withdrawListLoading}
          />
        </RrhDrawer>
      </div>
      <ReviewWithdrawalTable
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
    </div>
  );
};
