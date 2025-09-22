import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SystemFundOperationsForm } from './SystemFundOperationsForm';
import { TableCell } from '@/components/ui/table';
import { SystemFundOperationsTable } from './SystemFundOperationsTable';
import { SystemFundOperationRecordListParams } from '@/api/hooks/report/types';
import {
  useSystemFundOperationRecordList,
  useSystemFundOperationRecordSum,
} from '@/api/hooks/report/report';

export const SystemFundOperationsPage = () => {
  const [params, setParams] = useState<SystemFundOperationRecordListParams['params']>({
    name: '',
    login: '',
    ticket: '',
    operationStart: '',
    operationEnd: '',
    operName: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<SystemFundOperationRecordListParams, 'params'>
  >({
    type: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();

  const { data: systemFunOperationRecordList, isLoading: systemFunOperationRecordListLoading } =
    useSystemFundOperationRecordList(
      {
        pageSize,
        pageNum: pageNum + 1,
        orderByColumn: '',
        isAsc: 'asc',
        ...otherParams,
        params: {
          ...params,
        },
      },
      { enabled: true },
    );

  const {
    mutate: getOperationRecordSum,
    data: sumData,
    isPending,
  } = useSystemFundOperationRecordSum();

  const [sumShow, setSumShow] = useState(false);
  const getSumData = () => {
    setSumShow(true);
    getOperationRecordSum({
      ...otherParams,
      params: {
        ...params,
      },
    });
  };

  useEffect(() => {
    setSumShow(false);
  }, [systemFunOperationRecordList]);
  const reset = () => {
    setParams({
      name: '',
      login: '',
      ticket: '',
      operationStart: '',
      operationEnd: '',
      operName: '',
    });
    setOtherParams({
      type: '',
    });
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('systemFundOperationsPage.title')}</h1>
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setParams(prev => ({ ...prev, ticket: e }));
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
            <SystemFundOperationsForm
              setParams={setParams}
              setOtherParams={setOtherParams}
              loading={systemFunOperationRecordListLoading}
            />
          </RrhDrawer>
        </div>
      </div>
      <SystemFundOperationsTable
        data={systemFunOperationRecordList?.rows || []}
        pageCount={Math.ceil(+(systemFunOperationRecordList?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={systemFunOperationRecordListLoading}
        CustomRow={
          <>
            <TableCell colSpan={1}>{t('table.total')}</TableCell>
            {!sumShow && (
              <TableCell colSpan={9}>
                <RrhButton variant="ghost" onClick={getSumData}>
                  {t('table.clickToGetSum')}
                </RrhButton>
              </TableCell>
            )}
            {sumShow ? (
              isPending ? (
                <TableCell colSpan={9}>{t('common.loading')}</TableCell>
              ) : (
                <>
                  <TableCell colSpan={9}>
                    {sumData?.data.map((item, index) => {
                      return (
                        <div
                          key={`${item.currency}-${index}`}
                          className="flex flex-col items-center"
                        >
                          {t('table.balance')} {item.amount} {item.currency}
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
