import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import {
  CrmDealAccountFundFlowItem,
  CrmDealAccountFundFlowParams,
  useCrmDealAccountFundFlow,
} from '@/api/hooks/account';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { useDictType } from '@/api/hooks/system';
import { FundFlowForm } from './FundFlowForm';
import { useTranslation } from 'react-i18next';
import { TableCell } from '@/components/ui/table';
import { oprType } from '@/lib/utils';

export const FundFlowPage = ({ id }: { id: string }) => {
  const [params, setParams] = useState<CrmDealAccountFundFlowParams['params']>({
    operationStart: '',
    operationEnd: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<
      CrmDealAccountFundFlowParams,
      'params' | 'pageSize' | 'pageNum' | 'orderByColumn' | 'isAsc'
    >
  >({
    ticket: '',
    opeTypeList: '',
    comment: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const { t } = useTranslation();
  const { data: typeRes, isLoading: typeResloading } = useDictType('sys_finance_type');
  const { data: data, isLoading: loading } = useCrmDealAccountFundFlow(id, {
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
    params,
  });

  const reset = () => {
    setParams(pre => ({
      ...pre,
      operationStart: '',
      operationEnd: '',
    }));
    setOtherParams({
      ticket: '',
      opeTypeList: '',
      comment: '',
    });
    setKeyword('');
    setPageNum(0);
  };

  const allColumns: CRMColumnDef<CrmDealAccountFundFlowItem, unknown>[] = [
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'login',
      header: t('table.tradingAccount'),
      cell: ({ row }) => row?.original?.login || '-',
    },
    {
      id: 'name',
      header: t('table.fullName'),
      cell: ({ row }) => row?.original?.name || '-',
    },
    {
      id: 'flowType',
      header: t('table.operationType'),
      cell: ({ row }) => {
        const type = oprType(row.original);
        return type ? t(type) : '-';
      },
    },
    {
      id: 'profit',
      header: t('tradingAccountTransactions.profit'),
      cell: ({ row }) =>
        `${row?.original?.profit && row?.original?.profit > 0 ? '+' : ''}${(row?.original?.profit || 0).toFixed(row?.original?.digits || 2)} ${row?.original?.currency}`,
    },
    {
      id: 'timeStr',
      header: t('table.time'),
      cell: ({ row }) => row?.original?.timeStr || '-',
    },
    {
      id: 'ticket',
      header: t('table.orderNumber'),
      cell: ({ row }) => row?.original?.ticket || '-',
    },
    {
      id: 'comment',
      header: t('table.comment'),
      cell: ({ row }) => row?.original?.comment || '-',
    },
  ];
  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('fund-flow-table', allColumns);

  return (
    <div>
      <TableContentWrapper>
        <div className="mb-3 flex items-center justify-between">
          <RrhInputWithIcon
            placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
            className="h-9"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            leftIcon={<Search className="size-4 cursor-pointer" />}
            onLeftIconClick={e => {
              setOtherParams(prev => ({ ...prev, ticket: e }));
              setPageNum(0);
            }}
          />
          <div className="flex items-center justify-end gap-2">
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
              <FundFlowForm
                setParams={setParams}
                setOtherParams={setOtherParams}
                loading={loading || typeResloading}
                reset={reset}
                typeOptions={
                  typeRes?.map(res => ({ label: res.dictLabel, value: res.dictValue })) || []
                }
                params={params}
                otherParams={otherParams}
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
          data={data?.rows || []}
          pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={loading || typeResloading}
          CustomRow={
            <>
              <TableCell colSpan={4}>{t('table.total')}</TableCell>
              {loading || typeResloading ? (
                <TableCell>{t('common.loading')}</TableCell>
              ) : (
                <>
                  <TableCell colSpan={1}>
                    <div>{(data?.priceSum || 0).toFixed(2)}</div>
                  </TableCell>
                </>
              )}
            </>
          }
        />
      </TableContentWrapper>
    </div>
  );
};
