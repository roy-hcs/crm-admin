import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Funnel, RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useServerList } from '@/api/hooks/system/system';
import { useTranslation } from 'react-i18next';
import { RebateCommissionListParams } from '@/api/hooks/review/types';
import {
  useRebateCommissionList,
  useRebateCommissionListSum,
  useRebateCommissionRuleList,
} from '@/api/hooks/review/review';
import { TableCell } from '@/components/ui/table';
import { ReviewFeeRebateForm } from './ReviewFeeRebateForm';
import { ReviewFeeRebateTable } from './ReviewFeeRebateTable';

export const ReviewFeeRebatePage = () => {
  const [params, setParams] = useState<RebateCommissionListParams['params']>({
    startTraderTime: '',
    endTraderTime: '',
    beginTime: '',
    endTime: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<RebateCommissionListParams & { taderType?: string }, 'params'>
  >({
    serverId: '',
    serverGroupList: '',
    mtOrder: '',
    trderAccount: '',
    taderType: '',
    rebateStatus: '',
    id: '',
    rebateTraderId: '',
    accountGroupList: '',
    verifyUserName: '',
    conditionName: '',
  });

  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(false);

  const { data: serverList, isLoading: serverListLoading } = useServerList();
  const { data: rebateRuleList } = useRebateCommissionRuleList(2);

  useEffect(() => {
    if (serverList && serverList.rows && serverList.rows.length > 0) {
      setOtherParams(prev => ({
        ...prev,
        serverId: serverList.rows[0].id,
        serverType: serverList.rows[0].serviceType.toString(),
      }));
    }
  }, [serverList]);
  useEffect(() => {
    if (otherParams.serverId) {
      setEnabled(true);
    }
  }, [otherParams.serverId]);
  const { data, isLoading } = useRebateCommissionList(
    {
      orderByColumn: 'rebateStatusDef',
      isAsc: 'asc',
      pageNum: pageNum + 1,
      pageSize,
      ...otherParams,
      rebateType: 2,
      params: {
        ...params,
      },
    },
    {
      enabled,
    },
  );
  const { mutate: getRebateSum, data: sumData, isPending } = useRebateCommissionListSum();
  const [sumShow, setSumShow] = useState(false);
  const getSumData = () => {
    setSumShow(true);
    getRebateSum({
      ...otherParams,
      rebateType: 2,
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
      startTraderTime: '',
      endTraderTime: '',
      beginTime: '',
      endTime: '',
    });
    setOtherParams({
      serverId: serverList?.rows[0].id || '',
      serverGroupList: '',
      mtOrder: '',
      trderAccount: '',
      rebateStatus: '',
      id: '',
      rebateTraderId: '',
      accountGroupList: '',
      verifyUserName: '',
      conditionName: '',
    });
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('feeRebateReview.title')}</h1>
      <div className="my-3.5 flex justify-end gap-2">
        <RrhButton variant="outline">{t('table.export')}</RrhButton>
        <RrhButton variant="outline">{t('table.batchDelete')}</RrhButton>
        <RrhButton variant="outline">{t('table.batchAudit')}</RrhButton>
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
          <ReviewFeeRebateForm
            serverListLoading={serverListLoading}
            serverList={serverList?.rows || []}
            setParams={setParams}
            setOtherParams={setOtherParams}
            rebateRuleList={rebateRuleList || []}
            loading={isLoading}
          />
        </RrhDrawer>
      </div>

      <ReviewFeeRebateTable
        data={data?.rows || []}
        pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={isLoading}
        CustomRow={
          <>
            <TableCell colSpan={6}>{t('table.total')}</TableCell>
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
                  <TableCell colSpan={1} className="text-center">
                    {sumData?.data[0]?.totalVolume}
                  </TableCell>
                  <TableCell colSpan={2}></TableCell>
                  <TableCell colSpan={1} className="text-center">
                    {sumData?.data[0]?.totalList.map(item => {
                      return (
                        <div key={item.amtUnit}>
                          {item.commissionBase} {item.amtUnit}
                        </div>
                      );
                    })}
                  </TableCell>
                  <TableCell colSpan={1}></TableCell>
                  <TableCell colSpan={1} className="text-center">
                    {sumData?.data[0]?.totalList.map(item => {
                      return (
                        <div key={item.amtUnit}>
                          {item.rebateFixedAmt} {item.amtUnit}
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
};
