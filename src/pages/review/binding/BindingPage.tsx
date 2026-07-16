import { useCallback, useMemo, useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { BindingForm } from './BindingForm';
import { Funnel, Search, RefreshCcw } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { useBindVerifyList, CrmNewLoginVerifyListParams } from '@/api/hooks/review';
import { Button } from '@/components/ui/button';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { BindVerifyListItem } from '@/api/hooks/review';
import { VerifyStatusOptions } from '@/lib/const';
import { RrhOrderStatusTag } from '@/components/common/RrhOrderStatusTag';
import { RrhSorter } from '@/components/common/RrhSorter';
import { RrhButton } from '@/components/common/RrhButton';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { useTabActions } from '@/hooks/useTabActions';

export function BindingPage() {
  const { t } = useTranslation();
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('');
  const [orderByColumn, setOrderByColumn] = useState<string>('status desc,subTime desc');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [resetKey, setResetKey] = useState(0);
  const [params, setParams] = useState<CrmNewLoginVerifyListParams['params']>({
    server: '',
    serverProperty: '',
    beginTime: '',
    endTime: '',
  });
  const [commonParams, setCommonParams] = useState({
    userId: '',
    status: '',
    login: '',
    verifyUserName: '',
  });
  const { data: data, isLoading: loading } = useBindVerifyList({
    params,
    pageSize,
    ...commonParams,
    pageNum: pageNum + 1,
    isAsc: isAsc,
    orderByColumn: orderByColumn,
  });
  const reset = () => {
    setParams(pre => ({ ...pre, beginTime: '', endTime: '' }));
    setCommonParams({
      userId: '',
      status: '',
      login: '',
      verifyUserName: '',
    });
    setResetKey(k => k + 1);
    setPageNum(0);
  };

  const { openTab } = useTabActions();

  const goToDetail = useCallback(
    (row: BindVerifyListItem) => {
      const type = ![-1, 2].includes(Number(row.status)) ? 'detail' : 'audit';
      const url = `/review/binding/detail?type=${type}&id=${row.id}`;
      openTab({
        key: url,
        title: t('binding.bindingReviewDetail'),
        path: url,
      });
    },
    [openTab, t],
  );

  const allColumns = useMemo<CRMColumnDef<BindVerifyListItem, unknown>[]>(
    () => [
      {
        id: 'No.',
        header: t('table.index'),
        cell: ({ row }) => <div>{row.index + 1}</div>,
      },
      {
        id: 'name',
        header: t('table.fullName'),
        cell: ({ row }) => {
          if (row?.original?.userLastName || row?.original?.userShowId || row?.original?.userName) {
            return (
              <div>
                <div>
                  {(row?.original?.userLastName || '') + ' ' + (row?.original?.userName || '')}
                </div>
                <div>{row?.original?.userShowId}</div>
              </div>
            );
          } else {
            return <div className="text-center">-</div>;
          }
        },
      },
      {
        id: 'aliasName',
        header: t('common.server'),
        accessorKey: 'aliasName',
        cell: ({ row }) => {
          if (row?.original?.aliasName && row?.original?.severProperty) {
            return (
              <div>
                {row?.original?.aliasName}
                {Number(row?.original?.severProperty || 0) === 1
                  ? t('common.live')
                  : t('common.demo')}
              </div>
            );
          } else {
            return <div className="text-center">-</div>;
          }
        },
      },
      {
        id: 'staName',
        header: t('table.tradingAccount'),
        accessorKey: 'staName',
        cell: ({ row }) => row.original.login || '-',
      },
      {
        id: 'status',
        header: () => {
          return (
            <div className="flex items-center justify-between gap-2">
              <div>{t('table.status')}</div>
              <RrhSorter
                orderByColumn={orderByColumn}
                isAsc={isAsc}
                column="status"
                setOrderByColumn={setOrderByColumn}
                setIsAsc={setIsAsc}
              />
            </div>
          );
        },
        label: t('table.status'),
        accessorKey: 'status',
        cell: ({ row }) => (
          <RrhOrderStatusTag status={String(row.original.status)} options={VerifyStatusOptions} />
        ),
      },
      {
        id: 'subTime',
        header: () => {
          return (
            <div className="flex items-center justify-between gap-2">
              <div>{t('common.subTime')}</div>
              <RrhSorter
                orderByColumn={orderByColumn}
                isAsc={isAsc}
                column="subTime"
                setOrderByColumn={setOrderByColumn}
                setIsAsc={setIsAsc}
              />
            </div>
          );
        },
        label: t('common.subTime'),
        accessorKey: 'subTime',
        cell: ({ row }) => row.original.subTime || '-',
      },
      {
        id: 'verifyUserName',
        header: t('information.verifyUserName'),
        accessorKey: 'verifyUserName',
        cell: ({ row }) => row.original.verifyUserName || '-',
      },
      {
        id: 'verifyTime',
        header: () => {
          return (
            <div className="flex items-center justify-between gap-2">
              <div>{t('common.verifyTime')}</div>
              <RrhSorter
                orderByColumn={orderByColumn}
                isAsc={isAsc}
                column="verifyTime"
                setOrderByColumn={setOrderByColumn}
                setIsAsc={setIsAsc}
              />
            </div>
          );
        },
        label: t('common.verifyTime'),
        accessorKey: 'verifyTime',
        cell: ({ row }) => row.original.verifyTime || '-',
      },
      {
        id: 'operation',
        header: () => {
          return <div className="flex justify-center">{t('common.Operation')}</div>;
        },
        label: t('common.Operation'),
        cell: ({ row }) => (
          <RrhButton variant="ghost" onClick={() => goToDetail(row.original)}>
            {String(row?.original?.status) !== '2' ? t('common.View') : t('table.audit')}
          </RrhButton>
        ),
        fixed: 'right',
        size: 50,
      },
    ],
    [t, isAsc, orderByColumn, setOrderByColumn, setIsAsc, goToDetail],
  );

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('review-binding-table', allColumns);

  return (
    <div>
      <PageInfo title={t('binding.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              key={resetKey}
              placeholder={t('common.pleaseInput', { field: t('table.tradingAccount') })}
              className="h-9"
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={value => {
                setCommonParams(prev => ({ ...prev, login: value }));
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
              <BindingForm
                params={params}
                commonParams={commonParams}
                reset={reset}
                setParams={setParams}
                setCommonParams={setCommonParams}
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
}
