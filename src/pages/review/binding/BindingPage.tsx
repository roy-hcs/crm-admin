import { useState } from 'react';
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

export function BindingPage() {
  const { t } = useTranslation();
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('');
  const [orderByColumn, setOrderByColumn] = useState<string>('status desc,subTime desc');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
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
    setKeyword('');
    setPageNum(0);
  };

  const allColumns: CRMColumnDef<BindVerifyListItem, unknown>[] = [
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
            <div>{t('common.status')}</div>
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
      label: t('common.status'),
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
      header: t('review.information.verifyUserName'),
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
      cell: () => <RrhButton variant="ghost">{t('table.audit')}</RrhButton>,
      fixed: 'right',
      size: 50,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('review-binding-table', allColumns);

  return (
    <div>
      <PageInfo title={t('review.binding.title')} />
      <div className="mt-3.5 mb-3.5 flex justify-between">
        <div className="w-67 max-w-sm">
          <RrhInputWithIcon
            placeholder={t('common.pleaseInput', { field: t('table.tradingAccount') })}
            className="h-9"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            rightIcon={<Search className="size-4" />}
            onRightIconClick={() => {
              setCommonParams(prev => ({ ...prev, login: keyword }));
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
    </div>
  );
}
