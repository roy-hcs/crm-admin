import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InvestmentReviewTable } from './InvestmentReviewTable';
import { InvestmentReviewForm } from './InvestmentReviewForm';
import { PammAuditLogListParams } from '@/api/hooks/pamm/type';
import { usePammAuditLogList } from '@/api/hooks/pamm';
import { TableCell } from '@/components/ui/table';

export const InvestmentReviewPage = () => {
  const [otherParams, setOtherParams] = useState<Omit<PammAuditLogListParams, 'BasicParams'>>({
    projectName: '',
    investor: '',
    operType: '',
    orderNo: '',
    auditStatus: '',
    createStartTime: '',
    createEndTime: '',
    auditStartTime: '',
    auditEndTime: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();

  const { data: data, isLoading: loading } = usePammAuditLogList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
  });

  const reset = () => {
    setOtherParams(pre => ({
      ...pre,
      projectName: '',
      investor: '',
      operType: '',
      orderNo: '',
      auditStatus: '',
      createStartTime: '',
      createEndTime: '',
      auditStartTime: '',
      auditEndTime: '',
    }));
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('investmentReview.title')}</h1>
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
            responsiveDirection={{
              mobile: 'bottom',
              desktop: 'right',
            }}
            footerShow={false}
            Trigger={
              <RrhButton variant="ghost" className="size-8">
                <Funnel />
              </RrhButton>
            }
          >
            <InvestmentReviewForm setOtherParams={setOtherParams} loading={loading} />
          </RrhDrawer>
        </div>
      </div>
      <InvestmentReviewTable
        data={data?.rows || []}
        pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={loading}
        CustomRow={
          <>
            <TableCell colSpan={5}>{t('table.total')}</TableCell>
            {loading ? (
              <TableCell>{t('common.loading')}</TableCell>
            ) : (
              <>
                <TableCell colSpan={1}>
                  {data?.totalList.map((i, index) => {
                    return (
                      <div key={index}>
                        {(Number(i.amountTotal) || 0).toFixed(2)} {i.currency}
                      </div>
                    );
                  })}
                </TableCell>
              </>
            )}
          </>
        }
      />
    </div>
  );
};
