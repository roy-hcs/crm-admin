import { useMemo, useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Button } from '@/components/ui/button';
import { ProductReviewItem, ProductReviewListParams } from '@/api/hooks/pamm/type';
import { useProductReviewList } from '@/api/hooks/pamm';
import { ProductReviewForm } from './ProductReviewForm';
import { Funnel, Search, RefreshCcw, Ellipsis } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { RrhTag } from '@/components/common/RrhTag';
import { commissionReviewOptions } from '@/lib/const';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';

export const ProductReviewPage = () => {
  const [otherParams, setOtherParams] = useState<Omit<ProductReviewListParams, 'BasicParams'>>({
    investmentManager: '',
    projectName: '',
    submitStartTime: '',
    submitEndTime: '',
    verifyStartTime: '',
    verifyEndTime: '',
    login: '',
    applyStatus: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [resetKey, setResetKey] = useState(0);
  const { t } = useTranslation();

  const { data: data, isLoading: loading } = useProductReviewList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
  });

  const reset = () => {
    setOtherParams((pre: Omit<ProductReviewListParams, 'BasicParams'>) => ({
      ...pre,
      investmentManager: '',
      projectName: '',
      submitStartTime: '',
      submitEndTime: '',
      verifyStartTime: '',
      verifyEndTime: '',
      login: '',
      applyStatus: '',
    }));
    setResetKey(k => k + 1);
    setPageNum(0);
  };

  const allColumns = useMemo<CRMColumnDef<ProductReviewItem, unknown>[]>(
    () => [
      {
        id: 'No',
        header: t('table.index'),
        cell: ({ row }) => <div>{row.index + 1}</div>,
      },
      {
        id: 'createBy',
        header: t('productReview.investmentManager'),
        accessorFn: row => row.createBy || '-',
      },
      {
        id: 'projectName',
        header: t('table.projectName'),
        accessorFn: row => row.projectName || '-',
      },
      {
        id: 'model',
        header: t('productReview.model'),
        cell: ({ row }) => {
          if ([2].includes(row?.original?.model || 0)) {
            return t(`productReview.modelOptions.${row?.original?.model}`);
          }
          return '-';
        },
      },
      {
        id: 'login',
        header: t('table.login'),
        accessorFn: row => row.login || '-',
      },
      {
        id: 'applyStatus',
        header: t('table.status'),
        cell: ({ row }) => {
          const typeMap: Record<number | string, 'error' | 'success' | 'warning' | 'info'> = {
            0: 'warning',
            1: 'success',
            2: 'error',
          };
          const text = commissionReviewOptions.find(
            res => res.value === String(row?.original?.applyStatus),
          );
          return (
            <RrhTag type={typeMap[row?.original?.applyStatus || 0]}>
              {text?.label ? t(text.label) : '-'}
            </RrhTag>
          );
        },
      },
      {
        id: 'createTime',
        header: t('table.submitTime'),
        accessorFn: row => row.createTime || '-',
      },
      {
        id: 'verifyBy',
        header: t('table.verifyUser'),
        accessorFn: row => row.verifyBy || '-',
      },
      {
        id: 'verifyTime',
        header: t('table.verifyTime'),
        accessorFn: row => row.verifyTime || '-',
      },
      {
        id: 'operation',
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
    ],
    [t],
  );

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('product-review-table', allColumns);

  return (
    <div>
      <PageInfo title={t('productReview.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              key={resetKey}
              placeholder={t('common.pleaseInput', { field: t('table.projectName') })}
              className="h-9"
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={value => {
                setOtherParams(prev => ({ ...prev, projectName: value }));
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
              <ProductReviewForm
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
        />
      </TableContentWrapper>
    </div>
  );
};
