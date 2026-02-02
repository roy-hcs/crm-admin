import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCrmDealGoodsList, CrmDealGoodsListParams, GoodsListItem } from '@/api/hooks/pointsMall';
import { PageInfo } from '@/components/common/PageInfo';
import { Button } from '@/components/ui/button';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { CRMColumnDef, DataTable } from '@/components/table';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { ColumnVisibilityButton } from '@/components/common/ColumnVisibilityButton';
import { RrhDropdown } from '@/components/common/RrhDropdown';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Ellipsis } from 'lucide-react';
import { RrhSorter } from '@/components/common/RrhSorter';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import { ProductsForm } from './components/ProductsForm';
import { StatusCell } from './components/StatusCell';
import { DeleteAlert } from './components/DeleteAlert';

export const ProductsPage = () => {
  const { t } = useTranslation();
  const [params, setParams] = useState<CrmDealGoodsListParams['params']>({
    goodsName: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [isAsc, setIsAsc] = useState<'asc' | 'desc' | ''>('asc');
  const [orderByColumn, setOrderByColumn] = useState('');
  const [row, setRow] = useState<GoodsListItem>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    data: data,
    isLoading: loading,
    refetch,
  } = useCrmDealGoodsList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn,
    isAsc: isAsc || 'asc',
    params,
  });

  const reset = () => {
    setParams(pre => ({
      ...pre,
      goodsName: '',
    }));
    setKeyword('');
    setPageNum(0);
    setPageSize(10);
    setIsAsc('asc');
    setOrderByColumn('');
  };

  const allColumns: CRMColumnDef<GoodsListItem, unknown>[] = [
    {
      id: 'No.',
      header: t('table.index'),
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: 'id',
      header: t('products.goodId'),
      accessorFn: row => row.id,
      cell: ({ row }) => <div>{row?.original?.id}</div>,
    },
    {
      id: 'goodsName',
      header: t('products.name'),
      accessorFn: row => row.goodsName,
      cell: ({ row }) => {
        return <div>{row?.original?.goodsName || '-'}</div>;
      },
    },
    {
      id: 'exchangePoints',
      label: t('products.exchangePoints'),
      header: () => (
        <div className="flex items-center gap-1">
          {t('products.exchangePoints')}
          <RrhSorter
            setIsAsc={setIsAsc}
            isAsc={isAsc}
            orderByColumn={orderByColumn}
            setOrderByColumn={setOrderByColumn}
            column="exchangePoints"
          />
        </div>
      ),
      accessorFn: row => row.exchangePoints,
      cell: ({ row }) => {
        return <div>{row?.original?.exchangePoints || '-'}</div>;
      },
    },
    {
      id: 'combinationPaymentList',
      header: t('products.exchangeAmount'),
      accessorFn: row => row.combinationPaymentList,
      cell: ({ row }) => {
        if (
          row?.original?.combinationPaymentList?.[0]?.exchangeAmount &&
          row?.original?.combinationPaymentList?.[0]?.exchangePoint
        ) {
          return (
            <Tooltip>
              <TooltipTrigger>
                {row?.original?.combinationPaymentList?.[0]?.exchangeAmount}USD
              </TooltipTrigger>
              <TooltipContent>
                {row?.original?.combinationPaymentList?.[0]?.exchangePoint +
                  `+${row?.original?.combinationPaymentList?.[0]?.exchangeAmount}USD`}
              </TooltipContent>
            </Tooltip>
          );
        }
        return '-';
      },
    },
    {
      id: 'goodsType',
      header: t('products.goodsType'),
      accessorFn: row => row.goodsType,
      cell: ({ row }) => {
        return (
          <div>
            {String(row?.original?.goodsType) === '2'
              ? t('products.physicalGoods')
              : t('products.virtualGoods')}
          </div>
        );
      },
    },
    {
      id: 'status',
      header: t('table.status'),
      accessorFn: row => row.status,
      cell: ({ row }) => {
        return <StatusCell row={row} onSuccess={refetch} />;
      },
    },
    {
      id: 'viewCount',
      label: t('products.viewCount'),
      header: () => (
        <div className="flex items-center gap-1">
          {t('products.viewCount')}
          <RrhSorter
            setIsAsc={setIsAsc}
            isAsc={isAsc}
            orderByColumn={orderByColumn}
            setOrderByColumn={setOrderByColumn}
            column="viewCount"
          />
        </div>
      ),
      accessorFn: row => row.viewCount,
      cell: ({ row }) => {
        return <div>{row?.original?.viewCount || '-'}</div>;
      },
    },
    {
      id: 'exchangeCount',
      label: t('products.exchangeCount'),
      header: () => (
        <div className="flex items-center gap-1">
          {t('products.exchangeCount')}
          <RrhSorter
            setIsAsc={setIsAsc}
            isAsc={isAsc}
            orderByColumn={orderByColumn}
            setOrderByColumn={setOrderByColumn}
            column="exchangeCount"
          />
        </div>
      ),
      accessorFn: row => row.exchangeCount,
      cell: ({ row }) => {
        return <div>{row?.original?.exchangeCount}</div>;
      },
    },
    {
      id: 'updateBy',
      header: t('products.updateBy'),
      accessorFn: row => row.updateBy,
      cell: ({ row }) => {
        return <div>{row?.original?.updateBy || '-'}</div>;
      },
    },
    {
      id: 'updateTime',
      label: t('table.updateTime'),
      header: () => (
        <div className="flex items-center gap-1">
          {t('table.updateTime')}
          <RrhSorter
            setIsAsc={setIsAsc}
            isAsc={isAsc}
            orderByColumn={orderByColumn}
            setOrderByColumn={setOrderByColumn}
            column="updateTime"
          />
        </div>
      ),
      accessorFn: row => row.updateTime,
      cell: ({ row }) => {
        return <div>{row?.original?.updateTime || '-'}</div>;
      },
    },
    {
      id: 'operation',
      label: t('common.Operation'),
      header: () => {
        return <div className="flex justify-center">{t('common.Operation')}</div>;
      },
      cell: ({ row }) => (
        <div>
          <RrhDropdown
            Trigger={<Ellipsis className="size-4" />}
            dropdownList={[
              { label: t('common.Edit'), value: 'edit' },
              { label: t('common.delete'), value: 'delete' },
            ]}
            callToAction={action => {
              if (action === 'edit') {
                // Handle edit action
              } else if (action === 'delete') {
                setRow(row.original);
                setIsDeleteDialogOpen(true);
              }
            }}
          />
        </div>
      ),
      fixed: 'right',
      size: 50,
    },
  ];

  const { visibleColumns, toggleColumn, batchUpdateColumns, columns, tableColumns, columnMeta } =
    useColumnVisibility('points-mall-products-table', allColumns);

  return (
    <div>
      <PageInfo title={t('products.title')} />
      <TableContentWrapper>
        <div className="mb-3 flex justify-between">
          <div className="w-67 max-w-sm">
            <RrhInputWithIcon
              placeholder={t('common.pleaseInput', { field: t('products.goodsName') })}
              className="h-9"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              leftIcon={<Search className="size-4" />}
              onLeftIconClick={() => {
                setParams(prev => ({ ...prev, goodsName: keyword }));
                setPageNum(0);
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
              <RefreshCcw className="size-3.5" />
            </Button>
            <RrhDrawer
              headerShow={false}
              asChild
              responsiveDirection={{
                mobile: 'bottom',
                desktop: 'right',
              }}
              footerShow={false}
              Trigger={
                <Button variant="ghost" className="size-8">
                  <Funnel />
                </Button>
              }
            >
              <ProductsForm setParams={setParams} params={params} reset={reset} />
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
        <DeleteAlert
          row={row}
          open={isDeleteDialogOpen}
          setOpen={setIsDeleteDialogOpen}
          onSuccess={refetch}
        />
      </TableContentWrapper>
    </div>
  );
};
