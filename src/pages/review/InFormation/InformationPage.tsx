import { useState } from 'react';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { InformationForm } from './InformationForm';
import { Funnel, Search, RefreshCcw } from 'lucide-react';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useTranslation } from 'react-i18next';
import { useCrmInfoVerifyList, CrmInfoVerifyListParams } from '@/api/hooks/review';
import { Button } from '@/components/ui/button';
import { useInfoTypeList } from '@/api/hooks/system/system';
import { InfoTypeItem } from '@/api/hooks/system/types';
import { PageInfo } from '@/components/common/PageInfo';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { CrmInfoVerifyItem } from '@/api/hooks/review';
import { VerifyStatusOptions } from '@/lib/const';
import { RrhOrderStatusTag } from '@/components/common/RrhOrderStatusTag';
import { RrhSorter } from '@/components/common/RrhSorter';
import { RrhButton } from '@/components/common/RrhButton';

export function InformationPage() {
  const { t } = useTranslation();
  const { data: useInfoTyperesponse, isLoading: useInfoTypeloading } = useInfoTypeList();
  const infoTypeList: InfoTypeItem[] = Array.isArray(useInfoTyperesponse)
    ? useInfoTyperesponse
    : [];
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('desc');
  const [orderByColumn, setOrderByColumn] = useState<string>('');
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [params, setParams] = useState<CrmInfoVerifyListParams['params']>({
    beginTime: '',
    endTime: '',
  });
  const [commonParams, setCommonParams] = useState({
    userId: '',
    infoType: '',
    status: '',
    verifyUserName: '',
  });
  const { data: data, isLoading: loading } = useCrmInfoVerifyList({
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
      infoType: '',
      status: '',
      verifyUserName: '',
    });
    setKeyword('');
    setPageNum(0);
  };

  const allColumns: CRMColumnDef<CrmInfoVerifyItem, unknown>[] = [
    {
      id: 'No.',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'name',
      header: t('table.fullName'),
      accessorFn: row => `${row.userLastName} ${row.userName}`,
      cell: ({ row }) => {
        return !row.original.userLastName && !row.original.userShowId ? (
          <div className="text-center">-</div>
        ) : (
          <div>
            <div>{row.original.userLastName}</div>
            <div>{row.original.userShowId}</div>
          </div>
        );
      },
    },
    {
      id: 'infoType',
      label: t('review.information.infoType'),
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('review.information.infoType')}</div>
            <RrhSorter
              orderByColumn={orderByColumn}
              isAsc={isAsc}
              column="infoType"
              setOrderByColumn={setOrderByColumn}
              setIsAsc={setIsAsc}
            />
          </div>
        );
      },
      accessorKey: 'infoType',
      cell: ({ row }) => {
        const infoType = infoTypeList.find(
          item => Number(item.dictValue) === Number(row.original.infoType),
        );
        return <div>{infoType ? infoType.dictLabel : '-'}</div>;
      },
    },
    {
      id: 'status',
      label: t('common.status'),
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
      accessorKey: 'status',
      cell: ({ row }) => (
        <RrhOrderStatusTag status={String(row.original.status)} options={VerifyStatusOptions} />
      ),
    },
    {
      id: 'subTime',
      label: t('common.subTime'),
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
      label: t('review.information.verifyTime'),
      header: () => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div>{t('review.information.verifyTime')}</div>
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
      accessorKey: 'verifyTime',
      cell: ({ row }) => row.original.verifyTime || '-',
    },
    {
      id: 'operation',
      label: t('common.Operation'),
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      cell: () => <RrhButton variant="ghost">{t('table.audit')}</RrhButton>,
      fixed: 'right',
      size: 50,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('review-information-table', allColumns);

  return (
    <div>
      <PageInfo title={t('review.information.title')} />
      <div className="mt-3.5 mb-3.5 flex justify-between">
        <div className="w-67 max-w-sm">
          <RrhInputWithIcon
            placeholder={t('common.pleaseInput', { field: t('review.information.verifyUserName') })}
            className="h-9"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            rightIcon={<Search className="size-4" />}
            onRightIconClick={() => {
              setCommonParams(prev => ({ ...prev, verifyUserName: keyword }));
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
            <InformationForm
              params={params}
              commonParams={commonParams}
              reset={reset}
              setParams={setParams}
              setCommonParams={setCommonParams}
              infoTypeList={infoTypeList}
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
        loading={loading || useInfoTypeloading}
      />
    </div>
  );
}
