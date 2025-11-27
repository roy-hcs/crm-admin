import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BasicParams } from '@/api/hooks/review/types';
import { useServerList } from '@/api/hooks/system/system';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { PammReportSettlementListParams } from '@/api/hooks/pamm/type';
import { usePammReportSettlementList } from '@/api/hooks/pamm';
import { TableCell } from '@/components/ui/table';
import { AccrualReportForm } from './AccrualReportForm';
import { AccrualReportTable } from './AccrualReportTable';

export const AccrualReportPage = () => {
  const [otherParams, setOtherParams] = useState<
    Omit<PammReportSettlementListParams, 'params' | keyof BasicParams>
  >({
    serverId: '',
    projectName: '',
    userName: '',
    orderNo: '',
    managerName: '',
    settlementType: '',
    startTime: '',
    endTime: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('asc');
  const [orderByColumn, setOrderByColumn] = useState<string>('');
  const { t } = useTranslation();
  const { data: server, isLoading: serverLoading } = useServerList();

  const { data: pammInvestReports, isLoading: pammInvestReportsLoading } =
    usePammReportSettlementList({
      pageSize,
      pageNum: pageNum + 1,
      orderByColumn,
      isAsc,
      ...otherParams,
    });
  const reset = () => {
    setOtherParams({
      serverId: '',
      projectName: '',
      userName: '',
      orderNo: '',
      managerName: '',
      settlementType: '',
      startTime: '',
      endTime: '',
    });
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('PammSettlementReport.title')}</h1>
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('table.projectName') })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setOtherParams(prev => ({ ...prev, projectName: e }));
            setPageNum(1);
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
            <AccrualReportForm
              serverOptions={server?.rows || []}
              setOtherParams={setOtherParams}
              loading={pammInvestReportsLoading || serverLoading}
            />
          </RrhDrawer>
        </div>
      </div>
      <AccrualReportTable
        data={pammInvestReports?.rows || []}
        pageCount={Math.ceil(+(pammInvestReports?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={pammInvestReportsLoading}
        orderByColumn={orderByColumn}
        setOrderByColumn={setOrderByColumn}
        isAsc={isAsc}
        setIsAsc={setIsAsc}
        CustomRow={
          <>
            <TableCell colSpan={8}>{t('table.total')}</TableCell>
            <TableCell colSpan={1}>
              {pammInvestReports?.totalList?.map(item => {
                return (
                  <div key={`${item.currency} + ${item.currency}`}>
                    {item.businessAmountTotal ? (
                      <div>
                        {item.businessAmountTotal.toFixed(2)} {item.currency}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </TableCell>
            <TableCell colSpan={1}>
              {pammInvestReports?.totalList?.map(item => {
                return (
                  <div key={`${item.currency} + ${item.currency}`}>
                    {item.commissionTotal ? (
                      <div>
                        {item.commissionTotal.toFixed(2)} {item.currency}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </TableCell>
            <TableCell colSpan={1}>
              {pammInvestReports?.totalList?.map(item => {
                return (
                  <div key={`${item.currency} + ${item.currency}`}>
                    {item.rewardAmountTotal ? (
                      <div>
                        {item.rewardAmountTotal.toFixed(2)} {item.currency}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </TableCell>
          </>
        }
      />
    </div>
  );
};
