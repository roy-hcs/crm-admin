import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BasicParams } from '@/api/hooks/review/types';
import { useServerList } from '@/api/hooks/system/system';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { PammReportInvestListParams } from '@/api/hooks/pamm/type';
import { usePammReportInvestList } from '@/api/hooks/pamm';
import { InvestmentReportForm } from './InvestmentReportForm';
import { InvestmentReportTable } from './InvestmentReportTable';
import { TableCell } from '@/components/ui/table';

export const InvestmentReportPage = () => {
  const [otherParams, setOtherParams] = useState<
    Omit<PammReportInvestListParams, keyof BasicParams>
  >({
    serverId: '',
    projectName: '',
    profitType: '',
    userName: '',
    type: '',
    orderNo: '',
    status: '',
    startTime: '',
    endTime: '',
    confirmEndTime: '',
    confirmStartTime: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const { data: server, isLoading: serverLoading } = useServerList();

  const { data: pammInvestReports, isLoading: pammInvestReportsLoading } = usePammReportInvestList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
  });
  const reset = () => {
    setOtherParams({
      serverId: '',
      projectName: '',
      profitType: '',
      userName: '',
      type: '',
      orderNo: '',
      status: '',
      startTime: '',
      endTime: '',
      confirmEndTime: '',
      confirmStartTime: '',
    });
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('PammInvestReport.title')}</h1>
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
            <InvestmentReportForm
              serverOptions={server?.rows || []}
              setOtherParams={setOtherParams}
              loading={pammInvestReportsLoading || serverLoading}
            />
          </RrhDrawer>
        </div>
      </div>
      <InvestmentReportTable
        data={pammInvestReports?.rows || []}
        pageCount={Math.ceil(+(pammInvestReports?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={pammInvestReportsLoading}
        CustomRow={
          <>
            <TableCell colSpan={3}>{t('table.total')}</TableCell>
            <TableCell colSpan={6}>
              <div className="flex flex-col items-center">
                {pammInvestReports?.totalList?.map(item => {
                  return (
                    <div key={`${item.currency} + ${item.currency}`}>
                      {(item.amountTotal || 0).toFixed(2)} {item.currency}
                    </div>
                  );
                })}
              </div>
            </TableCell>
          </>
        }
      />
    </div>
  );
};
