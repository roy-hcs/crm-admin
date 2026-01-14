import { useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { PammCommissionItem, PammCommissionListParams } from '@/api/hooks/pamm/type';
import { usePammCommissionList } from '@/api/hooks/pamm';
import { CommissionReviewForm } from './CommissionReviewForm';
import { Funnel, Search, RefreshCcw, Ellipsis } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BasicParams } from '@/api/types';
import { TableCell } from '@/components/ui/table';
import { transformTotalList } from '@/lib/utils';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { commissionReviewOptions } from '@/lib/const';
import { serverMap } from '@/lib/constant';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

export const CommissionReviewPage = () => {
  const [params, setParams] = useState<PammCommissionListParams['params']>({
    beginTime: '',
    endTime: '',
    auditBeginTime: '',
    auditEndTime: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<PammCommissionListParams, 'params' | keyof BasicParams>
  >({
    commissionType: '',
    serverId: '',
    projectName: '',
    customerName: '',
    orderNo: '',
    verifyStatus: '',
    profitType: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const { t } = useTranslation();

  const { data: data, isLoading: loading } = usePammCommissionList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
    params,
  });

  const totalList = transformTotalList(data?.totalList, ['businessAmountToatl', 'commissionToatl']);

  const reset = () => {
    setParams((pre: PammCommissionListParams['params']) => ({
      ...pre,
      beginTime: '',
      endTime: '',
      auditBeginTime: '',
      auditEndTime: '',
    }));
    setOtherParams((pre: Omit<PammCommissionListParams, 'params' | keyof BasicParams>) => ({
      ...pre,
      commissionType: '',
      serverId: '',
      projectName: '',
      customerName: '',
      orderNo: '',
      verifyStatus: '',
      profitType: '',
    }));
    setKeyword('');
    setPageNum(0);
  };

  const allColumns: CRMColumnDef<PammCommissionItem, unknown>[] = [
    {
      id: 'No',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'serverName',
      header: t('table.server'),
      cell: ({ row }) => {
        return (
          <div>
            {row?.original?.serverName}
            <span> {serverMap[row?.original?.serverType] || ''}</span>
          </div>
        );
      },
    },
    {
      id: 'projectName',
      header: t('table.projectName'),
      accessorFn: row => row.projectName || '-',
    },
    {
      id: 'customerName',
      header: t('table.customerName'),
      accessorFn: row => row.customerName || '-',
    },
    {
      id: 'businessAmount',
      header: t('table.amount'),
      cell: ({ row }) => {
        return (row?.original?.businessAmount || '0') + row?.original?.currency || '';
      },
    },
    {
      id: 'orderNo',
      header: t('table.orderNumber'),
      accessorFn: row => row.orderNo || '-',
    },
    {
      id: 'commission',
      header: t('commissionReview.commission'),
      cell: ({ row }) => {
        return (row?.original?.commission || '0') + row?.original?.currency || '';
      },
    },
    {
      id: 'verifyStatus',
      header: t('common.status'),
      cell: ({ row }) => {
        const text = commissionReviewOptions.find(
          res => res.value === String(row?.original?.verifyStatus),
        );
        return text?.label ? t(text.label) : '-';
      },
    },
    {
      id: 'submitTime',
      header: t('table.submitTime'),
      accessorFn: row => row.submitTime || '-',
    },
    {
      id: 'verifyUser',
      header: t('table.verifyUser'),
      accessorFn: row => row.verifyUser || '-',
    },
    {
      id: 'verifyTime',
      header: t('table.verifyTime'),
      accessorFn: row => row.verifyTime || '-',
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
    useColumnVisibility('commission-review-table', allColumns);

  return (
    <div>
      <PageInfo title={t('commissionReview.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
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
              <CommissionReviewForm
                params={params}
                otherParams={otherParams}
                reset={reset}
                setParams={setParams}
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
              <TableCell colSpan={4}>{t('table.total')}</TableCell>
              {loading ? (
                <TableCell>{t('common.loading')}</TableCell>
              ) : (
                <>
                  {totalList.map(it => {
                    if ('businessAmountToatl' in it) {
                      return (
                        <TableCell colSpan={2}>
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
                    if ('commissionToatl' in it) {
                      return (
                        <TableCell colSpan={2}>
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
      </TableContentWrapper>
    </div>
  );
};
