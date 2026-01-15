import { useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { PammAuditLogItem, PammAuditLogListParams } from '@/api/hooks/pamm/type';
import { usePammAuditLogList } from '@/api/hooks/pamm';
import { InvestmentReviewForm } from './InvestmentReviewForm';
import { Funnel, Search, RefreshCcw, Ellipsis } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { TableCell } from '@/components/ui/table';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { InvestmentReviewOperTypeOptions, InvestmentReviewStatusOptions } from '@/lib/const';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

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
  const [keyword, setKeyword] = useState('');
  const { t } = useTranslation();

  const { data: data, isLoading: loading } = usePammAuditLogList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
  });

  const reset = () => {
    setOtherParams((pre: Omit<PammAuditLogListParams, 'BasicParams'>) => ({
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
    setKeyword('');
    setPageNum(0);
  };

  const allColumns: CRMColumnDef<PammAuditLogItem, unknown>[] = [
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'projectName',
      header: t('table.projectName'),
      accessorFn: row => row.projectName || '-',
    },
    {
      id: 'investor',
      header: t('table.customerName'),
      accessorFn: row => row.investor || '-',
    },
    {
      id: 'operType',
      header: t('investmentReview.operType'),
      cell: ({ row }) => {
        const text = InvestmentReviewOperTypeOptions.find(
          res => res.value === String(row?.original?.operType),
        );
        return text?.label ? t(text.label) : '-';
      },
    },
    {
      id: 'auditStatus',
      header: t('common.status'),
      cell: ({ row }) => {
        const text = InvestmentReviewStatusOptions.find(
          res => res.value === String(row?.original?.auditStatus),
        );
        return text?.label ? t(text.label) : '-';
      },
    },
    {
      id: 'amount',
      header: t('table.amount'),
      cell: ({ row }) => {
        return (row?.original?.amount || '0') + (row?.original?.currency || '');
      },
    },
    {
      id: 'createTime',
      header: t('table.submitTime'),
      accessorFn: row => row.createTime || '-',
    },
    {
      id: 'auditor',
      header: t('table.verifyUser'),
      accessorFn: row => row.auditor || '-',
    },
    {
      id: 'auditTime',
      header: t('table.verifyTime'),
      accessorFn: row => row.auditTime || '-',
    },
    {
      id: 'orderNo',
      header: t('table.orderNumber'),
      accessorFn: row => row.orderNo || '-',
    },
    {
      id: 'operation',
      label: t('common.Operation'),
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      cell: () => (
        <div>
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[{ label: t('table.audit'), value: 'edit' }]}
            callToAction={() => {}}
          />
        </div>
      ),
      fixed: 'right',
      size: 50,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('investment-review-table', allColumns);

  return (
    <div>
      <PageInfo title={t('investmentReview.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              placeholder={t('common.pleaseInput', { field: t('table.projectName') })}
              className="h-9"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={() => {
                setOtherParams(prev => ({ ...prev, projectName: keyword }));
                setPageNum(0);
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
              <RefreshCcw className="size-3.5" />
            </Button>
            <RrhDrawer
              asChild
              Trigger={
                <Button variant="ghost" className="size-8 cursor-pointer">
                  <Funnel className="size-4" />
                </Button>
              }
              title="Filter"
              responsiveDirection={{
                mobile: 'bottom',
                desktop: 'right',
              }}
              footerShow={false}
            >
              <InvestmentReviewForm
                otherParams={otherParams}
                reset={reset}
                setOtherParams={setOtherParams}
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
      </TableContentWrapper>
    </div>
  );
};
