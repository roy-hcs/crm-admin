import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SystemFundOperationsForm } from './SystemFundOperationsForm';
import { TableCell } from '@/components/ui/table';
import {
  SystemFundOperationRecordItem,
  SystemFundOperationRecordListParams,
  useSystemFundOperationRecordList,
  useSystemFundOperationRecordSum,
} from '@/api/hooks/report';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { financeTypeMap } from '@/lib/constant';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

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
  const [keyword, setKeyword] = useState('');
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
    setKeyword('');
    setPageNum(0);
  };
  const allColumns: CRMColumnDef<SystemFundOperationRecordItem, unknown>[] = [
    {
      id: 'orderNumber',
      header: t('table.orderNumber'),
      accessorFn: row => row.orderNumber,
    },
    {
      id: 'CRMAccount',
      header: t('table.CRMAccount'),
      cell: ({ row }) => {
        return !row.original.crmName && !row.original.crmShowId ? (
          <div className="text-center">-</div>
        ) : (
          <div>
            <div>{row.original.crmName}</div>
            <div>{row.original.crmShowId}</div>
          </div>
        );
      },
    },
    {
      id: 'fundAccount',
      header: t('table.fundAccount'),
      cell: ({ row }) => (
        <div className="flex flex-col items-center">
          <div>{row.original.server}</div>
          <div>{row.original.accountId}</div>
        </div>
      ),
    },
    {
      id: 'way',
      header: t('table.way'),
      accessorFn: row => t(financeTypeMap[row.type as keyof typeof financeTypeMap] || ''),
    },
    {
      id: 'amount',
      header: t('table.amount'),
      cell: ({ row }) => (
        <div>
          {row.original.amount} {row.original.currency}
        </div>
      ),
    },
    {
      id: 'remarks',
      header: t('table.remarks'),
      accessorFn: row => row.comment,
    },
    {
      id: 'operationPerson',
      header: t('table.operationPerson'),
      accessorFn: row => row.operName,
    },
    {
      id: 'operationIP',
      header: t('table.operationIP'),
      cell: ({ row }) => (
        <div>
          {row.original.operIp} ({row.original.operAddress})
        </div>
      ),
    },
    {
      id: 'operationTime',
      header: t('table.operationTime'),
      accessorFn: row => row.operTime,
    },
    {
      id: 'tradingServerOrderNumber',
      header: t('table.tradingServerOrderNumber'),
      accessorFn: row => row.serverOrder || '-',
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility<SystemFundOperationRecordItem>('system-fund-operations-table', allColumns);

  return (
    <div>
      <PageInfo title={t('systemFundOperationsPage.title')} />
      <TableContentWrapper>
        <div className="my-3.5 flex items-center justify-between">
          <RrhInputWithIcon
            placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
            className="h-9"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            leftIcon={<Search className="size-4 cursor-pointer" />}
            onLeftIconClick={e => {
              setParams(prev => ({ ...prev, ticket: e }));
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
              <SystemFundOperationsForm
                reset={reset}
                params={params}
                otherParams={otherParams}
                setParams={setParams}
                setOtherParams={setOtherParams}
                loading={systemFunOperationRecordListLoading}
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
      </TableContentWrapper>
    </div>
  );
};
