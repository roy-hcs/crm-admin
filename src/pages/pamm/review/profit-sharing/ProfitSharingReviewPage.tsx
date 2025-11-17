import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProfitSharingReviewTable } from './ProfitSharingReviewTable';
import { ProfitSharingReviewForm } from './ProfitSharingReviewForm';
import { PammCommissionListParams } from '@/api/hooks/pamm/type';
import { usePammCommissionList } from '@/api/hooks/pamm';
import { BasicParams } from '@/api/types';
import { TableCell } from '@/components/ui/table';
import { transformTotalList } from '@/lib/utils';

export const ProfitSharingReviewPage = () => {
  const [params, setParams] = useState<PammCommissionListParams['params']>({
    beginTime: '',
    endTime: '',
    auditBeginTime: '',
    auditEndTime: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<PammCommissionListParams, 'params' | keyof BasicParams>
  >({
    commissionType: '2',
    serverId: '',
    projectName: '',
    customerName: '',
    orderNo: '',
    verifyStatus: '',
    profitType: '',
    settlementType: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();

  const { data: data, isLoading: loading } = usePammCommissionList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
    params,
  });

  const totalList = useMemo(() => {
    return transformTotalList(data?.totalList, [
      'businessAmountToatl',
      'rewardAmountToatl',
      'commissionToatl',
    ]);
  }, [data]);

  const reset = () => {
    setParams(pre => ({
      ...pre,
      beginTime: '',
      endTime: '',
      auditBeginTime: '',
      auditEndTime: '',
    }));
    setOtherParams(pre => ({
      ...pre,
      commissionType: '',
      serverId: '',
      projectName: '',
      customerName: '',
      orderNo: '',
      verifyStatus: '',
      profitType: '',
      settlementType: '',
    }));
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('profitSharingReview.title')}</h1>
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('table.projectName') })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setOtherParams(prev => ({ ...prev, projectName: e }));
            setPageNum(0);
          }}
        />
        <div className="flex justify-end gap-2">
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
            <ProfitSharingReviewForm
              setParams={setParams}
              setOtherParams={setOtherParams}
              loading={loading}
            />
          </RrhDrawer>
        </div>
      </div>
      <ProfitSharingReviewTable
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
            {loading ? (
              <TableCell>{t('common.loading')}</TableCell>
            ) : (
              <>
                {totalList.map(it => {
                  // 收益
                  if ('businessAmountToatl' in it) {
                    return (
                      <TableCell colSpan={1}>
                        {(it['businessAmountToatl'] || []).map((i, index) => {
                          return (
                            <div key={index}>
                              {(Number(i.amount) || 0).toFixed(2)} {i.currency}
                            </div>
                          );
                        })}
                      </TableCell>
                    );
                  }
                  // 业绩报酬金额
                  if ('rewardAmountToatl' in it) {
                    return (
                      <TableCell colSpan={2}>
                        {(it['rewardAmountToatl'] || []).map((i, index) => {
                          return (
                            <div key={index}>
                              {(Number(i.amount) || 0).toFixed(2)} {i.currency}
                            </div>
                          );
                        })}
                      </TableCell>
                    );
                  }
                  // 代理分润
                  if ('commissionToatl' in it) {
                    return (
                      <TableCell colSpan={1}>
                        {(it['commissionToatl'] || []).map((i, index) => {
                          return (
                            <div key={index}>
                              {(Number(i.amount) || 0).toFixed(2)} {i.currency}
                            </div>
                          );
                        })}
                      </TableCell>
                    );
                  }
                })}
              </>
            )}
          </>
        }
      />
    </div>
  );
};
